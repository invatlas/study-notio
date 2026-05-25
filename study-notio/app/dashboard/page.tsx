'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const quotes = [
  "The expert in anything was once a beginner.",
  "Small daily improvements lead to stunning results.",
  "Every problem has a solution. You just need to find it.",
  "Mathematics is not about numbers, it's about understanding.",
  "The only way to learn mathematics is to do mathematics.",
]

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

const xpLevels = [
  { name: 'Beginner', min: 0, max: 500 },
  { name: 'Apprentice', min: 500, max: 1500 },
  { name: 'Scholar', min: 1500, max: 3000 },
  { name: 'Master', min: 3000, max: 5000 },
]

function getMasteryColor(m) {
  if (m >= 80) return '#c8f75a'
  if (m >= 60) return '#f0a840'
  if (m >= 40) return '#f97316'
  return '#f43f5e'
}

export default function Dashboard() {
  const [dark, setDark] = useState(true)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quote] = useState(quotes[Math.floor(Math.random() * quotes.length)])

  const xp = profile?.xp || 0
  const streak = profile?.streak || 0
  const firstName = profile?.full_name?.split(' ')[0] || 'there'
  const currentLevel = xpLevels.find(l => xp >= l.min && xp < l.max) || xpLevels[0]
  const nextLevel = xpLevels[xpLevels.indexOf(currentLevel) + 1]
  const xpProgress = ((xp - currentLevel.min) / (currentLevel.max - currentLevel.min)) * 100

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/auth/login'; return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
      setLoading(false)
    }
    getProfile()
  }, [])

  const d = dark
  const bg = d ? '#080808' : '#f9f8f5'
  const bg2 = d ? '#111111' : '#ffffff'
  const bg3 = d ? '#161616' : '#f2f1ed'
  const text = d ? '#ede9e3' : '#141210'
  const muted = d ? '#6b6860' : '#8a8680'
  const border = d ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)'
  const border2 = d ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'
  const accent = '#c8f75a'
  const sidebar = d ? '#0d0d0d' : '#f5f4f0'

  const navItems = [
    { id: 'dashboard', icon: '⊞', label: 'Dashboard', href: '/dashboard' },
    { id: 'plans', icon: '📅', label: 'Study Plans', href: '/plan' },
    { id: 'tutor', icon: '💬', label: 'AI Tutor', href: '/tutor' },
    { id: 'tests', icon: '📝', label: 'Tests', href: '/tests' },
    { id: 'progress', icon: '📈', label: 'Progress', href: '/progress' },
    { id: 'upload', icon: '⬆', label: 'Upload', href: '/upload' },
  ]

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#6b6860', fontFamily: "'DM Mono',monospace", fontSize: 13, letterSpacing: '0.06em' }}>LOADING...</p>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: bg, fontFamily: "'Syne',sans-serif", color: text, transition: 'all 0.3s' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
        .nav-item{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:6px;cursor:pointer;transition:all 0.2s;font-size:13px;font-weight:500;color:${muted};letter-spacing:0.02em;text-decoration:none}
        .nav-item:hover{background:${bg3};color:${text}}
        .nav-item.active{background:rgba(200,247,90,0.1);color:${accent}}
        .card{background:${bg2};border:1px solid ${border};border-radius:12px;padding:1.25rem;transition:all 0.3s}
        .card:hover{border-color:${border2}}
        .btn-primary{background:${accent};color:#080808;border:none;border-radius:6px;padding:0.6rem 1.25rem;font-size:12px;font-weight:700;cursor:pointer;font-family:'Syne',sans-serif;letter-spacing:0.06em;text-transform:uppercase;transition:all 0.2s}
        .btn-primary:hover{background:#d4f96e;transform:translateY(-1px)}
        .btn-ghost{background:transparent;color:${text};border:1px solid ${border};border-radius:6px;padding:0.6rem 1.25rem;font-size:12px;font-weight:500;cursor:pointer;font-family:'Syne',sans-serif;transition:all 0.2s}
        .btn-ghost:hover{border-color:${border2};background:${bg3}}
        .progress-bar{height:4px;background:${bg3};border-radius:2px;overflow:hidden}
        .progress-fill{height:100%;border-radius:2px;transition:width 1s ease}
        .fade{animation:fadeIn 0.6s cubic-bezier(0.16,1,0.3,1) forwards}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:${bg}}
        ::-webkit-scrollbar-thumb{background:${border2};border-radius:2px}
      `}</style>

      {/* SIDEBAR */}
      <div style={{ width: 220, background: sidebar, borderRight: `1px solid ${border}`, display: 'flex', flexDirection: 'column', padding: '1.5rem 1rem', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 10 }}>
        <a href="/" style={{ display: 'block', fontFamily: "'Instrument Serif',serif", fontSize: 20, color: text, textDecoration: 'none', marginBottom: '2rem', padding: '0 4px' }}>
          Study<span style={{ color: accent }}>Notio</span>
        </a>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map(item => (
            <a key={item.id} href={item.href} className={`nav-item${item.id === 'dashboard' ? ' active' : ''}`}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </div>

        {/* XP */}
        <div style={{ background: bg3, border: `1px solid ${border}`, borderRadius: 8, padding: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: muted, fontFamily: "'DM Mono',monospace", letterSpacing: '0.06em' }}>{currentLevel.name.toUpperCase()}</span>
            <span style={{ fontSize: 11, color: accent, fontFamily: "'DM Mono',monospace" }}>{xp} XP</span>
          </div>
          <div className="progress-bar" style={{ marginBottom: 6 }}>
            <div className="progress-fill" style={{ width: `${xpProgress}%`, background: accent }} />
          </div>
          <p style={{ fontSize: 11, color: muted, fontFamily: "'DM Mono',monospace" }}>
            {nextLevel ? `${nextLevel.min - xp} XP to ${nextLevel.name}` : 'Max level reached'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
          <a href="/profile" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#080808' }}>
              {firstName[0]?.toUpperCase()}
            </div>
            <span style={{ fontSize: 13, color: text, fontWeight: 500 }}>{firstName}</span>
          </a>
          <button onClick={() => setDark(!dark)} style={{ background: 'transparent', border: `1px solid ${border}`, borderRadius: 6, width: 30, height: 30, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', color: muted }}>
            {dark ? '☀' : '☾'}
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ marginLeft: 220, flex: 1, padding: '2rem 2.5rem', maxWidth: 'calc(100vw - 220px)' }}>

        {/* HEADER */}
        <div className="fade" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <p style={{ fontSize: 12, color: muted, fontFamily: "'DM Mono',monospace", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: '2.2rem', fontWeight: 400, letterSpacing: '-0.02em', color: text, marginBottom: 4 }}>
              {getGreeting()}, {firstName} 👋
            </h1>
            <p style={{ fontSize: 14, color: muted, fontStyle: 'italic' }}>"{quote}"</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ background: bg2, border: `1px solid ${border}`, borderRadius: 8, padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 18, animation: 'pulse 2s ease-in-out infinite' }}>🔥</span>
              <div>
                <p style={{ fontSize: 18, fontWeight: 700, color: text, lineHeight: 1 }}>{streak}</p>
                <p style={{ fontSize: 10, color: muted, fontFamily: "'DM Mono',monospace", letterSpacing: '0.04em' }}>DAY STREAK</p>
              </div>
            </div>
            <button className="btn-primary" onClick={() => window.location.href = '/upload'}>+ New Plan</button>
          </div>
        </div>

        {/* STATS */}
        <div className="fade" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Active Plans', value: '0', sub: 'No plans yet', icon: '📅', color: accent },
            { label: 'Chapters Done', value: '0', sub: 'Upload to start', icon: '✅', color: '#a78bfa' },
            { label: 'Avg Mastery', value: '—', sub: 'No data yet', icon: '🧠', color: '#60d4f7' },
            { label: 'Tests Taken', value: '0', sub: 'No tests yet', icon: '📝', color: '#f97316' },
          ].map((stat, i) => (
            <div key={i} className="card" style={{ animation: `fadeIn 0.6s ease ${i * 0.08}s both` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: 20 }}>{stat.icon}</span>
                <span style={{ fontSize: 10, color: muted, fontFamily: "'DM Mono',monospace", letterSpacing: '0.06em', textTransform: 'uppercase', background: bg3, padding: '2px 8px', borderRadius: 3 }}>{stat.label}</span>
              </div>
              <p style={{ fontSize: 28, fontWeight: 700, color: stat.color, fontFamily: "'Instrument Serif',serif", marginBottom: 2 }}>{stat.value}</p>
              <p style={{ fontSize: 12, color: muted }}>{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        <div className="card fade" style={{ textAlign: 'center', padding: '4rem 2rem', border: `1px dashed ${border2}`, background: 'transparent' }}>
          <div style={{ fontSize: 48, marginBottom: '1.5rem' }}>📂</div>
          <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: '1.8rem', color: text, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
            No study plans yet.
          </h2>
          <p style={{ fontSize: 14, color: muted, marginBottom: '2rem', lineHeight: 1.7 }}>
            Upload your first chapter — PDF, photo, or YouTube link.<br />
            We'll build your personalised study plan in seconds.
          </p>
          <button className="btn-primary" style={{ padding: '0.9rem 2rem', fontSize: 13 }} onClick={() => window.location.href = '/upload'}>
            Upload your first chapter →
          </button>
        </div>

      </div>

      {/* FLOATING BUTTON */}
      <button style={{ position: 'fixed', bottom: '2rem', right: '2rem', width: 52, height: 52, background: accent, border: 'none', borderRadius: '50%', fontSize: 22, cursor: 'pointer', boxShadow: '0 8px 24px rgba(200,247,90,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', zIndex: 50, color: '#080808', fontWeight: 700 }}
        onClick={() => window.location.href = '/upload'}
        onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.1)' }}
        onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)' }}
      >+</button>
    </div>
  )
}