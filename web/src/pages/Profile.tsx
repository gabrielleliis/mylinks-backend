import { useState, useEffect } from 'react'
import type { ChangeEvent } from 'react' // <--- MUDANÇA AQUI: import separado com 'type'
import { useNavigate } from 'react-router-dom'
import '../App.css'

export default function Profile() {
  const [name, setName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // 1. Busca os dados atuais do usuário ao abrir a tela
  useEffect(() => {
    const slug = localStorage.getItem('mylinks-slug')
    
    if (slug) {
      fetch(`http://localhost:3333/${slug}`)
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setName(data.user.name)
            setAvatarUrl(data.user.avatarUrl)
          }
        })
        .catch(err => console.error("Erro ao carregar perfil:", err))
    }
  }, [])

  // 2. Lida com a escolha da nova foto
  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      // Cria uma URL temporária para mostrar a foto na hora
      setPreview(URL.createObjectURL(file))
    }
  }

  // 3. Envia as atualizações para o backend
  async function handleUpdateProfile() {
    setLoading(true)
    const token = localStorage.getItem('mylinks-token')
    
    const formData = new FormData()
    // Só envia o nome se ele não estiver vazio
    if (name) formData.append('name', name)
    // Só envia a imagem se o usuário tiver escolhido uma nova
    if (selectedFile) formData.append('image', selectedFile)

    try {
      const response = await fetch('http://localhost:3333/users', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        alert("Perfil atualizado com sucesso! 🎉")
        navigate('/dashboard')
      } else {
        alert("Erro ao atualizar perfil.")
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      
      {/* CARD ESTILIZADO */}
      <div style={{ 
        width: '100%', 
        maxWidth: '400px', 
        padding: '40px', 
        backgroundColor: '#121214', 
        borderRadius: '16px', 
        border: '1px solid #27272a',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        display: 'flex', 
        flexDirection: 'column',
        gap: '24px'
      }}>
        
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#eee', margin: 0 }}>
            Editar Perfil ⚙️
          </h1>
          <p style={{ color: '#71717a', fontSize: '14px', marginTop: '5px' }}>
            Personalize como os outros te veem.
          </p>
        </div>

        {/* --- ÁREA DA FOTO --- */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          
          <div style={{ 
            width: '120px', 
            height: '120px', 
            borderRadius: '50%', 
            border: '3px solid #8257e5', 
            overflow: 'hidden', 
            background: '#202024', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            boxShadow: '0 0 20px rgba(130, 87, 229, 0.2)' 
          }}>
            {(preview || avatarUrl) ? (
              <img 
                src={preview || avatarUrl} 
                alt="Avatar" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            ) : (
              <span style={{ fontSize: '40px' }}>👤</span>
            )}
          </div>
          
          <label 
            htmlFor="fileInput" 
            style={{ 
              cursor: 'pointer', 
              background: 'rgba(130, 87, 229, 0.1)', 
              color: '#8257e5', 
              padding: '8px 16px', 
              borderRadius: '8px', 
              fontSize: '13px', 
              fontWeight: '600', 
              border: '1px solid #8257e5',
              transition: 'all 0.2s'
            }}
          >
            📸 Trocar Foto
          </label>
          <input 
            id="fileInput" 
            type="file" 
            accept="image/*"
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
          />
        </div>

        {/* --- INPUT DE NOME --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: '500', color: '#a1a1aa' }}>
            Seu Nome
          </label>
          <input 
            className="input-modern"
            value={name} 
            onChange={e => setName(e.target.value)}
            placeholder="Como você quer ser chamado?"
          />
        </div>

        {/* --- BOTÕES --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
          
          <button 
            className="btn-primary" 
            onClick={handleUpdateProfile} 
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar Alterações"}
          </button>

          <button 
            onClick={() => navigate('/dashboard')} 
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: '#71717a', 
              padding: '12px', 
              fontSize: '14px', 
              cursor: 'pointer',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#71717a'}
          >
            Cancelar e Voltar
          </button>

        </div>

      </div>
    </div>
  )
}