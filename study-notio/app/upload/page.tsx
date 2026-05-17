'use client'
import { useState, useRef, useCallback } from 'react'

const methods = [
  {
    id: 'pdf',
    icon: '📄',
    title: 'PDF Document',
    desc: 'Upload any textbook chapter, notes, or worksheet',
    accent: '#c8f75a',
    bg: 'rgba(200,247,90,0.08)',
    border: 'rgba(200,247,90,0.25)',
  },
  {
    id: 'image',
    icon: '📸',
    title: 'Photo / Image',
    desc: 'Snap a photo of your textbook or handwritten notes',
    accent: '#a78bfa',
    bg: 'rgba(167,139,250,0.08)',
    border: 'rgba(167,139,250,0.25)',
  },
  {
    id: 'youtube',
    icon: '▶',
    title: 'YouTube Link',
    desc: 'Paste any maths tutorial or lecture video link',
    accent: '#f43f5e',
    bg: 'rgba(244,63,94,0.08)',
    border: 'rgba(244,63,94,0.25)',
  },
  {
    id: 'topic',
    icon: '✏️',
    title: 'Type a Topic',
    desc: 'Just type the topic name and we\'ll handle the rest',
    accent: '#60d4f7',
    bg: 'rgba(96,212,247,0.08)',
    border: 'rgba(96,212,247,0.25)',
  },
]

const analysisSteps = [
  { text: 'Reading your content...', dur: 1200 },
  { text: 'Extracting key concepts...', dur: 1400 },
  { text: 'Mapping topic dependencies...', dur: 1200 },
  { text: 'Assessing difficulty levels...', dur: 1000 },
  { text: 'Building your profile...', dur: 800 },
]

const mockConcepts = [
  { name: 'Limits & Continuity', difficulty: 'Foundation', mastery: 0, deps: [] },
  { name: 'First Principles', difficulty: 'Beginner', mastery: 0, deps: ['Limits & Continuity'] },
  { name: 'Chain Rule', difficulty: 'Intermediate', mastery: 0, deps: ['First Principles'] },
  { name: 'Product Rule', difficulty: 'Intermediate', mastery: 0, deps: ['First Principles'] },
  { name: 'Implicit Differentiation', difficulty: 'Advanced', mastery: 0, deps: ['Chain Rule', 'Product Rule'] },
  { name: 'Related Rates', difficulty: 'Advanced', mastery: 0, deps: ['Implicit Differentiation'] },
]

const diffColors = {
  Foundation: { bg: 'rgba(200,247,90,0.12)', text: '#c8f75a', border: 'rgba(200,247,90,0.25)' },
  Beginner: { bg: 'rgba(96,212,247,0.12)', text: '#60d4f7', border: 'rgba(96,212,247,0.25)' },
  Intermediate: { bg: 'rgba(240,168,64,0.12)', text: '#f0a840', border: 'rgba(240,168,64,0.25)' },
  Advanced: { bg: 'rgba(244,63,94,0.12)', text: '#f43f5e', border: 'rgba(244,63,94,0.25)' },
}

export default function Upload() {
  const [dark, setDark] = useState(true)
  const [step, setStep] = useState(1) // 1=pick method, 2=upload, 3=analysing, 4=results
  const [method, setMethod] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState(null)
  const [ytLink, setYtLink] = useState('')
  const [topic, setTopic] = useState('')
  const [analysisStep, setAnalysisStep] = useState(0)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [examType, setExamType] = useState('')
  const [days, setDays] = useState(30)
  const fileRef = useRef(null)

  const d = dark
  const bg = d ? '#0a0a0a' : '#f9f8f5'
  const bg2 = d ? '#111111' : '#ffffff'
  const bg3 = d ? '#1a1a1a' : '#f0efe9'
  const text = d ? '#ede9e3' : '#141210'
  const muted = d ? '#6b6860' : '#8a8680'
  const border = d ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)'
  const border2 = d ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.14)'
  const accent = '#c8f75a'

  const selectedMethod = methods.find(m => m.id === method)

  const startAnalysis = () => {
    setStep(3)
    let stepIdx = 0
    let progress = 0
    const progressInterval = setInterval(() => {
      progress += 1.5
      setAnalysisProgress(Math.min(progress, 100))
      if (progress >= 100) clearInterval(progressInterval)
    }, 60)
    const runStep = () => {
      if (stepIdx < analysisSteps.length) {
        setAnalysisStep(stepIdx)
        setTimeout(() => { stepIdx++; runStep() }, analysisSteps[stepIdx]?.dur || 1000)
      } else {
        setTimeout(() => setStep(4), 500)
      }
    }
    runStep()
  }

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) setFile(f)
  }, [])

  const canProceed = () => {
    if (method === 'pdf' || method === 'image') return !!file
    if (method === 'youtube') return ytLink.length > 10
    if (method === 'topic') return topic.length > 2
    return false
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: "'Syne',sans-serif", color: text, transition: 'all 0.3s', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.08);opacity:0.8}}
        @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes gradMove{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        .fade-up{animation:fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards}
        .method-card{border-radius:16px;padding:1.5rem;cursor:pointer;transition:all 0.25s;border:2px solid transparent;position:relative;overflow:hidden}
        .method-card:hover{transform:translateY(-4px)}
        .upload-zone{border-radius:20px;padding:3rem 2rem;text-align:center;transition:all 0.3s;cursor:pointer;position:relative;overflow:hidden}
        .upload-zone.dragging{transform:scale(1.02)}
        .btn-main{background:#c8f75a;color:#0a0a0a;border:none;border-radius:8px;padding:0.9rem 2rem;font-size:14px;font-weight:700;cursor:pointer;font-family:'Syne',sans-serif;letter-spacing:0.06em;text-transform:uppercase;transition:all 0.2s;display:inline-flex;align-items:center;gap:8px}
        .btn-main:hover:not(:disabled){background:#d4f96e;transform:translateY(-2px);box-shadow:0 8px 24px rgba(200,247,90,0.25)}
        .btn-main:disabled{opacity:0.4;cursor:not-allowed;transform:none}
        .btn-ghost{background:transparent;color:${text};border:1px solid ${border2};border-radius:8px;padding:0.9rem 1.5rem;font-size:13px;font-weight:500;cursor:pointer;font-family:'Syne',sans-serif;transition:all 0.2s}
        .btn-ghost:hover{background:${bg3};border-color:${border2}}
        .concept-card{background:${bg2};border:1px solid ${border};border-radius:12px;padding:1rem 1.25rem;transition:all 0.3s;animation:fadeUp 0.5s ease both}
        .concept-card:hover{border-color:${border2};transform:translateY(-2px)}
        .text-input{width:100%;background:${bg2};border:2px solid ${border};border-radius:12px;padding:1rem 1.25rem;font-size:15px;color:${text};font-family:'Syne',sans-serif;outline:none;transition:all 0.2s}
        .text-input:focus{border-color:rgba(200,247,90,0.5);box-shadow:0 0 0 4px rgba(200,247,90,0.08)}
        .text-input::placeholder{color:${muted}}
        .step-dot{width:8px;height:8px;border-radius:50%;transition:all 0.3s}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:${bg}}
        ::-webkit-scrollbar-thumb{background:${border2};border-radius:2px}
      `}</style>

      {/* background blobs */}
      <div style={{ position: 'fixed', top: '-20%', right: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,247,90,0.06) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '-20%', left: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: d ? 'rgba(10,10,10,0.85)' : 'rgba(249,248,245,0.85)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${border}`, padding: '0 2.5rem', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/dashboard" style={{ fontFamily: "'Instrument Serif',serif", fontSize: 20, color: text, textDecoration: 'none' }}>
          Study<span style={{ color: accent }}>Notio</span>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* step indicators */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {['Pick method', 'Upload', 'Analysing', 'Results'].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div className="step-dot" style={{ background: step > i + 1 ? accent : step === i + 1 ? accent : border2, width: step === i + 1 ? 24 : 8, borderRadius: step === i + 1 ? 4 : '50%' }} />
                {step === i + 1 && <span style={{ fontSize: 11, color: accent, fontFamily: "'DM Mono',monospace", letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s}</span>}
              </div>
            ))}
          </div>
          <button onClick={() => setDark(!dark)} style={{ background: 'transparent', border: `1px solid ${border}`, borderRadius: 6, width: 32, height: 32, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: muted }}>
            {dark ? '☀' : '☾'}
          </button>
        </div>
      </nav>

      <div style={{ paddingTop: '5rem', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>

        {/* ── STEP 1: PICK METHOD ── */}
        {step === 1 && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem' }}>
            <div className="fade-up" style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: accent, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>Step 1 of 3</p>
              <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 'clamp(2.5rem,5vw,4rem)', fontWeight: 400, letterSpacing: '-0.02em', color: text, marginBottom: '1rem', lineHeight: 1.1 }}>
                How do you want<br />to <em style={{ color: accent }}>upload?</em>
              </h1>
              <p style={{ fontSize: 16, color: muted, maxWidth: 440, margin: '0 auto', lineHeight: 1.7 }}>
                Choose your content format. StudyNotio will read it, analyse it, and build your personalised study plan.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', maxWidth: 960, width: '100%', marginBottom: '2rem' }}>
              {methods.map((m, i) => (
                <div key={m.id} className="method-card fade-up" onClick={() => { setMethod(m.id); setStep(2) }}
                  style={{ background: method === m.id ? m.bg : bg2, border: `2px solid ${method === m.id ? m.accent : border}`, animationDelay: `${i * 0.08}s` }}
                  onMouseOver={e => { e.currentTarget.style.background = m.bg; e.currentTarget.style.borderColor = m.border }}
                  onMouseOut={e => { e.currentTarget.style.background = method === m.id ? m.bg : bg2; e.currentTarget.style.borderColor = method === m.id ? m.accent : border }}
                >
                  <div style={{ fontSize: 36, marginBottom: '1rem', display: 'block', animation: 'float 3s ease-in-out infinite', animationDelay: `${i * 0.5}s` }}>{m.icon}</div>
                  <h3 style={{ fontSize: 17, fontWeight: 600, color: text, marginBottom: '0.5rem' }}>{m.title}</h3>
                  <p style={{ fontSize: 13, color: muted, lineHeight: 1.6 }}>{m.desc}</p>
                  <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', width: 28, height: 28, borderRadius: '50%', background: m.bg, border: `1px solid ${m.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>→</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 2: UPLOAD ── */}
        {step === 2 && selectedMethod && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem' }}>
            <div className="fade-up" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <button onClick={() => setStep(1)} style={{ background: 'transparent', border: 'none', color: muted, cursor: 'pointer', fontSize: 13, fontFamily: "'DM Mono',monospace", letterSpacing: '0.06em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 6, margin: '0 auto 1rem' }}>
                ← BACK
              </button>
              <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: selectedMethod.accent, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>Step 2 of 3 · {selectedMethod.title}</p>
              <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 400, letterSpacing: '-0.02em', color: text, marginBottom: '0.75rem' }}>
                {method === 'pdf' && 'Drop your PDF here'}
                {method === 'image' && 'Upload your photo'}
                {method === 'youtube' && 'Paste the YouTube link'}
                {method === 'topic' && 'What topic are you studying?'}
              </h1>
            </div>

            <div style={{ maxWidth: 640, width: '100%' }}>
              {/* PDF / IMAGE upload zone */}
              {(method === 'pdf' || method === 'image') && (
                <div className={`upload-zone fade-up${dragging ? ' dragging' : ''}`}
                  style={{ background: file ? `${selectedMethod.bg}` : bg2, border: `2px dashed ${file ? selectedMethod.accent : dragging ? selectedMethod.accent : border2}`, boxShadow: dragging ? `0 0 40px ${selectedMethod.accent}20` : 'none' }}
                  onDragOver={e => { e.preventDefault(); setDragging(true) }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={onDrop}
                  onClick={() => fileRef.current?.click()}
                >
                  <input ref={fileRef} type="file" accept={method === 'pdf' ? '.pdf' : 'image/*'} style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} />

                  {file ? (
                    <div style={{ animation: 'fadeIn 0.4s ease' }}>
                      <div style={{ fontSize: 48, marginBottom: '1rem' }}>{method === 'pdf' ? '📄' : '🖼'}</div>
                      <p style={{ fontSize: 16, fontWeight: 600, color: text, marginBottom: 4 }}>{file.name}</p>
                      <p style={{ fontSize: 13, color: muted, marginBottom: '1.5rem' }}>{(file.size / 1024 / 1024).toFixed(2)} MB · Ready to analyse</p>
                      <button onClick={e => { e.stopPropagation(); setFile(null) }} style={{ background: 'transparent', border: `1px solid ${border2}`, borderRadius: 6, padding: '0.4rem 1rem', fontSize: 12, color: muted, cursor: 'pointer', fontFamily: "'DM Mono',monospace" }}>
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: 56, marginBottom: '1.25rem', animation: 'float 3s ease-in-out infinite' }}>{selectedMethod.icon}</div>
                      <p style={{ fontSize: 16, fontWeight: 500, color: text, marginBottom: 8 }}>
                        {dragging ? 'Drop it!' : `Drag & drop your ${method === 'pdf' ? 'PDF' : 'image'} here`}
                      </p>
                      <p style={{ fontSize: 13, color: muted, marginBottom: '1.5rem' }}>or click to browse</p>
                      <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: muted, letterSpacing: '0.06em', background: bg3, padding: '4px 12px', borderRadius: 100, border: `1px solid ${border}` }}>
                        {method === 'pdf' ? 'PDF UP TO 50MB' : 'JPG, PNG, WEBP UP TO 20MB'}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* YOUTUBE */}
              {method === 'youtube' && (
                <div className="fade-up">
                  <div style={{ position: 'relative', marginBottom: '1rem' }}>
                    <span style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', fontSize: 18 }}>▶</span>
                    <input className="text-input" style={{ paddingLeft: '3rem' }} type="url" value={ytLink} onChange={e => setYtLink(e.target.value)} placeholder="https://youtube.com/watch?v=..." />
                  </div>
                  {ytLink.length > 10 && (
                    <div style={{ background: bg2, border: `1px solid ${border}`, borderRadius: 12, padding: '1rem', display: 'flex', alignItems: 'center', gap: 12, animation: 'fadeIn 0.3s ease' }}>
                      <div style={{ width: 48, height: 48, background: 'rgba(244,63,94,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>▶</div>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 500, color: text, marginBottom: 2 }}>YouTube video detected</p>
                        <p style={{ fontSize: 12, color: muted, fontFamily: "'DM Mono',monospace" }}>Ready to extract transcript & analyse</p>
                      </div>
                      <span style={{ marginLeft: 'auto', fontSize: 18 }}>✓</span>
                    </div>
                  )}
                </div>
              )}

              {/* TOPIC */}
              {method === 'topic' && (
                <div className="fade-up">
                  <textarea className="text-input" rows={3} value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Integration by Parts, Quadratic Equations, Probability..." style={{ resize: 'none', marginBottom: '1rem' }} />
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {['Integration by Parts', 'Quadratic Formula', 'Trigonometric Identities', 'Matrix Multiplication', 'Probability'].map((t, i) => (
                      <button key={i} onClick={() => setTopic(t)} style={{ background: bg3, border: `1px solid ${border}`, borderRadius: 100, padding: '5px 14px', fontSize: 12, color: muted, cursor: 'pointer', fontFamily: "'DM Mono',monospace', fontFamily:", transition: 'all 0.2s' }}
                        onMouseOver={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent }}
                        onMouseOut={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.color = muted }}
                      >{t}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* exam + days */}
              <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                <div>
                  <label style={{ fontSize: 11, color: muted, fontFamily: "'DM Mono',monospace", letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Exam type</label>
                  <select className="text-input" value={examType} onChange={e => setExamType(e.target.value)} style={{ cursor: 'pointer' }}>
                    <option value="">Select exam...</option>
                    {['JEE Mains', 'JEE Advanced', 'SAT', 'ACT', 'CBSE Boards', 'A-Levels', 'IB Maths', 'IGCSE', 'AP Calculus', 'Other'].map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, color: muted, fontFamily: "'DM Mono',monospace", letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Study days: {days}</label>
                  <input type="range" min={7} max={90} value={days} onChange={e => setDays(e.target.value)}
                    style={{ width: '100%', accentColor: accent, marginTop: 8, cursor: 'pointer' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    <span style={{ fontSize: 10, color: muted, fontFamily: "'DM Mono',monospace" }}>7 days</span>
                    <span style={{ fontSize: 10, color: muted, fontFamily: "'DM Mono',monospace" }}>90 days</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
                <button className="btn-ghost" onClick={() => setStep(1)}>← Back</button>
                <button className="btn-main" disabled={!canProceed()} onClick={startAnalysis}>
                  Analyse content →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: ANALYSING ── */}
        {step === 3 && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem', textAlign: 'center' }}>
            <div className="fade-up" style={{ maxWidth: 520, width: '100%' }}>
              {/* spinner */}
              <div style={{ width: 80, height: 80, margin: '0 auto 2rem', position: 'relative' }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: `3px solid ${border}`, borderTop: `3px solid ${accent}`, animation: 'spin 1s linear infinite' }} />
                <div style={{ position: 'absolute', inset: 8, borderRadius: '50%', border: `2px solid ${border}`, borderBottom: `2px solid rgba(200,247,90,0.4)`, animation: 'spin 1.5s linear infinite reverse' }} />
                <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: 24 }}>🧠</span>
              </div>

              <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: '2.4rem', fontWeight: 400, color: text, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
                Analysing your content
              </h2>
              <p style={{ fontSize: 14, color: muted, marginBottom: '2.5rem', lineHeight: 1.7 }}>
                Our AI is reading your material, extracting concepts, and mapping topic dependencies.
              </p>

              {/* progress bar */}
              <div style={{ background: bg2, border: `1px solid ${border}`, borderRadius: 12, padding: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: text }}>{analysisSteps[Math.min(analysisStep, analysisSteps.length - 1)]?.text}</span>
                  <span style={{ fontSize: 13, color: accent, fontFamily: "'DM Mono',monospace" }}>{Math.round(analysisProgress)}%</span>
                </div>
                <div style={{ height: 6, background: bg3, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${accent}, #a8e840)`, width: `${analysisProgress}%`, transition: 'width 0.3s ease', boxShadow: `0 0 12px rgba(200,247,90,0.4)` }} />
                </div>
              </div>

              {/* steps list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {analysisSteps.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.6rem 1rem', background: bg2, border: `1px solid ${border}`, borderRadius: 8, opacity: i <= analysisStep ? 1 : 0.4, transition: 'all 0.3s' }}>
                    <span style={{ fontSize: 14 }}>{i < analysisStep ? '✓' : i === analysisStep ? '⟳' : '○'}</span>
                    <span style={{ fontSize: 13, color: i < analysisStep ? accent : i === analysisStep ? text : muted }}>{s.text}</span>
                    {i < analysisStep && <span style={{ marginLeft: 'auto', fontSize: 11, color: accent, fontFamily: "'DM Mono',monospace" }}>Done</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4: RESULTS ── */}
        {step === 4 && (
          <div style={{ flex: 1, padding: '3rem 2rem', maxWidth: 900, margin: '0 auto', width: '100%' }}>
            <div className="fade-up" style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(200,247,90,0.15)', border: '1px solid rgba(200,247,90,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>✓</div>
                <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: accent, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Analysis complete</p>
              </div>
              <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 400, letterSpacing: '-0.02em', color: text, marginBottom: '0.5rem' }}>
                We found 6 concepts
              </h1>
              <p style={{ fontSize: 15, color: muted, lineHeight: 1.7 }}>
                Here's what we extracted from your content. Review the concepts and difficulty mapping before building your study plan.
              </p>
            </div>

            {/* summary cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { label: 'Concepts found', value: '6', icon: '🧠', color: accent },
                { label: 'Estimated hours', value: '18', icon: '⏱', color: '#a78bfa' },
                { label: 'Difficulty', value: 'Mixed', icon: '📊', color: '#60d4f7' },
                { label: 'Study days', value: days, icon: '📅', color: '#f0a840' },
              ].map((s, i) => (
                <div key={i} style={{ background: bg2, border: `1px solid ${border}`, borderRadius: 12, padding: '1rem', animation: `fadeUp 0.5s ease ${i * 0.08}s both` }}>
                  <span style={{ fontSize: 20, display: 'block', marginBottom: 8 }}>{s.icon}</span>
                  <p style={{ fontSize: 22, fontWeight: 700, color: s.color, fontFamily: "'Instrument Serif',serif", marginBottom: 2 }}>{s.value}</p>
                  <p style={{ fontSize: 11, color: muted, fontFamily: "'DM Mono',monospace", letterSpacing: '0.04em', textTransform: 'uppercase' }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* concepts */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: text, marginBottom: '1rem' }}>Extracted concepts — in learning order</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {mockConcepts.map((c, i) => (
                  <div key={i} className="concept-card" style={{ animationDelay: `${i * 0.07}s`, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: bg3, border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontFamily: "'DM Mono',monospace", color: muted, flexShrink: 0 }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 15, fontWeight: 500, color: text, marginBottom: 2 }}>{c.name}</p>
                      {c.deps.length > 0 && <p style={{ fontSize: 11, color: muted, fontFamily: "'DM Mono',monospace" }}>Requires: {c.deps.join(', ')}</p>}
                    </div>
                    <span style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", padding: '3px 10px', borderRadius: 3, background: diffColors[c.difficulty].bg, color: diffColors[c.difficulty].text, border: `1px solid ${diffColors[c.difficulty].border}`, letterSpacing: '0.04em' }}>
                      {c.difficulty}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div style={{ background: bg2, border: `2px solid rgba(200,247,90,0.2)`, borderRadius: 16, padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', animation: 'fadeUp 0.6s ease 0.4s both' }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: text, marginBottom: 4 }}>Ready to build your study plan?</h3>
                <p style={{ fontSize: 14, color: muted }}>
                  {days}-day personalised plan · 6 concepts · Sequenced by dependency
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn-ghost" onClick={() => setStep(1)}>Upload another</button>
                <button className="btn-main" onClick={() => window.location.href = '/plan'}>
                  Build my plan →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}