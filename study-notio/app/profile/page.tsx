'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const xpLevels = [
  { name: 'Beginner', min: 0, max: 500 },
  { name: 'Apprentice', min: 500, max: 1500 },
  { name: 'Scholar', min: 1500, max: 3000 },
  { name: 'Master', min: 3000, max: 5000 },
]

const rarityColors = {
  Common: { bg: 'rgba(255,255,255,0.06)', text: '#9a9690', border: 'rgba(255,255,255,0.1)' },
  Uncommon: { bg: 'rgba(96,212,247,0.08)', text: '#60d4f7', border: 'rgba(96,212,247,0.2)' },
  Rare: { bg: 'rgba(167,139,250,0.08)', text: '#a78bfa', border: 'rgba(167,139,250,0.2)' },
  Epic: { bg: 'rgba(240,168,64,0.08)', text: '#f0a840', border: 'rgba(240,168,64,0.2)' },
  Legendary: { bg: 'rgba(244,63,94,0.08)', text: '#f43f5e', border: 'rgba(244,63,94,0.2)' },
}

const allBadges = [
  { id: 1, icon: '🔥', name: '7-Day Streak', desc: 'Studied 7 days in a row', rarity: 'Common', req: 'streak_7' },
  { id: 2, icon: '🎯', name: 'First Chapter', desc: 'Completed your first chapter', rarity: 'Common', req: 'first_chapter' },
  { id: 3, icon: '⚡', name: 'Speed Learner', desc: 'Completed a chapter in under 2 days', rarity: 'Rare', req: 'speed_learner' },
  { id: 4, icon: '🧠', name: 'Master Mind', desc: 'Achieved 90%+ mastery on a chapter', rarity: 'Rare', req: 'mastery_90' },
  { id: 5, icon: '📚', name: 'Bookworm', desc: 'Uploaded 5 different chapters', rarity: 'Uncommon', req: 'upload_5' },
  { id: 6, icon: '🏆', name: 'Top 10', desc: 'Reach top 10 on the leaderboard', rarity: 'Epic', req: 'top_10' },
  { id: 7, icon: '💎', name: 'Scholar', desc: 'Reach Scholar level', rarity: 'Epic', req: 'level_scholar' },
  { id: 8, icon: '👑', name: 'Grand Master', desc: 'Reach Master level', rarity: 'Legendary', req: 'level_master' },
]

const examOptions = ['JEE Mains', 'JEE Advanced', 'SAT', 'ACT', 'A-Levels', 'CBSE Boards', 'IGCSE', 'IB Maths', 'AP Calculus', 'GCSE']

export default function Profile() {
  const [dark, setDark] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [form, setForm] = useState({ full_name: '', username: '', bio: '', location: '', exam_goals: [] })

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/auth/login'; return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
      setForm({
        full_name: data?.full_name || '',
        username: data?.username || '',
        bio: data?.bio || '',
        location: data?.location || '',
        exam_goals: data?.exam_goals || [],
      })
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('profiles').update({
      full_name: form.full_name,
      bio: form.bio,
      location: form.location,
      exam_goals: form.exam_goals,
      ...(profile?.is_pro ? { username: form.username } : {}),
    }).eq('id', user.id)

    if (error) {
      setSaveMsg('Error saving. Try again.')
    } else {
      setProfile({ ...profile, ...form })
      setSaveMsg('Saved!')
      setEditing(false)
    }
    setSaving(false)
    setTimeout(() => setSaveMsg(''), 3000)
  }

  const toggleExam = (exam) => {
    setForm(f => ({
      ...f,
      exam_goals: f.exam_goals.includes(exam)
        ? f.exam_goals.filter(e => e !== exam)
        : [...f.exam_goals, exam]
    }))
  }

  const xp = profile?.xp || 0
  const streak = profile?.streak || 0
  const firstName = profile?.full_name?.split(' ')[0] || 'there'
  const currentLevel = xpLevels.find(l => xp >= l.min && xp < l.max) || xpLevels[0]
  const nextLevel = xpLevels[xpLevels.indexOf(currentLevel) + 1]
  const xpProgress = ((xp - currentLevel.min) / (currentLevel.max - currentLevel.min)) * 100

  const earnedBadges = allBadges.filter(b => {
    if (b.req === 'streak_7') return streak >= 7
    if (b.req === 'level_scholar') return xp >= 1500
    if (b.req === 'level_master') return xp >= 3000
    return false
  })

  const d = dark
  const bg = d ? '#080808' : '#f9f8f5'
  const bg2 = d ? '#111111' : '#ffffff'
  const bg3 = d ? '#161616' : '#f2f1ed'
  const text = d ? '#ede9e3' : '#141210'
  const muted = d ? '#6b6860' : '#8a8680'
  const border = d ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)'
  const border2 = d ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.14)'
  const accent = '#c8f75a'

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#6b6860', fontFamily: "'DM Mono',monospace", fontSize: 13, letterSpacing: '0.06em' }}>LOADING...</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: "'Syne',sans-serif", color: text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        .card{background:${bg2};border:1px solid ${border};border-radius:12px;padding:1.25rem;transition:border-color 0.2s}
        .card:hover{border-color:${border2}}
        .tab-btn{padding:8px 20px;border-radius:8px;border:none;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.2s;font-family:'DM Mono',monospace;letter-spacing:0.06em;text-transform:uppercase}
        .tab-active{background:${bg2};color:${text};box-shadow:0 1px 4px rgba(0,0,0,0.2)}
        .tab-inactive{background:transparent;color:${muted}}
        .btn-main{background:#c8f75a;color:#080808;border:none;border-radius:8px;padding:0.7rem 1.5rem;font-size:12px;font-weight:700;cursor:pointer;font-family:'Syne',sans-serif;letter-spacing:0.06em;text-transform:uppercase;transition:all 0.2s}
        .btn-main:hover{background:#d4f96e;transform:translateY(-1px)}
        .btn-ghost{background:transparent;color:${text};border:1px solid ${border};border-radius:8px;padding:0.7rem 1.25rem;font-size:12px;cursor:pointer;font-family:'Syne',sans-serif;transition:all 0.2s}
        .btn-ghost:hover{border-color:${border2};background:${bg3}}
        .edit-input{width:100%;background:${bg3};border:1px solid ${border};border-radius:6px;padding:0.7rem 1rem;font-size:14px;color:${text};font-family:'Syne',sans-serif;outline:none;transition:border-color 0.2s}
        .edit-input:focus{border-color:rgba(200,247,90,0.4)}
        .exam-chip{padding:6px 14px;border-radius:999px;border:1px solid ${border};background:transparent;color:${muted};font-family:'Syne',sans-serif;font-size:12px;cursor:pointer;transition:all 0.2s}
        .exam-chip.selected{border-color:#c8f75a;background:rgba(200,247,90,0.08);color:#c8f75a}
        .pro-lock{position:relative;cursor:not-allowed;opacity:0.6}
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

      {/* BANNER */}
      <div style={{ position: 'relative', marginBottom: '5rem' }}>
        <div style={{ height: 180, background: `linear-gradient(135deg, rgba(200,247,90,0.15) 0%, rgba(167,139,250,0.1) 50%, rgba(96,212,247,0.1) 100%)`, borderBottom: `1px solid ${border}`, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          {!profile?.is_pro && (
            <div style={{ position: 'absolute', top: '1rem', right: '1.5rem', background: 'rgba(200,247,90,0.1)', border: '1px solid rgba(200,247,90,0.2)', borderRadius: 100, padding: '4px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 10 }}>⭐</span>
              <span style={{ fontSize: 11, color: accent, fontFamily: "'DM Mono',monospace", letterSpacing: '0.06em' }}>CUSTOM BANNER — PRO</span>
            </div>
          )}
        </div>
        <div style={{ position: 'absolute', bottom: -48, left: '2.5rem' }}>
          <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'linear-gradient(135deg, #c8f75a, #a8e840)', border: `4px solid ${bg}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 700, color: '#080808', fontFamily: "'Instrument Serif',serif" }}>
            {firstName[0]?.toUpperCase()}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2.5rem 4rem' }}>

        {/* USER INFO */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem', animation: 'fadeUp 0.5s ease both' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: '2rem', fontWeight: 400, color: text, letterSpacing: '-0.02em' }}>{profile?.full_name || firstName}</h1>
              <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 100, background: 'rgba(200,247,90,0.12)', color: accent, border: '1px solid rgba(200,247,90,0.25)', fontFamily: "'DM Mono',monospace" }}>{currentLevel.name}</span>
            </div>
            {profile?.username && <p style={{ fontSize: 13, color: muted, fontFamily: "'DM Mono',monospace', marginBottom: 4" }}>@{profile.username}</p>}
            {profile?.bio && <p style={{ fontSize: 14, color: muted, marginBottom: 4 }}>{profile.bio}</p>}
            <p style={{ fontSize: 13, color: muted }}>
              {profile?.location && `📍 ${profile.location} · `}
              {profile?.exam_goals?.length > 0 && `Studying ${profile.exam_goals.join(', ')}`}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {saveMsg && <span style={{ fontSize: 12, color: accent, fontFamily: "'DM Mono',monospace" }}>{saveMsg}</span>}
            <button className="btn-main" onClick={() => setEditing(!editing)}>
              {editing ? 'Cancel' : '✏ Edit profile'}
            </button>
          </div>
        </div>

        {/* EDIT FORM */}
        {editing && (
          <div className="card" style={{ marginBottom: '2rem', animation: 'fadeUp 0.3s ease' }}>
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Edit Profile</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: 11, color: muted, fontFamily: "'DM Mono',monospace", letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Full name</label>
                <input className="edit-input" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} placeholder="Your name" />
              </div>
              <div style={{ position: 'relative' }}>
                <label style={{ fontSize: 11, color: muted, fontFamily: "'DM Mono',monospace", letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                  Username {!profile?.is_pro && <span style={{ color: accent }}>⭐ PRO</span>}
                </label>
                <input className="edit-input" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} placeholder="@username" disabled={!profile?.is_pro} style={{ opacity: profile?.is_pro ? 1 : 0.5, cursor: profile?.is_pro ? 'text' : 'not-allowed' }} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: muted, fontFamily: "'DM Mono',monospace", letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Bio</label>
                <input className="edit-input" value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Tell us about yourself" />
              </div>
              <div>
                <label style={{ fontSize: 11, color: muted, fontFamily: "'DM Mono',monospace", letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Location</label>
                <input className="edit-input" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="City, Country" />
              </div>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: 11, color: muted, fontFamily: "'DM Mono',monospace", letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>Exam goals</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {examOptions.map(exam => (
                  <button key={exam} className={`exam-chip${form.exam_goals.includes(exam) ? ' selected' : ''}`} onClick={() => toggleExam(exam)}>{exam}</button>
                ))}
              </div>
            </div>
            <button className="btn-main" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save changes →'}
            </button>
          </div>
        )}

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'XP', value: xp, color: accent },
            { label: 'Streak', value: `🔥 ${streak}`, color: '#f97316' },
            { label: 'Badges', value: `${earnedBadges.length}/${allBadges.length}`, color: '#f0a840' },
            { label: 'Level', value: currentLevel.name, color: '#a78bfa' },
          ].map((s, i) => (
            <div key={i} className="card" style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 22, fontWeight: 700, color: s.color, fontFamily: "'Instrument Serif',serif", marginBottom: 2 }}>{s.value}</p>
              <p style={{ fontSize: 11, color: muted, fontFamily: "'DM Mono',monospace", letterSpacing: '0.04em', textTransform: 'uppercase' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* XP BAR */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: text }}>{currentLevel.name} · {xp} XP</span>
            {nextLevel && <span style={{ fontSize: 12, color: muted, fontFamily: "'DM Mono',monospace" }}>{nextLevel.min - xp} XP to {nextLevel.name}</span>}
          </div>
          <div style={{ height: 8, background: bg3, borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 4, background: `linear-gradient(90deg, ${accent}, #a8e840)`, width: `${xpProgress}%`, transition: 'width 1s ease' }} />
          </div>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: 4, background: bg3, border: `1px solid ${border}`, borderRadius: 10, padding: 4, marginBottom: '2rem', width: 'fit-content' }}>
          {['overview', 'badges'].map(tab => (
            <button key={tab} className={`tab-btn ${activeTab === tab ? 'tab-active' : 'tab-inactive'}`} onClick={() => setActiveTab(tab)}>
              {tab}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <div className="card">
              <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Your Stats</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: bg3, borderRadius: 8 }}>
                  <span style={{ fontSize: 14, color: text }}>Current level</span>
                  <span style={{ fontSize: 14, color: accent, fontFamily: "'DM Mono',monospace" }}>{currentLevel.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: bg3, borderRadius: 8 }}>
                  <span style={{ fontSize: 14, color: text }}>Total XP earned</span>
                  <span style={{ fontSize: 14, color: accent, fontFamily: "'DM Mono',monospace" }}>{xp} XP</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: bg3, borderRadius: 8 }}>
                  <span style={{ fontSize: 14, color: text }}>Current streak</span>
                  <span style={{ fontSize: 14, color: '#f97316', fontFamily: "'DM Mono',monospace" }}>🔥 {streak} days</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: bg3, borderRadius: 8 }}>
                  <span style={{ fontSize: 14, color: text }}>Badges earned</span>
                  <span style={{ fontSize: 14, color: '#f0a840', fontFamily: "'DM Mono',monospace" }}>{earnedBadges.length} / {allBadges.length}</span>
                </div>
                {profile?.exam_goals?.length > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: bg3, borderRadius: 8 }}>
                    <span style={{ fontSize: 14, color: text }}>Studying for</span>
                    <span style={{ fontSize: 14, color: muted, fontFamily: "'DM Mono',monospace" }}>{profile.exam_goals.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* BADGES */}
        {activeTab === 'badges' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', animation: 'fadeIn 0.4s ease' }}>
            {allBadges.map((badge, i) => {
              const earned = earnedBadges.find(b => b.id === badge.id)
              return (
                <div key={i} style={{ background: earned ? rarityColors[badge.rarity].bg : bg2, border: `1px solid ${earned ? rarityColors[badge.rarity].border : border}`, borderRadius: 12, padding: '1rem', opacity: earned ? 1 : 0.5, transition: 'all 0.2s' }}>
                  <div style={{ fontSize: 36, marginBottom: '0.75rem', filter: earned ? 'none' : 'grayscale(1)' }}>{badge.icon}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: earned ? text : muted }}>{badge.name}</p>
                    <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 3, background: rarityColors[badge.rarity].bg, color: rarityColors[badge.rarity].text, border: `1px solid ${rarityColors[badge.rarity].border}`, fontFamily: "'DM Mono',monospace", letterSpacing: '0.04em' }}>{badge.rarity}</span>
                  </div>
                  <p style={{ fontSize: 12, color: muted, lineHeight: 1.5 }}>{badge.desc}</p>
                  {!earned && <p style={{ fontSize: 11, color: muted, fontFamily: "'DM Mono',monospace", marginTop: 8 }}>🔒 NOT EARNED YET</p>}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}