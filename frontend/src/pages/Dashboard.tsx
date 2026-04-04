import { useEffect, useState } from 'react'
import api from '../services/api'
import PageHeader from '../components/PageHeader'
import styles from './Dashboard.module.css'

interface Resumo {
  totalVendas: number
  totalFaturado: number
  totalItens: number
}

interface ProdutoVendido {
  nome: string
  quantidade: number
}

interface FaturamentoDia {
  dia: string
  total: number
}

export default function Dashboard() {
  const [resumo, setResumo] = useState<Resumo | null>(null)
  const [maisVendidos, setMaisVendidos] = useState<ProdutoVendido[]>([])
  const [faturamento, setFaturamento] = useState<FaturamentoDia[]>([])

  useEffect(() => {
    api.get('/vendas/dashboard').then(res => {
      setResumo(res.data.resumo)
      setMaisVendidos(res.data.maisVendidos)
      setFaturamento(res.data.faturamento)
    })
  }, [])

  const maxFaturamento = Math.max(...faturamento.map(f => f.total), 1)

  return (
    <div className={styles.page}>
      <PageHeader title="Dashboard" />
      <div className={styles.body}>

        {/* Cards de resumo */}
        <div className={styles.cards}>
          <div className={styles.card}>
            <p className={styles.cardLabel}>vendas hoje</p>
            <p className={styles.cardValor}>{resumo?.totalVendas ?? 0}</p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardLabel}>faturamento hoje</p>
            <p className={styles.cardValor}>R$ {resumo?.totalFaturado.toFixed(2) ?? '0,00'}</p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardLabel}>itens vendidos hoje</p>
            <p className={styles.cardValor}>{resumo?.totalItens ?? 0}</p>
          </div>
        </div>

        <div className={styles.grid}>
          {/* Gráfico de barras — faturamento 7 dias */}
          <div className={styles.bloco}>
            <p className={styles.blocoTitulo}>faturamento — últimos 7 dias</p>
            <div className={styles.barras}>
              {faturamento.map(f => (
                <div key={f.dia} className={styles.barraWrap}>
                  <div className={styles.barraValor}>R$ {f.total.toFixed(0)}</div>
                  <div className={styles.barraContainer}>
                    <div
                      className={styles.barra}
                      style={{ height: `${(f.total / maxFaturamento) * 100}%` }}
                    />
                  </div>
                  <div className={styles.barraDia}>{f.dia}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Produtos mais vendidos */}
          <div className={styles.bloco}>
            <p className={styles.blocoTitulo}>produtos mais vendidos</p>
            {maisVendidos.length === 0 && (
              <p className={styles.vazio}>Nenhuma venda registrada</p>
            )}
            {maisVendidos.map((p, i) => (
              <div key={p.nome} className={styles.rankItem}>
                <div className={styles.rankPos}>{i + 1}</div>
                <div className={styles.rankNome}>{p.nome}</div>
                <div className={styles.rankQtd}>{p.quantidade} un.</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}