## Performance: Lighthouse CI (median of 3 runs)

### desktop

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 96 | 🟢 1.24 s | 🟢 0.69 s | 🟢 13 ms | 🟢 0.073 |
| search | 97 | 🟢 1.15 s | 🟢 0.70 s | 🟢 10 ms | 🟢 0.039 |
| login | 97 | 🟢 1.16 s | 🟢 0.71 s | 🟢 19 ms | 🟢 0.018 |

### mobile

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 67 | 🟡 6.56 s | 🟡 3.46 s | 🟢 139 ms | 🟢 0.065 |
| search | 66 | 🟡 5.60 s | 🟡 3.46 s | 🟡 258 ms | 🟢 0.065 |
| login | 68 | 🟡 5.43 s | 🟡 3.47 s | 🟡 253 ms | 🟢 0.035 |

### Interaction to Next Paint (user flow)

🟢 **INP 98 ms** (median of 3: 100, 98, 91 ms; target 200, ceiling 300)

Slowest interaction: `div.search-area > app-mat-search-bar#searchQuery > div.search-container > input.ng-untouched` — Input delay 0 ms, Processing duration 77 ms, Presentation delay 20 ms

🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)
