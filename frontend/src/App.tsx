import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Produtos from './pages/Produtos'
import Clientes from './pages/Clientes'
import PDV from './pages/PDV'

export default function App() {
  return (
    <BrowserRouter>
      {/* Navegação simples no topo */}
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', display: 'flex', gap: '1rem' }}>
        <Link to="/">PDV</Link>
        <Link to="/produtos">Produtos</Link>
        <Link to="/clientes">Clientes</Link>
      </nav>

      <Routes>
        <Route path="/" element={<PDV />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/clientes" element={<Clientes />} />
      </Routes>
    </BrowserRouter>
  )
}