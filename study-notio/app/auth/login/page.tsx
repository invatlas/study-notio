'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const symbols = ['∫', 'Σ', 'π', '∂', '√', 'θ', 'λ', '∞', 'Δ', 'φ', 'α', 'β']

const floats = [
  { sym: '∫', top: '8%', left: '4%', size: '2.2rem', delay: '0s', dur: '9s', op: 0.07 },
  { sym: 'π', top: '15%', right: '6%', size: '1.8rem', delay: '1.5s', dur: '11s', op: 0.06 },
  { sym: 'Σ', top: '70%', left: '3%', size: '2rem', delay: '3s', dur: '8s', op: 0.07 },
  { sym: '∞', top: '80%', right: '5%', size: '2.4rem', delay: '0.5s', dur: '10s', op: 0.06 },
  { sym: 'θ', top: '40%', left: '92%', size: '1.6rem', delay: '2s', dur: '12s', op: 0.05 },
  { sym: 'λ', top: '55%', left: '5%', size: '1.4rem', delay: '4s', dur: '9s', op: 0.06 },
  { sym: 'Δ', top: '25%', left: '88%', size: '1.8rem', delay: '1s', dur: '13s', op: 0.05 },
  { sym: '√', top: '88%', left: '45%', size: '1.6rem', delay: '3.5s', dur: '10s', op: 0.06 },
]

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [focused, setFocused] = useState('')

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else window.location.href = '/dashboard'
    setLoading(false)
  }

  const handleKey = (e: any) => { if (e.key === 'Enter') handleLogin() }
  
  return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne',sans-serif", padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        @keyframes floatUp{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-16px) rotate(4deg)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes glow{0%,100%{opacity:0.4}50%{opacity:0.7}}
        .float-s{position:absolute;font-family:'DM Mono',monospace;color:#c8f75a;pointer-events:none;user-select:none;animation:floatUp var(--dur) ease-in-out var(--delay) infinite}
        .auth-input{width:100%;background:#0f0f0f;border:1px solid rgba(255,255,255,0.08);border-radius:4px;padding:0.85rem 1rem;font-size:14px;color:#ede9e3;font-family:'Syne',sans-serif;outline:none;transition:border-color 0.2s,box-shadow 0.2s}
        .auth-input:focus{border-color:rgba(200,247,90,0.4);box-shadow:0 0 0 3px rgba(200,247,90,0.06)}
        .auth-input::placeholder{color:#3a3835}
        .sign-btn{width:100%;background:#c8f75a;color:#080808;border:none;border-radius:4px;padding:0.9rem;font-size:13px;font-weight:700;cursor:pointer;font-family:'Syne',sans-serif;letter-spacing:0.08em;text-transform:uppercase;transition:all 0.2s}
        .sign-btn:hover:not(:disabled){background:#d4f96e;transform:translateY(-1px);box-shadow:0 8px 24px rgba(200,247,90,0.2)}
        .sign-btn:disabled{opacity:0.6;cursor:not-allowed}
        .card{animation:fadeIn 0.7s cubic-bezier(0.16,1,0.3,1) forwards}
      `}</style>

      {/* dot grid */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />

      {/* glow */}
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 500, background: 'radial-gradient(circle, rgba(200,247,90,0.04) 0%, transparent 65%)', pointerEvents: 'none', animation: 'glow 4s ease-in-out infinite' }} />

      {/* floating symbols */}
      {floats.map((f, i) => (
        <span key={i} className="float-s" style={{ top: f.top, left: f.left, right: f.right, fontSize: f.size, opacity: f.op, '--delay': f.delay, '--dur': f.dur }}>
          {f.sym}
        </span>
      ))}

      {/* card */}
      <div className="card" style={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 1 }}>

        {/* logo */}
        <a href="/" style={{ display: 'block', marginBottom: '2.5rem', fontFamily: "'Instrument Serif',serif", fontSize: 22, color: '#ede9e3', textDecoration: 'none', letterSpacing: '-0.01em' }}>
          Study<span style={{ color: '#c8f75a' }}>Notio</span>
        </a>

        {/* heading */}
        <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: '2.6rem', fontWeight: 400, color: '#ede9e3', marginBottom: '0.4rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          Welcome back.
        </h1>
        <p style={{ fontSize: 14, color: '#5a5855', marginBottom: '2.5rem', lineHeight: 1.6 }}>
          New here? <a href="/auth/signup" style={{ color: '#c8f75a', textDecoration: 'none', fontWeight: 500 }}>Create a free account →</a>
        </p>

        {/* error */}
        {error && (
          <div style={{ background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.2)', borderRadius: 4, padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: 13, color: '#ff8080', fontFamily: "'DM Mono',monospace", letterSpacing: '0.02em' }}>
            {error}
          </div>
        )}

        {/* fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <label style={{ fontSize: 10, color: '#5a5855', fontFamily: "'DM Mono',monospace", letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Email</label>
            <input className="auth-input" type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={handleKey} placeholder="you@example.com" />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: 10, color: '#5a5855', fontFamily: "'DM Mono',monospace", letterSpacing: '0.1em', textTransform: 'uppercase' }}>Password</label>
              <a href="#" style={{ fontSize: 11, color: '#5a5855', textDecoration: 'none', fontFamily: "'DM Mono',monospace", letterSpacing: '0.04em' }}>Forgot?</a>
            </div>
            <input className="auth-input" type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={handleKey} placeholder="••••••••" />
          </div>
        </div>

        <button className="sign-btn" onClick={handleLogin} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in →'}
        </button>

        {/* divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          <span style={{ fontSize: 11, color: '#3a3835', fontFamily: "'DM Mono',monospace", letterSpacing: '0.06em' }}>OR</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
        </div>

        {/* google */}
        <button onClick={async () => { await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/dashboard` } }) }} style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, padding: '0.85rem', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: "'Syne',sans-serif", color: '#ede9e3', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'all 0.2s' }}
          onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
          onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>

        <p style={{ textAlign: 'center', fontSize: 11, color: '#3a3835', marginTop: '2rem', fontFamily: "'DM Mono',monospace", letterSpacing: '0.04em', lineHeight: 1.6 }}>
          BY CONTINUING YOU AGREE TO OUR <a href="#" style={{ color: '#5a5855', textDecoration: 'none' }}>TERMS</a> & <a href="#" style={{ color: '#5a5855', textDecoration: 'none' }}>PRIVACY</a>
        </p>
      </div>
    </div>
  )
}