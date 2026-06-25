export interface Config {
  outer: number
  inner: number
}

export interface StepRow {
  step: number
  effective: number
  best: Config
  alt: Config | null
}

const OUTER_STEP = 0.25
const INNER_MIN = -6
const INNER_MAX = 6
const N_MIN = 4  // outer 1.00
const N_MAX = 44 // outer 11.00

export function effectiveToK(effective: number): number {
  return Math.round(effective * 12)
}

export function kToEffective(k: number): number {
  return k / 12
}

export function configsForK(k: number): Config[] {
  const configs: Config[] = []
  for (let N = N_MIN; N <= N_MAX; N++) {
    // inner = (k − 3N) / 2 is only an integer when k and N share parity
    if ((k & 1) !== (N & 1)) continue
    const inner = (k - 3 * N) / 2
    if (inner < INNER_MIN || inner > INNER_MAX) continue
    configs.push({ outer: N / 4, inner })
  }
  return configs
}

export function scoreConfig(config: Config, current: Config): number {
  const innerChanged = config.inner !== current.inner
  return (
    (innerChanged ? 1000 : 0) +
    Math.abs(config.inner - current.inner) * 10 +
    Math.abs(config.outer - current.outer) / OUTER_STEP +
    Math.abs(config.inner) * 0.1
  )
}

export function rankConfigs(k: number, current: Config): Config[] {
  return configsForK(k).sort(
    (a, b) => scoreConfig(a, current) - scoreConfig(b, current),
  )
}

export function buildStepTable(currentEffective: number, current: Config): StepRow[] {
  const k0 = effectiveToK(currentEffective)
  const rows: StepRow[] = []
  for (let step = -8; step <= 8; step++) {
    const k = k0 + step
    const ranked = rankConfigs(k, current)
    if (ranked.length === 0) continue
    rows.push({
      step,
      effective: kToEffective(k),
      best: ranked[0],
      alt: ranked.length > 1 ? ranked[1] : null,
    })
  }
  return rows
}
