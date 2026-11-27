## Performance: Lighthouse CI (median of 3 runs)

### desktop

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 96 | 🟢 1.22 s | 🟢 0.69 s | 🟢 18 ms | 🟢 0.075 |
| search | 97 | 🟢 1.15 s | 🟢 0.70 s | 🟢 7 ms | 🟢 0.039 |
| login | 98 | 🟢 1.12 s | 🟢 0.70 s | 🟢 22 ms | 🟢 0.018 |

### mobile

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 67 | 🟡 6.70 s | 🟡 3.46 s | 🟢 152 ms | 🟢 0.065 |
| search | 67 | 🟡 5.62 s | 🟡 3.47 s | 🟡 232 ms | 🟢 0.065 |
| login | 67 | 🟡 5.44 s | 🟡 3.47 s | 🟡 260 ms | 🟢 0.035 |

### Interaction to Next Paint (user flow)

🟢 **INP 100 ms** (median of 3: 102, 100, 99 ms; target 200, ceiling 300)

Slowest interaction: `div.search-area > app-mat-search-bar#searchQuery > div.search-container > input.ng-untouched` — Input delay 1 ms, Processing duration 78 ms, Presentation delay 21 ms

🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)
