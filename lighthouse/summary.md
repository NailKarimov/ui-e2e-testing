## Performance: Lighthouse CI (median of 3 runs)

### desktop

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 96 | 🟢 1.24 s | 🟢 0.70 s | 🟢 42 ms | 🟢 0.073 |
| search | 97 | 🟢 1.18 s | 🟢 0.70 s | 🟢 42 ms | 🟢 0.039 |
| login | 97 | 🟢 1.20 s | 🟢 0.71 s | 🟢 49 ms | 🟢 0.018 |

### mobile

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 64 | 🟡 6.70 s | 🟡 3.46 s | 🟡 245 ms | 🟢 0.065 |
| search | 60 | 🟡 5.73 s | 🟡 3.47 s | 🟡 429 ms | 🟢 0.065 |
| login | 61 | 🟡 5.52 s | 🟡 3.49 s | 🟡 448 ms | 🟢 0.035 |

### Interaction to Next Paint (user flow)

🟢 **INP 142 ms** (median of 3: 147, 122, 142 ms; target 200, ceiling 300)

Slowest interaction: `div.search-area > app-mat-search-bar#searchQuery > div.search-container > input.ng-untouched` — Input delay 1 ms, Processing duration 111 ms, Presentation delay 30 ms

🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)
