'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSignup = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    })
    if (error) setError(error.message)
    else setSuccess(true)
    setLoading(false)
  }

  if (success) return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');`}</style>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{ fontSize: 48, marginBottom: '1.5rem' }}>🎓</div>
        <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: '2rem', color: '#ede9e3', marginBottom: '0.75rem' }}>Check your email</h2>
        <p style={{ fontSize: 14, color: '#6b6860', lineHeight: 1.7 }}>We sent a confirmation link to <strong style={{ color: '#c8f75a' }}>{email}</strong>. Click it to activate your account.</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne',sans-serif", padding: '2rem' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');`}</style>

      <div style={{ width: '100%', maxWidth: 420 }}>
        <a href="/" style={{ display: 'block', marginBottom: '3rem', fontFamily: "'Instrument Serif',serif", fontSize: 22, color: '#ede9e3', textDecoration: 'none' }}>
          Study<span style={{ color: '#c8f75a' }}>Notio</span>
        </a>

        <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: '2.8rem', fontWeight: 400, color: '#ede9e3', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Let's begin.
        </h1>
        <p style={{ fontSize: 14, color: '#6b6860', marginBottom: '2.5rem' }}>
          Already have an account? <a href="/auth/login" style={{ color: '#c8f75a', textDecoration: 'none' }}>Sign in</a>
        </p>

        {error && (
          <div style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)', borderRadius: 3, padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: 13, color: '#ff8080' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ fontSize: 11, color: '#6b6860', fontFamily: "'DM Mono',monospace", letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Full name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              style={{ width: '100%', background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3, padding: '0.8rem 1rem', fontSize: 14, color: '#ede9e3', fontFamily: "'Syne',sans-serif", outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 11, color: '#6b6860', fontFamily: "'DM Mono',monospace", letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{ width: '100%', background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3, padding: '0.8rem 1rem', fontSize: 14, color: '#ede9e3', fontFamily: "'Syne',sans-serif", outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 11, color: '#6b6860', fontFamily: "'DM Mono',monospace", letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3, padding: '0.8rem 1rem', fontSize: 14, color: '#ede9e3', fontFamily: "'Syne',sans-serif", outline: 'none' }}
            />
          </div>
        </div>

        <button
          onClick={handleSignup}
          disabled={loading}
          style={{ width: '100%', background: '#c8f75a', color: '#080808', border: 'none', borderRadius: 3, padding: '0.9rem', fontSize: 13, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'Syne',sans-serif", letterSpacing: '0.06em', textTransform: 'uppercase', opacity: loading ? 0.7 : 1, transition: 'all 0.2s' }}
        >
          {loading ? 'Creating account...' : 'Create account →'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#6b6860', marginTop: '1.5rem', fontFamily: "'DM Mono',monospace", letterSpacing: '0.04em', lineHeight: 1.6 }}>
          BY SIGNING UP YOU AGREE TO OUR <a href="#" style={{ color: '#c8f75a', textDecoration: 'none' }}>TERMS</a> AND <a href="#" style={{ color: '#c8f75a', textDecoration: 'none' }}>PRIVACY POLICY</a>
        </p>
      </div>
    </div>
  )
}