import { NavLink } from 'react-router-dom'
import styles from './Layout.module.css'

const navItems = [
  { to: '/',         label: 'Dashboard', icon: '▦' },
  { to: '/pdv',      label: 'PDV',       icon: '⊡' },
  { to: '/produtos', label: 'Produtos',  icon: '◫' },
  { to: '/clientes', label: 'Clientes',  icon: '◉' },
  { to: '/vendas',   label: 'Vendas',    icon: '≡' },
]

export default function Layout({ children }: { children: React.ReactNode }) {
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
      </aside>
      <main className={styles.main}>
        {children}
      </main>
    </div>
  )
}