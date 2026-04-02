import { useEffect, useState } from 'react'
import api from '../services/api'

interface Produto {
  id: number
  nome: string
  preco: number
  estoque: number
}

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [nome, setNome] = useState('')
  const [preco, setPreco] = useState('')
  const [estoque, setEstoque] = useState('')

  // Busca os produtos ao carregar a página
  async function carregarProdutos() {
    const res = await api.get('/produtos')
    setProdutos(res.data)
  }

  useEffect(() => { carregarProdutos() }, [])

  // Envia o form para criar um novo produto
  async function handleCriar() {
    if (!nome || !preco || !estoque) return alert('Preencha todos os campos')
    await api.post('/produtos', { nome, preco: Number(preco), estoque: Number(estoque) })
    setNome(''); setPreco(''); setEstoque('')
    carregarProdutos() // recarrega a lista
  }

  async function handleDeletar(id: number) {
    await api.delete(`/produtos/${id}`)
    carregarProdutos()
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Produtos</h1>

      {/* Formulário de cadastro */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
        <input placeholder="Preço" type="number" value={preco} onChange={e => setPreco(e.target.value)} />
        <input placeholder="Estoque" type="number" value={estoque} onChange={e => setEstoque(e.target.value)} />
        <button onClick={handleCriar}>Cadastrar</button>
      </div>

      {/* Tabela de produtos */}
      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>ID</th><th>Nome</th><th>Preço</th><th>Estoque</th><th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nome}</td>
              <td>R$ {p.preco.toFixed(2)}</td>
              <td>{p.estoque}</td>
              <td>
                <button onClick={() => handleDeletar(p.id)}>Deletar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}