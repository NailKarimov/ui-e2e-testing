## Performance: Lighthouse CI (median of 3 runs)

### desktop

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 96 | 🟢 1.25 s | 🟢 0.69 s | 🟢 23 ms | 🟢 0.073 |
| search | 97 | 🟢 1.14 s | 🟢 0.70 s | 🟢 10 ms | 🟢 0.039 |
| login | 97 | 🟢 1.13 s | 🟢 0.85 s | 🟢 26 ms | 🟢 0.016 |

### mobile

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 68 | 🟡 6.57 s | 🟡 3.46 s | 🟢 154 ms | 🟢 0.002 |
| search | 64 | 🟡 5.62 s | 🟡 3.47 s | 🟡 327 ms | 🟢 0.065 |
| login | 66 | 🟡 5.44 s | 🟡 3.47 s | 🟡 289 ms | 🟢 0.035 |

### Interaction to Next Paint (user flow)

🟢 **INP 100 ms** (median of 3: 109, 99, 100 ms; target 200, ceiling 300)

Slowest interaction: `div.search-area > app-mat-search-bar#searchQuery > div.search-container > input.ng-untouched` — Input delay 1 ms, Processing duration 77 ms, Presentation delay 22 ms

🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)
