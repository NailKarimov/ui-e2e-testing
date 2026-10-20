// Planted bugs for checking that the suite catches what it claims to catch (docs/ui-e2e.md, "Mutation check").
// Each mutant is a one-line change to Juice Shop's compiled frontend (main.js of the release under test).
//
//   node scripts/mutants.mjs list
//   node scripts/mutants.mjs apply  <path/to/main.js> M1     # keeps main.js.orig next to it
//   node scripts/mutants.mjs restore <path/to/main.js>
//
// With the Docker image: docker cp juice-shop:/juice-shop/frontend/dist/frontend/main.js ., apply, docker cp back.
// Only for a local Juice Shop you run yourself.
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';

export const MUTANTS = [
  {
    id: 'M1',
    what: 'Basket total ignores quantities (sums prices only)',
    from: 'i+n.price*n.BasketItem.quantity',
    to: 'i+n.price',
    caughtBy: 'basket total / purchase journey',
  },
  {
    id: 'M2',
    what: 'Order summary shows delivery as free whatever was chosen',
    from: 'subscribe(t=>{this.deliveryPrice=t.price})',
    to: 'subscribe(t=>{this.deliveryPrice=0})',
    caughtBy: 'checkout: delivery options',
  },
  {
    id: 'M3',
    what: 'Checkout button enabled for an empty basket',
    from: '`disabled`,n.productCount<1',
    to: '`disabled`,n.productCount<0',
    caughtBy: 'removing the last item … disables checkout',
  },
  {
    id: 'M4',
    what: 'Registration accepts passwords that do not match',
    from: 'if(i()&&i()!==n(t.password))return{kind:`notSame`}}),dd(t.securityQuestion)',
    to: 'if(!1)return{kind:`notSame`}}),dd(t.securityQuestion)',
    caughtBy: 'passwords that do not match are flagged',
  },
  {
    id: 'M5',
    what: 'FIX of UI-SEC-1: search term rendered as text (a known-defect test must turn red)',
    from: 'this.searchValue=this.sanitizer.bypassSecurityTrustHtml(t)',
    to: 'this.searchValue=t',
    also: ['ny(`innerHTML`,t.searchValue,Zw)', 'ny(`textContent`,t.searchValue)'],
    caughtBy: 'UI-SEC-1 (expected to fail, but passed)',
  },
  {
    id: 'M6',
    what: 'Quantity "−" takes away 2 instead of 1',
    from: 'dec(t){this.addToQuantity(t,-1)}',
    to: 'dec(t){this.addToQuantity(t,-2)}',
    caughtBy: '+ and − change the quantity',
  },
];

const [cmd, file, id] = process.argv.slice(2);
if (cmd === 'list') {
  for (const m of MUTANTS) console.log(`${m.id}  ${m.what}  → ${m.caughtBy}`);
} else if (cmd === 'restore') {
  if (existsSync(`${file}.orig`)) copyFileSync(`${file}.orig`, file);
} else if (cmd === 'apply') {
  const m = MUTANTS.find((x) => x.id === id);
  if (!m) throw new Error(`no mutant ${id}`);
  if (!existsSync(`${file}.orig`)) copyFileSync(file, `${file}.orig`);
  let src = readFileSync(`${file}.orig`, 'utf8');
  for (const [from, to] of [[m.from, m.to], ...(m.also ? [m.also] : [])]) {
    if (src.split(from).length !== 2) throw new Error(`${m.id}: "${from}" must occur exactly once`);
    src = src.replace(from, to);
  }
  writeFileSync(file, src);
  console.log(`applied ${m.id}: ${m.what}`);
} else {
  console.log('usage: mutants.mjs list | apply <main.js> <id> | restore <main.js>');
}
