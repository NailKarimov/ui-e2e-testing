## Performance: Lighthouse CI (median of 3 runs)

### desktop

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 96 | 🟢 1.26 s | 🟢 0.70 s | 🟢 37 ms | 🟢 0.073 |
| search | 97 | 🟢 1.18 s | 🟢 0.70 s | 🟢 38 ms | 🟢 0.039 |
| login | 97 | 🟢 1.16 s | 🟢 0.71 s | 🟢 45 ms | 🟢 0.018 |

### mobile

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 65 | 🟡 6.66 s | 🟡 3.46 s | 🟡 213 ms | 🟢 0.065 |
| search | 62 | 🟡 5.70 s | 🟡 3.47 s | 🟡 368 ms | 🟢 0.065 |
| login | 63 | 🟡 5.59 s | 🟡 3.50 s | 🟡 380 ms | 🟢 0.035 |

### Interaction to Next Paint (user flow)

🟢 **INP 122 ms** (median of 3: 122, 118, 122 ms; target 200, ceiling 300)

Slowest interaction: `div.search-area > app-mat-search-bar#searchQuery > div.search-container > input.ng-untouched` — Input delay 0 ms, Processing duration 91 ms, Presentation delay 31 ms

🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)
