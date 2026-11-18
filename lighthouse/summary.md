## Performance: Lighthouse CI (median of 3 runs)

### desktop

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 96 | 🟢 1.21 s | 🟢 0.70 s | 🟢 3 ms | 🟢 0.073 |
| search | 97 | 🟢 1.14 s | 🟢 0.70 s | 🟢 8 ms | 🟢 0.039 |
| login | 98 | 🟢 1.12 s | 🟢 0.71 s | 🟢 15 ms | 🟢 0.018 |

### mobile

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 67 | 🟡 6.73 s | 🟡 3.46 s | 🟢 126 ms | 🟢 0.065 |
| search | 68 | 🟡 5.59 s | 🟡 3.47 s | 🟢 198 ms | 🟢 0.065 |
| login | 68 | 🟡 5.42 s | 🟡 3.47 s | 🟡 245 ms | 🟢 0.035 |

### Interaction to Next Paint (user flow)

🟢 **INP 88 ms** (median of 3: 91, 88, 85 ms; target 200, ceiling 300)

Slowest interaction: `div.search-area > app-mat-search-bar#searchQuery > div.search-container > input.ng-untouched` — Input delay 0 ms, Processing duration 67 ms, Presentation delay 20 ms

🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)
