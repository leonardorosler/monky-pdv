import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import PDV from './pages/PDV'
import Produtos from './pages/Produtos'
import Clientes from './pages/Clientes'
import Vendas from './pages/Vendas'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<PDV />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/vendas" element={<Vendas />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
} 