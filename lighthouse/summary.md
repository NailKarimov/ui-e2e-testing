## Performance: Lighthouse CI (median of 3 runs)

### desktop

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 95 | 🟢 1.25 s | 🟢 0.69 s | 🟢 36 ms | 🟢 0.073 |
| search | 97 | 🟢 1.17 s | 🟢 0.71 s | 🟢 35 ms | 🟢 0.041 |
| login | 97 | 🟢 1.22 s | 🟢 0.72 s | 🟢 53 ms | 🟢 0.015 |

### mobile

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 63 | 🟡 6.70 s | 🟡 3.46 s | 🟡 254 ms | 🟢 0.065 |
| search | 60 | 🟡 5.71 s | 🟡 3.47 s | 🟡 437 ms | 🟢 0.065 |
| login | 61 | 🟡 5.56 s | 🟡 3.48 s | 🟡 457 ms | 🟢 0.035 |

### Interaction to Next Paint (user flow)

🟢 **INP 129 ms** (median of 3: 129, 131, 123 ms; target 200, ceiling 300)

Slowest interaction: `div.search-area > app-mat-search-bar#searchQuery > div.search-container > input.ng-untouched` — Input delay 0 ms, Processing duration 100 ms, Presentation delay 28 ms

🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)
