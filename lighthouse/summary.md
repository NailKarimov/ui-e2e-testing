## Performance: Lighthouse CI (median of 3 runs)

### desktop

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 95 | 🟢 1.28 s | 🟢 0.71 s | 🟢 45 ms | 🟢 0.073 |
| search | 97 | 🟢 1.16 s | 🟢 0.71 s | 🟢 28 ms | 🟢 0.039 |
| login | 97 | 🟢 1.16 s | 🟢 0.76 s | 🟢 42 ms | 🟢 0.016 |

### mobile

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 63 | 🟡 6.61 s | 🟡 3.52 s | 🟡 258 ms | 🟢 0.065 |
| search | 60 | 🟡 5.83 s | 🟡 3.48 s | 🟡 417 ms | 🟢 0.065 |
| login | 61 | 🟡 5.47 s | 🟡 3.48 s | 🟡 432 ms | 🟢 0.035 |

### Interaction to Next Paint (user flow)

🟢 **INP 130 ms** (median of 3: 128, 132, 130 ms; target 200, ceiling 300)

Slowest interaction: `div.search-area > app-mat-search-bar#searchQuery > div.search-container > input.ng-untouched` — Input delay 0 ms, Processing duration 97 ms, Presentation delay 33 ms

🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)
