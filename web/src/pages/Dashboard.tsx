import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'
import logoImg from '../assets/logo.png'
import { API_URL } from '../api'

interface LinkItem {
  id: string
  title: string
  url: string
  clicks: number
}

export default function Dashboard() {
  const [links, setLinks] = useState<LinkItem[]>([])
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const navigate = useNavigate()
  
  const userSlug = localStorage.getItem('mylinks-slug')

  useEffect(() => {
    const token = localStorage.getItem('mylinks-token')
    
    if (!token) {
      navigate('/')
      return
    }

    // --- CORREÇÃO 1: Usando API_URL e tratando erro ---
    fetch(`${API_URL}/users/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(async (res) => {
      if (!res.ok) throw new Error('Falha ao buscar dados')
      return res.json()
    })
    .then((data) => {
      // --- CORREÇÃO 2: Lendo do lugar certo (data.user.links) ---
      // O backend agora manda { user: { links: [] } }
      if (data.user && data.user.links) {
        setLinks(data.user.links)
      } else {
        setLinks([])
      }
    })
    .catch(() => {
      // Se der erro grave, desloga o usuário
      localStorage.clear()
      navigate('/')
    })
  }, [navigate])

  async function handleAddLink() {
    const token = localStorage.getItem('mylinks-token')
    
    if (!title || !url) return alert("Preencha tudo!")

    // --- CORREÇÃO 3: Trocando localhost por API_URL ---
    const response = await fetch(`${API_URL}/links`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, url })
    })

    if (response.ok) {
      const newLink = await response.json()
      setLinks([...links, newLink])
      setTitle('')
      setUrl('')
    } else {
      alert("Erro ao criar link")
    }
  }

  async function handleDeleteLink(id: string) {
    const token = localStorage.getItem('mylinks-token')
    
    // --- CORREÇÃO 4: Trocando localhost por API_URL ---
    const response = await fetch(`${API_URL}/links/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })

    if (response.ok) {
      setLinks(links.filter(link => link.id !== id))
    }
  }

  function handleLogout() {
    localStorage.clear()
    navigate('/')
  }

  return (
    <div className="login-container" style={{ justifyContent: 'flex-start', paddingTop: '20px' }}>
      
      <div style={{ width: '100%', maxWidth: '800px', padding: '0 20px' }}>

        {/* --- HEADER --- */}
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '20px',
          paddingBottom: '10px',
          borderBottom: '1px solid rgba(255,255,255,0.1)' 
        }}>
          
          <img 
            src={logoImg} 
            alt="Logo MyLinks" 
            style={{ 
              height: '120px', 
              width: 'auto', 
              objectFit: 'contain',
              marginTop: '-10px', 
              marginBottom: '-10px' 
            }} 
          />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button 
              onClick={() => navigate('/profile')} 
              style={{ 
                background: 'rgba(130, 87, 229, 0.1)', 
                border: '1px solid #8257e5', 
                color: '#8257e5', 
                padding: '8px 16px', 
                fontSize: '14px', 
                cursor: 'pointer',
                borderRadius: '8px',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
            >
              ⚙️ Perfil
            </button>

            {/* --- CORREÇÃO 5: Link relativo para funcionar na Vercel --- */}
            <a 
              href={`/${userSlug}`} 
              target="_blank" 
              style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}
            >
              Ver site ↗
            </a>
            
            <button 
              onClick={handleLogout} 
              style={{ 
                background: 'transparent', 
                color: '#e1e1e6', 
                border: '1px solid #3f3f46', 
                padding: '8px 16px', 
                fontSize: '14px', 
                cursor: 'pointer',
                borderRadius: '8px',
                fontWeight: '500'
              }}
            >
              Sair
            </button>
          </div>
        </header>

        {/* --- CARD DE CRIAR LINK --- */}
        <div style={{ 
          backgroundColor: '#121214', 
          padding: '32px', 
          borderRadius: '16px', 
          border: '1px solid #27272a',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          marginBottom: '40px' 
        }}>
          <h2 style={{ fontSize: '18px', marginBottom: '20px', color: '#eee', fontWeight: '600' }}>
            Adicionar Novo Link
          </h2>
          
          <div style={{ display: 'flex', gap: '15px', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 1 }}>
                <input 
                  className="input-modern" 
                  placeholder="Título (ex: Meu Instagram)" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                />
              </div>
              <div style={{ flex: 1 }}>
                <input 
                  className="input-modern"
                  placeholder="URL (https://...)" 
                  value={url} 
                  onChange={e => setUrl(e.target.value)} 
                />
              </div>
            </div>
            <button 
              className="btn-primary" 
              onClick={handleAddLink} 
              style={{ marginTop: '5px' }}
            >
              + Adicionar Link
            </button>
          </div>
        </div>

        {/* --- LISTA DE LINKS --- */}
        <h3 style={{ fontSize: '18px', color: '#ccc', marginBottom: '20px', fontWeight: '500' }}>Seus Links Ativos</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '40px' }}>
          {links.length === 0 && (
            <div style={{ 
              textAlign: 'center', color: '#777', padding: '40px', 
              border: '1px dashed #333', borderRadius: '8px' 
            }}>
              Você ainda não tem links cadastrados. Adicione o primeiro acima! ☝️
            </div>
          )}
          
          {links.map(link => (
            <div key={link.id} style={{ 
              backgroundColor: '#18181b', 
              padding: '20px', 
              borderRadius: '12px', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              border: '1px solid #27272a',
              transition: 'transform 0.2s',
            }}>
              <div style={{ overflow: 'hidden' }}>
                <strong style={{ display: 'block', fontSize: '16px', color: '#fff', marginBottom: '4px' }}>{link.title}</strong>
                <small style={{ color: '#8257e5', fontSize: '13px' }}>{link.url}</small>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#a1a1aa' }}>
                  <span>📊</span>
                  <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '16px' }}>
                    {link.clicks || 0}
                  </span>
                  <span style={{ fontSize: '12px' }}>cliques</span>
                </div>

                <button 
                  onClick={() => handleDeleteLink(link.id)}
                  style={{ 
                    background: 'transparent', 
                    border: '1px solid #ef4444', 
                    color: '#ef4444', 
                    padding: '8px 16px', 
                    fontSize: '12px', 
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Apagar
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}