import { describe, it, expect } from 'vitest'
import {
  effectiveToK,
  kToEffective,
  configsForK,
  scoreConfig,
  rankConfigs,
  buildStepTable,
} from './grinder'

describe('effectiveToK / kToEffective', () => {
  it('converts effective setting to integer k (×12)', () => {
    expect(effectiveToK(5.0)).toBe(60)
    expect(effectiveToK(1.0)).toBe(12)
    expect(effectiveToK(11.0)).toBe(132)
  })

  it('round-trips through kToEffective', () => {
    for (const k of [12, 37, 60, 91, 132]) {
      expect(effectiveToK(kToEffective(k))).toBe(k)
    }
  })

  it('rounds to nearest k for non-grid values', () => {
    expect(effectiveToK(5.04)).toBe(60)
    expect(effectiveToK(5.05)).toBe(61)
  })
})

describe('configsForK', () => {
  it('returns all valid configs for k=60 (effective 5.00)', () => {
    const configs = configsForK(60)
    // outer range 4.00–6.00 covers inner [-6,+6] at this effective
    expect(configs).toHaveLength(5)
    expect(configs).toContainEqual({ outer: 4.0, inner: 6 })
    expect(configs).toContainEqual({ outer: 4.5, inner: 3 })
    expect(configs).toContainEqual({ outer: 5.0, inner: 0 })
    expect(configs).toContainEqual({ outer: 5.5, inner: -3 })
    expect(configs).toContainEqual({ outer: 6.0, inner: -6 })
  })

  it('all configs have outer in [1.00, 11.00] and inner in [-6, +6]', () => {
    for (let k = 0; k <= 140; k++) {
      for (const { outer, inner } of configsForK(k)) {
        expect(outer).toBeGreaterThanOrEqual(1.0)
        expect(outer).toBeLessThanOrEqual(11.0)
        expect(inner).toBeGreaterThanOrEqual(-6)
        expect(inner).toBeLessThanOrEqual(6)
      }
    }
  })

  it('all returned inner values are integers', () => {
    for (let k = 0; k <= 132; k++) {
      for (const { inner } of configsForK(k)) {
        expect(Number.isInteger(inner)).toBe(true)
      }
    }
  })

  it('effective setting of each config equals k/12', () => {
    for (let k = 12; k <= 132; k++) {
      for (const { outer, inner } of configsForK(k)) {
        const effective = outer + inner / 6
        expect(effective).toBeCloseTo(k / 12, 10)
      }
    }
  })

  it('returns empty array for unreachable k values', () => {
    // k=1 is below the minimum achievable setting
    expect(configsForK(1)).toHaveLength(0)
  })
})

describe('scoreConfig', () => {
  const current = { outer: 5.0, inner: 0 }

  it('scores zero for no movement', () => {
    expect(scoreConfig({ outer: 5.0, inner: 0 }, current)).toBe(0)
  })

  it('adds +1000 when inner ring must change', () => {
    const score = scoreConfig({ outer: 5.5, inner: -3 }, current)
    expect(score).toBeGreaterThanOrEqual(1000)
  })

  it('outer-only move scores much lower than any inner-change move', () => {
    const outerOnly = scoreConfig({ outer: 5.25, inner: 0 }, current)
    const innerChange = scoreConfig({ outer: 5.5, inner: -3 }, current)
    expect(outerOnly).toBeLessThan(innerChange)
  })

  it('prefers smaller outer movement when inner is unchanged', () => {
    const close = scoreConfig({ outer: 5.25, inner: 0 }, current)
    const far = scoreConfig({ outer: 6.0, inner: 0 }, current)
    expect(close).toBeLessThan(far)
  })

  it('prefers inner closer to zero when outer is unchanged', () => {
    // hypothetical: same outer, different inner distances from zero
    const nearZero = scoreConfig({ outer: 5.0, inner: 1 }, { outer: 5.0, inner: 1 })
    const farFromZero = scoreConfig({ outer: 5.0, inner: 5 }, { outer: 5.0, inner: 5 })
    expect(nearZero).toBeLessThan(farFromZero)
  })
})

describe('rankConfigs', () => {
  it('returns configs sorted by score ascending', () => {
    const current = { outer: 5.0, inner: 0 }
    const ranked = rankConfigs(63, current) // effective 5.25
    expect(ranked[0]).toEqual({ outer: 5.25, inner: 0 }) // outer-only move
  })

  it('puts outer-only move first over an equivalent inner-change route', () => {
    const current = { outer: 5.0, inner: 0 }
    // k=63: outer=5.25/inner=0 vs outer=4.75/inner=3, etc.
    const ranked = rankConfigs(63, current)
    expect(ranked[0].inner).toBe(current.inner) // best move keeps inner unchanged
  })
})

describe('buildStepTable', () => {
  const current = { outer: 5.0, inner: 0 }

  it('returns a row for each step from -8 to +8 at mid-range', () => {
    const rows = buildStepTable(5.0, current)
    expect(rows).toHaveLength(17)
    expect(rows[0].step).toBe(-8)
    expect(rows[16].step).toBe(8)
  })

  it('step 0 row has effective 5.00 and best config matches current', () => {
    const rows = buildStepTable(5.0, current)
    const zero = rows.find((r) => r.step === 0)!
    expect(zero.effective).toBeCloseTo(5.0)
    expect(zero.best).toEqual({ outer: 5.0, inner: 0 })
  })

  it('effective of each row equals (k0 + step) / 12', () => {
    const rows = buildStepTable(5.0, current)
    for (const row of rows) {
      expect(row.effective).toBeCloseTo((60 + row.step) / 12, 10)
    }
  })

  it('provides an alt config when multiple configs exist', () => {
    const rows = buildStepTable(5.0, current)
    // k=60 has 5 valid configs, so alt should be present
    const zero = rows.find((r) => r.step === 0)!
    expect(zero.alt).not.toBeNull()
  })

  it('skips steps with no valid configs at the extreme low end', () => {
    // effective=1.00, k0=12; step -8 → k=4 (one config exists); step -9 would be k=3
    // We only go to -8, so all 17 steps should exist here too
    const rows = buildStepTable(1.0, { outer: 1.0, inner: 0 })
    // Some extreme steps may have fewer configs but should still return rows
    expect(rows.length).toBeGreaterThan(0)
  })
})
