import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { trpc } from './lib/trpc'
import { httpBatchLink } from '@trpc/client'
import App from './App'
import './index.css'

// Configuração do QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 1,
    },
  },
})

// Função de redirecionamento
const redirectToLoginIfUnauthorized = (error: any) => {
  if (error?.data?.code === 'UNAUTHORIZED') {
    window.location.href = '/login'
  }
}

// Configuração do tRPC Client
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/trpc',
      headers() {
        const token = localStorage.getItem('token')
        return token ? { Authorization: `Bearer ${token}` } : {}
      },
    }),
  ],
  transformer: undefined,
})

// Renderização da aplicação
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </trpc.Provider>
  </React.StrictMode>
)
