import { describe, expect, it } from 'vitest'
import { compare, type PackageInput, type Unit } from './comparison'

function pack(
  price: string,
  quantity: string,
  unit: Unit = 'kg',
): PackageInput {
  return { price, quantity, unit }
}

describe('preço por unidade', () => {
  it('compara dois pacotes por contagem', () => {
    expect(
      compare(pack('9,90', '10', 'un'), pack('12', '8', 'un')),
    ).toMatchObject({ ok: true, winner: 'A', base: 'un', rates: [0.99, 1.5] })
  })

  it('converte o exemplo de 500 g e 1 kg antes de comparar os preços', () => {
    expect(compare(pack('8,00', '500', 'g'), pack('15,00', '1'))).toMatchObject(
      { ok: true, winner: 'B', base: 'kg', rates: [16, 15], saving: 6.25 },
    )
  })
})

describe('conversões e validação', () => {
  it('reconhece um empate entre mililitros e litros', () => {
    expect(
      compare(pack('2,50', '250', 'mL'), pack('7.50', '0,750', 'L')),
    ).toMatchObject({
      ok: true,
      winner: 'tie',
      rates: [10, 10],
      base: 'L',
      saving: 0,
    })
  })

  it('preserva a diferença de preço antes do arredondamento', () => {
    expect(compare(pack('9,99', '3'), pack('10', '3'))).toMatchObject({
      ok: true,
      winner: 'A',
    })
  })

  it.each([
    [pack('', '1'), pack('1', '1'), 'Faltam dados'],
    [pack('0', '1'), pack('1', '1'), 'preço'],
    [pack('-2', '1'), pack('1', '1'), 'preço'],
    [pack('1,001', '1'), pack('1', '1'), 'preço'],
    [pack('8', '0'), pack('1', '1'), 'quantidade'],
    [pack('8', '1'), pack('a', '1'), 'Embalagem B'],
    [pack('8', '1'), pack('2', '0.1', 'un'), 'inteira'],
    [pack('8', '1', 'g'), pack('1', '1', 'mL'), 'compatíveis'],
  ] as const)('valida %j e %j', (a, b, message) => {
    expect(compare(a, b)).toMatchObject({
      ok: false,
      message: expect.stringContaining(message),
    })
  })
})
