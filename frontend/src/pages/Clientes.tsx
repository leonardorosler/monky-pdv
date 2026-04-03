import { useEffect, useState } from 'react'
import api from '../services/api'
import PageHeader from '../components/PageHeader'
import styles from './Produtos.module.css' // reutiliza os mesmos estilos

interface Cliente {
  id: number
  nome: string
  email: string
}

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  async function carregarClientes() {
    const res = await api.get('/clientes')
    setClientes(res.data)
  }

  useEffect(() => { carregarClientes() }, [])

  async function handleCriar() {
    setErro(''); setSucesso('')
    if (!nome.trim()) return setErro('Nome é obrigatório')
    if (!email.includes('@')) return setErro('Email inválido')
    try {
      await api.post('/clientes', { nome, email })
      setSucesso('Cliente cadastrado!')
      setNome(''); setEmail('')
      carregarClientes()
    } catch (err: any) {
      if (err.response?.status === 500) return setErro('Email já cadastrado')
      setErro('Erro ao cadastrar cliente')
    }
  }

  async function handleDeletar(id: number) {
    if (!confirm('Deletar este cliente?')) return
    await api.delete(`/clientes/${id}`)
    carregarClientes()
  }

  return (
    <div className={styles.page}>
      <PageHeader title="Clientes" />
      <div className={styles.body}>
        <div className={styles.form}>
          <input className={styles.input} placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
          <input className={styles.input} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{width: 220}} />
          <button className={styles.btnCadastrar} onClick={handleCriar}>Cadastrar</button>
        </div>
        {erro && <p className={styles.erro}>{erro}</p>}
        {sucesso && <p className={styles.ok}>{sucesso}</p>}
        <table className={styles.table}>
          <thead>
            <tr><th>ID</th><th>Nome</th><th>Email</th><th></th></tr>
          </thead>
          <tbody>
            {clientes.map(c => (
              <tr key={c.id}>
                <td style={{color: 'var(--text-hint)'}}>{c.id}</td>
                <td>{c.nome}</td>
                <td style={{color: 'var(--text-muted)'}}>{c.email}</td>
                <td><button className={styles.btnDeletar} onClick={() => handleDeletar(c.id)}>Deletar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}