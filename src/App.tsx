import { useState, useEffect } from 'react'
import { useGrinderState } from './hooks/useGrinderState'
import { buildStepTable } from './lib/grinder'
import { RingControls } from './components/RingControls'
import { TargetSelector } from './components/TargetSelector'
import { StepTable } from './components/StepTable'

type Tab = 'adjust' | 'table'

export function App() {
  const { position, setOuter, setInner } = useGrinderState()
  const effective = position.outer + position.inner / 6
  const rows = buildStepTable(effective, position)

  const [targetStep, setTargetStep] = useState(0)
  const [tab, setTab] = useState<Tab>('adjust')

  // Reset target when the user manually changes position
  useEffect(() => {
    setTargetStep(0)
  }, [position.outer, position.inner])

  const targetRow = rows.find((r) => r.step === targetStep)
  const displayConfig = targetStep !== 0 && targetRow ? targetRow.best : position
  const isTarget = targetStep !== 0 && targetRow !== undefined
  const innerChanges = isTarget ? displayConfig.inner !== position.inner : false

  function handleSelectStep(step: number) {
    setTargetStep(step)
    setTab('adjust')
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col bg-gray-50">
      <div className="flex flex-col gap-3 p-4 pb-2">
        <h1 className="text-lg font-bold text-gray-900">Fellow Opus Grind Calculator</h1>
        <div className="flex rounded-xl bg-gray-200 p-1">
          {(['adjust', 'table'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold capitalize transition-colors ${
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

      <div className="flex flex-col gap-3 p-4 pt-0">
        {tab === 'adjust' ? (
          <>
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
          </>
        ) : (
          <StepTable
            rows={rows}
            position={position}
            selectedStep={targetStep}
            onSelectStep={handleSelectStep}
          />
        )}
      </div>
    </div>
  )
}
