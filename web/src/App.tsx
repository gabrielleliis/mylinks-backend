import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Public from './pages/Public' // <--- IMPORTAR AQUI
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Rota dinâmica: qualquer coisa depois de /u/ vira userId */}
        <Route path="/u/:userId" element={<Public />} /> 
      </Routes>
    </BrowserRouter>
  )
}