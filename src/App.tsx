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
    <div className="mx-auto flex h-svh max-w-md flex-col bg-slate-950">
      {/* Header */}
      <div className="flex-none px-4 pb-3 pt-5">
        <h1 className="mb-4 text-xl font-bold tracking-tight text-white">
          Fellow Opus
          <span className="ml-2 text-slate-500">Grind Calculator</span>
        </h1>
        {/* Tab switcher */}
        <div className="flex rounded-xl bg-slate-800 p-1">
          {(['adjust', 'table'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
                tab === t
                  ? 'bg-amber-500 text-slate-950'
                  : 'text-slate-400 active:text-slate-200'
              }`}
            >
              {t === 'adjust' ? 'Adjust' : 'Step Table'}
            </button>
          ))}
        </div>
      </div>

      {tab === 'adjust' ? (
        <div className="flex flex-col gap-3 px-4 pb-4">
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
          <p className="pt-1 text-center text-xs text-slate-600">
            Not affiliated with Fellow Products
          </p>
        </div>
      ) : (
        <div className="flex flex-1 flex-col overflow-hidden px-4 pb-4">
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
