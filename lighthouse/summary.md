## Performance: Lighthouse CI (median of 3 runs)

### desktop

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 95 | 🟢 1.26 s | 🟢 0.70 s | 🟢 47 ms | 🟢 0.075 |
| search | 97 | 🟢 1.23 s | 🟢 0.72 s | 🟢 39 ms | 🟢 0.039 |
| login | 97 | 🟢 1.19 s | 🟢 0.71 s | 🟢 46 ms | 🟢 0.018 |

### mobile

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 64 | 🟡 6.69 s | 🟡 3.46 s | 🟡 240 ms | 🟢 0.065 |
| search | 58 | 🟡 5.77 s | 🟡 3.47 s | 🟡 474 ms | 🟢 0.065 |
| login | 62 | 🟡 5.52 s | 🟡 3.49 s | 🟡 438 ms | 🟢 0.035 |

### Interaction to Next Paint (user flow)

🟢 **INP 119 ms** (median of 3: 119, 119, 117 ms; target 200, ceiling 300)

Slowest interaction: `div.search-area > app-mat-search-bar#searchQuery > div.search-container > input.ng-untouched` — Input delay 0 ms, Processing duration 89 ms, Presentation delay 29 ms

🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)
