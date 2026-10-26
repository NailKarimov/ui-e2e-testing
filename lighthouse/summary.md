## Performance: Lighthouse CI (median of 3 runs)

### desktop

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 96 | 🟢 1.25 s | 🟢 0.69 s | 🟢 37 ms | 🟢 0.073 |
| search | 97 | 🟢 1.18 s | 🟢 0.70 s | 🟢 35 ms | 🟢 0.039 |
| login | 97 | 🟢 1.15 s | 🟢 0.71 s | 🟢 36 ms | 🟢 0.016 |

### mobile

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 64 | 🟡 6.63 s | 🟡 3.46 s | 🟡 240 ms | 🟢 0.065 |
| search | 61 | 🟡 5.73 s | 🟡 3.47 s | 🟡 409 ms | 🟢 0.065 |
| login | 62 | 🟡 5.42 s | 🟡 3.49 s | 🟡 437 ms | 🟢 0.035 |

### Interaction to Next Paint (user flow)

🟢 **INP 120 ms** (median of 3: 126, 120, 113 ms; target 200, ceiling 300)

Slowest interaction: `div.search-area > app-mat-search-bar#searchQuery > div.search-container > input.ng-untouched` — Input delay 1 ms, Processing duration 93 ms, Presentation delay 26 ms

🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)
