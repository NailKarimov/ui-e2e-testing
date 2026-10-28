## Performance: Lighthouse CI (median of 3 runs)

### desktop

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 96 | 🟢 1.24 s | 🟢 0.69 s | 🟢 18 ms | 🟢 0.073 |
| search | 97 | 🟢 1.15 s | 🟢 0.70 s | 🟢 14 ms | 🟢 0.041 |
| login | 97 | 🟢 1.13 s | 🟢 0.70 s | 🟢 22 ms | 🟢 0.018 |

### mobile

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 67 | 🟡 6.58 s | 🟡 3.46 s | 🟢 165 ms | 🟢 0.065 |
| search | 65 | 🟡 5.64 s | 🟡 3.47 s | 🟡 290 ms | 🟢 0.065 |
| login | 67 | 🟡 5.42 s | 🟡 3.47 s | 🟡 282 ms | 🟢 0.035 |

### Interaction to Next Paint (user flow)

🟢 **INP 101 ms** (median of 3: 99, 101, 105 ms; target 200, ceiling 300)

Slowest interaction: `div.search-area > app-mat-search-bar#searchQuery > div.search-container > input.ng-untouched` — Input delay 1 ms, Processing duration 76 ms, Presentation delay 24 ms

🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)
