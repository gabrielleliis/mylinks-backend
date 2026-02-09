import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import '../App.css'

interface Link {
  id: string
  title: string
  url: string
}

// Criamos uma tipagem para o User também
interface UserData {
  email: string
}

export default function Public() {
  const { userId } = useParams()
  
  // Agora temos dois estados: um pros Links e um pro Usuário
  const [links, setLinks] = useState<Link[]>([])
  const [user, setUser] = useState<UserData | null>(null)

  useEffect(() => {
    fetch(`http://localhost:3333/${userId}/links`)
      .then(response => response.json())
      .then(data => {
        // O Backend agora manda { user, links }
        setUser(data.user)
        setLinks(data.links)
      })
  }, [userId])

  return (
    <div className="container">
      <div style={{ 
        width: '100%', 
        maxWidth: '400px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '20px' 
      }}>
        
        {/* Ícone de Perfil */}
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          backgroundColor: '#8257e5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px',
          marginBottom: '10px',
          border: '4px solid #202024'
        }}>
          👤
        </div>

        {/* --- NOME DINÂMICO AQUI 👇 --- */}
        <h1 style={{ fontSize: '20px', marginBottom: '20px' }}>
          {user ? user.email : 'Carregando...'}
        </h1>
        {/* ----------------------------- */}

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {links.map(link => (
            <a 
              key={link.id} 
              href={link.url} 
              target="_blank"
              style={{
                backgroundColor: '#202024',
                color: 'white',
                padding: '16px',
                borderRadius: '8px',
                textDecoration: 'none',
                textAlign: 'center',
                fontWeight: 'bold',
                border: '2px solid transparent',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = '#8257e5'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = 'transparent'}
            >
              {link.title}
            </a>
          ))}
        </div>

        {links.length === 0 && <p>Este usuário ainda não tem links.</p>}

        <footer style={{ marginTop: '40px', fontSize: '12px', color: '#777' }}>
          Feito com MyLinks 🚀
        </footer>
      </div>
    </div>
  )
}