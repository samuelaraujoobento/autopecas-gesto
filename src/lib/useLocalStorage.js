import { useEffect, useState } from 'react'

export function useLocalStorage(chave, inicial) {
  const [valor, setValor] = useState(() => {
    try {
      const salvo = localStorage.getItem(chave)
      return salvo ? JSON.parse(salvo) : inicial
    } catch {
      return inicial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(chave, JSON.stringify(valor))
    } catch {
      /* armazenamento indisponível: segue só em memória */
    }
  }, [chave, valor])

  return [valor, setValor]
}
