## Performance: Lighthouse CI (median of 3 runs)

### desktop

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 96 | 🟢 1.23 s | 🟢 0.69 s | 🟢 9 ms | 🟢 0.073 |
| search | 98 | 🟢 1.12 s | 🟢 0.69 s | 🟢 0 ms | 🟢 0.039 |
| login | 97 | 🟢 1.11 s | 🟢 0.86 s | 🟢 15 ms | 🟢 0.016 |

### mobile

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 68 | 🟡 6.51 s | 🟡 3.46 s | 🟢 93 ms | 🟢 0.065 |
| search | 68 | 🟡 5.72 s | 🟡 3.46 s | 🟢 199 ms | 🟢 0.065 |
| login | 70 | 🟡 5.24 s | 🟡 3.47 s | 🟢 188 ms | 🟢 0.035 |

### Interaction to Next Paint (user flow)

🟢 **INP 80 ms** (median of 3: 86, 80, 77 ms; target 200, ceiling 300)

Slowest interaction: `div.search-area > app-mat-search-bar#searchQuery > div.search-container > input.ng-untouched` — Input delay 1 ms, Processing duration 59 ms, Presentation delay 21 ms

🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)
