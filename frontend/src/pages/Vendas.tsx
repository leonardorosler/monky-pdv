import { useEffect, useState } from 'react'
import api from '../services/api'
import PageHeader from '../components/PageHeader'
import styles from './Vendas.module.css'

interface ItemVenda {
  id: number
  quantidade: number
  precoUnit: number
  produto: { nome: string }
}

interface Venda {
  id: number
  total: number
  criadoEm: string
  cliente: { nome: string } | null
  itens: ItemVenda[]
}

export default function Vendas() {
  const [vendas, setVendas] = useState<Venda[]>([])
  const [aberta, setAberta] = useState<number | null>(null)

  useEffect(() => {
    api.get('/vendas').then(res => setVendas(res.data))
  }, [])

  return (
    <div className={styles.page}>
      <PageHeader title="Histórico de Vendas" />
      <div className={styles.body}>
        {vendas.length === 0 && <p className={styles.vazia}>Nenhuma venda registrada.</p>}
        {vendas.map(v => (
          <div key={v.id} className={styles.venda}>
            <div className={styles.vendaHeader} onClick={() => setAberta(aberta === v.id ? null : v.id)}>
              <div>
                <p className={styles.vendaId}>#{v.id}</p>
                <p className={styles.vendaData}>{new Date(v.criadoEm).toLocaleString('pt-BR')}</p>
              </div>
              <div className={styles.vendaRight}>
                <span className={styles.vendaCliente}>
                  {v.cliente ? v.cliente.nome : 'Sem cliente'}
                </span>
                <span className={styles.vendaTotal}>R$ {v.total.toFixed(2)}</span>
              </div>
            </div>
            {aberta === v.id && (
              <div className={styles.vendaItens}>
                <table className={styles.itensTable}>
                  <thead>
                    <tr><th>Produto</th><th>Qtd</th><th>Preço unit.</th><th>Subtotal</th></tr>
                  </thead>
                  <tbody>
                    {v.itens.map(i => (
                      <tr key={i.id}>
                        <td>{i.produto.nome}</td>
                        <td>{i.quantidade}</td>
                        <td>R$ {i.precoUnit.toFixed(2)}</td>
                        <td>R$ {(i.quantidade * i.precoUnit).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}