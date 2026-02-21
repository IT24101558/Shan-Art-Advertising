import { useState } from 'react'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import { AuthProvider } from './context/AuthContext'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Header />
        <main>
          <Dashboard />
        </main>
      </div>
    </AuthProvider>
  )
}

export default App
