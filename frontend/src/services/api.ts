import axios from 'axios'

// URL base da API — todas as chamadas vão usar esse prefixo
const api = axios.create({
  baseURL: 'http://localhost:3333'
})

export default api