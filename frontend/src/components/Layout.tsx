import { NavLink } from 'react-router-dom'
import styles from './Layout.module.css'

const navItems = [
  { to: '/',         label: 'Dashboard', icon: '▦' },
  { to: '/pdv',      label: 'PDV',       icon: '⊡' },
  { to: '/produtos', label: 'Produtos',  icon: '◫' },
  { to: '/clientes', label: 'Clientes',  icon: '◉' },
  { to: '/vendas',   label: 'Vendas',    icon: '≡' },
]

interface Props {
  children: React.ReactNode
  onLogout: () => void
}

export default function Layout({ children, onLogout }: Props) {
  const usuario = JSON.parse(localStorage.getItem('usuario') ?? '{}')

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    onLogout()
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          Monky PDV
          <span>v1.0</span>
        </div>
        <nav>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Usuário logado + logout */}
        <div className={styles.userArea}>
          <p className={styles.userName}>{usuario.nome}</p>
          <button className={styles.btnLogout} onClick={handleLogout}>Sair</button>
        </div>
      </aside>
      <main className={styles.main}>
        {children}
      </main>
    </div>
  )
}