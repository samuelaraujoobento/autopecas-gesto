export const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export const formatPreco = (valor) => brl.format(Number(valor) || 0)

// Aceita "145", "145,90", "1.450,90" ou "R$ 145,90" e devolve número.
export function parsePreco(texto) {
  if (typeof texto === 'number') return texto
  const limpo = String(texto ?? '')
    .replace(/[^\d,.-]/g, '')
    .replace(/\.(?=\d{3}(\D|$))/g, '')
    .replace(',', '.')
  const n = parseFloat(limpo)
  return Number.isFinite(n) ? n : 0
}

export const CATEGORIAS = [
  'Freios',
  'Filtros',
  'Ignição',
  'Suspensão',
  'Motor',
  'Elétrica',
  'Transmissão',
  'Lubrificantes',
  'Acessórios',
  'Geral',
]

export const isBaixo = (p) => p.qtd <= p.min

export function exportarCSV(pecas) {
  const cab = ['SKU', 'Peça', 'Categoria', 'Quantidade', 'Estoque mínimo', 'Preço (R$)']
  const linhas = pecas.map((p) =>
    [p.sku, p.nome, p.categoria, p.qtd, p.min, p.preco.toFixed(2).replace('.', ',')]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(';'),
  )
  const csv = '\uFEFF' + [cab.join(';'), ...linhas].join('\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = 'estoque-autopecas.csv'
  a.click()
  URL.revokeObjectURL(url)
}
