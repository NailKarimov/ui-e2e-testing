## Performance: Lighthouse CI (median of 3 runs)

### desktop

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 95 | 🟢 1.31 s | 🟢 0.70 s | 🟢 60 ms | 🟢 0.073 |
| search | 97 | 🟢 1.17 s | 🟢 0.70 s | 🟢 33 ms | 🟢 0.039 |
| login | 97 | 🟢 1.21 s | 🟢 0.72 s | 🟢 46 ms | 🟢 0.018 |

### mobile

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 64 | 🟡 6.66 s | 🟡 3.46 s | 🟡 243 ms | 🟢 0.065 |
| search | 61 | 🟡 5.70 s | 🟡 3.47 s | 🟡 396 ms | 🟢 0.065 |
| login | 62 | 🟡 5.42 s | 🟡 3.48 s | 🟡 432 ms | 🟢 0.034 |

### Interaction to Next Paint (user flow)

🟢 **INP 120 ms** (median of 3: 121, 120, 116 ms; target 200, ceiling 300)

Slowest interaction: `div.search-area > app-mat-search-bar#searchQuery > div.search-container > input.ng-untouched` — Input delay 1 ms, Processing duration 89 ms, Presentation delay 30 ms

🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)
