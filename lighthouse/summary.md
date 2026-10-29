## Performance: Lighthouse CI (median of 3 runs)

### desktop

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 96 | 🟢 1.26 s | 🟢 0.70 s | 🟢 45 ms | 🟢 0.073 |
| search | 97 | 🟢 1.18 s | 🟢 0.70 s | 🟢 41 ms | 🟢 0.039 |
| login | 97 | 🟢 1.20 s | 🟢 0.71 s | 🟢 48 ms | 🟢 0.018 |

### mobile

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 63 | 🟡 6.70 s | 🟡 3.46 s | 🟡 250 ms | 🟢 0.065 |
| search | 59 | 🟡 5.74 s | 🟡 3.47 s | 🟡 456 ms | 🟢 0.065 |
| login | 59 | 🟡 5.61 s | 🟡 3.49 s | 🟡 492 ms | 🟢 0.035 |

### Interaction to Next Paint (user flow)

🟢 **INP 142 ms** (median of 3: 126, 142, 145 ms; target 200, ceiling 300)

Slowest interaction: `div.search-area > app-mat-search-bar#searchQuery > div.search-container > input.ng-untouched` — Input delay 1 ms, Processing duration 105 ms, Presentation delay 36 ms

🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)
