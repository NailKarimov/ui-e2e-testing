## Performance: Lighthouse CI (median of 3 runs)

### desktop

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 95 | 🟢 1.25 s | 🟢 0.70 s | 🟢 37 ms | 🟢 0.073 |
| search | 97 | 🟢 1.19 s | 🟢 0.71 s | 🟢 35 ms | 🟢 0.039 |
| login | 97 | 🟢 1.19 s | 🟢 0.73 s | 🟢 48 ms | 🟢 0.015 |

### mobile

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 64 | 🟡 6.67 s | 🟡 3.46 s | 🟡 242 ms | 🟢 0.065 |
| search | 61 | 🟡 5.71 s | 🟡 3.47 s | 🟡 417 ms | 🟢 0.065 |
| login | 61 | 🟡 5.47 s | 🟡 3.50 s | 🟡 445 ms | 🟢 0.035 |

### Interaction to Next Paint (user flow)

🟢 **INP 129 ms** (median of 3: 125, 131, 129 ms; target 200, ceiling 300)

Slowest interaction: `div.search-area > app-mat-search-bar#searchQuery > div.search-container > input.ng-untouched` — Input delay 0 ms, Processing duration 98 ms, Presentation delay 30 ms

🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)
