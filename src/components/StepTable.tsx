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
      className={`cursor-pointer active:brightness-95 ${
        isCurrent ? 'bg-indigo-50' : 'bg-white'
      } ${isSelected ? 'outline outline-2 -outline-offset-1 outline-indigo-400' : ''}`}
    >
      <td className="py-2 pl-3 pr-2 text-right font-mono text-sm tabular-nums text-gray-400">
        {index}
      </td>
      <td className="px-3 py-2 text-right font-mono text-sm tabular-nums text-gray-700">
        {row.effective.toFixed(2)}
      </td>
      <td className="px-3 py-2 text-right font-mono text-sm tabular-nums text-gray-700">
        {row.best.outer.toFixed(2)}
      </td>
      <td className="py-2 pl-3 pr-3 text-right font-mono text-sm tabular-nums text-gray-700">
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
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex-1 overflow-y-auto">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-gray-50 shadow-[0_1px_0_0_#e5e7eb]">
            <tr>
              <th className="py-2 pl-3 pr-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">
                #
              </th>
              <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">
                Setting
              </th>
              <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">
                Outer
              </th>
              <th className="py-2 pl-3 pr-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">
                Inner
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
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
      <div className="flex-none border-t border-gray-100 px-3 py-2">
        <span className="flex items-center gap-1 text-xs text-gray-400">
          <span className="inline-block h-3 w-3 rounded-sm bg-indigo-100" /> current position
        </span>
      </div>
    </div>
  )
}
