# Fellow Opus Grind Calculator

A mobile-first web app for dialing in the [Fellow Opus](https://fellowproducts.com/products/opus-grinder) grinder. It shows every achievable grind setting and the exact outer and inner ring configuration needed to reach it.

## What it does

The Opus has two adjustable rings that together determine your grind size:

- **Outer ring** — 41 positions from 1.00 to 11.00 in 0.25 steps
- **Inner notch** — 13 positions from −6 to +6

Because the outer ring moves in steps of 1/4 and the inner in steps of 1/6, their GCD is 1/12 — so you can reach settings halfway between outer-ring positions by combining both rings. That's 17 micro-steps for every outer-ring click, but knowing which ring to move and by how much isn't obvious.

This calculator does that math for you.

## How to use it

1. **Set your current position** — dial in your outer ring and inner notch to match where your grinder is right now.
2. **Adjust the target** — tap − (finer) or + (coarser) to step the effective setting up or down in 1/12 increments.
3. **Set the rings** — the app shows exactly what to dial for outer and inner to reach your target, and warns you when the inner ring needs to change (it's harder to adjust).
4. **Step Table tab** — shows all ±8 micro-steps from your current position at a glance. Tap any row to jump to that target.

## Stack

- React 19 + TypeScript (strict)
- Vite 8
- Tailwind CSS v4
- Hosted on Cloudflare Pages

## Development

```bash
npm install
npm run dev       # dev server at http://localhost:5173
npm run test      # run unit tests (Vitest)
npm run build     # production build
npm run lint      # oxlint
npm run typecheck # tsc --noEmit
```

CI runs lint → typecheck → test → build → `npm audit` on every PR. Dependabot keeps dependencies up to date weekly.
