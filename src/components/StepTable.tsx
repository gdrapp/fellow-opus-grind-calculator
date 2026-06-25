import { useEffect, useRef } from 'react'
import type { StepRow } from '../lib/grinder'

interface Props {
  rows: StepRow[]
  selectedStep: number
  onSelectStep: (step: number) => void
}

function formatInner(v: number): string {
  if (v === 0) return '0'
  return v > 0 ? `+${v}` : `${v}`
}

function Row({
  index,
  row,
  isCurrent,
  isSelected,
  onSelect,
  rowRef,
}: {
  index: number
  row: StepRow
  isCurrent: boolean
  isSelected: boolean
  onSelect: () => void
  rowRef?: React.Ref<HTMLTableRowElement>
}) {
  return (
    <tr
      ref={rowRef}
      onClick={onSelect}
      className={`cursor-pointer transition-colors active:brightness-110 ${
        isSelected
          ? 'bg-amber-500/10 outline outline-1 -outline-offset-1 outline-amber-500/50'
          : isCurrent
            ? 'bg-indigo-500/10'
            : 'hover:bg-slate-800/50'
      }`}
    >
      <td className="py-2.5 pl-4 pr-2 text-right font-mono text-xs tabular-nums text-slate-600">
        {index}
      </td>
      <td className="px-3 py-2.5 text-right font-mono text-sm tabular-nums text-slate-300">
        {row.effective.toFixed(2)}
      </td>
      <td className={`px-3 py-2.5 text-right font-mono text-sm tabular-nums ${isCurrent || isSelected ? 'text-white' : 'text-slate-300'}`}>
        {row.best.outer.toFixed(2)}
      </td>
      <td className={`py-2.5 pl-3 pr-4 text-right font-mono text-sm tabular-nums ${isCurrent || isSelected ? 'text-white' : 'text-slate-300'}`}>
        {formatInner(row.best.inner)}
      </td>
    </tr>
  )
}

export function StepTable({ rows, selectedStep, onSelectStep }: Props) {
  const selectedRef = useRef<HTMLTableRowElement>(null)

  useEffect(() => {
    selectedRef.current?.scrollIntoView({ block: 'center', behavior: 'instant' })
  }, [])

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <div className="flex-1 overflow-y-auto">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-slate-950">
            <tr className="border-b border-slate-800">
              <th className="py-2.5 pl-4 pr-2 text-right text-xs font-semibold uppercase tracking-widest text-slate-600">
                #
              </th>
              <th className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-widest text-slate-600">
                Setting
              </th>
              <th className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-widest text-slate-600">
                Outer
              </th>
              <th className="py-2.5 pl-3 pr-4 text-right text-xs font-semibold uppercase tracking-widest text-slate-600">
                Inner
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {rows.map((row, i) => {
              const isCurrent = row.step === 0
              const isSelected = row.step === selectedStep
              return (
                <Row
                  key={row.step}
                  index={i + 1}
                  row={row}
                  isCurrent={isCurrent}
                  isSelected={isSelected}
                  onSelect={() => onSelectStep(row.step)}
                  rowRef={isSelected || isCurrent ? selectedRef : undefined}
                />
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="flex-none border-t border-slate-800 px-4 py-2.5">
        <span className="flex items-center gap-2 text-xs text-slate-600">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-indigo-500/30 ring-1 ring-indigo-500/50" />
          current position
        </span>
      </div>
    </div>
  )
}
