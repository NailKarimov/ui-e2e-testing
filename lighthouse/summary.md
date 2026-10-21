## Performance: Lighthouse CI (median of 3 runs)

### desktop

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 96 | 🟢 1.25 s | 🟢 0.69 s | 🟢 46 ms | 🟢 0.073 |
| search | 97 | 🟢 1.18 s | 🟢 0.70 s | 🟢 37 ms | 🟢 0.039 |
| login | 97 | 🟢 1.22 s | 🟢 0.72 s | 🟢 55 ms | 🟢 0.018 |

### mobile

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 64 | 🟡 6.64 s | 🟡 3.46 s | 🟡 244 ms | 🟢 0.065 |
| search | 60 | 🟡 5.74 s | 🟡 3.48 s | 🟡 420 ms | 🟢 0.065 |
| login | 59 | 🟡 5.61 s | 🟡 3.49 s | 🟡 490 ms | 🟢 0.034 |

### Interaction to Next Paint (user flow)

🟢 **INP 125 ms** (median of 3: 125, 130, 121 ms; target 200, ceiling 300)

Slowest interaction: `div.search-area > app-mat-search-bar#searchQuery > div.search-container > input.ng-untouched` — Input delay 1 ms, Processing duration 94 ms, Presentation delay 30 ms

🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)
