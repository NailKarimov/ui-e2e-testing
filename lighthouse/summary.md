## Performance: Lighthouse CI (median of 3 runs)

### desktop

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 96 | 🟢 1.21 s | 🟢 0.69 s | 🟢 4 ms | 🟢 0.073 |
| search | 97 | 🟢 1.14 s | 🟢 0.70 s | 🟢 3 ms | 🟢 0.039 |
| login | 98 | 🟢 1.06 s | 🟢 0.70 s | 🟢 11 ms | 🟢 0.016 |

### mobile

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 68 | 🟡 6.68 s | 🟡 3.46 s | 🟢 115 ms | 🟢 0.065 |
| search | 67 | 🟡 5.62 s | 🟡 3.47 s | 🟡 227 ms | 🟢 0.065 |
| login | 69 | 🟡 5.26 s | 🟡 3.47 s | 🟡 236 ms | 🟢 0.035 |

### Interaction to Next Paint (user flow)

🟢 **INP 95 ms** (median of 3: 95, 102, 93 ms; target 200, ceiling 300)

Slowest interaction: `div.search-area > app-mat-search-bar#searchQuery > div.search-container > input.ng-untouched` — Input delay 0 ms, Processing duration 72 ms, Presentation delay 22 ms

🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)
