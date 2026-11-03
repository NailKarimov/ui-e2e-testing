## Performance: Lighthouse CI (median of 3 runs)

### desktop

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 96 | 🟢 1.24 s | 🟢 0.69 s | 🟢 21 ms | 🟢 0.075 |
| search | 97 | 🟢 1.17 s | 🟢 0.70 s | 🟢 17 ms | 🟢 0.039 |
| login | 97 | 🟢 1.12 s | 🟢 0.71 s | 🟢 33 ms | 🟢 0.015 |

### mobile

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 67 | 🟡 6.60 s | 🟡 3.46 s | 🟢 166 ms | 🟢 0.002 |
| search | 65 | 🟡 5.79 s | 🟡 3.47 s | 🟡 282 ms | 🟢 0.065 |
| login | 65 | 🟡 5.44 s | 🟡 3.47 s | 🟡 313 ms | 🟢 0.035 |

### Interaction to Next Paint (user flow)

🟢 **INP 110 ms** (median of 3: 115, 110, 108 ms; target 200, ceiling 300)

Slowest interaction: `div.search-area > app-mat-search-bar#searchQuery > div.search-container > input.ng-untouched` — Input delay 0 ms, Processing duration 83 ms, Presentation delay 27 ms

🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)
