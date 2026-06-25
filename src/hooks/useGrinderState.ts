import { useState, useEffect } from 'react'
import type { Config } from '../lib/grinder'

const STORAGE_KEY = 'grinder-position'
const DEFAULT: Config = { outer: 5.0, inner: 0 }

function isValidOuter(v: unknown): v is number {
  if (typeof v !== 'number' || !isFinite(v)) return false
  if (v < 1.0 || v > 11.0) return false
  // must be a multiple of 0.25
  return Math.round(v * 4) === v * 4
}

function isValidInner(v: unknown): v is number {
  return typeof v === 'number' && Number.isInteger(v) && v >= -6 && v <= 6
}

function loadPosition(): Config {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return DEFAULT
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return DEFAULT
    const { outer, inner } = parsed as Record<string, unknown>
    if (isValidOuter(outer) && isValidInner(inner)) return { outer, inner }
  } catch {
    // malformed JSON or localStorage unavailable
  }
  return DEFAULT
}

function savePosition(config: Config): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  } catch {
    // storage quota exceeded or unavailable — silently ignore
  }
}

export function useGrinderState() {
  const [position, setPosition] = useState<Config>(loadPosition)

  useEffect(() => {
    savePosition(position)
  }, [position])

  function setOuter(outer: number) {
    setPosition((prev) => ({ ...prev, outer }))
  }

  function setInner(inner: number) {
    setPosition((prev) => ({ ...prev, inner }))
  }

  return { position, setOuter, setInner }
}
