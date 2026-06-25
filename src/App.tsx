import { useState, useEffect } from 'react'
import { useGrinderState } from './hooks/useGrinderState'
import { buildStepTable, buildFullTable } from './lib/grinder'
import { RingControls } from './components/RingControls'
import { TargetSelector } from './components/TargetSelector'
import { StepTable } from './components/StepTable'

type Tab = 'adjust' | 'table'

export function App() {
  const { position, setOuter, setInner } = useGrinderState()
  const effective = position.outer + position.inner / 6
  const rows = buildStepTable(effective, position)
  const fullRows = buildFullTable(position)

  const [targetStep, setTargetStep] = useState(0)
  const [tab, setTab] = useState<Tab>('adjust')

  useEffect(() => {
    setTargetStep(0)
  }, [position.outer, position.inner])

  const targetRow = fullRows.find((r) => r.step === targetStep)
  const displayConfig = targetStep !== 0 && targetRow ? targetRow.best : position
  const isTarget = targetStep !== 0 && targetRow !== undefined
  const innerChanges = isTarget ? displayConfig.inner !== position.inner : false

  function handleSelectStep(step: number) {
    setTargetStep(step)
    setTab('adjust')
  }

  return (
    <div className="mx-auto flex h-svh max-w-md flex-col bg-gray-50">
      <div className="flex-none flex flex-col gap-3 p-4 pb-2">
        <h1 className="text-lg font-bold text-gray-900">Fellow Opus Grind Calculator</h1>
        <div className="flex rounded-xl bg-gray-200 p-1">
          {(['adjust', 'table'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
                tab === t
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 active:text-gray-700'
              }`}
            >
              {t === 'adjust' ? 'Adjust' : 'Step Table'}
            </button>
          ))}
        </div>
      </div>

      {tab === 'adjust' ? (
        <div className="flex flex-col gap-3 p-4 pt-0">
          <RingControls
            displayConfig={displayConfig}
            isTarget={isTarget}
            innerChanges={innerChanges}
            onSetOuter={setOuter}
            onSetInner={setInner}
          />
          <TargetSelector
            rows={rows}
            targetStep={targetStep}
            position={position}
            onStepChange={setTargetStep}
          />
          <p className="pt-1 text-center text-xs text-gray-400">
            Not affiliated with Fellow Products
          </p>
        </div>
      ) : (
        <div className="flex flex-1 flex-col overflow-hidden p-4 pt-0">
          <StepTable
            rows={fullRows}
            selectedStep={targetStep}
            onSelectStep={handleSelectStep}
          />
        </div>
      )}
    </div>
  )
}
