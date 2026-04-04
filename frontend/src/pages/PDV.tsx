import { useState, useEffect } from 'react'
import api from '../services/api'
import { useDebounce } from '../hooks/useDebounce'
import PageHeader from '../components/PageHeader'
import styles from './PDV.module.css'

interface Produto {
  id: number
  nome: string
  preco: number
  estoque: number
}

interface Cliente {
  id: number
  nome: string
  email: string
}

interface ItemCarrinho {
  produtoId: number
  nome: string
  quantidade: number
  precoUnit: number
}

const FORMAS_PAGAMENTO = [
  { value: 'dinheiro', label: 'Dinheiro' },
  { value: 'cartao_credito', label: 'Cartão de Crédito' },
  { value: 'cartao_debito', label: 'Cartão de Débito' },
  { value: 'pix', label: 'Pix' },
]

export default function PDV() {
  const [busca, setBusca] = useState('')
  const [resultados, setResultados] = useState<Produto[]>([])
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([])
  const [mensagem, setMensagem] = useState('')
  const [sucesso, setSucesso] = useState(false)

  // Cliente
  const [buscaCliente, setBuscaCliente] = useState('')
  const [resultadosCliente, setResultadosCliente] = useState<Cliente[]>([])
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null)

  // Pagamento
  const [formaPagamento, setFormaPagamento] = useState('dinheiro')
  const [valorPago, setValorPago] = useState('')

  const buscaDebounced = useDebounce(busca, 400)
  const buscaClienteDebounced = useDebounce(buscaCliente, 400)

  useEffect(() => {
    if (buscaDebounced.length < 2) return setResultados([])
    api.get(`/produtos?nome=${buscaDebounced}`).then(res => setResultados(res.data))
  }, [buscaDebounced])

  useEffect(() => {
    if (buscaClienteDebounced.length < 2) return setResultadosCliente([])
    api.get(`/clientes?nome=${buscaClienteDebounced}`).then(res => setResultadosCliente(res.data))
  }, [buscaClienteDebounced])

  function handleAdicionar(produto: Produto) {
    if (produto.estoque === 0) return
    const existente = carrinho.find(i => i.produtoId === produto.id)
    if (existente) {
      if (existente.quantidade >= produto.estoque) return
      setCarrinho(carrinho.map(i =>
        i.produtoId === produto.id ? { ...i, quantidade: i.quantidade + 1 } : i
      ))
    } else {
      setCarrinho([...carrinho, {
        produtoId: produto.id,
        nome: produto.nome,
        quantidade: 1,
        precoUnit: produto.preco
      }])
    }
    setBusca('')
    setResultados([])
  }

  function handleQuantidade(produtoId: number, quantidade: number) {
    if (quantidade < 1) return handleRemover(produtoId)
    setCarrinho(carrinho.map(i =>
      i.produtoId === produtoId ? { ...i, quantidade } : i
    ))
  }

  function handleRemover(produtoId: number) {
    setCarrinho(carrinho.filter(i => i.produtoId !== produtoId))
  }

  function handleSelecionarCliente(cliente: Cliente) {
    setClienteSelecionado(cliente)
    setBuscaCliente('')
    setResultadosCliente([])
  }

  const total = carrinho.reduce((soma, i) => soma + i.precoUnit * i.quantidade, 0)
  const troco = formaPagamento === 'dinheiro' && valorPago
    ? Math.max(0, Number(valorPago) - total)
    : null

  async function handleFinalizar() {
    if (carrinho.length === 0) return
    try {
      await api.post('/vendas', {
        itens: carrinho,
        formaPagamento,
        clienteId: clienteSelecionado?.id
      })
      setSucesso(true)
      setMensagem('Venda finalizada com sucesso!')
      setCarrinho([])
      setClienteSelecionado(null)
      setValorPago('')
      setFormaPagamento('dinheiro')
      setTimeout(() => setMensagem(''), 3000)
    } catch {
      setSucesso(false)
      setMensagem('Erro ao finalizar venda')
    }
  }

  return (
    <div className={styles.page}>
      <PageHeader title="PDV">
        <input
          className={styles.searchInput}
          placeholder="Buscar produto pelo nome..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          autoFocus
        />
      </PageHeader>

      <div className={styles.body}>
        <div className={styles.left}>

          {/* Resultados produto */}
          {resultados.length > 0 && (
            <div className={styles.section}>
              <p className={styles.sectionLabel}>produtos</p>
              <div className={styles.resultList}>
                {resultados.map(p => (
                  <div
                    key={p.id}
                    className={`${styles.resultItem} ${p.estoque === 0 ? styles.disabled : ''}`}
                    onClick={() => handleAdicionar(p)}
                  >
                    <div>
                      <p className={styles.resultNome}>{p.nome}</p>
                      <p className={`${styles.resultEstoque} ${p.estoque < 5 ? styles.low : ''}`}>
                        estoque: {p.estoque}
                      </p>
                    </div>
                    <span className={styles.resultPreco}>R$ {p.preco.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Busca cliente */}
          <div className={styles.section}>
            <p className={styles.sectionLabel}>cliente (opcional)</p>
            {clienteSelecionado ? (
              <div className={styles.clienteSelecionado}>
                <span>{clienteSelecionado.nome}</span>
                <button className={styles.btnRemoverCliente} onClick={() => setClienteSelecionado(null)}>×</button>
              </div>
            ) : (
              <>
                <input
                  className={styles.clienteInput}
                  placeholder="Buscar cliente pelo nome..."
                  value={buscaCliente}
                  onChange={e => setBuscaCliente(e.target.value)}
                />
                {resultadosCliente.map(c => (
                  <div key={c.id} className={styles.resultItem} onClick={() => handleSelecionarCliente(c)}>
                    <div>
                      <p className={styles.resultNome}>{c.nome}</p>
                      <p className={styles.resultEstoque}>{c.email}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Mensagem */}
          {mensagem && (
            <div className={`${styles.mensagem} ${sucesso ? styles.mensagemSucesso : styles.mensagemErro}`}>
              {mensagem}
            </div>
          )}
        </div>

        {/* Carrinho */}
        <aside className={styles.cart}>
          <div className={styles.cartHeader}>
            Carrinho
            {carrinho.length > 0 && (
              <span className={styles.cartBadge}>{carrinho.length}</span>
            )}
          </div>

          <div className={styles.cartItems}>
            {carrinho.length === 0 && (
              <p className={styles.cartVazio}>Nenhum item adicionado</p>
            )}
            {carrinho.map(i => (
              <div key={i.produtoId} className={styles.cartItem}>
                <div className={styles.cartItemNome}>{i.nome}</div>
                <div className={styles.cartItemControls}>
                  <div className={styles.qtyControls}>
                    <button className={styles.qtyBtn} onClick={() => handleQuantidade(i.produtoId, i.quantidade - 1)}>−</button>
                    <span className={styles.qtyVal}>{i.quantidade}</span>
                    <button className={styles.qtyBtn} onClick={() => handleQuantidade(i.produtoId, i.quantidade + 1)}>+</button>
                  </div>
                  <span className={styles.cartSubtotal}>R$ {(i.precoUnit * i.quantidade).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagamento */}
          <div className={styles.pagamento}>
            <p className={styles.sectionLabel} style={{ marginBottom: 8 }}>forma de pagamento</p>
            <div className={styles.formasPagamento}>
              {FORMAS_PAGAMENTO.map(f => (
                <button
                  key={f.value}
                  className={`${styles.btnForma} ${formaPagamento === f.value ? styles.btnFormaAtivo : ''}`}
                  onClick={() => setFormaPagamento(f.value)}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {formaPagamento === 'dinheiro' && (
              <div style={{ marginTop: 10 }}>
                <input
                  className={styles.valorRecebidoInput}
                  type="number"
                  placeholder="Valor recebido"
                  value={valorPago}
                  onChange={e => setValorPago(e.target.value)}
                />
                {troco !== null && troco >= 0 && (
                  <p style={{ fontSize: 12, color: 'var(--accent)', marginTop: 6 }}>
                    Troco: R$ {troco.toFixed(2)}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className={styles.cartFooter}>
            <div className={styles.cartTotal}>
              <span>Total</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            <button
              className={styles.btnFinalizar}
              onClick={handleFinalizar}
              disabled={carrinho.length === 0}
            >
              Finalizar Venda
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}