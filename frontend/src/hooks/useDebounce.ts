import { useState, useEffect } from 'react'

// Aguarda o usuário parar de digitar antes de atualizar o valor
export function useDebounce<T>(valor: T, delay: number = 400): T {
  const [valorDebounced, setValorDebounced] = useState<T>(valor)

  useEffect(() => {
    const timer = setTimeout(() => setValorDebounced(valor), delay)
    return () => clearTimeout(timer) // cancela se o usuário continuar digitando
  }, [valor, delay])

  return valorDebounced
}