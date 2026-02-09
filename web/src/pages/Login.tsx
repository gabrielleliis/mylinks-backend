import { useState } from 'react'
import { useNavigate } from 'react-router-dom' // Importamos o navegador
import '../App.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate() // O hook para mudar de página

  async function handleLogin() {
    const response = await fetch('http://localhost:3333/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const data = await response.json()

    if (response.ok) {
      // 1. GUARDA O TOKEN NO NAVEGADOR (LocalStorage)
      localStorage.setItem('mylinks-token', data.token)
      
      // 2. LEVA O USUÁRIO PARA O DASHBOARD
      navigate('/dashboard')
    } else {
      alert('Erro: ' + data.message)
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Acesse sua conta 👋</h1>
        
        <div className="input-group">
          <label>E-mail</label>
          <input 
            type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
            placeholder="Digite seu e-mail"
          />
        </div>

        <div className="input-group">
          <label>Senha</label>
          <input 
            type="password" value={password} onChange={(e) => setPassword(e.target.value)} 
            placeholder="Digite sua senha"
          />
        </div>

        <button onClick={handleLogin}>Entrar</button>
      </div>
    </div>
  )
}