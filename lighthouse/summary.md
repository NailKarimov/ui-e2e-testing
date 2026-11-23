## Performance: Lighthouse CI (median of 3 runs)

### desktop

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 96 | 🟢 1.21 s | 🟢 0.70 s | 🟢 8 ms | 🟢 0.073 |
| search | 97 | 🟢 1.13 s | 🟢 0.70 s | 🟢 13 ms | 🟢 0.039 |
| login | 98 | 🟢 1.12 s | 🟢 0.71 s | 🟢 15 ms | 🟢 0.015 |

### mobile

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 68 | 🟡 6.56 s | 🟡 3.46 s | 🟢 115 ms | 🟢 0.065 |
| search | 68 | 🟡 5.60 s | 🟡 3.46 s | 🟡 212 ms | 🟢 0.065 |
| login | 68 | 🟡 5.29 s | 🟡 3.47 s | 🟡 256 ms | 🟢 0.035 |

### Interaction to Next Paint (user flow)

🟢 **INP 81 ms** (median of 3: 82, 80, 81 ms; target 200, ceiling 300)

Slowest interaction: `div.search-area > app-mat-search-bar#searchQuery > div.search-container > input.ng-untouched` — Input delay 0 ms, Processing duration 62 ms, Presentation delay 18 ms

🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)
