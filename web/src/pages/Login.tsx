import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../App.css'
import logoImg from '../assets/logo.png'
import { API_URL } from '../api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  async function handleLogin() {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('mylinks-token', data.token)
        localStorage.setItem('mylinks-slug', data.user.slug)
        navigate('/dashboard')
      } else {
        alert('Erro: ' + (data.message || 'Falha no login'))
      }
    } catch (error) {
      alert('Erro ao conectar com o servidor.')
    }
  }

  return (
    <div className="login-container">
      
      {/* CARD COMPACTO E ELEGANTE */}
      <div style={{ 
        width: '100%', 
        maxWidth: '400px', 
        padding: '32px 40px', // REDUZI de 48px para 32px (menos altura)
        backgroundColor: '#121214', 
        borderRadius: '16px', 
        border: '1px solid #27272a',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        display: 'flex', 
        flexDirection: 'column',
      }}>
        
        {/* --- LOGO AJUSTADA --- */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginBottom: '20px' // REDUZI de 40px para 20px (traz o título pra perto)
        }}>
          <img 
            src={logoImg} 
            alt="Logo MyLinks" 
            style={{ 
              height: '100px', // TAMANHO EQUILIBRADO (nem 50, nem 120)
              width: 'auto',
              objectFit: 'contain' 
            }} 
          />
        </div>

        {/* --- TÍTULO --- */}
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: '600', 
            color: '#f4f4f5', 
            marginBottom: '4px',
            marginTop: 0 // Garante que não tem espaço extra em cima
          }}>
            Login no MyLinks
          </h1>
          <p style={{ color: '#71717a', fontSize: '14px', margin: 0 }}>
            Acesse sua conta para continuar.
          </p>
        </div>
        
        {/* --- INPUTS --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}> {/* Gap menor entre inputs */}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '500', color: '#a1a1aa' }}>
              E-mail
            </label>
            <input 
              className="input-modern"
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="seu@email.com"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '500', color: '#a1a1aa' }}>
              Senha
            </label>
            <input 
              className="input-modern"
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
            />
          </div>

        </div>

        {/* --- BOTÃO --- */}
        <button className="btn-primary" onClick={handleLogin}>
          Entrar na conta
        </button>

        {/* --- RODAPÉ DO CARD --- */}
        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#71717a' }}>
          Não tem uma conta?{' '}
          <Link to="/register" style={{ color: '#8257e5', fontWeight: '600', textDecoration: 'none' }}>
            Cadastre-se
          </Link>
        </div>

      </div>
      
      {/* Créditos mais discretos */}
      <p style={{ marginTop: '24px', color: '#3f3f46', fontSize: '12px', marginBottom: 0 }}>
        &copy; 2026 MyLinks.
      </p>

    </div>
  )
}