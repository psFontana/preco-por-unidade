import { describe, expect, it } from 'vitest'
import { compare, type PackageInput, type Unit } from './comparison'

function pack(price: string, quantity: string, unit: Unit = 'kg'): PackageInput {
  return { price, quantity, unit }
}

describe('preço por unidade', () => {
  it('compara dois pacotes por contagem', () => {
    expect(compare(pack('9,90', '10', 'un'), pack('12', '8', 'un')))
      .toMatchObject({ ok: true, winner: 'A', base: 'un', rates: [0.99, 1.5] })
  })

  it('converte o exemplo de 500 g e 1 kg antes de comparar os preços', () => {
    expect(compare(pack('8,00', '500', 'g'), pack('15,00', '1')))
      .toMatchObject({ ok: true, winner: 'B', base: 'kg', rates: [16, 15], saving: 6.25 })
  })
})
