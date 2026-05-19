'use client'
import { useState } from 'react'

const weekData = [4, 6, 3, 7, 5, 8, 6]
const monthGrid = Array.from({ length: 30 }, (_, i) => ({ day: i + 1, intensity: Math.random() > 0.3 ? Math.ceil(Math.random() * 4) : 0 }))

const subjects = [
  { name: 'Integration & Differentiation', exam: 'JEE', progress: 28, mastery: 74, chapters: 12, done: 3, color: '#c8f75a' },
  { name: 'SAT Math — Algebra', exam: 'SAT', progress: 55, mastery: 82, chapters: 8, done: 4, color: '#a78bfa' },
]

const weakAreas = [
  { topic: 'Chain Rule', mastery: 45, plan: 'Integration & Diff.', color: '#f97316' },
  { topic: 'Implicit Differentiation', mastery: 32, plan: 'Integration & Diff.', color: '#f43f5e' },
  { topic: 'Quadratic Functions', mastery: 61, plan: 'SAT Algebra', color: '#f0a840' },
]

const recentTests = [
  { chapter: 'Limits & Continuity', score: 92, date: '2 days ago', xp: 138, status: 'mastered' },
  { chapter: 'First Principles', score: 88, date: '3 days ago', xp: 120, status: 'mastered' },
  { chapter: 'Chain Rule', score: 45, date: '4 days ago', xp: 40, status: 'needs-work' },
  { chapter: 'Linear Equations', score: 95, date: '5 days ago', xp: 150, status: 'mastered' },
]

const xpLevels = [
  { name: 'Beginner', min: 0, max: 500 },
  { name: 'Apprentice', min: 500, max: 1500 },
  { name: 'Scholar', min: 1500, max: 3000 },
  { name: 'Master', min: 3000, max: 5000 },
]

export default function Progress() {
  const [dark, setDark] = useState(true)
  const [calView, setCalView] = useState('month')
  const xp = 820
  const streak = 7
  const currentLevel = xpLevels.find(l => xp >= l.min && xp < l.max)
  const nextLevel = xpLevels[xpLevels.indexOf(currentLevel) + 1]
  const xpProgress = ((xp - currentLevel.min) / (currentLevel.max - currentLevel.min)) * 100

  const d = dark
  const bg = d ? '#080808' : '#f9f8f5'
  const bg2 = d ? '#111111' : '#ffffff'
  const bg3 = d ? '#161616' : '#f2f1ed'
  const text = d ? '#ede9e3' : '#141210'
  const muted = d ? '#6b6860' : '#8a8680'
  const border = d ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)'
  const border2 = d ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.14)'
  const accent = '#c8f75a'

  const getMasteryColor = (m) => m >= 80 ? '#c8f75a' : m >= 60 ? '#f0a840' : '#f43f5e'
  const getIntensityColor = (i) => {
    if (i === 0) return d ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)'
    if (i === 1) return 'rgba(200,247,90,0.2)'
    if (i === 2) return 'rgba(200,247,90,0.4)'
    if (i === 3) return 'rgba(200,247,90,0.65)'
    return 'rgba(200,247,90,0.9)'
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: "'Syne',sans-serif", color: text, transition: 'all 0.3s' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
        .card{background:${bg2};border:1px solid ${border};border-radius:12px;padding:1.25rem;transition:border-color 0.2s}
        .card:hover{border-color:${border2}}
        .fade{animation:fadeUp 0.5s ease both}
        .cal-btn{padding:5px 12px;border-radius:6px;border:none;font-size:10px;font-weight:600;cursor:pointer;font-family:'DM Mono',monospace;letter-spacing:0.06em;text-transform:uppercase;transition:all 0.2s}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:${bg}}
        ::-webkit-scrollbar-thumb{background:${border2};border-radius:2px}
      `}</style>

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: d ? 'rgba(8,8,8,0.92)' : 'rgba(249,248,245,0.92)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${border}`, padding: '0 2.5rem', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a href="/dashboard" style={{ fontFamily: "'Instrument Serif',serif", fontSize: 20, color: text, textDecoration: 'none' }}>Study<span style={{ color: accent }}>Notio</span></a>
          <span style={{ color: border2 }}>›</span>
          <span style={{ fontSize: 13, color: muted }}>Progress</span>
        </div>
        <button onClick={() => setDark(!dark)} style={{ background: 'transparent', border: `1px solid ${border}`, borderRadius: 6, width: 32, height: 32, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', color: muted }}>
          {dark ? '☀' : '☾'}
        </button>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 2rem', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>

        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* HEADER */}
          <div className="fade">
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Your Progress</p>
            <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: '2.8rem', fontWeight: 400, color: text, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Keep going, <em style={{ color: accent }}>Aden.</em>
            </h1>
          </div>

          {/* STATS ROW */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {[
              { label: 'Day Streak', value: `🔥 ${streak}`, color: '#f97316', sub: 'Personal best: 12' },
              { label: 'Total XP', value: `⚡ ${xp}`, color: accent, sub: currentLevel.name },
              { label: 'Chapters Done', value: '14', color: '#60d4f7', sub: 'This month' },
              { label: 'Avg Score', value: '84%', color: '#a78bfa', sub: 'Last 10 tests' },
            ].map((s, i) => (
              <div key={i} className="card fade" style={{ animationDelay: `${i * 0.07}s` }}>
                <p style={{ fontSize: 22, fontWeight: 700, color: s.color, fontFamily: "'Instrument Serif',serif", marginBottom: 2 }}>{s.value}</p>
                <p style={{ fontSize: 11, color: muted, fontFamily: "'DM Mono',monospace", letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 2 }}>{s.label}</p>
                <p style={{ fontSize: 11, color: muted }}>{s.sub}</p>
              </div>
            ))}
          </div>

          {/* XP LEVEL BAR */}
          <div className="card fade">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: text }}>{currentLevel.name}</span>
                <span style={{ fontSize: 11, color: muted, fontFamily: "'DM Mono',monospace" }}>{xp} XP</span>
              </div>
              {nextLevel && <span style={{ fontSize: 11, color: muted, fontFamily: "'DM Mono',monospace" }}>{nextLevel.min - xp} XP to {nextLevel.name}</span>}
            </div>
            <div style={{ height: 8, background: bg3, borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
              <div style={{ height: '100%', borderRadius: 4, background: `linear-gradient(90deg, ${accent}, #a8e840)`, width: `${xpProgress}%`, transition: 'width 1s ease', boxShadow: `0 0 10px rgba(200,247,90,0.3)` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {xpLevels.map((l, i) => (
                <span key={i} style={{ fontSize: 10, color: xp >= l.min ? accent : muted, fontFamily: "'DM Mono',monospace", letterSpacing: '0.04em' }}>{l.name}</span>
              ))}
            </div>
          </div>

          {/* ACTIVITY CALENDAR */}
          <div className="card fade">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: text }}>Study Activity</h2>
              <div style={{ display: 'flex', gap: 4, background: bg3, border: `1px solid ${border}`, borderRadius: 8, padding: 3 }}>
                {[['week', 'Week'], ['month', 'Month']].map(([id, label]) => (
                  <button key={id} className="cal-btn" onClick={() => setCalView(id)}
                    style={{ background: calView === id ? bg2 : 'transparent', color: calView === id ? text : muted, boxShadow: calView === id ? '0 1px 3px rgba(0,0,0,0.2)' : 'none' }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {calView === 'week' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginBottom: '0.75rem' }}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                      <div style={{ height: `${20 + weekData[i] * 12}px`, borderRadius: 6, background: `rgba(200,247,90,${0.2 + weekData[i] * 0.1})`, marginBottom: 4, transition: 'height 0.5s ease' }} />
                      <p style={{ fontSize: 10, color: muted, fontFamily: "'DM Mono',monospace" }}>{day}</p>
                      <p style={{ fontSize: 11, color: accent, fontFamily: "'DM Mono',monospace', fontWeight: 600" }}>{weekData[i]}h</p>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 11, color: muted, textAlign: 'center', fontFamily: "'DM Mono',monospace" }}>Total this week: {weekData.reduce((a, b) => a + b, 0)} hours</p>
              </div>
            )}

            {calView === 'month' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                    <div key={i} style={{ textAlign: 'center', fontSize: 10, color: muted, fontFamily: "'DM Mono',monospace", padding: '4px 0' }}>{d}</div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
                  {monthGrid.map((day, i) => (
                    <div key={i} title={`Day ${day.day}: ${day.intensity > 0 ? `${day.intensity}h studied` : 'No study'}`}
                      style={{ aspectRatio: '1', borderRadius: 4, background: getIntensityColor(day.intensity), border: `1px solid ${day.intensity > 0 ? 'rgba(200,247,90,0.2)' : border}`, cursor: 'default', transition: 'transform 0.1s', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: day.intensity >= 3 ? '#080808' : muted, fontFamily: "'DM Mono',monospace" }}
                      onMouseOver={e => e.currentTarget.style.transform = 'scale(1.2)'}
                      onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    >{day.day}</div>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: '0.75rem', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: 10, color: muted, fontFamily: "'DM Mono',monospace" }}>Less</span>
                  {[0, 1, 2, 3, 4].map(i => (
                    <div key={i} style={{ width: 12, height: 12, borderRadius: 2, background: getIntensityColor(i) }} />
                  ))}
                  <span style={{ fontSize: 10, color: muted, fontFamily: "'DM Mono',monospace" }}>More</span>
                </div>
              </div>
            )}
          </div>

          {/* PLAN PROGRESS */}
          <div className="fade">
            <h2 style={{ fontSize: 15, fontWeight: 600, color: text, marginBottom: '1rem' }}>Plan Progress</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {subjects.map((sub, i) => (
                <div key={i} className="card" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 600, color: text, marginBottom: 4 }}>{sub.name}</p>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 3, background: `${sub.color}18`, color: sub.color, border: `1px solid ${sub.color}30`, fontFamily: "'DM Mono',monospace" }}>{sub.exam}</span>
                        <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 3, background: bg3, color: muted, border: `1px solid ${border}`, fontFamily: "'DM Mono',monospace" }}>{sub.done}/{sub.chapters} chapters</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 22, fontWeight: 700, color: sub.color, fontFamily: "'Instrument Serif',serif" }}>{sub.progress}%</p>
                      <p style={{ fontSize: 10, color: muted, fontFamily: "'DM Mono',monospace" }}>COMPLETE</p>
                    </div>
                  </div>
                  <div style={{ height: 6, background: bg3, borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
                    <div style={{ height: '100%', borderRadius: 3, background: sub.color, width: `${sub.progress}%`, transition: 'width 1s ease' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, color: muted }}>Avg mastery: <strong style={{ color: getMasteryColor(sub.mastery) }}>{sub.mastery}%</strong></span>
                    <span style={{ fontSize: 11, color: muted, fontFamily: "'DM Mono',monospace" }}>{sub.chapters - sub.done} chapters left</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RECENT TESTS */}
          <div className="fade">
            <h2 style={{ fontSize: 15, fontWeight: 600, color: text, marginBottom: '1rem' }}>Recent Tests</h2>
            <div className="card" style={{ padding: '0.5rem' }}>
              {recentTests.map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', borderBottom: i < recentTests.length - 1 ? `1px solid ${border}` : 'none' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: t.status === 'mastered' ? 'rgba(200,247,90,0.1)' : 'rgba(244,63,94,0.08)', border: `1px solid ${t.status === 'mastered' ? 'rgba(200,247,90,0.2)' : 'rgba(244,63,94,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                    {t.status === 'mastered' ? '✓' : '⚠'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: text, marginBottom: 2 }}>{t.chapter}</p>
                    <p style={{ fontSize: 11, color: muted, fontFamily: "'DM Mono',monospace" }}>{t.date} · +{t.xp} XP</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 18, fontWeight: 700, color: getMasteryColor(t.score), fontFamily: "'Instrument Serif',serif" }}>{t.score}%</p>
                    <p style={{ fontSize: 10, color: muted, fontFamily: "'DM Mono',monospace", letterSpacing: '0.04em' }}>{t.status === 'mastered' ? 'MASTERED' : 'NEEDS WORK'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ position: 'sticky', top: '80px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* STREAK CARD */}
          <div className="card fade" style={{ textAlign: 'center', border: `1px solid rgba(249,115,22,0.2)`, background: d ? 'rgba(249,115,22,0.03)' : 'rgba(249,115,22,0.03)' }}>
            <span style={{ fontSize: 40, display: 'block', marginBottom: '0.5rem', animation: 'pulse 2s ease-in-out infinite' }}>🔥</span>
            <p style={{ fontFamily: "'Instrument Serif',serif", fontSize: '3rem', fontWeight: 400, color: text, lineHeight: 1 }}>{streak}</p>
            <p style={{ fontSize: 11, color: muted, fontFamily: "'DM Mono',monospace", letterSpacing: '0.08em', marginBottom: '1rem' }}>DAY STREAK</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
              {Array.from({ length: 7 }, (_, i) => (
                <div key={i} style={{ height: 28, borderRadius: 4, background: i < streak % 7 || streak >= 7 ? `rgba(249,115,22,${0.3 + i * 0.08})` : bg3, border: `1px solid ${i < streak % 7 || streak >= 7 ? 'rgba(249,115,22,0.3)' : border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>
                  {(i < streak % 7 || streak >= 7) ? '✓' : ''}
                </div>
              ))}
            </div>
          </div>

          {/* WEAK AREAS */}
          <div className="card fade">
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Needs Attention ⚠️</p>
            {weakAreas.map((w, i) => (
              <div key={i} style={{ marginBottom: '0.75rem', padding: '0.75rem', background: bg3, borderRadius: 8, border: `1px solid ${border}`, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseOver={e => e.currentTarget.style.borderColor = w.color + '60'}
                onMouseOut={e => e.currentTarget.style.borderColor = border}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: text }}>{w.topic}</p>
                  <span style={{ fontSize: 12, color: getMasteryColor(w.mastery), fontFamily: "'DM Mono',monospace", fontWeight: 700 }}>{w.mastery}%</span>
                </div>
                <div style={{ height: 4, background: d ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 2, background: getMasteryColor(w.mastery), width: `${(w.mastery / 80) * 100}%` }} />
                </div>
                <p style={{ fontSize: 10, color: muted, fontFamily: "'DM Mono',monospace", marginTop: 4 }}>Need 80% to advance</p>
              </div>
            ))}
          </div>

          {/* ACHIEVEMENTS */}
          <div className="card fade">
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Recent Achievements</p>
            {[
              { icon: '🔥', text: '7-Day Streak', sub: 'Studied 7 days in a row', color: '#f97316' },
              { icon: '⚡', text: 'Speed Learner', sub: 'Chapter done in under 2 days', color: '#a78bfa' },
              { icon: '🧠', text: 'Master Mind', sub: '90%+ mastery on Limits', color: accent },
            ].map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '0.6rem 0', borderBottom: i < 2 ? `1px solid ${border}` : 'none' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${a.color}18`, border: `1px solid ${a.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{a.icon}</div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: text, marginBottom: 1 }}>{a.text}</p>
                  <p style={{ fontSize: 11, color: muted }}>{a.sub}</p>
                </div>
              </div>
            ))}
            <a href="/profile" style={{ display: 'block', textAlign: 'center', fontSize: 11, color: accent, fontFamily: "'DM Mono',monospace", letterSpacing: '0.06em', marginTop: '0.75rem', textDecoration: 'none' }}>VIEW ALL BADGES →</a>
          </div>
        </div>
      </div>
    </div>
  )
}