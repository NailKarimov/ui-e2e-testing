## Performance: Lighthouse CI (median of 3 runs)

### desktop

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 95 | 🟢 1.25 s | 🟢 0.69 s | 🟢 35 ms | 🟢 0.075 |
| search | 97 | 🟢 1.18 s | 🟢 0.70 s | 🟢 40 ms | 🟢 0.039 |
| login | 97 | 🟢 1.18 s | 🟢 0.71 s | 🟢 48 ms | 🟢 0.018 |

### mobile

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 64 | 🟡 6.68 s | 🟡 3.46 s | 🟡 246 ms | 🟢 0.065 |
| search | 59 | 🟡 5.78 s | 🟡 3.49 s | 🟡 442 ms | 🟢 0.065 |
| login | 61 | 🟡 5.54 s | 🟡 3.47 s | 🟡 461 ms | 🟢 0.035 |

### Interaction to Next Paint (user flow)

🟢 **INP 122 ms** (median of 3: 119, 122, 131 ms; target 200, ceiling 300)

Slowest interaction: `div.search-area > app-mat-search-bar#searchQuery > div.search-container > input.ng-untouched` — Input delay 1 ms, Processing duration 95 ms, Presentation delay 26 ms

🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)
