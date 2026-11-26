## Performance: Lighthouse CI (median of 3 runs)

### desktop

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 96 | 🟢 1.25 s | 🟢 0.69 s | 🟢 34 ms | 🟢 0.073 |
| search | 97 | 🟢 1.16 s | 🟢 0.70 s | 🟢 37 ms | 🟢 0.039 |
| login | 97 | 🟢 1.17 s | 🟢 0.70 s | 🟢 42 ms | 🟢 0.018 |

### mobile

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 64 | 🟡 6.69 s | 🟡 3.46 s | 🟡 245 ms | 🟢 0.065 |
| search | 60 | 🟡 5.77 s | 🟡 3.47 s | 🟡 427 ms | 🟢 0.065 |
| login | 63 | 🟡 5.52 s | 🟡 3.48 s | 🟡 389 ms | 🟢 0.035 |

### Interaction to Next Paint (user flow)

🟢 **INP 117 ms** (median of 3: 114, 117, 117 ms; target 200, ceiling 300)

Slowest interaction: `div.search-area > app-mat-search-bar#searchQuery > div.search-container > input.ng-untouched` — Input delay 1 ms, Processing duration 88 ms, Presentation delay 28 ms

🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)
