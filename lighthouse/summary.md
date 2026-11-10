## Performance: Lighthouse CI (median of 3 runs)

### desktop

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 95 | 🟢 1.30 s | 🟢 0.70 s | 🟢 42 ms | 🟢 0.073 |
| search | 97 | 🟢 1.17 s | 🟢 0.71 s | 🟢 32 ms | 🟢 0.039 |
| login | 97 | 🟢 1.19 s | 🟢 0.87 s | 🟢 44 ms | 🟢 0.018 |

### mobile

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 64 | 🟡 6.63 s | 🟡 3.46 s | 🟡 248 ms | 🟢 0.065 |
| search | 62 | 🟡 5.72 s | 🟡 3.47 s | 🟡 382 ms | 🟢 0.065 |
| login | 62 | 🟡 5.52 s | 🟡 3.48 s | 🟡 415 ms | 🟢 0.035 |

### Interaction to Next Paint (user flow)

🟢 **INP 115 ms** (median of 3: 114, 115, 120 ms; target 200, ceiling 300)

Slowest interaction: `div.search-area > app-mat-search-bar#searchQuery > div.search-container > input.ng-untouched` — Input delay 1 ms, Processing duration 86 ms, Presentation delay 28 ms

🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)
