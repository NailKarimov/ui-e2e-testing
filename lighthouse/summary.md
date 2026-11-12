## Performance: Lighthouse CI (median of 3 runs)

### desktop

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 96 | 🟢 1.23 s | 🟢 0.69 s | 🟢 5 ms | 🟢 0.073 |
| search | 97 | 🟢 1.16 s | 🟢 0.70 s | 🟢 9 ms | 🟢 0.041 |
| login | 97 | 🟢 1.10 s | 🟢 0.71 s | 🟢 10 ms | 🟢 0.016 |

### mobile

| Page | Score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| home | 68 | 🟡 6.53 s | 🟡 3.46 s | 🟢 103 ms | 🟢 0.065 |
| search | 68 | 🟡 5.59 s | 🟡 3.46 s | 🟢 198 ms | 🟢 0.065 |
| login | 70 | 🟡 5.35 s | 🟡 3.48 s | 🟢 184 ms | 🟢 0.035 |

### Interaction to Next Paint (user flow)

🟢 **INP 85 ms** (median of 3: 85, 79, 87 ms; target 200, ceiling 300)

Slowest interaction: `div.search-area > app-mat-search-bar#searchQuery > div.search-container > input.ng-untouched` — Input delay 0 ms, Processing duration 63 ms, Presentation delay 22 ms

🟢 meets the Core Web Vitals target · 🟡 misses the target, within the ceiling · 🔴 over the ceiling (the build fails)
