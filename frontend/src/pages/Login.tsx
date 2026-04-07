import { useState } from 'react'
import api from '../services/api'
import styles from './Login.module.css'

interface Props {
  onLogin: () => void
}

export default function Login({ onLogin }: Props) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleLogin() {
    setErro('')
    if (!email || !senha) return setErro('Preencha todos os campos')
    setCarregando(true)
    try {
      const res = await api.post('/auth/login', { email, senha })
      localStorage.setItem('token', res.data.token) // salva o token
      localStorage.setItem('usuario', JSON.stringify(res.data.usuario))
      onLogin() // avisa o App que o login foi feito
    } catch (err: any) {
      setErro(err.response?.data?.erro ?? 'Erro ao fazer login')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>🐒 Monky PDV</div>
        <p className={styles.sub}>Faça login para continuar</p>

        <div className={styles.form}>
          <input
            className={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            className={styles.input}
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
          {erro && <p className={styles.erro}>{erro}</p>}
          <button
            className={styles.btn}
            onClick={handleLogin}
            disabled={carregando}
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
      </div>
    </div>
  )
}