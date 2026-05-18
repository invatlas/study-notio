'use client'
import { useState } from 'react'

const badges = [
  { id: 1, icon: '🔥', name: '7-Day Streak', desc: 'Studied 7 days in a row', earned: true, rarity: 'Common' },
  { id: 2, icon: '🎯', name: 'First Chapter', desc: 'Completed your first chapter', earned: true, rarity: 'Common' },
  { id: 3, icon: '⚡', name: 'Speed Learner', desc: 'Completed a chapter in under 2 days', earned: true, rarity: 'Rare' },
  { id: 4, icon: '🧠', name: 'Master Mind', desc: 'Achieved 90%+ mastery on a chapter', earned: true, rarity: 'Rare' },
  { id: 5, icon: '📚', name: 'Bookworm', desc: 'Uploaded 5 different chapters', earned: false, rarity: 'Uncommon' },
  { id: 6, icon: '🏆', name: 'Top 10', desc: 'Reach top 10 on the leaderboard', earned: false, rarity: 'Epic' },
  { id: 7, icon: '💎', name: 'Scholar', desc: 'Reach Scholar level', earned: false, rarity: 'Epic' },
  { id: 8, icon: '👑', name: 'Grand Master', desc: 'Reach Master level and top 3', earned: false, rarity: 'Legendary' },
]

const leaderboard = [
  { rank: 1, name: 'Arjun K.', xp: 4820, level: 'Master', streak: 34, avatar: 'A', color: '#f0a840' },
  { rank: 2, name: 'Priya S.', xp: 4210, level: 'Master', streak: 28, avatar: 'P', color: '#a78bfa' },
  { rank: 3, name: 'Rohan M.', xp: 3890, level: 'Scholar', streak: 21, avatar: 'R', color: '#60d4f7' },
  { rank: 4, name: 'Aden', xp: 820, level: 'Apprentice', streak: 7, avatar: 'A', color: '#c8f75a', isUser: true },
  { rank: 5, name: 'Meera T.', xp: 740, level: 'Apprentice', streak: 5, avatar: 'M', color: '#f43f5e' },
  { rank: 6, name: 'Karan P.', xp: 620, level: 'Beginner', streak: 3, avatar: 'K', color: '#f0a840' },
  { rank: 7, name: 'Sneha R.', xp: 480, level: 'Beginner', streak: 2, avatar: 'S', color: '#a78bfa' },
]

const history = [
  { chapter: 'Limits & Continuity', plan: 'Integration & Diff.', score: 92, date: '2 days ago', time: '47 min', status: 'mastered' },
  { chapter: 'First Principles', plan: 'Integration & Diff.', score: 88, date: '3 days ago', time: '38 min', status: 'mastered' },
  { chapter: 'Linear Equations', plan: 'SAT Math Algebra', score: 95, date: '5 days ago', time: '32 min', status: 'mastered' },
  { chapter: 'Systems of Equations', plan: 'SAT Math Algebra', score: 82, date: '6 days ago', time: '55 min', status: 'mastered' },
  { chapter: 'Quadratics', plan: 'SAT Math Algebra', score: 61, date: '1 week ago', time: '1h 10min', status: 'needs-work' },
]

const rarityColors = {
  Common: { bg: 'rgba(255,255,255,0.06)', text: '#9a9690', border: 'rgba(255,255,255,0.1)' },
  Uncommon: { bg: 'rgba(96,212,247,0.08)', text: '#60d4f7', border: 'rgba(96,212,247,0.2)' },
  Rare: { bg: 'rgba(167,139,250,0.08)', text: '#a78bfa', border: 'rgba(167,139,250,0.2)' },
  Epic: { bg: 'rgba(240,168,64,0.08)', text: '#f0a840', border: 'rgba(240,168,64,0.2)' },
  Legendary: { bg: 'rgba(244,63,94,0.08)', text: '#f43f5e', border: 'rgba(244,63,94,0.2)' },
}

const xpLevels = [
  { name: 'Beginner', min: 0, max: 500 },
  { name: 'Apprentice', min: 500, max: 1500 },
  { name: 'Scholar', min: 1500, max: 3000 },
  { name: 'Master', min: 3000, max: 5000 },
]

export default function Profile() {
  const [dark, setDark] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [hoveredBadge, setHoveredBadge] = useState(null)

  const xp = 820
  const currentLevel = xpLevels.find(l => xp >= l.min && xp < l.max) || xpLevels[3]
  const xpProgress = ((xp - currentLevel.min) / (currentLevel.max - currentLevel.min)) * 100
  const nextLevel = xpLevels[xpLevels.indexOf(currentLevel) + 1]

  const d = dark
  const bg = d ? '#080808' : '#f9f8f5'
  const bg2 = d ? '#111111' : '#ffffff'
  const bg3 = d ? '#161616' : '#f2f1ed'
  const text = d ? '#ede9e3' : '#141210'
  const muted = d ? '#6b6860' : '#8a8680'
  const border = d ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)'
  const border2 = d ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.14)'
  const accent = '#c8f75a'

  const tabs = ['overview', 'badges', 'leaderboard', 'history']

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: "'Syne',sans-serif", color: text, transition: 'all 0.3s' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
        @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
        .card{background:${bg2};border:1px solid ${border};border-radius:12px;padding:1.25rem;transition:border-color 0.2s}
        .card:hover{border-color:${border2}}
        .tab-btn{padding:8px 20px;border-radius:8px;border:none;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.2s;font-family:'DM Mono',monospace;letter-spacing:0.06em;text-transform:uppercase}
        .tab-active{background:${bg2};color:${text};box-shadow:0 1px 4px rgba(0,0,0,0.2)}
        .tab-inactive{background:transparent;color:${muted}}
        .btn-main{background:#c8f75a;color:#080808;border:none;border-radius:8px;padding:0.7rem 1.5rem;font-size:12px;font-weight:700;cursor:pointer;font-family:'Syne',sans-serif;letter-spacing:0.06em;text-transform:uppercase;transition:all 0.2s}
        .btn-main:hover{background:#d4f96e;transform:translateY(-1px)}
        .btn-ghost{background:transparent;color:${text};border:1px solid ${border};border-radius:8px;padding:0.7rem 1.25rem;font-size:12px;cursor:pointer;font-family:'Syne',sans-serif;transition:all 0.2s}
        .btn-ghost:hover{border-color:${border2};background:${bg3}}
        .badge-card{border-radius:12px;padding:1rem;transition:all 0.3s;cursor:pointer;position:relative}
        .badge-card:hover{transform:translateY(-4px)}
        .lb-row{display:flex;align-items:center;gap:1rem;padding:0.75rem 1rem;border-radius:10px;transition:all 0.2s}
        .lb-row:hover{background:${bg3}}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:${bg}}
        ::-webkit-scrollbar-thumb{background:${border2};border-radius:2px}
      `}</style>

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: d ? 'rgba(8,8,8,0.92)' : 'rgba(249,248,245,0.92)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${border}`, padding: '0 2.5rem', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <a href="/dashboard" style={{ fontFamily: "'Instrument Serif',serif", fontSize: 20, color: text, textDecoration: 'none' }}>Study<span style={{ color: accent }}>Notio</span></a>
          <span style={{ color: border2, fontSize: 18 }}>›</span>
          <span style={{ fontSize: 13, color: muted }}>Profile</span>
        </div>
        <button onClick={() => setDark(!dark)} style={{ background: 'transparent', border: `1px solid ${border}`, borderRadius: 6, width: 32, height: 32, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', color: muted }}>
          {dark ? '☀' : '☾'}
        </button>
      </nav>

      {/* BANNER + PROFILE */}
      <div style={{ position: 'relative', marginBottom: '5rem' }}>
        {/* banner */}
        <div style={{ height: 180, background: `linear-gradient(135deg, rgba(200,247,90,0.15) 0%, rgba(167,139,250,0.1) 50%, rgba(96,212,247,0.1) 100%)`, borderBottom: `1px solid ${border}`, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          {/* pro badge */}
          <div style={{ position: 'absolute', top: '1rem', right: '1.5rem', background: 'rgba(200,247,90,0.15)', border: '1px solid rgba(200,247,90,0.3)', borderRadius: 100, padding: '4px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 10 }}>⭐</span>
            <span style={{ fontSize: 11, color: accent, fontFamily: "'DM Mono',monospace", letterSpacing: '0.06em' }}>CUSTOMISE BANNER — PRO</span>
          </div>
        </div>

        {/* avatar */}
        <div style={{ position: 'absolute', bottom: -48, left: '2.5rem' }}>
          <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'linear-gradient(135deg, #c8f75a, #a8e840)', border: `4px solid ${bg}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 700, color: '#080808', fontFamily: "'Instrument Serif',serif", position: 'relative' }}>
            A
            <div style={{ position: 'absolute', bottom: 4, right: 4, width: 14, height: 14, borderRadius: '50%', background: '#22c55e', border: `2px solid ${bg}` }} />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2.5rem 4rem' }}>

        {/* USER INFO ROW */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem', animation: 'fadeUp 0.5s ease both' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: '2rem', fontWeight: 400, color: text, letterSpacing: '-0.02em' }}>Aden</h1>
              <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 100, background: 'rgba(200,247,90,0.12)', color: accent, border: '1px solid rgba(200,247,90,0.25)', fontFamily: "'DM Mono',monospace", letterSpacing: '0.04em' }}>{currentLevel.name}</span>
              <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 100, background: bg3, color: muted, border: `1px solid ${border}`, fontFamily: "'DM Mono',monospace" }}>Rank #4</span>
            </div>
            <p style={{ fontSize: 13, color: muted }}>Studying JEE Mains & SAT · Kerala, India · Joined May 2026</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-ghost">Share profile</button>
            <button className="btn-main">✏ Edit profile</button>
          </div>
        </div>

        {/* STATS ROW */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem', animation: 'fadeUp 0.5s ease 0.05s both' }}>
          {[
            { label: 'XP', value: '820', icon: '⚡', color: accent },
            { label: 'Streak', value: '🔥 7', icon: '', color: '#f97316' },
            { label: 'Chapters', value: '14', icon: '📚', color: '#60d4f7' },
            { label: 'Avg Score', value: '84%', icon: '🎯', color: '#a78bfa' },
            { label: 'Badges', value: '4/8', icon: '🏅', color: '#f0a840' },
          ].map((s, i) => (
            <div key={i} className="card" style={{ textAlign: 'center', animation: `fadeUp 0.4s ease ${i * 0.06}s both` }}>
              <p style={{ fontSize: 22, fontWeight: 700, color: s.color, fontFamily: "'Instrument Serif',serif", marginBottom: 2 }}>{s.value}</p>
              <p style={{ fontSize: 11, color: muted, fontFamily: "'DM Mono',monospace", letterSpacing: '0.04em', textTransform: 'uppercase' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* XP BAR */}
        <div className="card" style={{ marginBottom: '2rem', animation: 'fadeUp 0.5s ease 0.1s both' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: text }}>{currentLevel.name}</span>
              <span style={{ fontSize: 12, color: muted, fontFamily: "'DM Mono',monospace" }}>{xp} XP</span>
            </div>
            {nextLevel && <span style={{ fontSize: 12, color: muted, fontFamily: "'DM Mono',monospace" }}>{nextLevel.name} at {nextLevel.min} XP · {nextLevel.min - xp} to go</span>}
          </div>
          <div style={{ height: 8, background: bg3, borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 4, background: `linear-gradient(90deg, ${accent}, #a8e840)`, width: `${xpProgress}%`, transition: 'width 1s ease', boxShadow: `0 0 12px rgba(200,247,90,0.3)` }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            {xpLevels.map((level, i) => (
              <span key={i} style={{ fontSize: 10, color: xp >= level.min ? accent : muted, fontFamily: "'DM Mono',monospace", letterSpacing: '0.04em' }}>{level.name}</span>
            ))}
          </div>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: 4, background: bg3, border: `1px solid ${border}`, borderRadius: 10, padding: 4, marginBottom: '2rem', width: 'fit-content', animation: 'fadeUp 0.5s ease 0.15s both' }}>
          {tabs.map(tab => (
            <button key={tab} className={`tab-btn ${activeTab === tab ? 'tab-active' : 'tab-inactive'}`} onClick={() => setActiveTab(tab)}>
              {tab}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', animation: 'fadeIn 0.4s ease' }}>
            <div className="card">
              <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Active Plans</p>
              {[
                { name: 'Integration & Differentiation', progress: 28, exam: 'JEE', color: accent },
                { name: 'SAT Math — Algebra', progress: 55, exam: 'SAT', color: '#a78bfa' },
              ].map((plan, i) => (
                <div key={i} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: text }}>{plan.name}</span>
                    <span style={{ fontSize: 12, color: plan.color, fontFamily: "'DM Mono',monospace" }}>{plan.progress}%</span>
                  </div>
                  <div style={{ height: 4, background: bg3, borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 2, background: plan.color, width: `${plan.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="card">
              <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Recent Badges</p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {badges.filter(b => b.earned).map((badge, i) => (
                  <div key={i} style={{ width: 52, height: 52, borderRadius: 12, background: rarityColors[badge.rarity].bg, border: `1px solid ${rarityColors[badge.rarity].border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, cursor: 'pointer', transition: 'transform 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    title={badge.name}>
                    {badge.icon}
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ gridColumn: '1 / -1' }}>
              <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Study Activity — Last 30 Days</p>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {Array.from({ length: 30 }, (_, i) => {
                  const intensity = Math.random()
                  const active = intensity > 0.3
                  return (
                    <div key={i} style={{ width: 20, height: 20, borderRadius: 4, background: active ? `rgba(200,247,90,${0.2 + intensity * 0.6})` : bg3, border: `1px solid ${active ? 'rgba(200,247,90,0.2)' : border}`, cursor: 'default', transition: 'transform 0.1s' }}
                      onMouseOver={e => e.currentTarget.style.transform = 'scale(1.2)'}
                      onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                      title={`Day ${i + 1}`}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* BADGES TAB */}
        {activeTab === 'badges' && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {badges.map((badge, i) => (
                <div key={i} className="badge-card"
                  style={{ background: badge.earned ? rarityColors[badge.rarity].bg : bg2, border: `1px solid ${badge.earned ? rarityColors[badge.rarity].border : border}`, opacity: badge.earned ? 1 : 0.5, animation: `fadeUp 0.4s ease ${i * 0.06}s both` }}
                  onMouseOver={() => setHoveredBadge(badge.id)}
                  onMouseOut={() => setHoveredBadge(null)}
                >
                  <div style={{ fontSize: 36, marginBottom: '0.75rem', filter: badge.earned ? 'none' : 'grayscale(1)' }}>{badge.icon}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: badge.earned ? text : muted }}>{badge.name}</p>
                    <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 3, background: rarityColors[badge.rarity].bg, color: rarityColors[badge.rarity].text, border: `1px solid ${rarityColors[badge.rarity].border}`, fontFamily: "'DM Mono',monospace", letterSpacing: '0.04em', flexShrink: 0, marginLeft: 4 }}>{badge.rarity}</span>
                  </div>
                  <p style={{ fontSize: 12, color: muted, lineHeight: 1.5 }}>{badge.desc}</p>
                  {!badge.earned && <p style={{ fontSize: 11, color: muted, fontFamily: "'DM Mono',monospace", marginTop: 8, letterSpacing: '0.04em' }}>🔒 NOT EARNED YET</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LEADERBOARD TAB */}
        {activeTab === 'leaderboard' && (
          <div style={{ animation: 'fadeIn 0.4s ease', maxWidth: 700 }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              {leaderboard.slice(0, 3).map((user, i) => (
                <div key={i} className="card" style={{ flex: 1, textAlign: 'center', border: i === 0 ? `2px solid #f0a840` : `1px solid ${border}`, animation: `fadeUp 0.4s ease ${i * 0.08}s both` }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{['🥇', '🥈', '🥉'][i]}</div>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: user.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#080808', margin: '0 auto 0.5rem' }}>{user.avatar}</div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: text, marginBottom: 2 }}>{user.name}</p>
                  <p style={{ fontSize: 12, color: user.color, fontFamily: "'DM Mono',monospace" }}>{user.xp} XP</p>
                  <p style={{ fontSize: 11, color: muted, marginTop: 2 }}>🔥 {user.streak} days</p>
                </div>
              ))}
            </div>

            <div className="card" style={{ padding: '0.5rem' }}>
              {leaderboard.map((user, i) => (
                <div key={i} className="lb-row" style={{ background: user.isUser ? 'rgba(200,247,90,0.05)' : 'transparent', border: user.isUser ? `1px solid rgba(200,247,90,0.2)` : '1px solid transparent', borderRadius: 10, animation: `fadeUp 0.3s ease ${i * 0.05}s both` }}>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, color: muted, width: 28, flexShrink: 0 }}>#{user.rank}</span>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: user.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#080808', flexShrink: 0 }}>{user.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: user.isUser ? 600 : 400, color: user.isUser ? accent : text }}>{user.name} {user.isUser && '(you)'}</p>
                    <p style={{ fontSize: 11, color: muted, fontFamily: "'DM Mono',monospace" }}>{user.level} · 🔥 {user.streak} day streak</p>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: user.isUser ? accent : text, fontFamily: "'DM Mono',monospace" }}>{user.xp} XP</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div style={{ animation: 'fadeIn 0.4s ease', maxWidth: 700 }}>
            <div className="card" style={{ padding: '0.5rem' }}>
              {history.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.9rem 0.75rem', borderBottom: i < history.length - 1 ? `1px solid ${border}` : 'none', animation: `fadeUp 0.3s ease ${i * 0.06}s both` }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: item.status === 'mastered' ? 'rgba(200,247,90,0.12)' : 'rgba(244,63,94,0.08)', border: `1px solid ${item.status === 'mastered' ? 'rgba(200,247,90,0.25)' : 'rgba(244,63,94,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                    {item.status === 'mastered' ? '✓' : '⚠'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: text, marginBottom: 2 }}>{item.chapter}</p>
                    <p style={{ fontSize: 11, color: muted, fontFamily: "'DM Mono',monospace" }}>{item.plan} · {item.time} · {item.date}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 18, fontWeight: 700, color: item.score >= 80 ? accent : '#f43f5e', fontFamily: "'Instrument Serif',serif" }}>{item.score}%</p>
                    <p style={{ fontSize: 10, color: muted, fontFamily: "'DM Mono',monospace" }}>{item.status === 'mastered' ? 'MASTERED' : 'NEEDS WORK'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}