## Performance: Lighthouse CI (median of 3 runs)

### desktop

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 96 | 🟢 1.22 s | 🟢 0.69 s | 🟢 8 ms | 🟢 0.073 |
| search | 97 | 🟢 1.14 s | 🟢 0.70 s | 🟢 7 ms | 🟢 0.039 |
| login | 97 | 🟢 1.11 s | 🟢 0.72 s | 🟢 14 ms | 🟢 0.018 |

### mobile

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 68 | 🟡 6.72 s | 🟡 3.46 s | 🟢 120 ms | 🟢 0.065 |
| search | 67 | 🟡 5.75 s | 🟡 3.47 s | 🟡 215 ms | 🟢 0.065 |
| login | 69 | 🟡 5.36 s | 🟡 3.47 s | 🟡 207 ms | 🟢 0.035 |

### Interaction to Next Paint (user flow)

🟢 **INP 88 ms** (median of 3: 87, 88, 90 ms; target 200, ceiling 300)

Slowest interaction: `div.search-area > app-mat-search-bar#searchQuery > div.search-container > input.ng-untouched` — Input delay 1 ms, Processing duration 66 ms, Presentation delay 22 ms

🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)
