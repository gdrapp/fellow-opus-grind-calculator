import type { Config, StepRow } from '../lib/grinder'

interface Props {
  rows: StepRow[]
  position: Config
  selectedStep: number
  onSelectStep: (step: number) => void
}

function formatStep(step: number): string {
  if (step === 0) return '0'
  return step > 0 ? `+${step}` : `${step}`
}

function formatInner(v: number): string {
  if (v === 0) return '0'
  return v > 0 ? `+${v}` : `${v}`
}

function ConfigCell({ config }: { config: Config }) {
  return (
    <span className="font-mono text-sm tabular-nums">
      {config.outer.toFixed(2)}
      <span className="text-gray-400"> / </span>
      {formatInner(config.inner)}
    </span>
  )
}

function Row({
  row,
  isCurrent,
  isSelected,
  innerChanges,
  onSelect,
}: {
  row: StepRow
  isCurrent: boolean
  isSelected: boolean
  innerChanges: boolean
  onSelect: () => void
}) {
  return (
    <tr
      onClick={onSelect}
      className={`cursor-pointer active:brightness-95 ${
        isSelected
          ? 'outline outline-2 -outline-offset-1 outline-indigo-400'
          : ''
      } ${
        isCurrent
          ? 'bg-indigo-50'
          : innerChanges
            ? 'bg-amber-50'
            : 'bg-white'
      }`}
    >
      <td className="py-2 pl-3 pr-2 text-center font-mono text-sm font-semibold tabular-nums text-gray-700">
        {formatStep(row.step)}
      </td>
      <td className="px-2 py-2 text-center font-mono text-sm tabular-nums text-gray-600">
        {row.effective.toFixed(2)}
      </td>
      <td className="px-2 py-2">
        <div className="flex items-center gap-1">
          {innerChanges && (
            <span className="text-amber-500" aria-label="inner ring must change">⚠</span>
          )}
          <ConfigCell config={row.best} />
        </div>
      </td>
      <td className="py-2 pl-2 pr-3 text-gray-400">
        {row.alt ? <ConfigCell config={row.alt} /> : <span className="text-xs">—</span>}
      </td>
    </tr>
  )
}

export function StepTable({ rows, position, selectedStep, onSelectStep }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="py-2 pl-3 pr-2 text-center text-xs font-semibold uppercase tracking-wide text-gray-400">
              Step
            </th>
            <th className="px-2 py-2 text-center text-xs font-semibold uppercase tracking-wide text-gray-400">
              Setting
            </th>
            <th className="px-2 py-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Best (outer / inner)
            </th>
            <th className="py-2 pl-2 pr-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Alt
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => (
            <Row
              key={row.step}
              row={row}
              isCurrent={row.step === 0}
              isSelected={row.step === selectedStep}
              innerChanges={row.best.inner !== position.inner}
              onSelect={() => onSelectStep(row.step)}
            />
          ))}
        </tbody>
      </table>
      <div className="flex items-center gap-4 border-t border-gray-100 px-3 py-2">
        <span className="flex items-center gap-1 text-xs text-gray-400">
          <span className="inline-block h-3 w-3 rounded-sm bg-indigo-100" /> current
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-400">
          <span className="text-amber-500">⚠</span> inner ring must change
        </span>
      </div>
    </div>
  )
}
