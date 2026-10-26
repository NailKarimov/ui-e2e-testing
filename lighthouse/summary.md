## Performance: Lighthouse CI (median of 3 runs)

### desktop

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 96 | 🟢 1.26 s | 🟢 0.69 s | 🟢 36 ms | 🟢 0.073 |
| search | 97 | 🟢 1.18 s | 🟢 0.70 s | 🟢 35 ms | 🟢 0.039 |
| login | 97 | 🟢 1.17 s | 🟢 0.72 s | 🟢 39 ms | 🟢 0.018 |

### mobile

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 64 | 🟡 6.68 s | 🟡 3.46 s | 🟡 245 ms | 🟢 0.065 |
| search | 60 | 🟡 5.72 s | 🟡 3.47 s | 🟡 421 ms | 🟢 0.065 |
| login | 61 | 🟡 5.46 s | 🟡 3.50 s | 🟡 428 ms | 🟢 0.035 |

### Interaction to Next Paint (user flow)

🟢 **INP 122 ms** (median of 3: 122, 123, 121 ms; target 200, ceiling 300)

Slowest interaction: `div.search-area > app-mat-search-bar#searchQuery > div.search-container > input.ng-untouched` — Input delay 1 ms, Processing duration 91 ms, Presentation delay 31 ms

🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)
