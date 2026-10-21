## Performance: Lighthouse CI (median of 3 runs)

### desktop

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 96 | 🟢 1.22 s | 🟢 0.69 s | 🟢 17 ms | 🟢 0.073 |
| search | 97 | 🟢 1.17 s | 🟢 0.70 s | 🟢 14 ms | 🟢 0.041 |
| login | 97 | 🟢 1.16 s | 🟢 0.71 s | 🟢 23 ms | 🟢 0.018 |

### mobile

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 67 | 🟡 6.58 s | 🟡 3.46 s | 🟢 182 ms | 🟢 0.002 |
| search | 65 | 🟡 5.64 s | 🟡 3.46 s | 🟡 304 ms | 🟢 0.065 |
| login | 65 | 🟡 5.47 s | 🟡 3.48 s | 🟡 310 ms | 🟢 0.035 |

### Interaction to Next Paint (user flow)

🟢 **INP 123 ms** (median of 3: 107, 129, 123 ms; target 200, ceiling 400)

Slowest interaction: `div.search-area > app-mat-search-bar#searchQuery > div.search-container > input.ng-untouched` — Input delay 1 ms, Processing duration 94 ms, Presentation delay 29 ms

🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)
