## Performance: Lighthouse CI (median of 3 runs)

### desktop

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 95 | 🟢 1.27 s | 🟢 0.69 s | 🟢 42 ms | 🟢 0.073 |
| search | 97 | 🟢 1.19 s | 🟢 0.70 s | 🟢 40 ms | 🟢 0.039 |
| login | 97 | 🟢 1.17 s | 🟢 0.72 s | 🟢 45 ms | 🟢 0.018 |

### mobile

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 63 | 🟡 6.67 s | 🟡 3.46 s | 🟡 250 ms | 🟢 0.065 |
| search | 57 | 🟡 5.73 s | 🟡 3.48 s | 🟡 562 ms | 🟢 0.065 |
| login | 61 | 🟡 5.47 s | 🟡 3.50 s | 🟡 457 ms | 🟢 0.035 |

### Interaction to Next Paint (user flow)

🟢 **INP 134 ms** (median of 3: 152, 132, 134 ms; target 200, ceiling 300)

Slowest interaction: `div.search-area > app-mat-search-bar#searchQuery > div.search-container > input.ng-untouched` — Input delay 0 ms, Processing duration 102 ms, Presentation delay 32 ms

🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)
