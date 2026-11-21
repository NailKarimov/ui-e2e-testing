## Performance: Lighthouse CI (median of 3 runs)

### desktop

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 96 | 🟢 1.22 s | 🟢 0.69 s | 🟢 3 ms | 🟢 0.075 |
| search | 97 | 🟢 1.13 s | 🟢 0.70 s | 🟢 2 ms | 🟢 0.039 |
| login | 97 | 🟢 1.11 s | 🟢 0.70 s | 🟢 14 ms | 🟢 0.018 |

### mobile

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 68 | 🟡 6.56 s | 🟡 3.46 s | 🟢 107 ms | 🟢 0.065 |
| search | 67 | 🟡 5.61 s | 🟡 3.46 s | 🟡 221 ms | 🟢 0.065 |
| login | 68 | 🟡 5.42 s | 🟡 3.48 s | 🟡 220 ms | 🟢 0.035 |

### Interaction to Next Paint (user flow)

🟢 **INP 74 ms** (median of 3: 76, 69, 74 ms; target 200, ceiling 300)

Slowest interaction: `div.search-area > app-mat-search-bar#searchQuery > div.search-container > input.ng-untouched` — Input delay 0 ms, Processing duration 56 ms, Presentation delay 17 ms

🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)
