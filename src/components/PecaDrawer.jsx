import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { CATEGORIAS, parsePreco } from '../lib/utils'

const VAZIO = { sku: '', nome: '', categoria: 'Geral', qtd: '', min: '5', preco: '' }

const campo =
  'w-full rounded-md border border-line bg-white px-3 py-2.5 text-[15px] text-graphite placeholder:text-zinc/60 focus:border-petrol focus:outline-none focus:ring-2 focus:ring-petrol/20'

export default function PecaDrawer({ peca, skusExistentes, onSalvar, onFechar }) {
  const editando = Boolean(peca)
  const [form, setForm] = useState(
    peca
      ? {
          sku: peca.sku,
          nome: peca.nome,
          categoria: peca.categoria,
          qtd: String(peca.qtd),
          min: String(peca.min),
          preco: peca.preco.toFixed(2).replace('.', ','),
        }
      : VAZIO,
  )
  const [erro, setErro] = useState('')
  const primeiro = useRef(null)

  useEffect(() => {
    primeiro.current?.focus()
    const esc = (e) => e.key === 'Escape' && onFechar()
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onFechar])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const enviar = (e) => {
    e.preventDefault()
    const sku = form.sku.trim().toUpperCase()
    const nome = form.nome.trim()
    if (!sku || !nome) return setErro('Preencha o código SKU e o nome da peça.')
    const duplicado = skusExistentes.some((s) => s === sku && s !== peca?.sku)
    if (duplicado) return setErro(`O SKU ${sku} já está cadastrado.`)
    const qtd = parseInt(form.qtd, 10)
    const min = parseInt(form.min, 10)
    if (!Number.isInteger(qtd) || qtd < 0) return setErro('Informe uma quantidade válida (0 ou mais).')
    if (!Number.isInteger(min) || min < 0) return setErro('Informe um estoque mínimo válido (0 ou mais).')
    onSalvar({
      id: peca?.id ?? Date.now(),
      sku,
      nome,
      categoria: form.categoria,
      qtd,
      min,
      preco: parsePreco(form.preco),
    })
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end" role="dialog" aria-modal="true" aria-labelledby="drawer-titulo">
      <button
        type="button"
        aria-label="Fechar painel"
        onClick={onFechar}
        className="absolute inset-0 bg-graphite/50"
      />
      <form
        onSubmit={enviar}
        noValidate
        className="drawer-in relative flex h-full w-full max-w-md flex-col bg-panel shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 id="drawer-titulo" className="font-display text-2xl font-semibold tracking-tight">
            {editando ? 'Editar peça' : 'Nova peça'}
          </h2>
          <button
            type="button"
            onClick={onFechar}
            aria-label="Fechar"
            className="rounded-md p-2 text-zinc hover:bg-chassis"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
          <div className="grid grid-cols-5 gap-3">
            <label className="col-span-2 block">
              <span className="mb-1.5 block text-sm font-medium">Código SKU</span>
              <input ref={primeiro} value={form.sku} onChange={set('sku')} placeholder="PEC-999" className={`${campo} font-mono uppercase`} />
            </label>
            <label className="col-span-3 block">
              <span className="mb-1.5 block text-sm font-medium">Categoria</span>
              <select value={form.categoria} onChange={set('categoria')} className={campo}>
                {CATEGORIAS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Nome da peça</span>
            <input value={form.nome} onChange={set('nome')} placeholder="Ex.: Amortecedor traseiro" className={campo} />
          </label>

          <div className="grid grid-cols-3 gap-3">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Quantidade</span>
              <input type="number" min="0" inputMode="numeric" value={form.qtd} onChange={set('qtd')} placeholder="10" className={campo} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Mínimo</span>
              <input type="number" min="0" inputMode="numeric" value={form.min} onChange={set('min')} className={campo} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Preço (R$)</span>
              <input inputMode="decimal" value={form.preco} onChange={set('preco')} placeholder="80,00" className={campo} />
            </label>
          </div>
          <p className="text-sm text-zinc">
            Quando a quantidade chegar ao mínimo, a peça aparece como reposição necessária.
          </p>

          {erro && (
            <p role="alert" className="rounded-md bg-caliper-soft px-3 py-2.5 text-sm font-medium text-caliper">
              {erro}
            </p>
          )}
        </div>

        <div className="flex gap-3 border-t border-line px-6 py-4">
          <button
            type="button"
            onClick={onFechar}
            className="flex-1 rounded-md border border-line px-4 py-2.5 font-medium hover:bg-chassis"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 rounded-md bg-petrol px-4 py-2.5 font-semibold text-white hover:bg-petrol-dark"
          >
            {editando ? 'Salvar alterações' : 'Adicionar ao estoque'}
          </button>
        </div>
      </form>
    </div>
  )
}
