import { useEffect, useState } from 'react'
import api from '../services/api'
import PageHeader from '../components/PageHeader'
import styles from './Produtos.module.css'

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
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  async function carregarProdutos() {
    const res = await api.get('/produtos')
    setProdutos(res.data)
  }

  useEffect(() => { carregarProdutos() }, [])

  async function handleCriar() {
    setErro(''); setSucesso('')
    if (!nome.trim()) return setErro('Nome é obrigatório')
    if (!preco || Number(preco) <= 0) return setErro('Preço deve ser maior que zero')
    if (!estoque || Number(estoque) < 0) return setErro('Estoque não pode ser negativo')
    try {
      await api.post('/produtos', { nome, preco: Number(preco), estoque: Number(estoque) })
      setSucesso('Produto cadastrado!')
      setNome(''); setPreco(''); setEstoque('')
      carregarProdutos()
    } catch {
      setErro('Erro ao cadastrar produto')
    }
  }

  async function handleDeletar(id: number) {
    if (!confirm('Deletar este produto?')) return
    await api.delete(`/produtos/${id}`)
    carregarProdutos()
  }

  return (
    <div className={styles.page}>
      <PageHeader title="Produtos" />
      <div className={styles.body}>
        <div className={styles.form}>
          <input className={styles.input} placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
          <input className={styles.input} placeholder="Preço" type="number" value={preco} onChange={e => setPreco(e.target.value)} style={{width: 100}} />
          <input className={styles.input} placeholder="Estoque" type="number" value={estoque} onChange={e => setEstoque(e.target.value)} style={{width: 100}} />
          <button className={styles.btnCadastrar} onClick={handleCriar}>Cadastrar</button>
        </div>
        {erro && <p className={styles.erro}>{erro}</p>}
        {sucesso && <p className={styles.ok}>{sucesso}</p>}
        <table className={styles.table}>
          <thead>
            <tr><th>ID</th><th>Nome</th><th>Preço</th><th>Estoque</th><th></th></tr>
          </thead>
          <tbody>
            {produtos.map(p => (
              <tr key={p.id}>
                <td style={{color: 'var(--text-hint)'}}>{p.id}</td>
                <td>{p.nome}</td>
                <td>R$ {p.preco.toFixed(2)}</td>
                <td className={p.estoque < 5 ? styles.stockLow : ''}>{p.estoque}</td>
                <td><button className={styles.btnDeletar} onClick={() => handleDeletar(p.id)}>Deletar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}