import { useState } from 'react'
import { compare, units, type PackageInput, type Unit } from './comparison'

const example: [PackageInput, PackageInput] = [
  { price: '8,00', quantity: '500', unit: 'g' },
  { price: '15,00', quantity: '1', unit: 'kg' },
]
const money = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})
const percent = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 })

function PackageFields({
  label,
  value,
  onChange,
}: {
  label: string
  value: PackageInput
  onChange: (value: PackageInput) => void
}) {
  return (
    <fieldset>
      <legend>
        <span className="letter" aria-hidden="true">
          {label}
        </span>{' '}
        Embalagem {label}
      </legend>
      <div className="fields">
        <label>
          Preço
          <span className="input money">
            <span aria-hidden="true">R$</span>
            <input
              inputMode="decimal"
              value={value.price}
              placeholder="0,00"
              maxLength={16}
              onChange={(event) =>
                onChange({ ...value, price: event.target.value })
              }
            />
          </span>
        </label>
        <label>
          Quantidade
          <input
            inputMode="decimal"
            value={value.quantity}
            placeholder="0"
            maxLength={16}
            onChange={(event) =>
              onChange({ ...value, quantity: event.target.value })
            }
          />
        </label>
        <label>
          Unidade
          <span className="select">
            <select
              value={value.unit}
              onChange={(event) =>
                onChange({ ...value, unit: event.target.value as Unit })
              }
            >
              {Object.keys(units).map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </span>
        </label>
      </div>
    </fieldset>
  )
}

export function App() {
  const [first, setFirst] = useState(example[0])
  const [second, setSecond] = useState(example[1])
  const result = compare(first, second)
  const heading = !result.ok
    ? 'Comparação pendente'
    : result.winner === 'tie'
      ? 'Preços iguais'
      : `Embalagem ${result.winner} compensa`
  const clear = () => {
    setFirst({ ...first, price: '', quantity: '' })
    setSecond({ ...second, price: '', quantity: '' })
  }

  return (
    <>
      <header className="mast">
        <div className="wrap nav">
          <span className="brand">
            <i className="basket" aria-hidden="true" />
            Preço por unidade
          </span>
          <a href="#calculo">Sobre o cálculo</a>
        </div>
      </header>
      <main className="wrap">
        <section className="intro">
          <h1>
            Qual embalagem <em>compensa?</em>
          </h1>
          <p>Compare duas embalagens pelo preço por quilo, litro ou unidade.</p>
        </section>
        <div className="workspace">
          <section className="editor" aria-label="Dados das embalagens">
            <PackageFields label="A" value={first} onChange={setFirst} />
            <PackageFields label="B" value={second} onChange={setSecond} />
            <div className="buttons">
              <button
                type="button"
                onClick={() => {
                  setFirst(example[0])
                  setSecond(example[1])
                }}
              >
                Usar exemplo
              </button>
              <button type="button" className="quiet" onClick={clear}>
                Limpar campos
              </button>
            </div>
          </section>
          <aside
            className="receipt"
            aria-label="Resultado da comparação"
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="receipt-title">
              <span>Resultado</span>
              <i className="paper-icon" aria-hidden="true" />
            </div>
            <h2>{heading}</h2>
            {result.ok ? (
              <>
                <dl>
                  {result.rates.map((rate, index) => (
                    <div key={index}>
                      <dt>Embalagem {index === 0 ? 'A' : 'B'}</dt>
                      <dd>
                        {money.format(rate)}
                        <small>/{result.base}</small>
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="saving">
                  <span>Economia por {result.base}</span>
                  <strong>
                    {result.saving > 0 && result.saving < 0.01
                      ? '< 0,01'
                      : percent.format(result.saving)}
                    %
                  </strong>
                </div>
              </>
            ) : (
              <p className="message">{result.message}</p>
            )}
            <div className="barcode" aria-hidden="true" />
          </aside>
        </div>
        <details id="calculo">
          <summary>Como o preço é calculado?</summary>
          <p>
            O preço da embalagem é dividido pela quantidade em quilos, litros ou
            unidades. A economia é a diferença percentual em relação à opção
            mais cara. O cálculo usa os valores completos antes de arredondar a
            exibição em reais.
          </p>
        </details>
      </main>
    </>
  )
}
