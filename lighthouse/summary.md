## Performance: Lighthouse CI (median of 3 runs)

### desktop

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 95 | 🟢 1.28 s | 🟢 0.71 s | 🟢 54 ms | 🟢 0.073 |
| search | 97 | 🟢 1.20 s | 🟢 0.71 s | 🟢 50 ms | 🟢 0.039 |
| login | 97 | 🟢 1.16 s | 🟢 0.72 s | 🟢 43 ms | 🟢 0.016 |

### mobile

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 65 | 🟡 6.62 s | 🟡 3.46 s | 🟡 218 ms | 🟢 0.065 |
| search | 60 | 🟡 5.71 s | 🟡 3.48 s | 🟡 440 ms | 🟢 0.065 |
| login | 63 | 🟡 5.52 s | 🟡 3.48 s | 🟡 383 ms | 🟢 0.034 |

### Interaction to Next Paint (user flow)

🟢 **INP 151 ms** (median of 3: 145, 165, 151 ms; target 200, ceiling 300)

Slowest interaction: `div.search-area > app-mat-search-bar#searchQuery > div.search-container > input.ng-untouched` — Input delay 0 ms, Processing duration 116 ms, Presentation delay 34 ms

🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)
