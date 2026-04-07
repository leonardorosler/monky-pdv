import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import PDV from './pages/PDV'
import Produtos from './pages/Produtos'
import Clientes from './pages/Clientes'
import Vendas from './pages/Vendas'
import Login from './pages/Login'

export default function App() {
  // Verifica se já tem token salvo
  const [autenticado, setAutenticado] = useState(!!localStorage.getItem('token'))

  if (!autenticado) {
    return <Login onLogin={() => setAutenticado(true)} />
  }

  return (
    <BrowserRouter>
      <Layout onLogout={() => setAutenticado(false)}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pdv" element={<PDV />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/vendas" element={<Vendas />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}