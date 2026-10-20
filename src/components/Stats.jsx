import { formatPreco } from '../lib/utils'

function Stat({ rotulo, valor, destaque }) {
  return (
    <div className="px-5 py-4 sm:px-6 sm:py-5">
      <p className="text-sm text-zinc">{rotulo}</p>
      <p
        className={`font-display text-4xl font-semibold leading-tight tracking-tight ${
          destaque ? 'text-caliper' : 'text-graphite'
        }`}
      >
        {valor}
      </p>
    </div>
  )
}

export default function Stats({ pecas }) {
  const unidades = pecas.reduce((s, p) => s + p.qtd, 0)
  const valor = pecas.reduce((s, p) => s + p.qtd * p.preco, 0)
  const baixos = pecas.filter((p) => p.qtd <= p.min).length

  return (
    <section
      aria-label="Resumo do estoque"
      className="grid grid-cols-2 divide-x divide-y divide-line overflow-hidden rounded-lg border border-line bg-panel lg:grid-cols-4 lg:divide-y-0"
    >
      <Stat rotulo="Peças cadastradas" valor={pecas.length} />
      <Stat rotulo="Unidades em estoque" valor={unidades.toLocaleString('pt-BR')} />
      <Stat rotulo="Valor em estoque" valor={formatPreco(valor)} />
      <Stat rotulo="Precisam de reposição" valor={baixos} destaque={baixos > 0} />
    </section>
  )
}
