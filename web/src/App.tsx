import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import React from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Public from './pages/Public'
import Profile from './pages/Profile' // <--- TEM QUE TER ESSE IMPORT

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('mylinks-token')
  return token ? children : <Navigate to="/" />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        
        {/* ESSA LINHA AQUI É O SEGREDO 👇 */}
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        
        <Route path="/:slug" element={<Public />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App