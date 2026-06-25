import type { Config, StepRow } from '../lib/grinder'

interface Props {
  rows: StepRow[]
  targetStep: number
  position: Config
  onStepChange: (step: number) => void
}

function stepLabel(step: number): string {
  if (step === 0) return 'current position'
  const n = Math.abs(step)
  const dir = step < 0 ? 'finer' : 'coarser'
  return `${n} step${n > 1 ? 's' : ''} ${dir}`
}

export function TargetSelector({ rows, targetStep, position, onStepChange }: Props) {
  const minStep = rows[0]?.step ?? -8
  const maxStep = rows[rows.length - 1]?.step ?? 8
  const row: StepRow | undefined = rows.find((r) => r.step === targetStep)
  const innerChanges = row ? row.best.inner !== position.inner : false

  const labelColor =
    targetStep === 0
      ? 'text-slate-500'
      : innerChanges
        ? 'text-amber-400'
        : 'text-emerald-400'

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex w-full items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          Target
        </span>
        <span className={`text-xs font-semibold ${labelColor}`}>
          {stepLabel(targetStep)}
        </span>
      </div>

      <div className="flex w-full items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => onStepChange(targetStep - 1)}
          disabled={targetStep <= minStep}
          aria-label="One step finer"
          className="flex min-h-12 min-w-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-2xl font-bold text-slate-200 active:bg-slate-700 disabled:opacity-25"
        >
          −
        </button>

        <div className="text-center">
          <div className="font-mono text-5xl font-bold tabular-nums tracking-tight text-white">
            {row ? row.effective.toFixed(2) : '—'}
          </div>
          <div className="mt-1 text-xs font-medium uppercase tracking-widest text-slate-600">
            effective setting
          </div>
        </div>

        <button
          type="button"
          onClick={() => onStepChange(targetStep + 1)}
          disabled={targetStep >= maxStep}
          aria-label="One step coarser"
          className="flex min-h-12 min-w-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-2xl font-bold text-slate-200 active:bg-slate-700 disabled:opacity-25"
        >
          +
        </button>
      </div>
    </div>
  )
}
