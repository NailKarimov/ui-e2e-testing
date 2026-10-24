## Performance: Lighthouse CI (median of 3 runs)

### desktop

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 96 | 🟢 1.24 s | 🟢 0.69 s | 🟢 19 ms | 🟢 0.073 |
| search | 97 | 🟢 1.14 s | 🟢 0.70 s | 🟢 7 ms | 🟢 0.039 |
| login | 97 | 🟢 1.18 s | 🟢 0.72 s | 🟢 25 ms | 🟢 0.015 |

### mobile

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 67 | 🟡 6.56 s | 🟡 3.46 s | 🟢 127 ms | 🟢 0.065 |
| search | 65 | 🟡 5.65 s | 🟡 3.48 s | 🟡 274 ms | 🟢 0.065 |
| login | 69 | 🟡 5.26 s | 🟡 3.47 s | 🟡 214 ms | 🟢 0.035 |

### Interaction to Next Paint (user flow)

🟢 **INP 94 ms** (median of 3: 94, 94, 97 ms; target 200, ceiling 300)

Slowest interaction: `div.search-area > app-mat-search-bar#searchQuery > div.search-container > input.ng-untouched` — Input delay 0 ms, Processing duration 71 ms, Presentation delay 23 ms

🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)
