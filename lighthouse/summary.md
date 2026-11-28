## Performance: Lighthouse CI (median of 3 runs)

### desktop

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 95 | 🟢 1.25 s | 🟢 0.85 s | 🟢 18 ms | 🟢 0.073 |
| search | 97 | 🟢 1.14 s | 🟢 0.69 s | 🟢 11 ms | 🟢 0.039 |
| login | 97 | 🟢 1.14 s | 🟢 0.73 s | 🟢 22 ms | 🟢 0.018 |

### mobile

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 67 | 🟡 6.57 s | 🟡 3.46 s | 🟢 169 ms | 🟢 0.065 |
| search | 66 | 🟡 5.60 s | 🟡 3.46 s | 🟡 271 ms | 🟢 0.065 |
| login | 65 | 🟡 5.33 s | 🟡 3.48 s | 🟡 303 ms | 🟢 0.035 |

### Interaction to Next Paint (user flow)

🟢 **INP 102 ms** (median of 3: 113, 95, 102 ms; target 200, ceiling 300)

Slowest interaction: `div.search-area > app-mat-search-bar#searchQuery > div.search-container > input.ng-untouched` — Input delay 0 ms, Processing duration 79 ms, Presentation delay 23 ms

🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)
