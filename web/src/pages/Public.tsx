import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import '../App.css'
import { API_URL } from '../api'

interface LinkItem {
  id: string
  title: string
  url: string
}

interface UserData {
  name: string
  avatarUrl: string
  links: LinkItem[]
}

export default function Public() {
  const { slug } = useParams()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    // O backend agora já traz os links automaticamente
    fetch(`${API_URL}/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Usuário não encontrado')
        return res.json()
      })
      .then(data => {
        setUser(data.user)
      })
      .catch(err => {
        console.error("Erro:", err)
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [slug])

  // --- FUNÇÃO QUE CONTA O CLIQUE 👇 ---
  function handleLinkClick(id: string) {
    // Manda um aviso pro servidor ("Ei, clicaram no link ID tal")
    fetch(`${API_URL}/links/${id}/click`, {
      method: 'POST'
    }).catch(err => console.error("Erro ao computar clique:", err))
  }

  if (loading) {
    return (
      <div className="login-container">
        <h1 style={{ color: '#fff' }}>Carregando... ⏳</h1>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="login-container">
        <h1 style={{ color: '#fff' }}>Usuário não encontrado 😕</h1>
      </div>
    )
  }

  return (
    <div className="login-container" style={{ justifyContent: 'flex-start', paddingTop: '60px' }}>
      
      <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', padding: '0 20px' }}>
        
        {/* --- CABEÇALHO --- */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{ 
            width: '120px', height: '120px', borderRadius: '50%', border: '3px solid #8257e5', 
            overflow: 'hidden', boxShadow: '0 0 30px rgba(130, 87, 229, 0.3)' 
          }}>
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: '#202024', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '40px' }}>👤</div>
            )}
          </div>

          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', margin: 0 }}>{user.name}</h1>
            <p style={{ color: '#a1a1aa', marginTop: '4px', fontSize: '14px' }}>@{slug}</p>
          </div>
        </div>

        {/* --- LISTA DE LINKS --- */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {user.links?.map(link => (
            <a 
              key={link.id} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              
              // 👇 O SEGREDO ESTÁ AQUI: O evento onClick
              onClick={() => handleLinkClick(link.id)}

              style={{ 
                backgroundColor: '#18181b', color: '#fff', padding: '16px', borderRadius: '12px',
                textAlign: 'center', textDecoration: 'none', fontWeight: '600', border: '1px solid #27272a',
                transition: 'all 0.2s ease', display: 'block', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.borderColor = '#8257e5'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = '#27272a'
              }}
            >
              {link.title}
            </a>
          ))}

          {(!user.links || user.links.length === 0) && (
            <p style={{ color: '#71717a', textAlign: 'center', fontSize: '14px' }}>
              Este usuário ainda não adicionou links.
            </p>
          )}
        </div>

        <footer style={{ marginTop: '20px', paddingBottom: '40px' }}>
           <a href="/" style={{ color: '#52525b', fontSize: '12px', textDecoration: 'none', fontWeight: '500' }}>
             Feito com <span style={{ color: '#fff' }}>MyLinks</span> 🚀
           </a>
        </footer>

      </div>
    </div>
  )
}