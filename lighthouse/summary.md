## Performance: Lighthouse CI (median of 3 runs)

### desktop

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 96 | 🟢 1.23 s | 🟢 0.70 s | 🟢 37 ms | 🟢 0.073 |
| search | 97 | 🟢 1.17 s | 🟢 0.70 s | 🟢 45 ms | 🟢 0.039 |
| login | 97 | 🟢 1.17 s | 🟢 0.71 s | 🟢 43 ms | 🟢 0.016 |

### mobile

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 63 | 🟡 6.69 s | 🟡 3.46 s | 🟡 266 ms | 🟢 0.065 |
| search | 60 | 🟡 5.76 s | 🟡 3.48 s | 🟡 435 ms | 🟢 0.065 |
| login | 61 | 🟡 5.40 s | 🟡 3.48 s | 🟡 439 ms | 🟢 0.035 |

### Interaction to Next Paint (user flow)

🟢 **INP 125 ms** (median of 3: 124, 143, 125 ms; target 200, ceiling 300)

Slowest interaction: `div.search-area > app-mat-search-bar#searchQuery > div.search-container > input.ng-untouched` — Input delay 0 ms, Processing duration 95 ms, Presentation delay 29 ms

🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)
