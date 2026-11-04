## Performance: Lighthouse CI (median of 3 runs)

### desktop

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 96 | 🟢 1.21 s | 🟢 0.69 s | 🟢 9 ms | 🟢 0.073 |
| search | 97 | 🟢 1.15 s | 🟢 0.70 s | 🟢 6 ms | 🟢 0.039 |
| login | 98 | 🟢 1.12 s | 🟢 0.70 s | 🟢 18 ms | 🟢 0.018 |

### mobile

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 68 | 🟡 6.55 s | 🟡 3.46 s | 🟢 131 ms | 🟢 0.065 |
| search | 67 | 🟡 5.74 s | 🟡 3.46 s | 🟡 222 ms | 🟢 0.065 |
| login | 69 | 🟡 5.38 s | 🟡 3.47 s | 🟡 223 ms | 🟢 0.035 |

### Interaction to Next Paint (user flow)

🟢 **INP 90 ms** (median of 3: 94, 90, 90 ms; target 200, ceiling 300)

Slowest interaction: `div.search-area > app-mat-search-bar#searchQuery > div.search-container > input.ng-untouched` — Input delay 0 ms, Processing duration 69 ms, Presentation delay 21 ms

🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)
