import { useState } from 'react'
import api from '../services/api'

interface Produto {
  id: number
  nome: string
  preco: number
  estoque: number
}

interface ItemCarrinho {
  produtoId: number
  nome: string
  quantidade: number
  precoUnit: number
}

export default function PDV() {
  const [busca, setBusca] = useState('')
  const [resultados, setResultados] = useState<Produto[]>([])
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([])

  // Busca produtos pelo nome enquanto digita
  async function handleBusca(texto: string) {
    setBusca(texto)
    if (texto.length < 2) return setResultados([])
    const res = await api.get(`/produtos?nome=${texto}`)
    setResultados(res.data)
  }

  // Adiciona produto ao carrinho
  function handleAdicionar(produto: Produto) {
    const existente = carrinho.find(i => i.produtoId === produto.id)
    if (existente) {
      // se já está no carrinho, aumenta a quantidade
      setCarrinho(carrinho.map(i =>
        i.produtoId === produto.id ? { ...i, quantidade: i.quantidade + 1 } : i
      ))
    } else {
      setCarrinho([...carrinho, { produtoId: produto.id, nome: produto.nome, quantidade: 1, precoUnit: produto.preco }])
    }
    setBusca(''); setResultados([])
  }

  function handleRemover(produtoId: number) {
    setCarrinho(carrinho.filter(i => i.produtoId !== produtoId))
  }

  const total = carrinho.reduce((soma, i) => soma + i.precoUnit * i.quantidade, 0)

  async function handleFinalizar() {
    if (carrinho.length === 0) return alert('Carrinho vazio')
    await api.post('/vendas', { itens: carrinho })
    alert('Venda finalizada!')
    setCarrinho([])
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h1>PDV</h1>

      {/* Campo de busca */}
      <input
        placeholder="Buscar produto pelo nome..."
        value={busca}
        onChange={e => handleBusca(e.target.value)}
        style={{ width: '300px', padding: '0.5rem' }}
      />

      {/* Resultados da busca */}
      {resultados.map(p => (
        <div key={p.id} style={{ padding: '0.5rem', border: '1px solid #ccc', marginTop: '0.25rem', cursor: 'pointer' }}
          onClick={() => handleAdicionar(p)}>
          {p.nome} — R$ {p.preco.toFixed(2)} (estoque: {p.estoque})
        </div>
      ))}

      {/* Carrinho */}
      <h2 style={{ marginTop: '1rem' }}>Carrinho</h2>
      {carrinho.length === 0 && <p>Nenhum item adicionado.</p>}
      {carrinho.map(i => (
        <div key={i.produtoId} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span>{i.nome} x{i.quantidade} = R$ {(i.precoUnit * i.quantidade).toFixed(2)}</span>
          <button onClick={() => handleRemover(i.produtoId)}>Remover</button>
        </div>
      ))}

      {/* Total e finalizar */}
      {carrinho.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <strong>Total: R$ {total.toFixed(2)}</strong>
          <br />
          <button onClick={handleFinalizar} style={{ marginTop: '0.5rem', padding: '0.5rem 1rem' }}>
            Finalizar Venda
          </button>
        </div>
      )}
    </div>
  )
}