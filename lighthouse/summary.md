## Performance: Lighthouse CI (median of 3 runs)

### desktop

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 95 | 🟢 1.26 s | 🟢 0.70 s | 🟢 40 ms | 🟢 0.075 |
| search | 97 | 🟢 1.18 s | 🟢 0.71 s | 🟢 30 ms | 🟢 0.039 |
| login | 97 | 🟢 1.18 s | 🟢 0.72 s | 🟢 40 ms | 🟢 0.016 |

### mobile

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 64 | 🟡 6.65 s | 🟡 3.46 s | 🟡 248 ms | 🟢 0.065 |
| search | 60 | 🟡 5.72 s | 🟡 3.47 s | 🟡 441 ms | 🟢 0.065 |
| login | 62 | 🟡 5.42 s | 🟡 3.52 s | 🟡 421 ms | 🟢 0.035 |

### Interaction to Next Paint (user flow)

🟢 **INP 119 ms** (median of 3: 131, 117, 119 ms; target 200, ceiling 300)

Slowest interaction: `div.search-area > app-mat-search-bar#searchQuery > div.search-container > input.ng-untouched` — Input delay 1 ms, Processing duration 87 ms, Presentation delay 32 ms

🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)
