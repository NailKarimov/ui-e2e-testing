## Performance: Lighthouse CI (median of 3 runs)

### desktop

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 96 | 🟢 1.23 s | 🟢 0.69 s | 🟢 12 ms | 🟢 0.073 |
| search | 97 | 🟢 1.15 s | 🟢 0.69 s | 🟢 11 ms | 🟢 0.039 |
| login | 97 | 🟢 1.16 s | 🟢 0.71 s | 🟢 24 ms | 🟢 0.018 |

### mobile

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 67 | 🟡 6.56 s | 🟡 3.46 s | 🟢 159 ms | 🟢 0.065 |
| search | 65 | 🟡 5.64 s | 🟡 3.47 s | 🟡 274 ms | 🟢 0.065 |
| login | 68 | 🟡 5.43 s | 🟡 3.48 s | 🟡 260 ms | 🟢 0.035 |

### Interaction to Next Paint (user flow)

🟢 **INP 97 ms** (median of 3: 101, 92, 97 ms; target 200, ceiling 300)

Slowest interaction: `div.search-area > app-mat-search-bar#searchQuery > div.search-container > input.ng-untouched` — Input delay 1 ms, Processing duration 73 ms, Presentation delay 23 ms

🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)
