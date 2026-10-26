## Performance: Lighthouse CI (median of 3 runs)

### desktop

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 95 | 🟢 1.24 s | 🟢 0.69 s | 🟢 16 ms | 🟢 0.073 |
| search | 97 | 🟢 1.16 s | 🟢 0.70 s | 🟢 7 ms | 🟢 0.039 |
| login | 97 | 🟢 1.14 s | 🟢 0.71 s | 🟢 13 ms | 🟢 0.018 |

### mobile

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 68 | 🟡 6.54 s | 🟡 3.46 s | 🟢 119 ms | 🟢 0.065 |
| search | 67 | 🟡 5.59 s | 🟡 3.46 s | 🟡 246 ms | 🟢 0.065 |
| login | 68 | 🟡 5.40 s | 🟡 3.47 s | 🟡 222 ms | 🟢 0.035 |

### Interaction to Next Paint (user flow)

🟢 **INP 86 ms** (median of 3: 86, 92, 83 ms; target 200, ceiling 300)

Slowest interaction: `div.search-area > app-mat-search-bar#searchQuery > div.search-container > input.ng-untouched` — Input delay 1 ms, Processing duration 64 ms, Presentation delay 22 ms

🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)
