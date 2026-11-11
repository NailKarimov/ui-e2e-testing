## Performance: Lighthouse CI (median of 3 runs)

### desktop

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 95 | 🟢 1.27 s | 🟢 0.70 s | 🟢 44 ms | 🟢 0.075 |
| search | 97 | 🟢 1.18 s | 🟢 0.71 s | 🟢 33 ms | 🟢 0.039 |
| login | 97 | 🟢 1.19 s | 🟢 0.71 s | 🟢 41 ms | 🟢 0.018 |

### mobile

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 63 | 🟡 6.66 s | 🟡 3.46 s | 🟡 257 ms | 🟢 0.065 |
| search | 60 | 🟡 5.75 s | 🟡 3.47 s | 🟡 415 ms | 🟢 0.065 |
| login | 62 | 🟡 5.42 s | 🟡 3.48 s | 🟡 405 ms | 🟢 0.034 |

### Interaction to Next Paint (user flow)

🟢 **INP 130 ms** (median of 3: 123, 132, 130 ms; target 200, ceiling 300)

Slowest interaction: `div.search-area > app-mat-search-bar#searchQuery > div.search-container > input.ng-untouched` — Input delay 0 ms, Processing duration 101 ms, Presentation delay 29 ms

🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)
