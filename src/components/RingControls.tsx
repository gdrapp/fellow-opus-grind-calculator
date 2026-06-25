import type { Config } from '../lib/grinder'

interface Props {
  displayConfig: Config
  isTarget: boolean
  innerChanges: boolean
  onSetOuter: (v: number) => void
  onSetInner: (v: number) => void
}

const OUTER_VALUES = Array.from({ length: 41 }, (_, i) =>
  parseFloat((1.0 + i * 0.25).toFixed(2)),
)

function formatInner(v: number): string {
  if (v === 0) return '0'
  return v > 0 ? `+${v}` : `${v}`
}

interface StepperProps {
  label: string
  display: string
  onDecrement: () => void
  onIncrement: () => void
  canDecrement: boolean
  canIncrement: boolean
  highlight: boolean
}

function Stepper({
  label,
  display,
  onDecrement,
  onIncrement,
  canDecrement,
  canIncrement,
  highlight,
}: StepperProps) {
  return (
    <div className="flex items-center gap-3 py-1">
      <span className="w-24 shrink-0 text-sm font-medium text-gray-500">{label}</span>
      <button
        type="button"
        onClick={onDecrement}
        disabled={!canDecrement}
        aria-label={`Decrease ${label}`}
        className="flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-gray-100 text-xl font-bold text-gray-700 active:bg-gray-200 disabled:opacity-30"
      >
        −
      </button>
      <span
        className={`w-14 text-center font-mono text-xl font-semibold tabular-nums ${
          highlight ? 'text-amber-600' : 'text-gray-900'
        }`}
      >
        {display}
      </span>
      <button
        type="button"
        onClick={onIncrement}
        disabled={!canIncrement}
        aria-label={`Increase ${label}`}
        className="flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-gray-100 text-xl font-bold text-gray-700 active:bg-gray-200 disabled:opacity-30"
      >
        +
      </button>
    </div>
  )
}

export function RingControls({
  displayConfig,
  isTarget,
  innerChanges,
  onSetOuter,
  onSetInner,
}: Props) {
  const outerIdx = OUTER_VALUES.indexOf(displayConfig.outer)

  return (
    <div
      className={`flex flex-col gap-2 rounded-xl border p-4 ${
        isTarget && innerChanges
          ? 'border-amber-200 bg-amber-50'
          : isTarget
            ? 'border-green-200 bg-green-50'
            : 'border-gray-200 bg-white'
      }`}
    >
      <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-gray-400">
        {isTarget ? 'Set rings to' : 'Current position'}
      </h2>
      <Stepper
        label="Outer ring"
        display={displayConfig.outer.toFixed(2)}
        canDecrement={outerIdx > 0}
        canIncrement={outerIdx < OUTER_VALUES.length - 1}
        onDecrement={() => onSetOuter(OUTER_VALUES[outerIdx - 1])}
        onIncrement={() => onSetOuter(OUTER_VALUES[outerIdx + 1])}
        highlight={false}
      />
      <Stepper
        label="Inner notch"
        display={formatInner(displayConfig.inner)}
        canDecrement={displayConfig.inner > -6}
        canIncrement={displayConfig.inner < 6}
        onDecrement={() => onSetInner(displayConfig.inner - 1)}
        onIncrement={() => onSetInner(displayConfig.inner + 1)}
        highlight={isTarget && innerChanges}
      />
      {isTarget && innerChanges && (
        <p className="mt-1 text-xs text-amber-600">⚠ Inner ring must change</p>
      )}
    </div>
  )
}
