'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'

const floats = [
  { sym: '∂', top: '10%', left: '5%', size: '2rem', delay: '0s', dur: '9s', op: 0.07 },
  { sym: 'φ', top: '18%', right: '7%', size: '1.8rem', delay: '2s', dur: '11s', op: 0.06 },
  { sym: '∇', top: '65%', left: '3%', size: '2.2rem', delay: '1s', dur: '8s', op: 0.07 },
  { sym: 'β', top: '78%', right: '4%', size: '2rem', delay: '0.5s', dur: '10s', op: 0.06 },
  { sym: 'ω', top: '42%', left: '93%', size: '1.6rem', delay: '3s', dur: '12s', op: 0.05 },
  { sym: '∫', top: '52%', left: '4%', size: '1.5rem', delay: '4s', dur: '9s', op: 0.06 },
  { sym: 'α', top: '30%', left: '89%', size: '1.8rem', delay: '1.5s', dur: '13s', op: 0.05 },
  { sym: 'Σ', top: '90%', left: '50%', size: '1.6rem', delay: '2.5s', dur: '10s', op: 0.06 },
]

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSignup = async () => {
    if (!name || !email || !password) { setError('Please fill in all fields'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
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

  const handleKey = (e: any) => { if (e.key === 'Enter') handleSignup() }
  
  if (success) return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne',sans-serif", position: 'relative', overflow: 'hidden' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');@keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
      <div style={{ textAlign: 'center', maxWidth: 420, padding: '2rem', position: 'relative', zIndex: 1, animation: 'fadeIn 0.7s ease forwards' }}>
        <div style={{ width: 64, height: 64, background: 'rgba(200,247,90,0.1)', border: '1px solid rgba(200,247,90,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 1.5rem' }}>🎓</div>
        <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: '2.2rem', color: '#ede9e3', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>Check your email</h2>
        <p style={{ fontSize: 14, color: '#5a5855', lineHeight: 1.75, marginBottom: '2rem' }}>
          We sent a confirmation link to<br /><strong style={{ color: '#c8f75a' }}>{email}</strong>
        </p>
        <p style={{ fontSize: 12, color: '#3a3835', fontFamily: "'DM Mono',monospace", letterSpacing: '0.04em' }}>
          DIDN'T GET IT? <a href="#" style={{ color: '#c8f75a', textDecoration: 'none' }}>RESEND EMAIL</a>
        </p>
      </div>
    </div>
  )

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

      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '35%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 500, background: 'radial-gradient(circle, rgba(200,247,90,0.04) 0%, transparent 65%)', pointerEvents: 'none', animation: 'glow 4s ease-in-out infinite' }} />

      {floats.map((f, i) => (
        <span key={i} className="float-s" style={{ top: f.top, left: f.left, right: f.right, fontSize: f.size, opacity: f.op, '--delay': f.delay, '--dur': f.dur }}>{f.sym}</span>
      ))}

      <div className="card" style={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 1 }}>
        <a href="/" style={{ display: 'block', marginBottom: '2.5rem', fontFamily: "'Instrument Serif',serif", fontSize: 22, color: '#ede9e3', textDecoration: 'none' }}>
          Study<span style={{ color: '#c8f75a' }}>Notio</span>
        </a>

        <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: '2.6rem', fontWeight: 400, color: '#ede9e3', marginBottom: '0.4rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          Let's begin.
        </h1>
        <p style={{ fontSize: 14, color: '#5a5855', marginBottom: '2.5rem' }}>
          Already have an account? <a href="/auth/login" style={{ color: '#c8f75a', textDecoration: 'none', fontWeight: 500 }}>Sign in →</a>
        </p>

        {error && (
          <div style={{ background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.2)', borderRadius: 4, padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: 13, color: '#ff8080', fontFamily: "'DM Mono',monospace" }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <label style={{ fontSize: 10, color: '#5a5855', fontFamily: "'DM Mono',monospace", letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Full name</label>
            <input className="auth-input" type="text" value={name} onChange={e => setName(e.target.value)} onKeyDown={handleKey} placeholder="Your name" />
          </div>
          <div>
            <label style={{ fontSize: 10, color: '#5a5855', fontFamily: "'DM Mono',monospace", letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Email</label>
            <input className="auth-input" type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={handleKey} placeholder="you@example.com" />
          </div>
          <div>
            <label style={{ fontSize: 10, color: '#5a5855', fontFamily: "'DM Mono',monospace", letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Password</label>
            <input className="auth-input" type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={handleKey} placeholder="Min. 6 characters" />
          </div>
        </div>

        <button className="sign-btn" onClick={handleSignup} disabled={loading}>
          {loading ? 'Creating account...' : 'Create account →'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          <span style={{ fontSize: 11, color: '#3a3835', fontFamily: "'DM Mono',monospace", letterSpacing: '0.06em' }}>OR</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
        </div>

        <button onClick={async () => { await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/dashboard` } }) }}
          style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, padding: '0.85rem', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: "'Syne',sans-serif", color: '#ede9e3', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'all 0.2s' }}
          onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
          onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>

        <p style={{ textAlign: 'center', fontSize: 11, color: '#3a3835', marginTop: '2rem', fontFamily: "'DM Mono',monospace", letterSpacing: '0.04em', lineHeight: 1.6 }}>
          BY SIGNING UP YOU AGREE TO OUR <a href="#" style={{ color: '#5a5855', textDecoration: 'none' }}>TERMS</a> & <a href="#" style={{ color: '#5a5855', textDecoration: 'none' }}>PRIVACY</a>
        </p>
      </div>
    </div>
  )
}