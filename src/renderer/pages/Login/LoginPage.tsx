'use client'

import React, { useState, useEffect } from 'react'
//import { useRouter } from 'next/navigation'
import './LoginPage.css'
import { User } from '../../types'

export default function LoginPage({ onLogin }: { onLogin: (user: User) => void }) {
  //const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [error, setError] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const endpoint = isRegistering
        ? 'http://localhost:8000/api/auth/register'
        : 'http://localhost:8000/api/auth/login'

      const body = isRegistering
        ? { email, password, username, walletAddress }
        : { email, password }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Authentication failed')

      onLogin(data.user)
      //router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isRegistering ? 'Register' : 'Login'}</h2>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          
          {isRegistering && (
            <>
              <label>Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} />

              <label>Wallet Address</label>
              <input type="text" value={walletAddress} onChange={e => setWalletAddress(e.target.value)} />
            </>
          )}

          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Please wait...' : isRegistering ? 'Register' : 'Login'}
          </button>
        </form>

        <div className="auth-toggle">
          <button onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? 'Already have an account? Log in' : 'No account? Register'}
          </button>
        </div>
      </div>
    </div>
  )
}