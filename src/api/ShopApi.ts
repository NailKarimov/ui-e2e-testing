import type { APIRequestContext } from '@playwright/test';

/**
 * Juice Shop's REST API, used to set tests up fast (accounts, basket, addresses, cards) and as an oracle (prices).
 * The UI is what the tests check; the API only prepares and confirms.
 */
export type Account = { email: string; password: string; token: string; bid: number; id: number };
export type Product = { id: number; name: string; price: number };

/** Juice Shop's published test card number (Visa test number): goes only to the local shop under test. */
export const TEST_CARD = { name: 'QA Tester', number: '4111111111111111', month: '12', year: '2090' };
export const TEST_ADDRESS = {
  country: 'Latvia',
  fullName: 'QA Tester',
  mobileNum: 29123456,
  zipCode: 'LV1050',
  streetAddress: 'Brivibas iela 1',
  city: 'Riga',
  state: '',
};

export const uniqueEmail = (tag = 'qa') =>
  `${tag}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@example.test`;

/**
 * Network-level retries only (a reset connection, a refused socket while the shop is busy), never on an HTTP
 * status: a 4xx or 5xx is an answer and goes to the test as it is.
 */
const NET = { maxRetries: 2 };

export class ShopApi {
  constructor(private readonly request: APIRequestContext) {}

  private auth(a: Account) {
    return { Authorization: `Bearer ${a.token}` };
  }

  async register(email = uniqueEmail(), password = 'Qa-test-pass1'): Promise<Account> {
    const reg = await this.request.post('/api/Users', {
      ...NET,
      data: {
        email,
        password,
        passwordRepeat: password,
        securityQuestion: { id: 1 },
        securityAnswer: 'blue',
      },
    });
    if (reg.status() !== 201) throw new Error(`register ${email}: ${reg.status()} ${await reg.text()}`);
    const id = (await reg.json()).data.id as number;
    return { ...(await this.login(email, password)), id };
  }

  async login(email: string, password: string): Promise<Account> {
    const res = await this.request.post('/rest/user/login', { ...NET, data: { email, password } });
    if (res.status() !== 200) throw new Error(`login ${email}: ${res.status()}`);
    const { token, bid } = (await res.json()).authentication;
    return { email, password, token, bid, id: 0 };
  }

  async products(): Promise<Product[]> {
    const res = await this.request.get('/api/Products', NET);
    return ((await res.json()).data as Product[]).map(({ id, name, price }) => ({ id, name, price }));
  }

  async product(name: string): Promise<Product> {
    const p = (await this.products()).find((x) => x.name === name);
    if (!p) throw new Error(`no product ${name}`);
    return p;
  }

  async basket(a: Account): Promise<{ id: number; name: string; quantity: number; itemId: number }[]> {
    const res = await this.request.get(`/rest/basket/${a.bid}`, { ...NET, headers: this.auth(a) });
    const products = (await res.json()).data.Products as {
      id: number;
      name: string;
      BasketItem: { id: number; quantity: number };
    }[];
    return products.map((p) => ({
      id: p.id,
      name: p.name,
      quantity: p.BasketItem.quantity,
      itemId: p.BasketItem.id,
    }));
  }

  async addToBasket(a: Account, productName: string, quantity = 1) {
    const p = await this.product(productName);
    const res = await this.request.post('/api/BasketItems', {
      ...NET,
      headers: this.auth(a),
      data: { ProductId: p.id, BasketId: String(a.bid), quantity },
    });
    if (!res.ok()) throw new Error(`add ${productName}: ${res.status()} ${await res.text()}`);
  }

  async emptyBasket(a: Account) {
    for (const item of await this.basket(a)) {
      await this.request.delete(`/api/BasketItems/${item.itemId}`, { ...NET, headers: this.auth(a) });
    }
  }

  async addAddress(a: Account, address = TEST_ADDRESS) {
    const res = await this.request.post('/api/Addresss', { ...NET, headers: this.auth(a), data: address });
    if (!res.ok()) throw new Error(`address: ${res.status()}`);
    return (await res.json()).data as { id: number };
  }

  async addCard(a: Account, card = TEST_CARD) {
    const res = await this.request.post('/api/Cards', {
      ...NET,
      headers: this.auth(a),
      data: {
        fullName: card.name,
        cardNum: Number(card.number),
        expMonth: Number(card.month),
        expYear: Number(card.year),
      },
    });
    if (!res.ok()) throw new Error(`card: ${res.status()}`);
  }

  async deliveries(): Promise<{ id: number; name: string; price: number; eta: number }[]> {
    const res = await this.request.get('/api/Deliverys', NET);
    return (await res.json()).data;
  }

  /** The shop's own search, the oracle for what the search page should list. */
  async search(q: string): Promise<string[]> {
    const res = await this.request.get(`/rest/products/search?q=${encodeURIComponent(q)}`, NET);
    return ((await res.json()).data as Product[]).map((p) => p.name);
  }

  async orders(
    a: Account,
  ): Promise<{ orderId: string; totalPrice: number; products: { name: string; quantity: number }[] }[]> {
    const res = await this.request.get('/rest/order-history', { ...NET, headers: this.auth(a) });
    return (await res.json()).data;
  }
}
