## Performance: Lighthouse CI (median of 3 runs)

### desktop

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 95 | 🟢 1.31 s | 🟢 0.70 s | 🟢 43 ms | 🟢 0.073 |
| search | 97 | 🟢 1.17 s | 🟢 0.70 s | 🟢 33 ms | 🟢 0.039 |
| login | 97 | 🟢 1.18 s | 🟢 0.71 s | 🟢 45 ms | 🟢 0.016 |

### mobile

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 65 | 🟡 6.67 s | 🟡 3.46 s | 🟡 214 ms | 🟢 0.065 |
| search | 62 | 🟡 5.70 s | 🟡 3.47 s | 🟡 385 ms | 🟢 0.065 |
| login | 63 | 🟡 5.38 s | 🟡 3.48 s | 🟡 394 ms | 🟢 0.035 |

### Interaction to Next Paint (user flow)

🟢 **INP 119 ms** (median of 3: 125, 119, 114 ms; target 200, ceiling 300)

Slowest interaction: `div.search-area > app-mat-search-bar#searchQuery > div.search-container > input.ng-untouched` — Input delay 0 ms, Processing duration 91 ms, Presentation delay 28 ms

🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)
