# Fellow Opus Grind Calculator

Mobile-first SPA that shows every achievable grind setting for the Fellow Opus grinder and how to configure both rings to reach it.

## Stack

- **React** (with hooks, no class components)
- **Vite** — build tool and dev server
- **Tailwind CSS** — utility-first styling, mobile-first breakpoints
- **Hosted on Cloudflare Pages** — static deployment, no server-side logic

## Project priorities

1. **Security** — no external data fetching, no auth surface; keep deps minimal and pinned; enforce CSP headers via `_headers` file in `public/`
2. **Dependency hygiene** — Dependabot configured for weekly npm updates with auto-merge for patch bumps; all PRs must pass CI before merge
3. **Mobile UX** — design for 390px viewport first; touch targets ≥ 44px; no hover-only interactions

## Grinder math

### Rings

| Ring | Step size | Range | Positions |
|------|-----------|-------|-----------|
| Outer | 0.25 | 1.00 – 11.00 | 41 |
| Inner | 1/6 ≈ 0.1667 | −6 to +6 | 13 |

```
effectiveSetting = outer + inner * (1 / 6)
```

GCD of one outer notch (1/4) and one inner notch (1/6) is **1/12**, so the finest achievable step is ~0.0833 — half an inner notch, reached only by moving both rings.

### Core algorithm — all configs for a target effective setting

Represent every setting as integer `k = effective × 12`.

For outer position `outer = N / 4` (N integer, 4 ≤ N ≤ 44):

```
inner = (k − 3N) / 2
```

Valid when:
- `k` and `N` have the **same parity** (otherwise inner is non-integer)
- `inner` is in `[−6, +6]`

Collect all valid `(outer, inner)` pairs for the target `k`.

### Ranking configs from current position

Score (ascending — lower is better):

```
score = (innerChanged ? 1000 : 0)
      + |inner − currentInner| * 10
      + (|outer − currentOuter| / 0.25)
      + |inner| * 0.1
```

Penalty breakdown:
- **+1000** if the inner ring must change (heavily penalized — inner is harder to adjust)
- Inner distance in notches × 10
- Outer distance in notches
- Inner absolute position × 0.1 (prefer inner near zero for future range)

### Step table

`k0 = round(currentEffective × 12)`

For each step offset `−8` to `+8`:
- `k = k0 + step`
- Find and rank all configs
- Emit a row with the best config and the next-best alternative

## UI structure

The app has two tabs:

**Adjust tab (default):**
1. Current position — outer ring stepper and inner notch stepper (sets where the grinder is now; persisted to localStorage)
2. Target selector — increment/decrement the effective setting by 1/12 steps; shows the exact outer and inner values to dial in for the selected target; resets to step 0 when current position changes; green when only outer changes, amber when inner must change

**Table tab:**
- Full step reference table (−8 to +8 from current); rows are tappable to jump the target selector; not shown by default as it's secondary information

The target selector is the primary UX: user sets their current position, then steps the target up or down to see precisely what to dial in next.

## File / folder conventions

```
src/
  components/    — UI components (one file per component)
  lib/           — pure functions (grinder math lives here, fully unit-tested)
  hooks/         — custom React hooks
public/
  _headers       — Cloudflare Pages response headers (CSP, HSTS, etc.)
.github/
  workflows/     — CI (lint, typecheck, test, build)
  dependabot.yml — weekly npm updates, patch auto-merge
```

## Code style

- TypeScript strict mode
- Named exports only (no default exports except route-level pages)
- Pure functions in `lib/` with no side effects — keep them testable
- Tailwind only for styles — no CSS modules, no styled-components, no inline `style` props
- No `any` types; no `// eslint-disable` comments

## Security baseline

- `public/_headers` must set: `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`
- CSP must disallow `unsafe-inline` and `unsafe-eval`
- No external scripts, fonts, or analytics loaded at runtime
- `npm audit` must pass (0 high/critical) in CI before deploy

## CI requirements (GitHub Actions)

Every PR must pass:
1. `npm run lint`
2. `npm run typecheck`
3. `npm run test`
4. `npm run build` (Vite production build)

Deploy to Cloudflare Pages only on merge to `main`.

## Dependabot

- Weekly schedule, `npm` ecosystem
- Auto-merge patch updates if CI passes
- Group minor updates into a single PR per week
- Never auto-merge major version bumps — require manual review
