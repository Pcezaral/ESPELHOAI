function App() {
  console.log('App carregado - sem sonner')
  
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f0f0f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 'bold' }}>
          ✅ ESPELHO AI
        </h1>
        <p style={{ fontSize: '18px', marginTop: '16px' }}>
          Build limpo - sem imports problemáticos
        </p>
      </div>
    </div>
  )
}

export default App
