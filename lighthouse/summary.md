## Performance: Lighthouse CI (median of 3 runs)

### desktop

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 96 | 🟢 1.23 s | 🟢 0.69 s | 🟢 4 ms | 🟢 0.073 |
| search | 97 | 🟢 1.13 s | 🟢 0.69 s | 🟢 2 ms | 🟢 0.039 |
| login | 97 | 🟢 1.12 s | 🟢 0.86 s | 🟢 11 ms | 🟢 0.016 |

### mobile

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 68 | 🟡 6.69 s | 🟡 3.46 s | 🟢 112 ms | 🟢 0.065 |
| search | 68 | 🟡 5.72 s | 🟡 3.46 s | 🟢 178 ms | 🟢 0.065 |
| login | 70 | 🟡 5.23 s | 🟡 3.47 s | 🟡 206 ms | 🟢 0.035 |

### Interaction to Next Paint (user flow)

🟢 **INP 96 ms** (median of 3: 93, 96, 96 ms; target 200, ceiling 300)

Slowest interaction: `div.search-area > app-mat-search-bar#searchQuery > div.search-container > input.ng-untouched` — Input delay 0 ms, Processing duration 75 ms, Presentation delay 20 ms

🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)
