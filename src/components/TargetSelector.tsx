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

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex w-full items-center justify-between">
        <span className="text-sm font-semibold uppercase tracking-wide text-gray-400">
          Target
        </span>
        <span
          className={`text-xs font-medium ${
            targetStep === 0
              ? 'text-indigo-500'
              : innerChanges
                ? 'text-amber-600'
                : 'text-green-600'
          }`}
        >
          {stepLabel(targetStep)}
        </span>
      </div>

      <div className="flex w-full items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onStepChange(targetStep - 1)}
          disabled={targetStep <= minStep}
          aria-label="One step finer"
          className="flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-gray-100 text-xl font-bold text-gray-700 active:bg-gray-200 disabled:opacity-30"
        >
          −
        </button>

        <div className="text-center">
          <div className="font-mono text-3xl font-bold tabular-nums text-gray-900">
            {row ? row.effective.toFixed(2) : '—'}
          </div>
          <div className="mt-0.5 text-xs text-gray-400">effective setting</div>
        </div>

        <button
          type="button"
          onClick={() => onStepChange(targetStep + 1)}
          disabled={targetStep >= maxStep}
          aria-label="One step coarser"
          className="flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-gray-100 text-xl font-bold text-gray-700 active:bg-gray-200 disabled:opacity-30"
        >
          +
        </button>
      </div>
    </div>
  )
}
