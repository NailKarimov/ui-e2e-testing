## Performance: Lighthouse CI (median of 3 runs)

### desktop

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 96 | 🟢 1.22 s | 🟢 0.69 s | 🟢 5 ms | 🟢 0.073 |
| search | 97 | 🟢 1.15 s | 🟢 0.70 s | 🟢 8 ms | 🟢 0.039 |
| login | 98 | 🟢 1.11 s | 🟢 0.70 s | 🟢 24 ms | 🟢 0.018 |

### mobile

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 68 | 🟡 6.56 s | 🟡 3.46 s | 🟢 144 ms | 🟢 0.065 |
| search | 67 | 🟡 5.61 s | 🟡 3.47 s | 🟡 219 ms | 🟢 0.065 |
| login | 68 | 🟡 5.40 s | 🟡 3.47 s | 🟡 234 ms | 🟢 0.035 |

### Interaction to Next Paint (user flow)

🟢 **INP 101 ms** (median of 3: 105, 98, 101 ms; target 200, ceiling 300)

Slowest interaction: `div.search-area > app-mat-search-bar#searchQuery > div.search-container > input.ng-untouched` — Input delay 1 ms, Processing duration 77 ms, Presentation delay 24 ms

🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)
