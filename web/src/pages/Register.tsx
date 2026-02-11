import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../App.css'
import logoImg from '../assets/logo.png'
import { API_URL } from '../api'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [slug, setSlug] = useState('')
  const navigate = useNavigate()

  async function handleRegister() {
    if (!name || !email || !password || !slug) {
      return alert("Por favor, preencha todos os campos!")
    }

    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, slug })
      })

      if (response.ok) {
        alert("Conta criada com sucesso!")
        navigate('/')
      } else {
        const data = await response.json()
        alert("Erro: " + data.message)
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor.")
    }
  }

  return (
    <div className="login-container">
      
      {/* CARD DE CADASTRO */}
      <div style={{ 
        width: '100%', 
        maxWidth: '400px', 
        padding: '32px 40px', 
        backgroundColor: '#121214', 
        borderRadius: '16px', 
        border: '1px solid #27272a',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        display: 'flex', 
        flexDirection: 'column',
      }}>
        
        {/* --- LOGO --- */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <img 
            src={logoImg} 
            alt="Logo MyLinks" 
            style={{ height: '80px', width: 'auto', objectFit: 'contain' }} // Um pouco menor pra caber tudo
          />
        </div>

        {/* --- TÍTULO --- */}
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '24px', fontWeight: '600', color: '#f4f4f5', 
            marginBottom: '4px', marginTop: 0 
          }}>
            Crie sua conta 🚀
          </h1>
          <p style={{ color: '#71717a', fontSize: '14px', margin: 0 }}>
            Comece a organizar seus links hoje.
          </p>
        </div>
        
        {/* --- FORMULÁRIO (GAP REDUZIDO PARA CABER TUDO) --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* Nome */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '500', color: '#a1a1aa' }}>Seu Nome</label>
            <input 
              className="input-modern"
              placeholder="Ex: Gabriel Lelis"
              value={name} onChange={e => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '500', color: '#a1a1aa' }}>E-mail</label>
            <input 
              className="input-modern"
              type="email"
              placeholder="seu@email.com"
              value={email} onChange={e => setEmail(e.target.value)}
            />
          </div>

          {/* Slug (Link) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '500', color: '#a1a1aa' }}>
              Escolha seu Link (Slug)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ color: '#555', fontSize: '12px' }}>mylinks.com/</span>
              <input 
                className="input-modern"
                placeholder="gabriel"
                value={slug} onChange={e => setSlug(e.target.value)}
              />
            </div>
          </div>

          {/* Senha */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '500', color: '#a1a1aa' }}>Senha</label>
            <input 
              className="input-modern"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password} onChange={e => setPassword(e.target.value)}
            />
          </div>

        </div>

        {/* --- BOTÃO --- */}
        <button className="btn-primary" onClick={handleRegister} style={{ marginTop: '24px' }}>
          Criar Conta
        </button>

        {/* --- RODAPÉ --- */}
        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#71717a' }}>
          Já tem conta?{' '}
          <Link to="/" style={{ color: '#8257e5', fontWeight: '600', textDecoration: 'none' }}>
            Faça Login
          </Link>
        </div>

      </div>

      <p style={{ marginTop: '24px', color: '#3f3f46', fontSize: '12px', marginBottom: 0 }}>
        &copy; 2026 MyLinks.
      </p>

    </div>
  )
}