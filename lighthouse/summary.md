## Performance: Lighthouse CI (median of 3 runs)

### desktop

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 95 | 🟢 1.24 s | 🟢 0.84 s | 🟢 10 ms | 🟢 0.073 |
| search | 98 | 🟢 1.12 s | 🟢 0.69 s | 🟢 5 ms | 🟢 0.039 |
| login | 97 | 🟢 1.11 s | 🟢 0.70 s | 🟢 8 ms | 🟢 0.016 |

### mobile

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 68 | 🟡 6.54 s | 🟡 3.46 s | 🟢 123 ms | 🟢 0.065 |
| search | 67 | 🟡 5.58 s | 🟡 3.46 s | 🟡 225 ms | 🟢 0.065 |
| login | 69 | 🟡 5.38 s | 🟡 3.47 s | 🟡 218 ms | 🟢 0.035 |

### Interaction to Next Paint (user flow)

🟢 **INP 97 ms** (median of 3: 90, 97, 98 ms; target 200, ceiling 300)

Slowest interaction: `div.search-area > app-mat-search-bar#searchQuery > div.search-container > input.ng-untouched` — Input delay 0 ms, Processing duration 71 ms, Presentation delay 25 ms

🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)
