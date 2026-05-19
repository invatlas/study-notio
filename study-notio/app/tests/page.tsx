'use client'
import { useState, useEffect, useRef } from 'react'

const QUESTIONS = [
  {
    id: 1, type: 'mcq', difficulty: 'Easy',
    question: 'What is the derivative of f(x) = x³?',
    options: ['2x²', '3x²', '3x³', 'x²'],
    answer: '3x²',
    explanation: 'Using the power rule: d/dx[xⁿ] = nxⁿ⁻¹. So d/dx[x³] = 3x².',
    tool: null,
  },
  {
    id: 2, type: 'mcq', difficulty: 'Easy',
    question: 'Which rule do you use to differentiate y = (x² + 1)⁵?',
    options: ['Product Rule', 'Quotient Rule', 'Chain Rule', 'Power Rule only'],
    answer: 'Chain Rule',
    explanation: 'This is a composite function — a function inside another. That\'s exactly when the Chain Rule applies.',
    tool: null,
  },
  {
    id: 3, type: 'typed', difficulty: 'Medium',
    question: 'Differentiate y = (3x + 2)⁴. Enter your answer below.',
    answer: '12(3x+2)^3',
    acceptedAnswers: ['12(3x+2)^3', '12(3x + 2)^3', '12(3x+2)³'],
    explanation: 'Chain Rule: outer derivative = 4(3x+2)³, inner derivative = 3. Multiply: 12(3x+2)³.',
    tool: 'calculator',
    hint: 'Outer function: u⁴ → 4u³. Inner function: 3x+2 → 3. Multiply them.',
  },
  {
    id: 4, type: 'mcq', difficulty: 'Medium',
    question: 'What is d/dx[sin(x²)]?',
    options: ['cos(x²)', '2x·cos(x²)', 'sin(2x)', '2x·sin(x²)'],
    answer: '2x·cos(x²)',
    explanation: 'Chain Rule: outer = cos(x²), inner derivative = 2x. Result: 2x·cos(x²).',
    tool: null,
  },
  {
    id: 5, type: 'typed', difficulty: 'Medium',
    question: 'Find dy/dx for y = e^(x² + 1). Type your answer.',
    answer: '2x·e^(x²+1)',
    acceptedAnswers: ['2x·e^(x²+1)', '2xe^(x^2+1)', '2x*e^(x²+1)'],
    explanation: 'Chain Rule on eˣ: derivative of e^u is e^u · du/dx. Here u = x²+1, du/dx = 2x.',
    tool: 'calculator',
    hint: 'Remember: d/dx[eᵘ] = eᵘ · (du/dx). What is u here?',
  },
  {
    id: 6, type: 'mcq', difficulty: 'Hard',
    question: 'If f(x) = ln(cos(x)), what is f\'(x)?',
    options: ['1/cos(x)', '-sin(x)/cos(x)', 'sin(x)/cos(x)', '-tan(x)'],
    answer: '-tan(x)',
    explanation: 'Chain Rule: d/dx[ln(u)] = (1/u)·(du/dx). Here u=cos(x), du/dx=-sin(x). Result: -sin(x)/cos(x) = -tan(x).',
    tool: null,
  },
  {
    id: 7, type: 'graph', difficulty: 'Hard',
    question: 'Looking at the graph of f(x) = x², at which x value is the derivative equal to 4?',
    options: ['x = 1', 'x = 2', 'x = 4', 'x = 8'],
    answer: 'x = 2',
    explanation: 'f\'(x) = 2x. Set 2x = 4, so x = 2.',
    tool: 'desmos',
  },
  {
    id: 8, type: 'typed', difficulty: 'Hard',
    question: 'Differentiate y = (x² + 3x)⁷ using the Chain Rule.',
    answer: '7(x²+3x)^6·(2x+3)',
    acceptedAnswers: ['7(x²+3x)^6·(2x+3)', '7(x^2+3x)^6*(2x+3)', '(7)(x²+3x)⁶(2x+3)'],
    explanation: 'Outer: 7(x²+3x)⁶. Inner derivative: 2x+3. Multiply: 7(x²+3x)⁶·(2x+3).',
    tool: 'calculator',
    hint: 'Step 1: Identify outer function (something⁷) and inner (x²+3x). Step 2: Differentiate each.',
  },
  {
    id: 9, type: 'mcq', difficulty: 'Medium',
    question: 'What is the derivative of y = √(x² + 1)?',
    options: ['x/√(x²+1)', '1/√(x²+1)', '2x/√(x²+1)', 'x²/√(x²+1)'],
    answer: 'x/√(x²+1)',
    explanation: 'Write √(x²+1) = (x²+1)^(1/2). Chain Rule: (1/2)(x²+1)^(-1/2)·2x = x/√(x²+1).',
    tool: null,
  },
  {
    id: 10, type: 'typed', difficulty: 'Hard',
    question: 'Find f\'(x) if f(x) = sin³(x). (Hint: this is [sin(x)]³)',
    answer: '3sin²(x)·cos(x)',
    acceptedAnswers: ['3sin²(x)·cos(x)', '3sin^2(x)*cos(x)', '3(sin(x))²cos(x)'],
    explanation: 'Chain Rule: outer = 3[sin(x)]², inner derivative = cos(x). Result: 3sin²(x)·cos(x).',
    tool: 'calculator',
    hint: 'Write it as [sin(x)]³. Now the outer function is u³ and inner is sin(x).',
  },
]

const diffColors = {
  Easy: { bg: 'rgba(200,247,90,0.12)', text: '#c8f75a', border: 'rgba(200,247,90,0.25)' },
  Medium: { bg: 'rgba(240,168,64,0.12)', text: '#f0a840', border: 'rgba(240,168,64,0.25)' },
  Hard: { bg: 'rgba(244,63,94,0.12)', text: '#f43f5e', border: 'rgba(244,63,94,0.25)' },
}

function Calculator({ dark }) {
  const [display, setDisplay] = useState('0')
  const [prev, setPrev] = useState(null)
  const [op, setOp] = useState(null)
  const [fresh, setFresh] = useState(true)
  const bg2 = dark ? '#1a1a1a' : '#f0efe9'
  const bg3 = dark ? '#222' : '#e8e7e3'
  const text = dark ? '#ede9e3' : '#141210'
  const border = dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)'

  const press = (val) => {
    if (val === 'C') { setDisplay('0'); setPrev(null); setOp(null); setFresh(true); return }
    if (val === '=') {
      if (prev !== null && op) {
        const a = parseFloat(prev), b = parseFloat(display)
        let res = op === '+' ? a + b : op === '-' ? a - b : op === '×' ? a * b : op === '÷' ? a / b : op === 'xʸ' ? Math.pow(a, b) : b
        setDisplay(String(parseFloat(res.toFixed(8))))
        setPrev(null); setOp(null); setFresh(true)
      }
      return
    }
    if (['+', '-', '×', '÷', 'xʸ'].includes(val)) {
      setPrev(display); setOp(val); setFresh(true); return
    }
    if (val === '√') { setDisplay(String(parseFloat(Math.sqrt(parseFloat(display)).toFixed(8)))); return }
    if (val === 'sin') { setDisplay(String(parseFloat(Math.sin(parseFloat(display) * Math.PI / 180).toFixed(8)))); return }
    if (val === 'cos') { setDisplay(String(parseFloat(Math.cos(parseFloat(display) * Math.PI / 180).toFixed(8)))); return }
    if (val === 'tan') { setDisplay(String(parseFloat(Math.tan(parseFloat(display) * Math.PI / 180).toFixed(8)))); return }
    if (val === 'ln') { setDisplay(String(parseFloat(Math.log(parseFloat(display)).toFixed(8)))); return }
    if (val === 'π') { setDisplay(String(Math.PI)); return }
    if (val === 'e') { setDisplay(String(Math.E)); return }
    if (val === '±') { setDisplay(String(-parseFloat(display))); return }
    const newVal = fresh ? val : (display === '0' ? val : display + val)
    setDisplay(newVal); setFresh(false)
  }

  const buttons = [
    ['sin', 'cos', 'tan', 'ln'],
    ['√', 'xʸ', 'π', 'e'],
    ['7', '8', '9', '÷'],
    ['4', '5', '6', '×'],
    ['1', '2', '3', '-'],
    ['±', '0', '.', '+'],
    ['C', '='],
  ]

  return (
    <div style={{ background: bg2, border: `1px solid ${border}`, borderRadius: 12, padding: '1rem', width: '100%' }}>
      <div style={{ background: bg3, borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '0.75rem', textAlign: 'right', fontFamily: "'DM Mono',monospace", fontSize: 20, color: text, minHeight: 48, wordBreak: 'break-all' }}>
        {display}
      </div>
      {buttons.map((row, ri) => (
        <div key={ri} style={{ display: 'grid', gridTemplateColumns: row.length === 2 ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 6, marginBottom: 6 }}>
          {row.map(btn => (
            <button key={btn} onClick={() => press(btn)} style={{
              padding: '0.6rem', borderRadius: 6, border: `1px solid ${border}`,
              background: btn === '=' ? '#c8f75a' : btn === 'C' ? 'rgba(244,63,94,0.15)' : bg3,
              color: btn === '=' ? '#080808' : btn === 'C' ? '#f43f5e' : ['+', '-', '×', '÷', 'xʸ'].includes(btn) ? '#c8f75a' : text,
              fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Mono',monospace",
              transition: 'all 0.15s',
            }}
              onMouseOver={e => e.currentTarget.style.opacity = '0.8'}
              onMouseOut={e => e.currentTarget.style.opacity = '1'}
            >{btn}</button>
          ))}
        </div>
      ))}
    </div>
  )
}

function DesmosGraph({ dark }) {
  const bg2 = dark ? '#1a1a1a' : '#f0efe9'
  const border = dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)'
  const text = dark ? '#ede9e3' : '#141210'
  const muted = dark ? '#6b6860' : '#8a8680'

  const points = Array.from({ length: 20 }, (_, i) => {
    const x = (i - 10) * 0.5
    return { x, y: x * x }
  })
  const maxY = Math.max(...points.map(p => p.y))
  const w = 280, h = 200, pad = 30
  const toSVG = (x, y) => ({
    sx: pad + ((x + 5) / 10) * (w - 2 * pad),
    sy: h - pad - (y / maxY) * (h - 2 * pad)
  })

  return (
    <div style={{ background: bg2, border: `1px solid ${border}`, borderRadius: 12, padding: '1rem' }}>
      <p style={{ fontSize: 10, color: '#c8f75a', fontFamily: "'DM Mono',monospace", letterSpacing: '0.08em', marginBottom: '0.5rem' }}>GRAPH: f(x) = x²</p>
      <svg width={w} height={h} style={{ display: 'block', margin: '0 auto' }}>
        {/* grid */}
        {[-4, -2, 0, 2, 4].map(x => {
          const { sx } = toSVG(x, 0)
          return <line key={x} x1={sx} y1={pad} x2={sx} y2={h - pad} stroke={dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} strokeWidth={1} />
        })}
        {/* axes */}
        <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke={dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'} strokeWidth={1} />
        <line x1={w / 2} y1={pad} x2={w / 2} y2={h - pad} stroke={dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'} strokeWidth={1} />
        {/* curve */}
        <polyline
          points={points.filter(p => p.y <= maxY).map(p => { const { sx, sy } = toSVG(p.x, p.y); return `${sx},${sy}` }).join(' ')}
          fill="none" stroke="#c8f75a" strokeWidth={2.5} strokeLinejoin="round"
        />
        {/* x=2 highlight */}
        {(() => { const { sx, sy } = toSVG(2, 4); return <circle cx={sx} cy={sy} r={5} fill="#f43f5e" stroke="white" strokeWidth={1.5} /> })()}
        {/* labels */}
        {[-4, -2, 0, 2, 4].map(x => {
          const { sx } = toSVG(x, 0)
          return <text key={x} x={sx} y={h - 10} textAnchor="middle" fontSize={10} fill={muted} fontFamily="monospace">{x}</text>
        })}
      </svg>
      <p style={{ fontSize: 11, color: muted, textAlign: 'center', fontFamily: "'DM Mono',monospace", marginTop: 4 }}>Red dot: x=2, f(x)=4</p>
    </div>
  )
}

export default function Tests() {
  const [dark, setDark] = useState(true)

  // SETUP SCREEN
  const [setupDone, setSetupDone] = useState(false)
  const [numQuestions, setNumQuestions] = useState(10)
  const [startDifficulty, setStartDifficulty] = useState('Mixed')
  const [timePerQ, setTimePerQ] = useState(90)
  const [adaptive, setAdaptive] = useState(true)

  // TEST STATE
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({})
  const [selectedOption, setSelectedOption] = useState(null)
  const [typedAnswer, setTypedAnswer] = useState('')
  const [timeLeft, setTimeLeft] = useState(timePerQ)
  const [timerActive, setTimerActive] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [hintUsed, setHintUsed] = useState({})
  const [showTool, setShowTool] = useState(false)
  const [testDone, setTestDone] = useState(false)
  const [tabSwitches, setTabSwitches] = useState(0)
  const timerRef = useRef(null)

  const questions = QUESTIONS.slice(0, numQuestions)
  const q = questions[currentQ]

  const d = dark
  const bg = d ? '#080808' : '#f9f8f5'
  const bg2 = d ? '#111111' : '#ffffff'
  const bg3 = d ? '#161616' : '#f2f1ed'
  const text = d ? '#ede9e3' : '#141210'
  const muted = d ? '#6b6860' : '#8a8680'
  const border = d ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)'
  const border2 = d ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.14)'
  const accent = '#c8f75a'

  // anti-cheat: detect tab switch
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && timerActive) setTabSwitches(prev => prev + 1)
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [timerActive])

  // timer
  useEffect(() => {
    if (!timerActive) return
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          handleNext(true)
          return timePerQ
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [timerActive, currentQ])

  const startTest = () => {
    setSetupDone(true)
    setTimerActive(true)
    setTimeLeft(timePerQ)
  }

  const handleNext = (timedOut = false) => {
    clearInterval(timerRef.current)
    const ans = q.type === 'mcq' || q.type === 'graph' ? selectedOption : typedAnswer
    setAnswers(prev => ({ ...prev, [q.id]: { answer: ans || '', timedOut } }))

    if (currentQ + 1 >= questions.length) {
      setTimerActive(false)
      setTestDone(true)
    } else {
      setCurrentQ(prev => prev + 1)
      setSelectedOption(null)
      setTypedAnswer('')
      setShowHint(false)
      setShowTool(false)
      setTimeLeft(timePerQ)
    }
  }

  const timerColor = timeLeft > timePerQ * 0.5 ? accent : timeLeft > timePerQ * 0.25 ? '#f0a840' : '#f43f5e'
  const timerPercent = (timeLeft / timePerQ) * 100

  // RESULTS
  if (testDone) {
    const results = questions.map(q => {
      const userAns = answers[q.id]?.answer || ''
      const correct = q.type === 'typed'
        ? (q.acceptedAnswers || [q.answer]).some(a => a.toLowerCase().replace(/\s/g, '') === userAns.toLowerCase().replace(/\s/g, ''))
        : userAns === q.answer
      return { ...q, userAnswer: userAns, correct, timedOut: answers[q.id]?.timedOut }
    })
    const score = results.filter(r => r.correct).length
    const pct = Math.round((score / questions.length) * 100)
    const xpEarned = score * 15 + (pct >= 80 ? 100 : 0)
    const weakAreas = results.filter(r => !r.correct).map(r => r.difficulty)
    const masteryGain = Math.round(pct * 0.3)

    return (
      <div style={{ minHeight: '100vh', background: bg, fontFamily: "'Syne',sans-serif", color: text, padding: '2rem' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');*{box-sizing:border-box;margin:0;padding:0}@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          {/* score card */}
          <div style={{ textAlign: 'center', marginBottom: '3rem', animation: 'fadeUp 0.6s ease both' }}>
            <div style={{ fontSize: 56, marginBottom: '1rem' }}>{pct >= 80 ? '🎉' : pct >= 60 ? '📈' : '📚'}</div>
            <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: '3rem', color: text, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
              {pct >= 80 ? 'Excellent work!' : pct >= 60 ? 'Good progress!' : 'Keep practising!'}
            </h1>
            <p style={{ fontSize: 15, color: muted, marginBottom: '2rem' }}>Chain Rule · {questions.length} questions · {tabSwitches > 0 ? `⚠ ${tabSwitches} tab switch${tabSwitches > 1 ? 'es' : ''} detected` : '✓ No cheating detected'}</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { label: 'Score', value: `${pct}%`, color: pct >= 80 ? accent : pct >= 60 ? '#f0a840' : '#f43f5e', icon: '🎯' },
                { label: 'Correct', value: `${score}/${questions.length}`, color: accent, icon: '✓' },
                { label: 'XP Earned', value: `+${xpEarned}`, color: accent, icon: '⚡' },
                { label: 'Mastery +', value: `+${masteryGain}%`, color: '#a78bfa', icon: '🧠' },
              ].map((s, i) => (
                <div key={i} style={{ background: bg2, border: `1px solid ${border}`, borderRadius: 12, padding: '1.25rem', animation: `fadeUp 0.5s ease ${i * 0.08}s both` }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
                  <p style={{ fontSize: 24, fontWeight: 700, color: s.color, fontFamily: "'Instrument Serif',serif", marginBottom: 2 }}>{s.value}</p>
                  <p style={{ fontSize: 11, color: muted, fontFamily: "'DM Mono',monospace", letterSpacing: '0.04em' }}>{s.label}</p>
                </div>
              ))}
            </div>

            {pct < 80 && (
              <div style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 12, padding: '1rem', marginBottom: '1.5rem', textAlign: 'left' }}>
                <p style={{ fontSize: 13, color: '#f97316', fontFamily: "'DM Mono',monospace", letterSpacing: '0.06em', marginBottom: 4 }}>⚠ NEEDS MORE WORK — {weakAreas.filter((v, i, a) => a.indexOf(v) === i).join(', ')} questions</p>
                <p style={{ fontSize: 14, color: muted }}>You need 80%+ to advance. Focus on the questions you got wrong below.</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button onClick={() => { setTestDone(false); setSetupDone(false); setCurrentQ(0); setAnswers({}); setTimerActive(false) }}
                style={{ background: 'transparent', border: `1px solid ${border2}`, borderRadius: 8, padding: '0.8rem 1.5rem', fontSize: 13, color: text, cursor: 'pointer', fontFamily: "'Syne',sans-serif" }}>
                Retake test
              </button>
              <button onClick={() => window.location.href = '/dashboard'}
                style={{ background: accent, border: 'none', borderRadius: 8, padding: '0.8rem 1.5rem', fontSize: 13, fontWeight: 700, color: '#080808', cursor: 'pointer', fontFamily: "'Syne',sans-serif" }}>
                {pct >= 80 ? 'Next chapter →' : 'Back to dashboard'}
              </button>
            </div>
          </div>

          {/* detailed review */}
          <h2 style={{ fontSize: 16, fontWeight: 600, color: text, marginBottom: '1rem' }}>Full Review</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {results.map((r, i) => (
              <div key={i} style={{ background: bg2, border: `1px solid ${r.correct ? 'rgba(200,247,90,0.2)' : 'rgba(244,63,94,0.2)'}`, borderRadius: 12, padding: '1.25rem', animation: `fadeUp 0.4s ease ${i * 0.05}s both` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 16 }}>{r.correct ? '✅' : '❌'}</span>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: muted, letterSpacing: '0.06em' }}>Q{i + 1} · {r.type.toUpperCase()}</span>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 3, background: diffColors[r.difficulty].bg, color: diffColors[r.difficulty].text, border: `1px solid ${diffColors[r.difficulty].border}`, fontFamily: "'DM Mono',monospace" }}>{r.difficulty}</span>
                  </div>
                  {r.timedOut && <span style={{ fontSize: 10, color: '#f0a840', fontFamily: "'DM Mono',monospace", background: 'rgba(240,168,64,0.1)', padding: '2px 8px', borderRadius: 3 }}>TIMED OUT</span>}
                </div>
                <p style={{ fontSize: 14, color: text, marginBottom: '0.75rem', lineHeight: 1.6 }}>{r.question}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <div style={{ background: r.correct ? 'rgba(200,247,90,0.08)' : 'rgba(244,63,94,0.08)', border: `1px solid ${r.correct ? 'rgba(200,247,90,0.2)' : 'rgba(244,63,94,0.2)'}`, borderRadius: 8, padding: '0.6rem 0.75rem' }}>
                    <p style={{ fontSize: 10, color: muted, fontFamily: "'DM Mono',monospace", letterSpacing: '0.06em', marginBottom: 2 }}>YOUR ANSWER</p>
                    <p style={{ fontSize: 13, color: r.correct ? accent : '#f43f5e' }}>{r.userAnswer || '(no answer)'}</p>
                  </div>
                  <div style={{ background: 'rgba(200,247,90,0.08)', border: '1px solid rgba(200,247,90,0.2)', borderRadius: 8, padding: '0.6rem 0.75rem' }}>
                    <p style={{ fontSize: 10, color: muted, fontFamily: "'DM Mono',monospace", letterSpacing: '0.06em', marginBottom: 2 }}>CORRECT ANSWER</p>
                    <p style={{ fontSize: 13, color: accent }}>{r.answer}</p>
                  </div>
                </div>
                <div style={{ background: bg3, borderRadius: 8, padding: '0.75rem' }}>
                  <p style={{ fontSize: 10, color: accent, fontFamily: "'DM Mono',monospace", letterSpacing: '0.06em', marginBottom: 4 }}>EXPLANATION</p>
                  <p style={{ fontSize: 13, color: muted, lineHeight: 1.65 }}>{r.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // SETUP SCREEN
  if (!setupDone) return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: "'Syne',sans-serif", color: text, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');*{box-sizing:border-box;margin:0;padding:0}@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ position: 'absolute', top: '20%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,247,90,0.05) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 560, width: '100%', position: 'relative', zIndex: 1 }}>
        <a href="/dashboard" style={{ fontFamily: "'Instrument Serif',serif", fontSize: 20, color: text, textDecoration: 'none', display: 'block', marginBottom: '2.5rem' }}>
          Study<span style={{ color: accent }}>Notio</span>
        </a>

        <div style={{ animation: 'fadeUp 0.6s ease both' }}>
          <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Configure your test</p>
          <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: '3rem', color: text, marginBottom: '0.5rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Chain Rule<br /><em style={{ color: accent }}>Test</em>
          </h1>
          <p style={{ fontSize: 14, color: muted, marginBottom: '2.5rem', lineHeight: 1.7 }}>
            Questions are generated from your uploaded content. Adaptive difficulty adjusts based on your performance.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            {/* num questions */}
            <div style={{ background: bg2, border: `1px solid ${border}`, borderRadius: 12, padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: text }}>Number of questions</label>
                <span style={{ fontSize: 14, fontWeight: 700, color: accent, fontFamily: "'DM Mono',monospace" }}>{numQuestions}</span>
              </div>
              <input type="range" min={10} max={50} step={5} value={numQuestions} onChange={e => setNumQuestions(Number(e.target.value))}
                style={{ width: '100%', accentColor: accent, cursor: 'pointer' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ fontSize: 10, color: muted, fontFamily: "'DM Mono',monospace" }}>10 MIN</span>
                <span style={{ fontSize: 10, color: muted, fontFamily: "'DM Mono',monospace" }}>50 MAX</span>
              </div>
            </div>

            {/* time per question */}
            <div style={{ background: bg2, border: `1px solid ${border}`, borderRadius: 12, padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: text }}>Time per question</label>
                <span style={{ fontSize: 14, fontWeight: 700, color: accent, fontFamily: "'DM Mono',monospace" }}>{timePerQ}s</span>
              </div>
              <input type="range" min={30} max={300} step={15} value={timePerQ} onChange={e => setTimePerQ(Number(e.target.value))}
                style={{ width: '100%', accentColor: accent, cursor: 'pointer' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ fontSize: 10, color: muted, fontFamily: "'DM Mono',monospace" }}>30s FAST</span>
                <span style={{ fontSize: 10, color: muted, fontFamily: "'DM Mono',monospace" }}>5min RELAXED</span>
              </div>
            </div>

            {/* starting difficulty */}
            <div style={{ background: bg2, border: `1px solid ${border}`, borderRadius: 12, padding: '1.25rem' }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: text, display: 'block', marginBottom: '0.75rem' }}>Starting difficulty</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['Easy', 'Mixed', 'Hard'].map(diff => (
                  <button key={diff} onClick={() => setStartDifficulty(diff)} style={{
                    flex: 1, padding: '0.6rem', borderRadius: 8, border: `1px solid ${startDifficulty === diff ? diffColors[diff === 'Mixed' ? 'Medium' : diff].border : border}`,
                    background: startDifficulty === diff ? diffColors[diff === 'Mixed' ? 'Medium' : diff].bg : bg3,
                    color: startDifficulty === diff ? diffColors[diff === 'Mixed' ? 'Medium' : diff].text : muted,
                    fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Mono',monospace", letterSpacing: '0.04em', transition: 'all 0.2s'
                  }}>{diff}</button>
                ))}
              </div>
            </div>

            {/* adaptive toggle */}
            <div style={{ background: bg2, border: `1px solid ${border}`, borderRadius: 12, padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, color: text, marginBottom: 2 }}>Adaptive difficulty</p>
                <p style={{ fontSize: 12, color: muted }}>Questions get harder as you improve</p>
              </div>
              <div onClick={() => setAdaptive(!adaptive)} style={{ width: 44, height: 24, borderRadius: 12, background: adaptive ? accent : bg3, border: `1px solid ${border2}`, cursor: 'pointer', transition: 'all 0.3s', position: 'relative' }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: adaptive ? '#080808' : muted, position: 'absolute', top: 2, left: adaptive ? 22 : 3, transition: 'left 0.3s' }} />
              </div>
            </div>

            {/* anti-cheat notice */}
            <div style={{ background: 'rgba(240,168,64,0.06)', border: '1px solid rgba(240,168,64,0.15)', borderRadius: 12, padding: '1rem', display: 'flex', gap: 10 }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>🛡</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, color: text, marginBottom: 2 }}>Anti-cheat active</p>
                <p style={{ fontSize: 12, color: muted, lineHeight: 1.6 }}>Tab switches are detected and flagged in your results. Each question is timed. Stay focused!</p>
              </div>
            </div>
          </div>

          <button onClick={startTest} style={{ width: '100%', background: accent, border: 'none', borderRadius: 10, padding: '1rem', fontSize: 15, fontWeight: 700, color: '#080808', cursor: 'pointer', fontFamily: "'Syne',sans-serif", letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'all 0.2s' }}
            onMouseOver={e => { e.currentTarget.style.background = '#d4f96e'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseOut={e => { e.currentTarget.style.background = accent; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Start test →
          </button>
        </div>
      </div>
    </div>
  )

  // TEST SCREEN
  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: "'Syne',sans-serif", color: text, display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes timerPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
        .option-btn{width:100%;text-align:left;padding:1rem 1.25rem;border-radius:10px;border:2px solid;cursor:pointer;font-size:14px;font-family:'Syne',sans-serif;transition:all 0.2s;line-height:1.5}
        .option-btn:hover{transform:translateX(4px)}
        .text-input{width:100%;background:${bg2};border:2px solid ${border};border-radius:10px;padding:0.85rem 1.25rem;font-size:15px;color:${text};font-family:'DM Mono',monospace;outline:none;transition:border-color 0.2s}
        .text-input:focus{border-color:rgba(200,247,90,0.4);box-shadow:0 0 0 3px rgba(200,247,90,0.06)}
        .text-input::placeholder{color:${muted}}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:${bg}}
        ::-webkit-scrollbar-thumb{background:${border2};border-radius:2px}
      `}</style>

      {/* top bar */}
      <div style={{ background: d ? 'rgba(8,8,8,0.95)' : 'rgba(249,248,245,0.95)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${border}`, padding: '0 2rem', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontFamily: "'Instrument Serif',serif", fontSize: 18, color: text }}>Study<span style={{ color: accent }}>Notio</span></span>
          <span style={{ color: border2 }}>›</span>
          <span style={{ fontSize: 13, color: muted }}>Chain Rule Test</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {tabSwitches > 0 && (
            <span style={{ fontSize: 11, color: '#f0a840', fontFamily: "'DM Mono',monospace", background: 'rgba(240,168,64,0.1)', padding: '3px 10px', borderRadius: 100, border: '1px solid rgba(240,168,64,0.2)' }}>
              ⚠ {tabSwitches} tab switch{tabSwitches > 1 ? 'es' : ''}
            </span>
          )}
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: muted }}>{currentQ + 1} / {questions.length}</span>
          <button onClick={() => setDark(!dark)} style={{ background: 'transparent', border: `1px solid ${border}`, borderRadius: 6, width: 30, height: 30, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', color: muted }}>{dark ? '☀' : '☾'}</button>
        </div>
      </div>

      {/* progress bar */}
      <div style={{ height: 3, background: bg3 }}>
        <div style={{ height: '100%', background: accent, width: `${((currentQ) / questions.length) * 100}%`, transition: 'width 0.3s ease' }} />
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: showTool ? '1fr 340px' : '1fr', maxWidth: 900, margin: '0 auto', width: '100%', padding: '2.5rem 2rem', gap: '2rem', alignItems: 'start' }}>

        {/* QUESTION */}
        <div style={{ animation: 'fadeUp 0.5s ease both' }}>

          {/* timer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 100, background: diffColors[q.difficulty].bg, color: diffColors[q.difficulty].text, border: `1px solid ${diffColors[q.difficulty].border}`, fontFamily: "'DM Mono',monospace", letterSpacing: '0.04em' }}>{q.difficulty}</span>
              <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 100, background: bg3, color: muted, border: `1px solid ${border}`, fontFamily: "'DM Mono',monospace", letterSpacing: '0.04em' }}>{q.type.toUpperCase()}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 120, height: 6, background: bg3, borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 3, background: timerColor, width: `${timerPercent}%`, transition: 'width 1s linear, background 0.3s' }} />
              </div>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 14, fontWeight: 700, color: timerColor, minWidth: 32, animation: timeLeft <= 10 ? 'timerPulse 0.5s ease-in-out infinite' : 'none' }}>{timeLeft}s</span>
            </div>
          </div>

          <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 400, color: text, marginBottom: '2rem', lineHeight: 1.4, letterSpacing: '-0.01em' }}>
            {q.question}
          </h2>

          {/* MCQ / GRAPH OPTIONS */}
          {(q.type === 'mcq' || q.type === 'graph') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {q.options.map((opt, i) => (
                <button key={i} className="option-btn" onClick={() => setSelectedOption(opt)} style={{
                  background: selectedOption === opt ? 'rgba(200,247,90,0.1)' : bg2,
                  borderColor: selectedOption === opt ? accent : border,
                  color: selectedOption === opt ? text : muted,
                }}>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: muted, marginRight: 10, letterSpacing: '0.04em' }}>{String.fromCharCode(65 + i)}.</span>
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* TYPED */}
          {q.type === 'typed' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <input className="text-input" value={typedAnswer} onChange={e => setTypedAnswer(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleNext() }}
                placeholder="Type your answer here... (e.g. 3x², 2sin(x)cos(x))"
              />
              {q.hint && (
                <button onClick={() => setShowHint(!showHint)} style={{ marginTop: 8, background: 'transparent', border: 'none', color: '#f0a840', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Mono',monospace", letterSpacing: '0.04em' }}>
                  {showHint ? '▲ HIDE HINT' : '💡 SHOW HINT (costs mastery)'}
                </button>
              )}
              {showHint && q.hint && (
                <div style={{ marginTop: 8, background: 'rgba(240,168,64,0.08)', border: '1px solid rgba(240,168,64,0.2)', borderRadius: 8, padding: '0.75rem 1rem', fontSize: 13, color: '#f0a840', animation: 'fadeIn 0.3s ease' }}>
                  💡 {q.hint}
                </div>
              )}
            </div>
          )}

          {/* tool toggle */}
          {q.tool && (
            <div style={{ marginBottom: '1.5rem' }}>
              <button onClick={() => setShowTool(!showTool)} style={{ background: showTool ? 'rgba(200,247,90,0.1)' : bg3, border: `1px solid ${showTool ? 'rgba(200,247,90,0.3)' : border}`, borderRadius: 8, padding: '0.6rem 1.25rem', fontSize: 12, color: showTool ? accent : muted, cursor: 'pointer', fontFamily: "'DM Mono',monospace", letterSpacing: '0.04em', transition: 'all 0.2s' }}>
                {q.tool === 'calculator' ? '🧮 ' : '📊 '}{showTool ? 'HIDE' : 'OPEN'} {q.tool === 'calculator' ? 'CALCULATOR' : 'GRAPH'}
              </button>
            </div>
          )}

          <button onClick={() => handleNext()} disabled={q.type === 'mcq' || q.type === 'graph' ? !selectedOption : !typedAnswer.trim()}
            style={{ background: accent, border: 'none', borderRadius: 10, padding: '0.9rem 2rem', fontSize: 14, fontWeight: 700, color: '#080808', cursor: 'pointer', fontFamily: "'Syne',sans-serif", letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'all 0.2s', opacity: (q.type === 'mcq' || q.type === 'graph' ? !selectedOption : !typedAnswer.trim()) ? 0.4 : 1 }}>
            {currentQ + 1 === questions.length ? 'Submit test →' : 'Next question →'}
          </button>
        </div>

        {/* TOOL PANEL */}
        {showTool && q.tool && (
          <div style={{ animation: 'fadeUp 0.4s ease both', position: 'sticky', top: '1rem' }}>
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              {q.tool === 'calculator' ? '🧮 Scientific Calculator' : '📊 Graph Tool'}
            </p>
            {q.tool === 'calculator' ? <Calculator dark={dark} /> : <DesmosGraph dark={dark} />}
          </div>
        )}
      </div>
    </div>
  )
}