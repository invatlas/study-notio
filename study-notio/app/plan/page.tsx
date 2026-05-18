'use client'
import { useState } from 'react'

const CHAPTERS = [
  { id: 1, name: 'Limits & Continuity', days: 3, difficulty: 'Foundation', color: '#c8f75a', topics: ['Definition of Limits', 'One-sided Limits', 'Continuity Rules'], locked: false },
  { id: 2, name: 'First Principles', days: 2, difficulty: 'Beginner', color: '#60d4f7', topics: ['Delta-Epsilon Definition', 'Derivative from First Principles'], locked: false },
  { id: 3, name: 'Chain Rule', days: 4, difficulty: 'Intermediate', color: '#f0a840', topics: ['Composite Functions', 'Chain Rule Formula', 'Applications'], locked: false },
  { id: 4, name: 'Product Rule', days: 3, difficulty: 'Intermediate', color: '#f0a840', topics: ['Product Rule Formula', 'Quotient Rule', 'Combined Rules'], locked: false },
  { id: 5, name: 'Implicit Differentiation', days: 4, difficulty: 'Advanced', color: '#a78bfa', topics: ['Implicit vs Explicit', 'Differentiation Techniques', 'Related Problems'], locked: false },
  { id: 6, name: 'Related Rates', days: 4, difficulty: 'Advanced', color: '#f43f5e', topics: ['Setting Up Problems', 'Geometric Applications', 'Real World Problems'], locked: false },
]

const diffColors = {
  Foundation: { bg: 'rgba(200,247,90,0.12)', text: '#c8f75a', border: 'rgba(200,247,90,0.25)' },
  Beginner: { bg: 'rgba(96,212,247,0.12)', text: '#60d4f7', border: 'rgba(96,212,247,0.25)' },
  Intermediate: { bg: 'rgba(240,168,64,0.12)', text: '#f0a840', border: 'rgba(240,168,64,0.25)' },
  Advanced: { bg: 'rgba(244,63,94,0.12)', text: '#f43f5e', border: 'rgba(244,63,94,0.25)' },
}

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function generateCalendarDays(chapters) {
  const days = []
  let dayNum = 1
  chapters.forEach((ch, ci) => {
    for (let d = 0; d < ch.days; d++) {
      days.push({ day: dayNum++, chapter: ci, chapterName: ch.name, color: ch.color })
    }
    // rest day after each chapter
    days.push({ day: dayNum++, chapter: -1, chapterName: 'Rest day', color: null })
  })
  return days
}

function generateGrid(totalDays) {
  // GitHub-style: 52 weeks x 7 days
  const cells = []
  for (let i = 0; i < 52 * 7; i++) {
    if (i < totalDays) {
      const intensity = Math.random()
      cells.push(intensity > 0.3 ? Math.ceil(intensity * 4) : 0)
    } else {
      cells.push(-1) // future
    }
  }
  return cells
}

export default function PlanBuilder() {
  const [dark, setDark] = useState(true)
  const [chapters, setChapters] = useState(CHAPTERS)
  const [calView, setCalView] = useState('grid') // grid | month | week
  const [expandedChapter, setExpandedChapter] = useState(null)
  const [planName, setPlanName] = useState('Integration & Differentiation')
  const [examDate, setExamDate] = useState('2026-01-15')
  const [saved, setSaved] = useState(false)
  const [dragOver, setDragOver] = useState(null)
  const [dragging, setDragging] = useState(null)

  const totalDays = chapters.reduce((sum, ch) => sum + ch.days, 0) + chapters.length
  const calDays = generateCalendarDays(chapters)
  const gridCells = generateGrid(30)

  const today = new Date()
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    return d
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

  const updateDays = (id, delta) => {
    setChapters(prev => prev.map(ch => ch.id === id ? { ...ch, days: Math.max(1, Math.min(14, ch.days + delta)) } : ch))
  }

  const handleDragStart = (id) => setDragging(id)
  const handleDragOver = (e, id) => { e.preventDefault(); setDragOver(id) }
  const handleDrop = (targetId) => {
    if (dragging === targetId) { setDragging(null); setDragOver(null); return }
    setChapters(prev => {
      const arr = [...prev]
      const fromIdx = arr.findIndex(c => c.id === dragging)
      const toIdx = arr.findIndex(c => c.id === targetId)
      const [moved] = arr.splice(fromIdx, 1)
      arr.splice(toIdx, 0, moved)
      return arr
    })
    setDragging(null)
    setDragOver(null)
  }

  const daysLeft = Math.ceil((new Date(examDate) - new Date()) / (1000 * 60 * 60 * 24))
  const urgencyColor = daysLeft > 60 ? accent : daysLeft > 30 ? '#f0a840' : '#f43f5e'

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: "'Syne',sans-serif", color: text, transition: 'all 0.3s' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
        .card{background:${bg2};border:1px solid ${border};border-radius:12px;padding:1.25rem;transition:all 0.3s}
        .btn-main{background:#c8f75a;color:#080808;border:none;border-radius:8px;padding:0.75rem 1.5rem;font-size:13px;font-weight:700;cursor:pointer;font-family:'Syne',sans-serif;letter-spacing:0.06em;text-transform:uppercase;transition:all 0.2s}
        .btn-main:hover{background:#d4f96e;transform:translateY(-1px)}
        .btn-ghost{background:transparent;color:${text};border:1px solid ${border};border-radius:8px;padding:0.75rem 1.25rem;font-size:12px;font-weight:500;cursor:pointer;font-family:'Syne',sans-serif;transition:all 0.2s}
        .btn-ghost:hover{border-color:${border2};background:${bg3}}
        .btn-icon{background:${bg3};border:1px solid ${border};border-radius:6px;width:28px;height:28px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:14px;color:${text};transition:all 0.2s;border:none}
        .btn-icon:hover{background:${border2}}
        .chapter-row{background:${bg2};border:1px solid ${border};border-radius:10px;padding:1rem 1.25rem;transition:all 0.25s;cursor:grab}
        .chapter-row:hover{border-color:${border2};transform:translateX(2px)}
        .chapter-row.drag-over{border-color:#c8f75a;background:rgba(200,247,90,0.05)}
        .cal-toggle{padding:6px 14px;border-radius:6px;border:none;font-size:11px;font-weight:600;cursor:pointer;transition:all 0.2s;font-family:'DM Mono',monospace;letter-spacing:0.06em;text-transform:uppercase}
        .tab-active{background:${bg2};color:${text};box-shadow:0 1px 4px rgba(0,0,0,0.2)}
        .tab-inactive{background:transparent;color:${muted}}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:${bg}}
        ::-webkit-scrollbar-thumb{background:${border2};border-radius:2px}
        input[type=date]{color-scheme:${dark?'dark':'light'}}
      `}</style>

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: d ? 'rgba(8,8,8,0.92)' : 'rgba(249,248,245,0.92)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${border}`, padding: '0 2.5rem', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <a href="/dashboard" style={{ fontFamily: "'Instrument Serif',serif", fontSize: 20, color: text, textDecoration: 'none' }}>
            Study<span style={{ color: accent }}>Notio</span>
          </a>
          <span style={{ color: border2, fontSize: 18 }}>›</span>
          <span style={{ fontSize: 13, color: muted }}>Plan Builder</span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button onClick={() => setDark(!dark)} style={{ background: 'transparent', border: `1px solid ${border}`, borderRadius: 6, width: 32, height: 32, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', color: muted }}>
            {dark ? '☀' : '☾'}
          </button>
          <button className="btn-ghost">Preview plan</button>
          <button className="btn-main" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500) }}>
            {saved ? '✓ Saved!' : 'Save & start →'}
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2.5rem 2rem', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }}>

        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* PLAN HEADER */}
          <div style={{ animation: 'fadeUp 0.5s ease both' }}>
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>AI-Generated Plan · Customise freely</p>
            <input value={planName} onChange={e => setPlanName(e.target.value)}
              style={{ fontFamily: "'Instrument Serif',serif", fontSize: '2.2rem', fontWeight: 400, color: text, background: 'transparent', border: 'none', outline: 'none', width: '100%', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}
            />
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, color: muted, fontFamily: "'DM Mono',monospace" }}>EXAM DATE:</span>
                <input type="date" value={examDate} onChange={e => setExamDate(e.target.value)}
                  style={{ background: bg2, border: `1px solid ${border}`, borderRadius: 6, padding: '4px 10px', fontSize: 12, color: text, fontFamily: "'DM Mono',monospace", outline: 'none', cursor: 'pointer' }}
                />
              </div>
              <span style={{ fontSize: 12, color: urgencyColor, fontFamily: "'DM Mono',monospace", background: `${urgencyColor}18`, padding: '4px 10px', borderRadius: 100, border: `1px solid ${urgencyColor}30` }}>
                {daysLeft} DAYS LEFT
              </span>
              <span style={{ fontSize: 12, color: muted, fontFamily: "'DM Mono',monospace" }}>{totalDays} TOTAL STUDY DAYS · {chapters.length} CHAPTERS</span>
            </div>
          </div>

          {/* STREAK BAR */}
          <div className="card" style={{ animation: 'fadeUp 0.5s ease 0.05s both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18, animation: 'pulse 2s ease-in-out infinite' }}>🔥</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: text }}>7 Day Streak</span>
              </div>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: muted, letterSpacing: '0.06em' }}>KEEP IT GOING →</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ height: 36, borderRadius: 6, background: i < 7 ? `rgba(200,247,90,${0.3 + i * 0.1})` : bg3, border: `1px solid ${i < 7 ? 'rgba(200,247,90,0.3)' : border}`, marginBottom: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                    {i < 7 ? '✓' : ''}
                  </div>
                  <span style={{ fontSize: 10, color: muted, fontFamily: "'DM Mono',monospace" }}>{day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CALENDAR SECTION */}
          <div className="card" style={{ animation: 'fadeUp 0.5s ease 0.1s both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: text }}>Study Calendar</h2>
              <div style={{ display: 'flex', gap: 4, background: bg3, border: `1px solid ${border}`, borderRadius: 8, padding: 3 }}>
                {[['grid', '▦ Grid'], ['month', '📅 Month'], ['week', '📆 Week']].map(([id, label]) => (
                  <button key={id} className={`cal-toggle ${calView === id ? 'tab-active' : 'tab-inactive'}`} onClick={() => setCalView(id)}>{label}</button>
                ))}
              </div>
            </div>

            {/* GITHUB GRID VIEW */}
            {calView === 'grid' && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <div style={{ display: 'flex', gap: 3, marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  {calDays.map((day, i) => (
                    <div key={i} title={`Day ${day.day}: ${day.chapterName}`}
                      style={{ width: 14, height: 14, borderRadius: 3, background: day.color ? day.color + '80' : bg3, border: `1px solid ${day.color ? day.color + '40' : border}`, cursor: 'default', transition: 'transform 0.1s' }}
                      onMouseOver={e => e.currentTarget.style.transform = 'scale(1.3)'}
                      onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {chapters.map(ch => (
                    <div key={ch.id} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: ch.color + '80' }} />
                      <span style={{ fontSize: 11, color: muted, fontFamily: "'DM Mono',monospace" }}>{ch.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MONTH VIEW */}
            {calView === 'month' && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                    <div key={i} style={{ textAlign: 'center', fontSize: 10, color: muted, fontFamily: "'DM Mono',monospace", padding: '4px 0' }}>{d}</div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
                  {Array.from({ length: 35 }, (_, i) => {
                    const dayData = calDays[i]
                    const isToday = i === 0
                    return (
                      <div key={i} style={{ aspectRatio: '1', borderRadius: 6, background: dayData?.color ? dayData.color + '25' : bg3, border: `1px solid ${dayData?.color ? dayData.color + '40' : border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: dayData?.color || muted, fontFamily: "'DM Mono',monospace", position: 'relative', outline: isToday ? `2px solid ${accent}` : 'none' }}>
                        <span style={{ fontWeight: isToday ? 700 : 400 }}>{i + 1}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* WEEK VIEW */}
            {calView === 'week' && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
                  {weekDays.map((date, i) => {
                    const dayData = calDays[i]
                    const isToday = i === 0
                    return (
                      <div key={i} style={{ background: isToday ? 'rgba(200,247,90,0.08)' : bg3, border: `1px solid ${isToday ? 'rgba(200,247,90,0.3)' : border}`, borderRadius: 10, padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                        <p style={{ fontSize: 10, color: isToday ? accent : muted, fontFamily: "'DM Mono',monospace", marginBottom: 4, letterSpacing: '0.06em' }}>
                          {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][i]}
                        </p>
                        <p style={{ fontSize: 18, fontWeight: 700, color: isToday ? accent : text, fontFamily: "'Instrument Serif',serif", marginBottom: 6 }}>{date.getDate()}</p>
                        {dayData?.color && (
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: dayData.color, margin: '0 auto', boxShadow: `0 0 6px ${dayData.color}60` }} />
                        )}
                        <p style={{ fontSize: 9, color: muted, marginTop: 4, fontFamily: "'DM Mono',monospace", lineHeight: 1.3 }}>
                          {dayData?.chapterName?.split(' ')[0] || '—'}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* CHAPTER LIST */}
          <div style={{ animation: 'fadeUp 0.5s ease 0.15s both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: text }}>Chapter Breakdown</h2>
              <span style={{ fontSize: 11, color: muted, fontFamily: "'DM Mono',monospace", letterSpacing: '0.04em' }}>DRAG TO REORDER</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {chapters.map((ch, i) => (
                <div key={ch.id}
                  className={`chapter-row${dragOver === ch.id ? ' drag-over' : ''}`}
                  draggable
                  onDragStart={() => handleDragStart(ch.id)}
                  onDragOver={e => handleDragOver(e, ch.id)}
                  onDrop={() => handleDrop(ch.id)}
                  onDragEnd={() => { setDragging(null); setDragOver(null) }}
                  style={{ animation: `fadeUp 0.4s ease ${i * 0.05}s both`, opacity: dragging === ch.id ? 0.5 : 1 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {/* drag handle */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, cursor: 'grab', flexShrink: 0 }}>
                      {[0, 1, 2].map(r => <div key={r} style={{ width: 16, height: 2, background: muted, borderRadius: 1 }} />)}
                    </div>

                    {/* color dot */}
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: ch.color, flexShrink: 0, boxShadow: `0 0 6px ${ch.color}60` }} />

                    {/* info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                        <p style={{ fontSize: 14, fontWeight: 500, color: text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ch.name}</p>
                        <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 3, background: diffColors[ch.difficulty].bg, color: diffColors[ch.difficulty].text, border: `1px solid ${diffColors[ch.difficulty].border}`, fontFamily: "'DM Mono',monospace", letterSpacing: '0.04em', flexShrink: 0 }}>{ch.difficulty}</span>
                      </div>
                      <p style={{ fontSize: 11, color: muted, fontFamily: "'DM Mono',monospace" }}>{ch.topics.join(' · ')}</p>
                    </div>

                    {/* day adjuster */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <button className="btn-icon" onClick={() => updateDays(ch.id, -1)}>−</button>
                      <div style={{ textAlign: 'center', minWidth: 48 }}>
                        <p style={{ fontSize: 16, fontWeight: 700, color: ch.color, fontFamily: "'Instrument Serif',serif", lineHeight: 1 }}>{ch.days}</p>
                        <p style={{ fontSize: 9, color: muted, fontFamily: "'DM Mono',monospace", letterSpacing: '0.04em' }}>DAYS</p>
                      </div>
                      <button className="btn-icon" onClick={() => updateDays(ch.id, 1)}>+</button>
                    </div>

                    {/* expand */}
                    <button className="btn-icon" onClick={() => setExpandedChapter(expandedChapter === ch.id ? null : ch.id)} style={{ fontSize: 12 }}>
                      {expandedChapter === ch.id ? '↑' : '↓'}
                    </button>
                  </div>

                  {/* expanded topics */}
                  {expandedChapter === ch.id && (
                    <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: `1px solid ${border}`, display: 'flex', gap: 6, flexWrap: 'wrap', animation: 'fadeIn 0.3s ease' }}>
                      {ch.topics.map((t, ti) => (
                        <span key={ti} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 100, background: ch.color + '15', color: ch.color, border: `1px solid ${ch.color}30`, fontFamily: "'DM Mono',monospace" }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ position: 'sticky', top: '80px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* PLAN SUMMARY */}
          <div className="card" style={{ animation: 'fadeUp 0.5s ease 0.1s both' }}>
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Plan Summary</p>
            {[
              { label: 'Total days', value: totalDays, color: text },
              { label: 'Chapters', value: chapters.length, color: text },
              { label: 'Exam in', value: `${daysLeft} days`, color: urgencyColor },
              { label: 'Daily study', value: '~45 min', color: text },
              { label: 'Rest days', value: chapters.length, color: text },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: i < 4 ? `1px solid ${border}` : 'none' }}>
                <span style={{ fontSize: 13, color: muted }}>{s.label}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: s.color, fontFamily: "'DM Mono',monospace" }}>{s.value}</span>
              </div>
            ))}
          </div>

          {/* DIFFICULTY BREAKDOWN */}
          <div className="card" style={{ animation: 'fadeUp 0.5s ease 0.15s both' }}>
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Difficulty Breakdown</p>
            {Object.entries(
              chapters.reduce((acc, ch) => { acc[ch.difficulty] = (acc[ch.difficulty] || 0) + 1; return acc }, {})
            ).map(([diff, count]) => (
              <div key={diff} style={{ marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: diffColors[diff].text, fontFamily: "'DM Mono',monospace", letterSpacing: '0.04em' }}>{diff}</span>
                  <span style={{ fontSize: 12, color: muted, fontFamily: "'DM Mono',monospace" }}>{count} chapter{count > 1 ? 's' : ''}</span>
                </div>
                <div style={{ height: 4, background: bg3, borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 2, background: diffColors[diff].text, width: `${(count / chapters.length) * 100}%`, transition: 'width 0.5s ease' }} />
                </div>
              </div>
            ))}
          </div>

          {/* AI TIPS */}
          <div className="card" style={{ border: `1px solid rgba(200,247,90,0.2)`, background: d ? 'rgba(200,247,90,0.03)' : 'rgba(200,247,90,0.05)', animation: 'fadeUp 0.5s ease 0.2s both' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
              <span style={{ fontSize: 16 }}>💡</span>
              <p style={{ fontSize: 11, color: accent, fontFamily: "'DM Mono',monospace", letterSpacing: '0.08em', textTransform: 'uppercase' }}>AI Recommendation</p>
            </div>
            <p style={{ fontSize: 13, color: muted, lineHeight: 1.7 }}>
              Based on the difficulty curve, consider giving <strong style={{ color: text }}>Chain Rule</strong> an extra day — it's a prerequisite for 3 other chapters and students typically need more time here.
            </p>
            <button className="btn-ghost" style={{ marginTop: '0.75rem', fontSize: 11, width: '100%' }} onClick={() => updateDays(3, 1)}>
              Apply suggestion →
            </button>
          </div>

          {/* SAVE */}
          <button className="btn-main" style={{ width: '100%', fontSize: 14, padding: '1rem' }} onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500) }}>
            {saved ? '✓ Plan saved!' : 'Save & start studying →'}
          </button>
          <button className="btn-ghost" style={{ width: '100%' }} onClick={() => window.location.href = '/dashboard'}>
            ← Back to dashboard
          </button>
        </div>
      </div>
    </div>
  )
}