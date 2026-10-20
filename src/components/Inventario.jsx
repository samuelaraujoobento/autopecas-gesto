import { useState } from 'react'
import { Minus, PackageSearch, Pencil, Plus, Trash2 } from 'lucide-react'
import { formatPreco, isBaixo } from '../lib/utils'

function NivelEstoque({ p }) {
  const teto = Math.max(p.min * 2, p.qtd, 1)
  const pct = Math.min(100, Math.round((p.qtd / teto) * 100))
  const baixo = isBaixo(p)
  return (
    <div className="min-w-[110px]">
      <div className="mb-1 flex items-baseline justify-between text-sm">
        <span className="font-semibold">{p.qtd} un</span>
        <span className="text-xs text-zinc">mín. {p.min}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-line" role="presentation">
        <div className={`h-full rounded-full ${baixo ? 'bg-caliper' : 'bg-galva'}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function Botao({ rotulo, onClick, children, perigo }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={rotulo}
      title={rotulo}
      className={`rounded-md p-2 text-zinc hover:bg-chassis ${perigo ? 'hover:text-caliper' : 'hover:text-petrol'}`}
    >
      {children}
    </button>
  )
}

function Linha({ p, onAjustar, onEditar, onExcluir }) {
  const [confirmando, setConfirmando] = useState(false)
  const baixo = isBaixo(p)

  return (
    <li className="grid grid-cols-1 items-center gap-3 px-5 py-4 md:grid-cols-[minmax(0,2.4fr)_1.1fr_1fr_1.2fr_auto] md:gap-4">
      <div className="min-w-0">
        <p className="truncate font-semibold">{p.nome}</p>
        <p className="text-sm text-zinc">
          <span className="font-mono text-xs">{p.sku}</span> &middot; {p.categoria}
        </p>
      </div>

      <NivelEstoque p={p} />

      <p className="font-medium">{formatPreco(p.preco)}</p>

      <span
        className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
          baixo ? 'bg-caliper-soft text-caliper' : 'bg-galva-soft text-galva'
        }`}
      >
        {baixo ? 'Repor estoque' : 'Estoque normal'}
      </span>

      <div className="-ml-2 flex items-center md:ml-0 md:justify-end">
        {confirmando ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc">Excluir?</span>
            <button
              type="button"
              onClick={() => onExcluir(p.id)}
              className="rounded-md bg-caliper px-3 py-1.5 text-sm font-semibold text-white"
            >
              Excluir
            </button>
            <button
              type="button"
              onClick={() => setConfirmando(false)}
              className="rounded-md border border-line px-3 py-1.5 text-sm font-medium"
            >
              Manter
            </button>
          </div>
        ) : (
          <>
            <Botao rotulo={`Retirar 1 unidade de ${p.nome}`} onClick={() => onAjustar(p.id, -1)}>
              <Minus size={18} />
            </Botao>
            <Botao rotulo={`Adicionar 1 unidade de ${p.nome}`} onClick={() => onAjustar(p.id, 1)}>
              <Plus size={18} />
            </Botao>
            <Botao rotulo={`Editar ${p.nome}`} onClick={() => onEditar(p)}>
              <Pencil size={18} />
            </Botao>
            <Botao rotulo={`Excluir ${p.nome}`} perigo onClick={() => setConfirmando(true)}>
              <Trash2 size={18} />
            </Botao>
          </>
        )}
      </div>
    </li>
  )
}

export default function Inventario({ pecas, totalGeral, onAjustar, onEditar, onExcluir, onNova, onLimparFiltros }) {
  if (pecas.length === 0) {
    const semNada = totalGeral === 0
    return (
      <div className="flex flex-col items-center px-6 py-16 text-center">
        <PackageSearch size={40} className="mb-3 text-zinc" />
        <p className="font-display text-2xl font-semibold">
          {semNada ? 'Nenhuma peça no estoque' : 'Nenhuma peça encontrada'}
        </p>
        <p className="mt-1 max-w-sm text-zinc">
          {semNada
            ? 'Cadastre a primeira peça para começar a controlar o estoque.'
            : 'Ajuste a busca ou os filtros para ver outras peças.'}
        </p>
        <button
          type="button"
          onClick={semNada ? onNova : onLimparFiltros}
          className="mt-5 rounded-md bg-petrol px-4 py-2.5 font-semibold text-white hover:bg-petrol-dark"
        >
          {semNada ? 'Cadastrar peça' : 'Limpar filtros'}
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="hidden grid-cols-[minmax(0,2.4fr)_1.1fr_1fr_1.2fr_auto] gap-4 border-b border-line bg-chassis/60 px-5 py-2.5 text-sm font-medium text-zinc md:grid">
        <span>Peça</span>
        <span>Estoque</span>
        <span>Preço</span>
        <span>Situação</span>
        <span className="w-[152px] text-right">Ações</span>
      </div>
      <ul className="divide-y divide-line">
        {pecas.map((p) => (
          <Linha key={p.id} p={p} onAjustar={onAjustar} onEditar={onEditar} onExcluir={onExcluir} />
        ))}
      </ul>
    </div>
  )
}
