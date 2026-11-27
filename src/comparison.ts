export const units = {
  g:  { base: 'kg', factor: 1n },
  kg: { base: 'kg', factor: 1000n },
  mL: { base: 'L',  factor: 1n },
  L:  { base: 'L',  factor: 1000n },
  un: { base: 'un', factor: 1000n },
} as const

export type Unit = keyof typeof units
export type PackageInput = { price: string; quantity: string; unit: Unit }
export type Comparison =
  | { ok: false; message: string }
  | { ok: true; base: 'kg' | 'L' | 'un'; rates: [number, number]; winner: 'A' | 'B' | 'tie'; saving: number }

function scaledInteger(text: string, places: number): bigint | null {
  const match = /^(\d{1,12})(?:[.,](\d+))?$/.exec(text.trim())
  if (!match || (match[2]?.length ?? 0) > places) return null
  const value = BigInt(match[1] + (match[2] ?? '').padEnd(places, '0'))
  return value > 0n ? value : null
}

function readPackage(input: PackageInput, label: string) {
  const price = scaledInteger(input.price, 2)
  if (price === null) return { error: `Embalagem ${label}: o preço deve ser positivo, com até dois decimais.` } as const
  const quantity = scaledInteger(input.quantity, 3)
  if (quantity === null) return { error: `Embalagem ${label}: a quantidade deve ser positiva, com até três decimais.` } as const
  if (input.unit === 'un' && quantity % 1000n !== 0n) {
    return { error: `Embalagem ${label}: a quantidade de unidades deve ser inteira.` } as const
  }
  return { price, amount: quantity * units[input.unit].factor } as const
}

export function compare(a: PackageInput, b: PackageInput): Comparison {
  if ([a.price, a.quantity, b.price, b.quantity].some(value => !value.trim())) {
    return { ok: false, message: 'Faltam dados de preço ou quantidade.' }
  }
  const first = readPackage(a, 'A')
  if (first.error !== undefined) return { ok: false, message: first.error }
  const second = readPackage(b, 'B')
  if (second.error !== undefined) return { ok: false, message: second.error }
  if (a.unit !== b.unit) {
    return { ok: false, message: 'As embalagens precisam usar medidas compatíveis.' }
  }

  // A comparação por produtos cruzados preserva o empate antes do arredondamento em reais.
  const left = first.price * second.amount
  const right = second.price * first.amount
  const winner = left === right ? 'tie' : left < right ? 'A' : 'B'
  const high = left > right ? left : right
  const low = left > right ? right : left
  return {
    ok: true,
    base: units[a.unit].base,
    rates: [Number(first.price) * 10000 / Number(first.amount), Number(second.price) * 10000 / Number(second.amount)],
    winner,
    saving: Number(high - low) / Number(high) * 100,
  }
}
