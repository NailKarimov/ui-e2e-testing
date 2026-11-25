## Performance: Lighthouse CI (median of 3 runs)

### desktop

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 96 | 🟢 1.23 s | 🟢 0.69 s | 🟢 0 ms | 🟢 0.073 |
| search | 97 | 🟢 1.13 s | 🟢 0.69 s | 🟢 0 ms | 🟢 0.041 |
| login | 97 | 🟢 1.08 s | 🟢 0.85 s | 🟢 6 ms | 🟢 0.016 |

### mobile

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 68 | 🟡 6.51 s | 🟡 3.46 s | 🟢 105 ms | 🟢 0.065 |
| search | 69 | 🟡 5.57 s | 🟡 3.46 s | 🟢 173 ms | 🟢 0.065 |
| login | 70 | 🟡 5.35 s | 🟡 3.47 s | 🟢 185 ms | 🟢 0.035 |

### Interaction to Next Paint (user flow)

🟢 **INP 80 ms** (median of 3: 87, 80, 79 ms; target 200, ceiling 300)

Slowest interaction: `div.search-area > app-mat-search-bar#searchQuery > div.search-container > input.ng-untouched` — Input delay 0 ms, Processing duration 57 ms, Presentation delay 24 ms

🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)
