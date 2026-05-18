'use client'
import { useState, useRef, useEffect } from 'react'

const INITIAL_MESSAGES = [
  {
    id: 1, role: 'tutor',
    text: "Welcome to your Chain Rule session! Before we dive in, I want to understand where you're starting from. Can you tell me — what happens when you differentiate a simple function like f(x) = x³?",
    type: 'question'
  }
]

const HINTS = [
  "Think about the power rule — what do you do with the exponent?",
  "Remember: d/dx[xⁿ] = n·xⁿ⁻¹. Try applying that here.",
  "The answer is 3x². Now can you see the pattern for the Chain Rule?",
]

const CONFETTI_COLORS = ['#c8f75a', '#a78bfa', '#60d4f7', '#f0a840', '#f43f5e', '#ffffff']

function Confetti({ active }) {
  if (!active) return null
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1000, overflow: 'hidden' }}>
      {Array.from({ length: 60 }, (_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${Math.random() * 100}%`,
          top: '-10px',
          width: `${4 + Math.random() * 6}px`,
          height: `${4 + Math.random() * 6}px`,
          borderRadius: Math.random() > 0.5 ? '50%' : '0',
          background: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          animation: `confettiFall ${1.5 + Math.random() * 2}s ease-in ${Math.random() * 0.8}s forwards`,
        }} />
      ))}
    </div>
  )
}

function XPPopup({ show, amount }) {
  if (!show) return null
  return (
    <div style={{
      position: 'fixed', bottom: '6rem', right: '2rem', zIndex: 999,
      background: 'rgba(200,247,90,0.15)', border: '1px solid rgba(200,247,90,0.4)',
      borderRadius: 12, padding: '0.75rem 1.25rem',
      display: 'flex', alignItems: 'center', gap: 8,
      animation: 'xpFloat 2s ease forwards',
      backdropFilter: 'blur(12px)',
    }}>
      <span style={{ fontSize: 18 }}>⚡</span>
      <span style={{ fontSize: 16, fontWeight: 700, color: '#c8f75a', fontFamily: "'DM Mono',monospace" }}>+{amount} XP</span>
    </div>
  )
}

const notes = [
  { title: 'Chain Rule Formula', content: 'If y = f(g(x)), then dy/dx = f\'(g(x)) · g\'(x)', type: 'formula' },
  { title: 'Remember', content: 'Work from outside → inside. Identify the outer and inner functions first.', type: 'tip' },
  { title: 'Example', content: 'y = (x² + 1)³ → outer: u³, inner: x² + 1\ndy/dx = 3(x² + 1)² · 2x', type: 'example' },
]

const noteColors = {
  formula: { bg: 'rgba(200,247,90,0.08)', border: 'rgba(200,247,90,0.2)', accent: '#c8f75a' },
  tip: { bg: 'rgba(96,212,247,0.08)', border: 'rgba(96,212,247,0.2)', accent: '#60d4f7' },
  example: { bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.2)', accent: '#a78bfa' },
}

export default function Tutor() {
  const [dark, setDark] = useState(true)
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [mastery, setMastery] = useState(45)
  const [xp, setXp] = useState(820)
  const [streak, setStreak] = useState(7)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showXP, setShowXP] = useState(false)
  const [xpAmount, setXpAmount] = useState(0)
  const [hintIdx, setHintIdx] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [sessionDone, setSessionDone] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [activePanel, setActivePanel] = useState('chat') // chat | notes | questions
  const [mode, setMode] = useState('socratic') // socratic | explain
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  const d = dark
  const bg = d ? '#080808' : '#f9f8f5'
  const bg2 = d ? '#111111' : '#ffffff'
  const bg3 = d ? '#161616' : '#f2f1ed'
  const text = d ? '#ede9e3' : '#141210'
  const muted = d ? '#6b6860' : '#8a8680'
  const border = d ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)'
  const border2 = d ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.14)'
  const accent = '#c8f75a'

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const celebrate = (xpEarned) => {
    setShowConfetti(true)
    setXpAmount(xpEarned)
    setShowXP(true)
    setXp(prev => prev + xpEarned)
    setMastery(prev => Math.min(100, prev + 8))
    setCorrectCount(prev => prev + 1)
    setTimeout(() => setShowConfetti(false), 3000)
    setTimeout(() => setShowXP(false), 2500)
  }

  const tutorResponses = [
    { text: "Excellent! That's exactly right — 3x². You've just used the power rule perfectly. Now here's where it gets interesting: what if I told you that the Chain Rule is essentially the power rule applied to *composite* functions? \n\nLet me ask you this: in the function y = (x² + 1)³, can you identify what the 'inner' and 'outer' functions are?", correct: true, xp: 50 },
    { text: "Good thinking! You're on the right track. Let me guide you a bit more — in y = (x² + 1)³, think of it as 'something cubed'. What is that something? That's your inner function. What's doing the cubing? That's your outer function.", correct: false, xp: 20 },
    { text: "Perfect breakdown! The outer function is u³ and the inner is (x² + 1). Now apply the Chain Rule: differentiate the outer, keep the inner, then multiply by the derivative of the inner. What do you get?", correct: true, xp: 60 },
  ]

  const [responseIdx, setResponseIdx] = useState(0)

  const sendMessage = () => {
    if (!input.trim()) return
    const userMsg = { id: Date.now(), role: 'user', text: input, type: 'answer' }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setTyping(true)

    setTimeout(() => {
      setTyping(false)
      const response = tutorResponses[responseIdx % tutorResponses.length]
      const tutorMsg = {
        id: Date.now() + 1, role: 'tutor',
        text: response.text, type: 'question',
        correct: response.correct
      }
      setMessages(prev => [...prev, tutorMsg])
      setResponseIdx(prev => prev + 1)
      if (response.correct) celebrate(response.xp)
    }, 1800)
  }

  const useHint = () => {
    if (hintsUsed >= HINTS.length) return
    const hintMsg = {
      id: Date.now(), role: 'system',
      text: `💡 Hint: ${HINTS[hintsUsed]}`, type: 'hint'
    }
    setMessages(prev => [...prev, hintMsg])
    setHintsUsed(prev => prev + 1)
    setXp(prev => Math.max(0, prev - 10))
  }

  const skipToExplanation = () => {
    const explainMsg = {
      id: Date.now(), role: 'tutor',
      text: "No worries! Let me explain the Chain Rule directly. If y = f(g(x)), then:\n\ndy/dx = f'(g(x)) · g'(x)\n\nIn plain English: differentiate the outer function (keeping the inner unchanged), then multiply by the derivative of the inner function. Let's try an example together now that you've seen the formula.",
      type: 'explanation'
    }
    setMessages(prev => [...prev, explainMsg])
  }

  const endSession = () => setSessionDone(true)

  const masteryColor = mastery >= 80 ? '#c8f75a' : mastery >= 60 ? '#f0a840' : '#f43f5e'

  if (sessionDone) return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: "'Syne',sans-serif", color: text, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');*{box-sizing:border-box;margin:0;padding:0}@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <Confetti active={true} />
      <div style={{ maxWidth: 520, width: '100%', textAlign: 'center', animation: 'fadeUp 0.6s ease both' }}>
        <div style={{ fontSize: 56, marginBottom: '1.5rem' }}>🎓</div>
        <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: '2.8rem', color: text, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Session complete!</h1>
        <p style={{ fontSize: 15, color: muted, marginBottom: '2.5rem', lineHeight: 1.7 }}>Great work on Chain Rule. Here's how you did:</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Mastery', value: `${mastery}%`, color: masteryColor, icon: '🧠' },
            { label: 'XP Earned', value: `+${xp - 820}`, color: accent, icon: '⚡' },
            { label: 'Correct', value: `${correctCount}/${responseIdx}`, color: '#60d4f7', icon: '✓' },
          ].map((s, i) => (
            <div key={i} style={{ background: bg2, border: `1px solid ${border}`, borderRadius: 12, padding: '1.25rem', animation: `fadeUp 0.5s ease ${i * 0.1}s both` }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
              <p style={{ fontSize: 24, fontWeight: 700, color: s.color, fontFamily: "'Instrument Serif',serif", marginBottom: 2 }}>{s.value}</p>
              <p style={{ fontSize: 11, color: muted, fontFamily: "'DM Mono',monospace", letterSpacing: '0.04em' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {mastery < 80 && (
          <div style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 12, padding: '1rem', marginBottom: '1.5rem', textAlign: 'left' }}>
            <p style={{ fontSize: 13, color: '#f97316', fontFamily: "'DM Mono',monospace", marginBottom: 4, letterSpacing: '0.06em' }}>⚠ NEEDS MORE WORK</p>
            <p style={{ fontSize: 14, color: muted, lineHeight: 1.6 }}>You need 80% mastery to unlock the next chapter. Practice a bit more and retake this session.</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => { setSessionDone(false); setMessages(INITIAL_MESSAGES); setMastery(45); setCorrectCount(0); setResponseIdx(0) }}
            style={{ background: 'transparent', border: `1px solid ${border2}`, borderRadius: 8, padding: '0.8rem 1.5rem', fontSize: 13, color: text, cursor: 'pointer', fontFamily: "'Syne',sans-serif" }}>
            Retake session
          </button>
          <button onClick={() => window.location.href = '/dashboard'}
            style={{ background: accent, border: 'none', borderRadius: 8, padding: '0.8rem 1.5rem', fontSize: 13, fontWeight: 700, color: '#080808', cursor: 'pointer', fontFamily: "'Syne',sans-serif', letterSpacing: '0.06em" }}>
            {mastery >= 80 ? 'Next chapter →' : 'Back to dashboard'}
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: bg, fontFamily: "'Syne',sans-serif", color: text, overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes confettiFall{0%{transform:translateY(-10px) rotate(0deg);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
        @keyframes xpFloat{0%{opacity:0;transform:translateY(20px)}20%{opacity:1;transform:translateY(0)}80%{opacity:1;transform:translateY(-10px)}100%{opacity:0;transform:translateY(-30px)}}
        @keyframes typingPulse{0%,80%,100%{transform:scale(0.6);opacity:0.4}40%{transform:scale(1);opacity:1}}
        @keyframes correctGlow{0%{box-shadow:0 0 0 rgba(200,247,90,0)}50%{box-shadow:0 0 30px rgba(200,247,90,0.3)}100%{box-shadow:0 0 0 rgba(200,247,90,0)}}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
        .msg-tutor{background:${bg2};border:1px solid ${border};border-radius:4px 16px 16px 16px;padding:1rem 1.25rem;max-width:85%;animation:fadeUp 0.4s ease both}
        .msg-user{background:rgba(200,247,90,0.1);border:1px solid rgba(200,247,90,0.2);border-radius:16px 4px 16px 16px;padding:1rem 1.25rem;max-width:85%;margin-left:auto;animation:fadeUp 0.4s ease both}
        .msg-hint{background:rgba(240,168,64,0.08);border:1px solid rgba(240,168,64,0.2);border-radius:12px;padding:0.75rem 1.25rem;max-width:85%;animation:fadeUp 0.4s ease both}
        .msg-explanation{background:rgba(96,212,247,0.08);border:1px solid rgba(96,212,247,0.2);border-radius:4px 16px 16px 16px;padding:1rem 1.25rem;max-width:85%;animation:fadeUp 0.4s ease both}
        .msg-correct{animation:correctGlow 1s ease}
        .chat-input{flex:1;background:${bg2};border:2px solid ${border};border-radius:12px;padding:0.85rem 1.25rem;font-size:14px;color:${text};font-family:'Syne',sans-serif;outline:none;resize:none;transition:border-color 0.2s;line-height:1.5}
        .chat-input:focus{border-color:rgba(200,247,90,0.4)}
        .chat-input::placeholder{color:${muted}}
        .panel-btn{padding:7px 16px;border-radius:7px;border:none;font-size:11px;font-weight:600;cursor:pointer;transition:all 0.2s;font-family:'DM Mono',monospace;letter-spacing:0.06em;text-transform:uppercase}
        .send-btn{background:#c8f75a;color:#080808;border:none;border-radius:10px;width:44px;height:44px;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;transition:all 0.2s;flex-shrink:0}
        .send-btn:hover{background:#d4f96e;transform:scale(1.05)}
        .send-btn:disabled{opacity:0.4;cursor:not-allowed}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:${bg}}
        ::-webkit-scrollbar-thumb{background:${border2};border-radius:2px}
      `}</style>

      <Confetti active={showConfetti} />
      <XPPopup show={showXP} amount={xpAmount} />

      {/* TOP BAR */}
      <div style={{ background: d ? 'rgba(8,8,8,0.95)' : 'rgba(249,248,245,0.95)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${border}`, padding: '0 1.5rem', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a href="/dashboard" style={{ fontFamily: "'Instrument Serif',serif", fontSize: 18, color: text, textDecoration: 'none' }}>Study<span style={{ color: accent }}>Notio</span></a>
          <span style={{ color: border2 }}>›</span>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: text, lineHeight: 1 }}>Chain Rule</p>
            <p style={{ fontSize: 11, color: muted, fontFamily: "'DM Mono',monospace" }}>Integration & Diff. · Day 8/30</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* mastery bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: muted, fontFamily: "'DM Mono',monospace", letterSpacing: '0.06em' }}>MASTERY</span>
            <div style={{ width: 80, height: 6, background: bg3, borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 3, background: masteryColor, width: `${mastery}%`, transition: 'width 0.5s ease', boxShadow: `0 0 8px ${masteryColor}60` }} />
            </div>
            <span style={{ fontSize: 12, color: masteryColor, fontFamily: "'DM Mono',monospace", fontWeight: 600 }}>{mastery}%</span>
          </div>

          {/* streak */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: bg3, border: `1px solid ${border}`, borderRadius: 8, padding: '4px 10px' }}>
            <span style={{ fontSize: 14, animation: 'pulse 2s ease-in-out infinite' }}>🔥</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: text, fontFamily: "'DM Mono',monospace" }}>{streak}</span>
          </div>

          {/* XP */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: bg3, border: `1px solid ${border}`, borderRadius: 8, padding: '4px 10px' }}>
            <span style={{ fontSize: 12, color: accent }}>⚡</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: accent, fontFamily: "'DM Mono',monospace" }}>{xp}</span>
          </div>

          {/* mode toggle */}
          <div style={{ display: 'flex', gap: 3, background: bg3, border: `1px solid ${border}`, borderRadius: 8, padding: 3 }}>
            {[['socratic', '🧠 Socratic'], ['explain', '📖 Explain']].map(([id, label]) => (
              <button key={id} className="panel-btn" onClick={() => setMode(id)}
                style={{ background: mode === id ? bg2 : 'transparent', color: mode === id ? text : muted, boxShadow: mode === id ? '0 1px 3px rgba(0,0,0,0.2)' : 'none' }}>
                {label}
              </button>
            ))}
          </div>

          <button onClick={() => setDark(!dark)} style={{ background: 'transparent', border: `1px solid ${border}`, borderRadius: 6, width: 30, height: 30, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', color: muted }}>
            {dark ? '☀' : '☾'}
          </button>

          <button onClick={endSession} style={{ background: 'transparent', border: `1px solid ${border}`, borderRadius: 6, padding: '4px 12px', fontSize: 11, color: muted, cursor: 'pointer', fontFamily: "'DM Mono',monospace", letterSpacing: '0.04em' }}>
            END SESSION
          </button>
        </div>
      </div>

      {/* MAIN SPLIT */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 320px', overflow: 'hidden' }}>

        {/* CHAT */}
        <div style={{ display: 'flex', flexDirection: 'column', borderRight: `1px solid ${border}`, overflow: 'hidden' }}>

          {/* messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((msg, i) => (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', animation: `fadeUp 0.4s ease both` }}>
                {msg.role !== 'user' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(200,247,90,0.2)', border: '1px solid rgba(200,247,90,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>🎓</div>
                    <span style={{ fontSize: 10, color: accent, fontFamily: "'DM Mono',monospace", letterSpacing: '0.06em' }}>TUTOR</span>
                    {msg.correct && <span style={{ fontSize: 10, color: accent, fontFamily: "'DM Mono',monospace", background: 'rgba(200,247,90,0.1)', padding: '1px 6px', borderRadius: 3 }}>✓ CORRECT!</span>}
                  </div>
                )}
                <div className={`msg-${msg.role === 'user' ? 'user' : msg.type || 'tutor'}${msg.correct ? ' msg-correct' : ''}`}>
                  <p style={{ fontSize: 14, lineHeight: 1.75, color: msg.role === 'user' ? text : text, whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                </div>
              </div>
            ))}

            {/* typing indicator */}
            {typing && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(200,247,90,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>🎓</div>
                <div className="msg-tutor" style={{ padding: '0.85rem 1.25rem' }}>
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: muted, animation: `typingPulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* input area */}
          <div style={{ padding: '1rem 1.5rem', borderTop: `1px solid ${border}`, background: bg, flexShrink: 0 }}>
            {/* hint/skip buttons */}
            <div style={{ display: 'flex', gap: 8, marginBottom: '0.75rem' }}>
              <button onClick={useHint} disabled={hintsUsed >= HINTS.length}
                style={{ background: 'rgba(240,168,64,0.08)', border: '1px solid rgba(240,168,64,0.2)', borderRadius: 8, padding: '5px 12px', fontSize: 11, color: '#f0a840', cursor: 'pointer', fontFamily: "'DM Mono',monospace", letterSpacing: '0.04em', opacity: hintsUsed >= HINTS.length ? 0.4 : 1 }}>
                💡 HINT (−10 XP) · {HINTS.length - hintsUsed} left
              </button>
              <button onClick={skipToExplanation}
                style={{ background: 'rgba(96,212,247,0.08)', border: '1px solid rgba(96,212,247,0.2)', borderRadius: 8, padding: '5px 12px', fontSize: 11, color: '#60d4f7', cursor: 'pointer', fontFamily: "'DM Mono',monospace", letterSpacing: '0.04em' }}>
                📖 EXPLAIN DIRECTLY
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
              <textarea
                ref={inputRef}
                className="chat-input"
                rows={2}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                placeholder="Type your answer... (Enter to send, Shift+Enter for new line)"
              />
              <button className="send-btn" onClick={sendMessage} disabled={!input.trim() || typing}>→</button>
            </div>
            <p style={{ fontSize: 10, color: muted, fontFamily: "'DM Mono',monospace", marginTop: 6, letterSpacing: '0.04em' }}>ENTER TO SEND · SHIFT+ENTER FOR NEW LINE</p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* panel tabs */}
          <div style={{ padding: '0.75rem 1rem', borderBottom: `1px solid ${border}`, display: 'flex', gap: 4, flexShrink: 0 }}>
            {[['chat', '💬 Info'], ['notes', '📝 Notes'], ['questions', '❓ Questions']].map(([id, label]) => (
              <button key={id} className="panel-btn" onClick={() => setActivePanel(id)}
                style={{ background: activePanel === id ? bg2 : 'transparent', color: activePanel === id ? text : muted, border: activePanel === id ? `1px solid ${border2}` : '1px solid transparent', boxShadow: activePanel === id ? '0 1px 3px rgba(0,0,0,0.2)' : 'none', borderRadius: 7 }}>
                {label}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>

            {/* INFO PANEL */}
            {activePanel === 'chat' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* chapter progress */}
                <div style={{ background: bg2, border: `1px solid ${border}`, borderRadius: 10, padding: '1rem' }}>
                  <p style={{ fontSize: 10, color: muted, fontFamily: "'DM Mono',monospace", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Session Progress</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {[
                      { label: 'Mastery', value: mastery, color: masteryColor, target: 80 },
                    ].map((item, i) => (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 12, color: muted }}>{item.label}</span>
                          <span style={{ fontSize: 12, color: item.color, fontFamily: "'DM Mono',monospace" }}>{item.value}% / {item.target}% needed</span>
                        </div>
                        <div style={{ height: 6, background: bg3, borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
                          <div style={{ height: '100%', borderRadius: 3, background: item.color, width: `${item.value}%`, transition: 'width 0.5s ease' }} />
                          {/* target line */}
                          <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${item.target}%`, width: 2, background: 'rgba(255,255,255,0.3)' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* session stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {[
                    { label: 'Correct', value: correctCount, color: accent },
                    { label: 'XP earned', value: `+${xp - 820}`, color: accent },
                    { label: 'Hints used', value: hintsUsed, color: '#f0a840' },
                    { label: 'Messages', value: messages.filter(m => m.role === 'user').length, color: '#60d4f7' },
                  ].map((s, i) => (
                    <div key={i} style={{ background: bg2, border: `1px solid ${border}`, borderRadius: 8, padding: '0.75rem', textAlign: 'center' }}>
                      <p style={{ fontSize: 18, fontWeight: 700, color: s.color, fontFamily: "'Instrument Serif',serif" }}>{s.value}</p>
                      <p style={{ fontSize: 10, color: muted, fontFamily: "'DM Mono',monospace", letterSpacing: '0.04em' }}>{s.label.toUpperCase()}</p>
                    </div>
                  ))}
                </div>

                {/* chapter outline */}
                <div style={{ background: bg2, border: `1px solid ${border}`, borderRadius: 10, padding: '1rem' }}>
                  <p style={{ fontSize: 10, color: muted, fontFamily: "'DM Mono',monospace", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Chapter Outline</p>
                  {['Introduction', 'Composite Functions', 'The Formula', 'Practice Problems', 'Applications'].map((topic, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: i < 4 ? `1px solid ${border}` : 'none' }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: i < 2 ? accent : i === 2 ? '#60d4f7' : border2, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: i < 2 ? text : i === 2 ? '#60d4f7' : muted }}>{topic}</span>
                      {i < 2 && <span style={{ marginLeft: 'auto', fontSize: 10, color: accent, fontFamily: "'DM Mono',monospace" }}>✓</span>}
                      {i === 2 && <span style={{ marginLeft: 'auto', fontSize: 10, color: '#60d4f7', fontFamily: "'DM Mono',monospace" }}>NOW</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NOTES PANEL */}
            {activePanel === 'notes' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <p style={{ fontSize: 10, color: muted, fontFamily: "'DM Mono',monospace", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Chapter Notes</p>
                {notes.map((note, i) => (
                  <div key={i} style={{ background: noteColors[note.type].bg, border: `1px solid ${noteColors[note.type].border}`, borderRadius: 10, padding: '1rem', animation: `fadeUp 0.4s ease ${i * 0.1}s both` }}>
                    <p style={{ fontSize: 10, color: noteColors[note.type].accent, fontFamily: "'DM Mono',monospace", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{note.type}</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: text, marginBottom: '0.4rem' }}>{note.title}</p>
                    <p style={{ fontSize: 13, color: muted, lineHeight: 1.7, whiteSpace: 'pre-wrap', fontFamily: note.type === 'formula' ? "'DM Mono',monospace" : 'inherit' }}>{note.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* QUESTIONS PANEL */}
            {activePanel === 'questions' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <p style={{ fontSize: 10, color: muted, fontFamily: "'DM Mono',monospace", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Practice Questions</p>
                {[
                  { q: 'Differentiate y = (3x² + 2)⁴', difficulty: 'Easy', done: false },
                  { q: 'Find dy/dx for y = sin(x²)', difficulty: 'Medium', done: false },
                  { q: 'Differentiate y = e^(x³ + 2x)', difficulty: 'Medium', done: false },
                  { q: 'Find the derivative of y = ln(cos(x))', difficulty: 'Hard', done: false },
                ].map((q, i) => (
                  <div key={i} style={{ background: bg2, border: `1px solid ${border}`, borderRadius: 10, padding: '0.9rem 1rem', animation: `fadeUp 0.4s ease ${i * 0.08}s both`, cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.borderColor = border2}
                    onMouseOut={e => e.currentTarget.style.borderColor = border}
                    onClick={() => setInput(`Can you help me with: ${q.q}`)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                      <p style={{ fontSize: 13, color: text, lineHeight: 1.5, flex: 1, marginRight: 8 }}>{q.q}</p>
                      <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 3, background: q.difficulty === 'Easy' ? 'rgba(200,247,90,0.1)' : q.difficulty === 'Medium' ? 'rgba(240,168,64,0.1)' : 'rgba(244,63,94,0.1)', color: q.difficulty === 'Easy' ? accent : q.difficulty === 'Medium' ? '#f0a840' : '#f43f5e', fontFamily: "'DM Mono',monospace", letterSpacing: '0.04em', flexShrink: 0 }}>{q.difficulty}</span>
                    </div>
                    <p style={{ fontSize: 10, color: muted, fontFamily: "'DM Mono',monospace", letterSpacing: '0.04em' }}>CLICK TO ASK TUTOR →</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}