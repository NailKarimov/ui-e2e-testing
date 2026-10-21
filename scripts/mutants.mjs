// Planted bugs for checking that the suite catches what it claims to catch (docs/ui-e2e.md, "Mutation check").
// Each mutant is a one-line change to Juice Shop's compiled frontend (main.js of the release under test).
//
//   node scripts/mutants.mjs list
//   node scripts/mutants.mjs apply  <path/to/main.js> M1     # keeps a .orig copy next to the changed file
//   node scripts/mutants.mjs restore <path/to/main.js>        # restores main.js and styles.css
// A mutant with `file: 'styles.css'` and an empty `from` appends CSS to the styles.css next to main.js.
//
// With the Docker image: docker cp juice-shop:/juice-shop/frontend/dist/frontend/main.js ., apply, docker cp back.
// Only for a local Juice Shop you run yourself.
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

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
  {
    id: 'M7',
    file: 'styles.css',
    what: 'Keyboard focus made invisible (no outline, no Material focus layer)',
    from: '',
    to: '\n*:focus{outline:none!important}.mat-focus-indicator,.mat-mdc-button-persistent-ripple,.mdc-button__ripple,.mat-ripple{display:none!important}\n',
    caughtBy: 'keyboard: every stop in the top bar shows where the focus is',
  },
  {
    id: 'M8',
    what: 'FIX of UI-A11Y-3: the search field gets aria-label="Search" (the axe ratchet must notice)',
    from: '[`type`,`text`,`autocapitalize`,`none`,3,',
    to: '[`type`,`text`,`autocapitalize`,`none`,`aria-label`,`Search`,3,',
    caughtBy: 'axe: "known defects no longer found" on every screen',
  },
  {
    id: 'M9',
    file: 'styles.css',
    what: 'A 4 px shift and square corners on the Checkout button',
    from: '',
    to: '\n#checkoutButton{margin-top:4px!important;border-radius:0!important}\n',
    caughtBy: 'visual: basket',
  },
  {
    id: 'M10',
    file: 'styles.css',
    what: 'Product prices in a lighter colour (contrast drops)',
    from: '',
    to: '\n.price{color:#8a8a8a!important}\n',
    caughtBy: 'visual: product card; axe: new color-contrast on the product list',
  },
];

const [cmd, file, id] = process.argv.slice(2);
if (cmd === 'list') {
  for (const m of MUTANTS) console.log(`${m.id}  ${m.what}  → ${m.caughtBy}`);
} else if (cmd === 'restore') {
  for (const f of [file, join(dirname(file), 'styles.css')])
    if (existsSync(`${f}.orig`)) copyFileSync(`${f}.orig`, f);
} else if (cmd === 'apply') {
  const m = MUTANTS.find((x) => x.id === id);
  if (!m) throw new Error(`no mutant ${id}`);
  const target = m.file ? join(dirname(file), m.file) : file;
  if (!existsSync(`${target}.orig`)) copyFileSync(target, `${target}.orig`);
  let src = readFileSync(`${target}.orig`, 'utf8');
  if (m.from === '') src += m.to;
  else
    for (const [from, to] of [[m.from, m.to], ...(m.also ? [m.also] : [])]) {
      if (src.split(from).length !== 2) throw new Error(`${m.id}: "${from}" must occur exactly once`);
      src = src.replace(from, to);
    }
  writeFileSync(target, src);
  console.log(`applied ${m.id}: ${m.what}`);
} else {
  console.log('usage: mutants.mjs list | apply <main.js> <id> | restore <main.js>');
}
