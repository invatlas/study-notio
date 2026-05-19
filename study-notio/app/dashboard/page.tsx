'use client'
import { useState, useEffect } from 'react'

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

function getDaysUntil(dateStr) {
  const diff = new Date(dateStr) - new Date()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

const plans = [
  {
    id: 1, title: 'Integration & Differentiation', exam: 'JEE Mains',
    examDate: '2026-01-15', day: 8, total: 30, progress: 28, chapters: 12,
    chapters_data: [
      { name: 'Limits', mastery: 92, status: 'done' },
      { name: 'Continuity', mastery: 88, status: 'done' },
      { name: 'Differentiation', mastery: 76, status: 'active' },
      { name: 'Chain Rule', mastery: 45, status: 'warning' },
      { name: 'Integration', mastery: 0, status: 'locked' },
      { name: 'By Parts', mastery: 0, status: 'locked' },
    ],
    color: '#c8f75a', weak: 2,
  },
  {
    id: 2, title: 'SAT Math — Algebra', exam: 'SAT',
    examDate: '2026-03-08', day: 3, total: 14, progress: 55, chapters: 8,
    chapters_data: [
      { name: 'Linear Eq.', mastery: 95, status: 'done' },
      { name: 'Systems', mastery: 82, status: 'done' },
      { name: 'Quadratics', mastery: 61, status: 'active' },
      { name: 'Functions', mastery: 0, status: 'locked' },
    ],
    color: '#a78bfa', weak: 1,
  },
]

const activity = [
  { text: 'Completed Differentiation test', score: '87%', time: '2 hours ago', icon: '📝' },
  { text: 'Studied Chain Rule', score: '45 min', time: '4 hours ago', icon: '📖' },
  { text: 'Streak milestone — 7 days!', score: '🔥', time: 'Yesterday', icon: '🏆' },
  { text: 'Completed Limits chapter', score: '92%', time: '2 days ago', icon: '✅' },
]

const xpLevels = [
  { name: 'Beginner', min: 0, max: 500 },
  { name: 'Apprentice', min: 500, max: 1500 },
  { name: 'Scholar', min: 1500, max: 3000 },
  { name: 'Master', min: 3000, max: 5000 },
]

function getMasteryColor(mastery) {
  if (mastery >= 80) return '#c8f75a'
  if (mastery >= 60) return '#f0a840'
  if (mastery >= 40) return '#f97316'
  return '#f43f5e'
}

function getCountdownColor(days) {
  if (days > 60) return '#c8f75a'
  if (days > 30) return '#f0a840'
  return '#f43f5e'
}

export default function Dashboard() {
  const [dark, setDark] = useState(true)
  const [xp] = useState(820)
  const [streak] = useState(7)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [weakPopup, setWeakPopup] = useState(null)
  const [toast, setToast] = useState(null)
  const [quote] = useState(quotes[Math.floor(Math.random() * quotes.length)])

  const currentLevel = xpLevels.find(l => xp >= l.min && xp < l.max) || xpLevels[3]
  const xpProgress = ((xp - currentLevel.min) / (currentLevel.max - currentLevel.min)) * 100

  useEffect(() => {
    if (streak >= 7) {
      setTimeout(() => setToast(`🔥 ${streak} day streak! You're on a roll!`), 1000)
      setTimeout(() => setToast(null), 4000)
    }
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

  const currentPage = 'dashboard'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: bg, fontFamily: "'Syne',sans-serif", color: text, transition: 'all 0.3s' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes toastIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
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
        .chapter-row{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid ${border};cursor:pointer;transition:all 0.2s}
        .chapter-row:hover{padding-left:4px}
        .chapter-row:last-child{border-bottom:none}
        .progress-bar{height:4px;background:${bg3};border-radius:2px;overflow:hidden}
        .progress-fill{height:100%;border-radius:2px;transition:width 1s ease}
        .mono{font-family:'DM Mono',monospace}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:${bg}}
        ::-webkit-scrollbar-thumb{background:${border2};border-radius:2px}
        .fade{animation:fadeIn 0.6s cubic-bezier(0.16,1,0.3,1) forwards}
      `}</style>

      {/* TOAST */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', background: bg2, border: `1px solid ${border2}`, borderRadius: 8, padding: '0.75rem 1.5rem', fontSize: 14, color: text, zIndex: 1000, boxShadow: '0 8px 32px rgba(0,0,0,0.4)', animation: 'toastIn 0.4s ease forwards' }}>
          {toast}
        </div>
      )}

      {/* WEAK AREA POPUP */}
      {weakPopup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }} onClick={() => setWeakPopup(null)}>
          <div style={{ background: bg2, border: `1px solid ${border2}`, borderRadius: 16, padding: '2rem', maxWidth: 420, width: '100%', animation: 'fadeIn 0.3s ease forwards' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
              <span style={{ fontSize: 24 }}>⚠️</span>
              <div>
                <p style={{ fontSize: 16, fontWeight: 600, color: text }}>{weakPopup.name}</p>
                <p style={{ fontSize: 12, color: muted, fontFamily: "'DM Mono',monospace" }}>{weakPopup.mastery}% mastery</p>
              </div>
            </div>
            <div style={{ background: bg3, borderRadius: 8, padding: '1rem', marginBottom: '1rem' }}>
              <p style={{ fontSize: 13, color: muted, lineHeight: 1.7 }}>
                You need <strong style={{ color: accent }}>80% mastery</strong> to advance. Currently at <strong style={{ color: getMasteryColor(weakPopup.mastery) }}>{weakPopup.mastery}%</strong>.
              </p>
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: muted, fontFamily: "'DM Mono',monospace" }}>Progress to unlock</span>
                <span style={{ fontSize: 12, color: accent, fontFamily: "'DM Mono',monospace" }}>{weakPopup.mastery}/80%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(weakPopup.mastery / 80) * 100}%`, background: getMasteryColor(weakPopup.mastery) }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={() => { setWeakPopup(null); window.location.href = '/tutor' }}>Practice this topic →</button>
              <button className="btn-ghost" onClick={() => setWeakPopup(null)}>Later</button>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <div style={{ width: 220, background: sidebar, borderRight: `1px solid ${border}`, display: 'flex', flexDirection: 'column', padding: '1.5rem 1rem', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 10, transition: 'all 0.3s' }}>
        <a href="/" style={{ display: 'block', fontFamily: "'Instrument Serif',serif", fontSize: 20, color: text, textDecoration: 'none', marginBottom: '2rem', padding: '0 4px' }}>
          Study<span style={{ color: accent }}>Notio</span>
        </a>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map(item => (
            <a key={item.id} href={item.href} className={`nav-item${currentPage === item.id ? ' active' : ''}`}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </div>

        {/* XP card */}
        <div style={{ background: bg3, border: `1px solid ${border}`, borderRadius: 8, padding: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: muted, fontFamily: "'DM Mono',monospace", letterSpacing: '0.06em' }}>{currentLevel.name.toUpperCase()}</span>
            <span style={{ fontSize: 11, color: accent, fontFamily: "'DM Mono',monospace" }}>{xp} XP</span>
          </div>
          <div className="progress-bar" style={{ marginBottom: 6 }}>
            <div className="progress-fill" style={{ width: `${xpProgress}%`, background: accent }} />
          </div>
          <p style={{ fontSize: 11, color: muted, fontFamily: "'DM Mono',monospace" }}>{xpLevels[xpLevels.indexOf(currentLevel) + 1]?.min - xp} XP to {xpLevels[xpLevels.indexOf(currentLevel) + 1]?.name}</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
          <a href="/profile" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#080808' }}>A</div>
            <span style={{ fontSize: 13, color: text, fontWeight: 500 }}>Aden</span>
          </a>
          <button onClick={() => setDark(!dark)} style={{ background: 'transparent', border: `1px solid ${border}`, borderRadius: 6, width: 30, height: 30, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', color: muted }}>
            {dark ? '☀' : '☾'}
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ marginLeft: 220, flex: 1, padding: '2rem 2.5rem', maxWidth: 'calc(100vw - 220px)', overflowX: 'hidden' }}>

        {/* HEADER */}
        <div className="fade" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <p style={{ fontSize: 12, color: muted, fontFamily: "'DM Mono',monospace", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: '2.2rem', fontWeight: 400, letterSpacing: '-0.02em', color: text, marginBottom: 4 }}>
              {getGreeting()}, Aden 👋
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
            { label: 'Active Plans', value: '2', sub: '1 due this week', icon: '📅', color: accent },
            { label: 'Chapters Done', value: '14', sub: 'This month', icon: '✅', color: '#a78bfa' },
            { label: 'Avg Mastery', value: '74%', sub: 'Across all topics', icon: '🧠', color: '#60d4f7' },
            { label: 'Tests Taken', value: '23', sub: '87% avg score', icon: '📝', color: '#f97316' },
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem' }}>

          {/* LEFT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* TODAY'S MISSION */}
            <div className="card fade" style={{ border: `1px solid rgba(200,247,90,0.2)`, background: d ? 'rgba(200,247,90,0.04)' : 'rgba(200,247,90,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
                <span style={{ fontSize: 16 }}>⚡</span>
                <span style={{ fontSize: 11, color: accent, fontFamily: "'DM Mono',monospace", letterSpacing: '0.1em', textTransform: 'uppercase' }}>Today's Mission</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: text, marginBottom: 4 }}>Complete Chain Rule · Chapter 4</h3>
                  <p style={{ fontSize: 13, color: muted }}>Integration & Differentiation · Estimated 25 mins · 45% mastery → target 80%</p>
                </div>
                <button className="btn-primary" style={{ whiteSpace: 'nowrap' }} onClick={() => window.location.href = '/tutor'}>Start session →</button>
              </div>
            </div>

            {/* ACTIVE PLANS */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: text }}>Active Study Plans</h2>
                <button className="btn-ghost" onClick={() => window.location.href = '/plan'}>View all</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {plans.map((plan, pi) => {
                  const daysLeft = getDaysUntil(plan.examDate)
                  return (
                    <div key={plan.id} className="card" style={{ animation: `fadeIn 0.6s ease ${pi * 0.1}s both` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: 8 }}>
                        <div>
                          <h3 style={{ fontSize: 15, fontWeight: 600, color: text, marginBottom: 4 }}>{plan.title}</h3>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 3, background: `${plan.color}18`, color: plan.color, border: `1px solid ${plan.color}30`, fontFamily: "'DM Mono',monospace" }}>{plan.exam}</span>
                            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 3, background: bg3, color: muted, border: `1px solid ${border}`, fontFamily: "'DM Mono',monospace" }}>Day {plan.day}/{plan.total}</span>
                            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 3, background: `${getCountdownColor(daysLeft)}18`, color: getCountdownColor(daysLeft), border: `1px solid ${getCountdownColor(daysLeft)}30`, fontFamily: "'DM Mono',monospace" }}>{daysLeft} days left</span>
                          </div>
                        </div>
                        <button className="btn-ghost" style={{ fontSize: 11 }} onClick={() => setSelectedPlan(selectedPlan === plan.id ? null : plan.id)}>
                          {selectedPlan === plan.id ? 'Hide ↑' : 'Chapters ↓'}
                        </button>
                      </div>

                      <div style={{ marginBottom: selectedPlan === plan.id ? '1rem' : 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ fontSize: 12, color: muted }}>Overall progress</span>
                          <span style={{ fontSize: 12, color: text, fontFamily: "'DM Mono',monospace" }}>{plan.progress}%</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${plan.progress}%`, background: plan.color }} />
                        </div>
                      </div>

                      {selectedPlan === plan.id && (
                        <div style={{ borderTop: `1px solid ${border}`, paddingTop: '1rem' }}>
                          <p style={{ fontSize: 11, color: muted, fontFamily: "'DM Mono',monospace", letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Chapters</p>
                          {plan.chapters_data.map((ch, ci) => (
                            <div key={ci} className="chapter-row" onClick={() => ch.mastery > 0 ? setWeakPopup(ch) : null}>
                              <div style={{ width: 8, height: 8, borderRadius: '50%', background: ch.status === 'done' ? accent : ch.status === 'active' ? '#60d4f7' : ch.status === 'warning' ? '#f97316' : border2, flexShrink: 0 }} />
                              <span style={{ flex: 1, fontSize: 13, color: ch.status === 'locked' ? muted : text }}>{ch.name}</span>
                              {ch.status === 'locked' && <span style={{ fontSize: 12 }}>🔒</span>}
                              {ch.status === 'warning' && <span style={{ fontSize: 11, color: '#f97316', fontFamily: "'DM Mono',monospace" }}>⚠ {ch.mastery}%</span>}
                              {ch.status === 'done' && <span style={{ fontSize: 11, color: accent, fontFamily: "'DM Mono',monospace" }}>✓ {ch.mastery}%</span>}
                              {ch.status === 'active' && <span style={{ fontSize: 11, color: '#60d4f7', fontFamily: "'DM Mono',monospace" }}>{ch.mastery}%</span>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* EXAM COUNTDOWNS */}
            <div className="card fade">
              <p style={{ fontSize: 11, color: muted, fontFamily: "'DM Mono',monospace", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>Exam Countdowns</p>
              {plans.map((plan, i) => {
                const days = getDaysUntil(plan.examDate)
                const color = getCountdownColor(days)
                return (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: i < plans.length - 1 ? `1px solid ${border}` : 'none' }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 500, color: text, marginBottom: 2 }}>{plan.exam}</p>
                      <p style={{ fontSize: 11, color: muted, fontFamily: "'DM Mono',monospace" }}>{new Date(plan.examDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 22, fontWeight: 700, color, fontFamily: "'Instrument Serif',serif", lineHeight: 1 }}>{days}</p>
                      <p style={{ fontSize: 10, color: muted, fontFamily: "'DM Mono',monospace" }}>DAYS LEFT</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* WEAK AREAS */}
            <div className="card fade">
              <p style={{ fontSize: 11, color: muted, fontFamily: "'DM Mono',monospace", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>Needs Attention ⚠️</p>
              {plans.flatMap(p => p.chapters_data.filter(c => c.mastery > 0 && c.mastery < 80)).map((ch, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.75rem', background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.15)', borderRadius: 8, marginBottom: 8, cursor: 'pointer', transition: 'all 0.2s' }}
                  onClick={() => setWeakPopup(ch)}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(249,115,22,0.1)'}
                  onMouseOut={e => e.currentTarget.style.background = 'rgba(249,115,22,0.06)'}
                >
                  <span style={{ fontSize: 16 }}>⚠️</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: text, marginBottom: 2 }}>{ch.name}</p>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${(ch.mastery / 80) * 100}%`, background: getMasteryColor(ch.mastery) }} />
                    </div>
                  </div>
                  <span style={{ fontSize: 11, color: getMasteryColor(ch.mastery), fontFamily: "'DM Mono',monospace" }}>{ch.mastery}%</span>
                </div>
              ))}
              <p style={{ fontSize: 11, color: muted, textAlign: 'center', marginTop: 4 }}>Click any topic to practice</p>
            </div>

            {/* RECENT ACTIVITY */}
            <div className="card fade">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <p style={{ fontSize: 11, color: muted, fontFamily: "'DM Mono',monospace", letterSpacing: '0.08em', textTransform: 'uppercase' }}>Recent Activity</p>
                <button className="btn-ghost" style={{ fontSize: 10 }} onClick={() => window.location.href = '/progress'}>View all</button>
              </div>
              {activity.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '0.6rem 0', borderBottom: i < activity.length - 1 ? `1px solid ${border}` : 'none' }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{a.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, color: text, marginBottom: 2 }}>{a.text}</p>
                    <p style={{ fontSize: 11, color: muted, fontFamily: "'DM Mono',monospace" }}>{a.time}</p>
                  </div>
                  <span style={{ fontSize: 11, color: accent, fontFamily: "'DM Mono',monospace", whiteSpace: 'nowrap' }}>{a.score}</span>
                </div>
              ))}
            </div>
          </div>
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