import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'

interface Link {
  id: string
  title: string
  url: string
  userId: string // <--- ADICIONADO: O Front precisa saber de quem é o link
}

export default function Dashboard() {
  const [links, setLinks] = useState<Link[]>([])
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchLinks()
  }, [])

  function fetchLinks() {
    const token = localStorage.getItem('mylinks-token')
    fetch('http://localhost:3333/links', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => setLinks(data))
  }

  async function handleCreateLink(e: React.FormEvent) {
    e.preventDefault()
    const token = localStorage.getItem('mylinks-token')

    const response = await fetch('http://localhost:3333/links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title: newTitle, url: newUrl })
    })

    if (response.ok) {
      setNewTitle('')
      setNewUrl('')
      fetchLinks()
    } else {
      alert('Erro ao criar link!')
    }
  }

  async function handleDeleteLink(id: string) {
    const token = localStorage.getItem('mylinks-token')
    
    if (confirm('Tem certeza que quer deletar esse link?')) {
      await fetch(`http://localhost:3333/links/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      fetchLinks()
    }
  }

  function handleLogout() {
    localStorage.removeItem('mylinks-token')
    navigate('/')
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '600px' }}>
        
        {/* Cabeçalho com Título e Logout */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h1 style={{ fontSize: '24px', margin: 0 }}>Meus Links 🔗</h1>
          <button onClick={handleLogout} style={{ backgroundColor: '#dc2626', width: 'auto', padding: '8px 15px', marginTop: 0 }}>
            Sair
          </button>
        </div>

        {/* --- NOVO: Link para a Página Pública --- */}
        {links.length > 0 && (
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <span style={{ color: '#ccc', fontSize: '14px' }}>Sua página está pública em: </span>
            <br />
            <a 
              href={`/u/${links[0].userId}`} 
              target="_blank" 
              style={{ color: '#8257e5', fontWeight: 'bold', textDecoration: 'none' }}
            >
              /u/{links[0].userId} ➡️
            </a>
          </div>
        )}
        {/* ---------------------------------------- */}

        <form onSubmit={handleCreateLink} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
          <input 
            placeholder="Nome do Link" 
            value={newTitle} 
            onChange={e => setNewTitle(e.target.value)}
            required
            style={{ flex: 1 }}
          />
          <input 
            placeholder="URL (https://...)" 
            value={newUrl} 
            onChange={e => setNewUrl(e.target.value)}
            required
            style={{ flex: 1 }}
          />
          <button type="submit" style={{ marginTop: 0, width: 'auto', backgroundColor: '#04d361' }}>
            +
          </button>
        </form>

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {links.map(link => (
            <li key={link.id} style={{ 
              backgroundColor: '#121214', 
              padding: '15px', 
              borderRadius: '5px', 
              marginBottom: '10px',
              border: '1px solid #323238',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <span style={{ fontWeight: 'bold' }}>{link.title}</span>
                <a href={link.url} target="_blank" style={{ color: '#8257e5', fontSize: '14px' }}>{link.url}</a>
              </div>
              
              <button 
                onClick={() => handleDeleteLink(link.id)}
                style={{ backgroundColor: 'transparent', border: '1px solid #dc2626', color: '#dc2626', width: 'auto', padding: '5px 10px', marginTop: 0 }}
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
        
        {links.length === 0 && <p style={{ textAlign: 'center', color: '#777' }}>Nenhum link criado ainda.</p>}
      </div>
    </div>
  )
}