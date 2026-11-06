## Performance: Lighthouse CI (median of 3 runs)

### desktop

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 96 | 🟢 1.23 s | 🟢 0.69 s | 🟢 14 ms | 🟢 0.073 |
| search | 97 | 🟢 1.15 s | 🟢 0.70 s | 🟢 14 ms | 🟢 0.039 |
| login | 97 | 🟢 1.15 s | 🟢 0.71 s | 🟢 19 ms | 🟢 0.018 |

### mobile

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 67 | 🟡 6.59 s | 🟡 3.46 s | 🟢 153 ms | 🟢 0.065 |
| search | 65 | 🟡 5.79 s | 🟡 3.47 s | 🟡 279 ms | 🟢 0.065 |
| login | 66 | 🟡 5.31 s | 🟡 3.48 s | 🟡 306 ms | 🟢 0.035 |

### Interaction to Next Paint (user flow)

🟢 **INP 102 ms** (median of 3: 102, 95, 102 ms; target 200, ceiling 300)

Slowest interaction: `div.search-area > app-mat-search-bar#searchQuery > div.search-container > input.ng-untouched` — Input delay 1 ms, Processing duration 73 ms, Presentation delay 28 ms

🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)
