import { useCallback, useMemo, useState } from 'react'
import { Download, Plus, Search } from 'lucide-react'
import Stats from './components/Stats'
import Inventario from './components/Inventario'
import PecaDrawer from './components/PecaDrawer'
import { PECAS_INICIAIS } from './data/seed'
import { CATEGORIAS, exportarCSV, isBaixo } from './lib/utils'
import { useLocalStorage } from './lib/useLocalStorage'

function Logo() {
  return (
    <svg width="38" height="38" viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#124559" />
      <circle cx="32" cy="32" r="17" fill="none" stroke="#EEF0EC" strokeWidth="6" />
      <circle cx="32" cy="32" r="5" fill="#C8382B" />
    </svg>
  )
}

const controle =
  'rounded-md border border-line bg-white px-3 py-2.5 text-[15px] focus:border-petrol focus:outline-none focus:ring-2 focus:ring-petrol/20'

export default function App() {
  const [pecas, setPecas] = useLocalStorage('autopecas-gesto:pecas', PECAS_INICIAIS)
  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] = useState('Todas')
  const [apenasBaixo, setApenasBaixo] = useState(false)
  const [drawer, setDrawer] = useState(null) // null | 'nova' | peça em edição

  const fecharDrawer = useCallback(() => setDrawer(null), [])

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return pecas
      .filter((p) => !termo || p.nome.toLowerCase().includes(termo) || p.sku.toLowerCase().includes(termo))
      .filter((p) => categoria === 'Todas' || p.categoria === categoria)
      .filter((p) => !apenasBaixo || isBaixo(p))
      .sort((a, b) => Number(isBaixo(b)) - Number(isBaixo(a)) || a.nome.localeCompare(b.nome, 'pt-BR'))
  }, [pecas, busca, categoria, apenasBaixo])

  const salvar = (peca) => {
    setPecas((lista) =>
      lista.some((p) => p.id === peca.id) ? lista.map((p) => (p.id === peca.id ? peca : p)) : [peca, ...lista],
    )
    fecharDrawer()
  }

  const ajustar = (id, delta) =>
    setPecas((lista) => lista.map((p) => (p.id === id ? { ...p, qtd: Math.max(0, p.qtd + delta) } : p)))

  const excluir = (id) => setPecas((lista) => lista.filter((p) => p.id !== id))

  const limparFiltros = () => {
    setBusca('')
    setCategoria('Todas')
    setApenasBaixo(false)
  }

  return (
    <div className="min-h-screen">
      <header className="bg-petrol text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <Logo />
            <div>
              <h1 className="font-display text-3xl font-semibold leading-none tracking-tight">AutoPeças Gesto</h1>
              <p className="mt-1 text-sm text-white/75">Controle de estoque da sua loja</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDrawer('nova')}
            className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2.5 font-semibold text-petrol hover:bg-chassis"
          >
            <Plus size={18} /> Nova peça
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-5 py-8 sm:px-8">
        <Stats pecas={pecas} />

        <section className="overflow-hidden rounded-lg border border-line bg-panel">
          <div className="flex flex-col gap-3 border-b border-line p-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc" />
              <input
                type="search"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por nome ou SKU"
                aria-label="Buscar por nome ou SKU"
                className={`${controle} w-full pl-10`}
              />
            </div>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              aria-label="Filtrar por categoria"
              className={controle}
            >
              <option>Todas</option>
              {CATEGORIAS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <label className="flex cursor-pointer items-center gap-2 text-[15px] font-medium">
              <input
                type="checkbox"
                checked={apenasBaixo}
                onChange={(e) => setApenasBaixo(e.target.checked)}
                className="h-4 w-4 accent-petrol"
              />
              Só reposição
            </label>
            <button
              type="button"
              onClick={() => exportarCSV(filtradas)}
              disabled={filtradas.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-line px-3.5 py-2.5 font-medium hover:bg-chassis disabled:opacity-40"
            >
              <Download size={17} /> Exportar CSV
            </button>
          </div>

          <Inventario
            pecas={filtradas}
            totalGeral={pecas.length}
            onAjustar={ajustar}
            onEditar={setDrawer}
            onExcluir={excluir}
            onNova={() => setDrawer('nova')}
            onLimparFiltros={limparFiltros}
          />
        </section>

        <footer className="pb-4 text-sm text-zinc">
          Projeto acadêmico de Samuel Araujo Bento (RA 420096812104). Os dados ficam salvos neste navegador.
        </footer>
      </main>

      {drawer && (
        <PecaDrawer
          key={drawer === 'nova' ? 'nova' : drawer.id}
          peca={drawer === 'nova' ? null : drawer}
          skusExistentes={pecas.map((p) => p.sku)}
          onSalvar={salvar}
          onFechar={fecharDrawer}
        />
      )}
    </div>
  )
}
