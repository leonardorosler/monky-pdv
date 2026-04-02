import { useEffect, useState } from 'react'
import api from '../services/api'

interface Cliente {
  id: number
  nome: string
  email: string
}

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')

  async function carregarClientes() {
    const res = await api.get('/clientes')
    setClientes(res.data)
  }

  useEffect(() => { carregarClientes() }, [])

  async function handleCriar() {
    if (!nome || !email) return alert('Preencha todos os campos')
    await api.post('/clientes', { nome, email })
    setNome(''); setEmail('')
    carregarClientes()
  }

  async function handleDeletar(id: number) {
    await api.delete(`/clientes/${id}`)
    carregarClientes()
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Clientes</h1>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <button onClick={handleCriar}>Cadastrar</button>
      </div>

      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>ID</th><th>Nome</th><th>Email</th><th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.nome}</td>
              <td>{c.email}</td>
              <td>
                <button onClick={() => handleDeletar(c.id)}>Deletar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}