'use client'
import { useState, useEffect, useRef } from 'react'

function useInView(threshold = 0.12) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, inView]
}

function Reveal({ children, delay = 0, y = 40, style = {} }) {
  const [ref, inView] = useInView()
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : `translateY(${y}px)`,
      transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      ...style
    }}>
      {children}
    </div>
  )
}

function TypingText({ words, color }) {
  const [wordIndex, setWordIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)
  useEffect(() => {
    const word = words[wordIndex]
    let timeout
    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 75)
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 2200)
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40)
    } else if (deleting && displayed.length === 0) {
      setDeleting(false)
      setWordIndex((wordIndex + 1) % words.length)
    }
    return () => clearTimeout(timeout)
  }, [displayed, deleting, wordIndex, words])
  return (
    <span style={{ color, fontStyle: 'italic' }}>
      {displayed}
      <span style={{ display: 'inline-block', width: 3, height: '0.8em', background: color, marginLeft: 2, verticalAlign: 'middle', animation: 'blink 1s step-end infinite' }} />
    </span>
  )
}

const marqueeItems = ['Calculus', 'JEE Mains', 'Trigonometry', 'SAT Math', 'Differentiation', 'A-Levels', 'Linear Algebra', 'CBSE Boards', 'Integration', 'IB Maths', 'Statistics', 'AP Calculus', 'Probability', 'GCSE Maths', 'Matrices', 'ACT Math', 'Complex Numbers', 'IGCSE', 'Vectors', 'Pure Maths', 'Number Theory', 'Permutations']

const features = [
  { num: '01', title: 'Upload anything', body: 'PDF, photo of your textbook, YouTube link, or just type a topic. Your content — not some generic syllabus.', tag: 'Input' },
  { num: '02', title: 'AI reads it deeply', body: 'Every concept, every dependency, every difficulty level — extracted automatically from your exact material.', tag: 'Analysis' },
  { num: '03', title: 'Smart study plan', body: "Can't do integration before differentiation. AI sequences topics in the order your brain actually needs.", tag: 'Planning' },
  { num: '04', title: 'Socratic tutor', body: "Doesn't just explain. Asks you questions first, finds your gap, then teaches exactly what's missing.", tag: 'Teaching' },
  { num: '05', title: 'Adaptive tests', body: 'Questions from your content. Difficulty rises as you improve. Weak spots automatically revisited.', tag: 'Testing' },
  { num: '06', title: 'Streak & progress', body: 'Daily streaks, chapter badges, weak area alerts, exam countdown. Makes studying feel like winning.', tag: 'Growth' },
]

const faqs = [
  { q: 'What exams does it support?', a: 'Any maths exam anywhere — JEE, SAT, ACT, CBSE, A-Levels, IB, IGCSE, AP Calculus, and more. If you can upload the content, StudyNotio teaches it.' },
  { q: "How is this different from ChatGPT?", a: "ChatGPT answers questions. StudyNotio builds a structured plan from YOUR content, teaches using the Socratic method, tracks your weak areas, and adapts over time. It's a study system, not a chatbot." },
  { q: 'Can I upload a photo of my textbook?', a: 'Yes. Snap any page — printed textbook, handwritten notes, worksheet — and the AI reads and analyses it instantly.' },
  { q: 'Is the free plan actually useful?', a: 'Genuinely yes. You get a real study plan, AI tutor sessions, and tests — just with daily limits. Most students start free and upgrade before their exam.' },
  { q: 'What language is the tutor in?', a: 'English. But it understands maths notation from any curriculum — Indian, American, British, or otherwise.' },
]

const freeFeatures = ['1 active study plan', 'PDF uploads only', '10 AI tutor messages/day', '5 test questions/session', 'Basic progress tracking']
const proFeatures = ['Unlimited study plans', 'PDF · Image · YouTube · Text', 'Unlimited AI tutor', 'Unlimited adaptive tests', 'Full analytics & weak areas', 'Daily streak & badges', 'Exam countdown timer', 'Priority support']

export default function Home() {
  const [dark, setDark] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [yearly, setYearly] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const d = dark
  const bg = d ? '#080808' : '#f9f8f5'
  const bg2 = d ? '#101010' : '#ffffff'
  const bg3 = d ? '#161616' : '#f2f1ed'
  const text = d ? '#ede9e3' : '#141210'
  const muted = d ? '#6b6860' : '#8a8680'
  const muted2 = d ? '#9a9690' : '#706e6a'
  const border = d ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'
  const border2 = d ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'
  const accent = '#c8f75a'
  const navBg = scrolled ? (d ? 'rgba(8,8,8,0.92)' : 'rgba(249,248,245,0.92)') : 'transparent'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:${bg};color:${text};font-family:'Syne',sans-serif;font-weight:400;transition:background 0.5s,color 0.5s;overflow-x:hidden}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes marqueeL{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes marqueeR{0%{transform:translateX(-50%)}100%{transform:translateX(0)}}
        @keyframes heroIn{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes gradRotate{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
        .nav-a{color:${muted};text-decoration:none;font-size:13px;font-weight:500;letter-spacing:0.04em;transition:color 0.2s;text-transform:uppercase}
        .nav-a:hover{color:${text}}
        .btn-g{background:${accent};color:#080808;border:none;padding:0.75rem 1.75rem;border-radius:3px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Syne',sans-serif;letter-spacing:0.06em;text-transform:uppercase;transition:all 0.2s}
        .btn-g:hover{background:#d4f96e;transform:translateY(-1px)}
        .btn-ghost{background:transparent;color:${text};border:1px solid ${border2};padding:0.75rem 1.75rem;border-radius:3px;font-size:13px;font-weight:500;cursor:pointer;font-family:'Syne',sans-serif;letter-spacing:0.04em;transition:all 0.2s}
        .btn-ghost:hover{border-color:${muted};background:${bg3}}
        .f-card{border-top:1px solid ${border};padding:2rem 0;transition:all 0.3s;cursor:default}
        .f-card:hover .f-num{color:${accent}}
        .f-card:hover{border-top-color:${accent}}
        .f-num{font-family:'DM Mono',monospace;font-size:11px;color:${muted};letter-spacing:0.1em;transition:color 0.3s;margin-bottom:0.75rem}
        .faq-row{border-bottom:1px solid ${border};padding:1.5rem 0;cursor:pointer;transition:border-color 0.2s}
        .faq-row:hover{border-bottom-color:${border2}}
        .tag-pill{display:inline-block;font-family:'DM Mono',monospace;font-size:10px;font-weight:500;padding:4px 10px;border-radius:2px;letter-spacing:0.08em;text-transform:uppercase;border:1px solid ${border2};color:${muted}}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:${bg}}
        ::-webkit-scrollbar-thumb{background:${border2};border-radius:2px}
        ::selection{background:rgba(200,247,90,0.25);color:${text}}
      `}</style>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: navBg, backdropFilter: scrolled ? 'blur(24px)' : 'none', borderBottom: scrolled ? `1px solid ${border}` : 'none', transition: 'all 0.4s', padding: '0 3rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: "'Instrument Serif',serif", fontSize: 22, fontWeight: 400, letterSpacing: '-0.01em' }}>
            Study<span style={{ color: accent }}>Notio</span>
          </span>
          <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
            {[['Features', '#features'], ['How it works', '#how'], ['Pricing', '#pricing'], ['FAQ', '#faq']].map(([label, href]) => (
              <a key={label} href={href} className="nav-a">{label}</a>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button onClick={() => setDark(!dark)} style={{ background: 'transparent', border: `1px solid ${border}`, borderRadius: 3, width: 34, height: 34, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: muted, transition: 'all 0.2s' }}>{dark ? '☀' : '☾'}</button>
            <button className="btn-ghost" style={{ padding: '0.5rem 1.25rem' }}>Log in</button>
            <button className="btn-g" style={{ padding: '0.5rem 1.25rem' }}>Start free</button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '8rem 3rem 6rem', position: 'relative', overflow: 'hidden', maxWidth: 1200, margin: '0 auto' }}>

        {/* background orb */}
        <div style={{ position: 'fixed', top: '20%', right: '-10%', width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle, rgba(200,247,90,0.05) 0%, transparent 65%)`, pointerEvents: 'none', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center', width: '100%' }}>

          {/* LEFT */}
          <div style={{ animation: 'heroIn 1s cubic-bezier(0.16,1,0.3,1) forwards' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '2rem' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: accent, display: 'inline-block' }} />
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: accent, letterSpacing: '0.12em', textTransform: 'uppercase' }}>AI Maths Tutoring</span>
            </div>

            <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 'clamp(3.2rem,5.5vw,5.2rem)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '2rem', color: text }}>
              The last maths<br />
              tutor you'll<br />
              ever <TypingText words={['need.', 'want.', 'love.']} color={accent} />
            </h1>

            <p style={{ fontSize: 16, color: muted2, lineHeight: 1.8, maxWidth: 420, marginBottom: '2.5rem', fontFamily: "'Syne',sans-serif", fontWeight: 400 }}>
              Upload your chapter. Get a personalised study plan. Learn from an AI that actually teaches — using the same Socratic method the best tutors in the world use.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <button className="btn-g">Let's begin studying →</button>
              <button className="btn-ghost">Watch demo</button>
            </div>

            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: muted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Free to start · No card · Works for every maths exam
            </p>
          </div>

          {/* RIGHT — tutor card */}
          <div style={{ animation: 'heroIn 1s cubic-bezier(0.16,1,0.3,1) 0.2s both' }}>
            <div style={{ background: bg2, border: `1px solid ${border2}`, borderRadius: 4, overflow: 'hidden', boxShadow: d ? '0 40px 100px rgba(0,0,0,0.6)' : '0 40px 100px rgba(0,0,0,0.1)' }}>

              {/* window bar */}
              <div style={{ background: bg3, borderBottom: `1px solid ${border}`, padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                {['#ff5f57', '#ffbd2e', '#28c840'].map(c => <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: muted, marginLeft: 8, letterSpacing: '0.04em' }}>StudyNotio — Integration by Parts · Day 3</span>
              </div>

              <div style={{ padding: '1.5rem' }}>
                {/* plan bar */}
                <div style={{ display: 'flex', gap: 6, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                  {['Limits', 'Differentiation', 'Integration ←', 'Applications'].map((t, i) => (
                    <span key={i} style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, padding: '3px 10px', borderRadius: 2, background: i === 2 ? 'rgba(200,247,90,0.15)' : bg3, color: i === 2 ? accent : muted, border: `1px solid ${i === 2 ? 'rgba(200,247,90,0.3)' : border}`, letterSpacing: '0.04em' }}>
                      {t}
                    </span>
                  ))}
                </div>

                {/* messages */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ background: bg3, border: `1px solid ${border}`, borderRadius: 3, padding: '0.9rem 1.1rem', fontSize: 14, color: text, lineHeight: 1.65 }}>
                    <span style={{ color: accent, fontWeight: 600, fontFamily: "'DM Mono',monospace", fontSize: 11, display: 'block', marginBottom: 4, letterSpacing: '0.06em' }}>TUTOR</span>
                    Before I explain integration by parts, what do you know about the product rule in differentiation?
                  </div>
                  <div style={{ background: `rgba(200,247,90,0.06)`, border: `1px solid rgba(200,247,90,0.15)`, borderRadius: 3, padding: '0.9rem 1.1rem', fontSize: 14, color: text, lineHeight: 1.65 }}>
                    <span style={{ color: muted, fontWeight: 600, fontFamily: "'DM Mono',monospace", fontSize: 11, display: 'block', marginBottom: 4, letterSpacing: '0.06em' }}>YOU</span>
                    I know that d/dx[f·g] = f'g + fg'
                  </div>
                  <div style={{ background: bg3, border: `1px solid ${border}`, borderRadius: 3, padding: '0.9rem 1.1rem', fontSize: 14, color: text, lineHeight: 1.65 }}>
                    <span style={{ color: accent, fontWeight: 600, fontFamily: "'DM Mono',monospace", fontSize: 11, display: 'block', marginBottom: 4, letterSpacing: '0.06em' }}>TUTOR</span>
                    Perfect. Now — if ∫u dv = uv − ∫v du looks familiar, can you see the connection?
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ flex: 1, height: 38, background: bg3, borderRadius: 3, border: `1px solid ${border}`, display: 'flex', alignItems: 'center', padding: '0 1rem' }}>
                    <span style={{ fontSize: 13, color: muted, fontFamily: "'DM Mono',monospace", fontSize: 11 }}>Type your answer...</span>
                  </div>
                  <div style={{ width: 38, height: 38, background: accent, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: '#080808', fontWeight: 700 }}>→</div>
                </div>
              </div>
            </div>

            {/* floating stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
              {[['Day 3 of 30', 'Study plan'], ['Chapter 3/12', 'Progress'], ['87%', 'Concept mastery'], ['🔥 5', 'Day streak']].map(([val, label], i) => (
                <div key={i} style={{ background: bg2, border: `1px solid ${border}`, borderRadius: 3, padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: text }}>{val}</span>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: muted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{ borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}`, padding: '1rem 0', overflow: 'hidden', background: bg }}>
        <div style={{ display: 'flex', gap: '2.5rem', animation: 'marqueeL 30s linear infinite', width: 'max-content' }}>
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: i % 4 === 0 ? accent : muted, whiteSpace: 'nowrap', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {item}<span style={{ marginLeft: '1.5rem', color: border2 }}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── STATEMENT SECTION ── */}
      <section style={{ padding: '8rem 3rem', maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '4rem', alignItems: 'start' }}>
            <div>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: accent, letterSpacing: '0.1em', textTransform: 'uppercase' }}>The problem</span>
            </div>
            <div>
              <p style={{ fontFamily: "'Instrument Serif',serif", fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 400, lineHeight: 1.3, color: text, letterSpacing: '-0.01em' }}>
                "Every maths tool either gives you answers without teaching, or teaches generically without knowing your syllabus. Nobody builds a study system around <em style={{ color: accent }}>your exact content.</em>"
              </p>
              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {['ChatGPT just answers', 'Khan Academy is generic', 'Photomath solves, not teaches', 'StudyNotio does all three'].map((t, i) => (
                  <span key={i} style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, padding: '5px 12px', borderRadius: 2, background: i === 3 ? 'rgba(200,247,90,0.12)' : bg3, color: i === 3 ? accent : muted, border: `1px solid ${i === 3 ? 'rgba(200,247,90,0.25)' : border}`, letterSpacing: '0.04em', textDecoration: i < 3 ? 'line-through' : 'none', textDecorationColor: muted }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <div style={{ borderTop: `1px solid ${border}` }} />

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: '8rem 3rem', maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '4rem', alignItems: 'start', marginBottom: '4rem' }}>
            <div>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: accent, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Features</span>
            </div>
            <div>
              <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 'clamp(2.4rem,4vw,3.8rem)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', color: text }}>
                Everything a real tutor does — and then some.
              </h2>
            </div>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 0 }}>
          {features.map((f, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div className="f-card" style={{ paddingRight: '2rem' }}>
                <p className="f-num">{f.num} — <span style={{ color: muted, letterSpacing: '0.06em' }}>{f.tag.toUpperCase()}</span></p>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: text, marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: muted2, lineHeight: 1.75 }}>{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <div style={{ borderTop: `1px solid ${border}` }} />

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ padding: '8rem 3rem', background: bg3 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '4rem', alignItems: 'start', marginBottom: '5rem' }}>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: accent, letterSpacing: '0.1em', textTransform: 'uppercase' }}>How it works</span>
              <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 'clamp(2.4rem,4vw,3.8rem)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', color: text }}>
                From upload to mastery in four steps.
              </h2>
            </div>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
            {[
              { n: '01', title: 'Upload', desc: 'Drop a PDF, snap your textbook, paste a YouTube link, or type the topic.', emoji: '📄' },
              { n: '02', title: 'Plan', desc: 'AI builds a day-by-day schedule sequenced by what your brain needs to learn first.', emoji: '🗓' },
              { n: '03', title: 'Learn', desc: 'Dedicated tutor per chapter. Asks questions first. Teaches based on YOUR gaps.', emoji: '🎓' },
              { n: '04', title: 'Master', desc: 'Adaptive tests from your content. Weak spots revisited. Watch yourself improve.', emoji: '📈' },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{ borderTop: `1px solid ${border}`, paddingTop: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: accent, letterSpacing: '0.1em' }}>{s.n}</span>
                    <span style={{ fontSize: 28 }}>{s.emoji}</span>
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 700, color: text, marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: muted2, lineHeight: 1.75 }}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* example strip */}
          <Reveal delay={0.3}>
            <div style={{ marginTop: '4rem', background: bg2, border: `1px solid ${border2}`, borderRadius: 4, padding: '2rem 2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div>
                <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Example output</p>
                <p style={{ fontSize: 16, fontWeight: 600, color: text }}>Differentiation · 12 concepts · 7-day plan generated</p>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['Limits →', 'Continuity →', 'First Principles →', 'Chain Rule →', 'Product Rule ✓'].map((c, i) => (
                  <span key={i} style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, padding: '5px 12px', borderRadius: 2, background: i === 4 ? 'rgba(200,247,90,0.12)' : bg3, color: i === 4 ? accent : muted, border: `1px solid ${i === 4 ? 'rgba(200,247,90,0.25)' : border}`, letterSpacing: '0.04em' }}>{c}</span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <div style={{ borderTop: `1px solid ${border}` }} />

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding: '8rem 3rem', maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '4rem', alignItems: 'start', marginBottom: '4rem' }}>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: accent, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Pricing</span>
            <div>
              <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 'clamp(2.4rem,4vw,3.8rem)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', color: text, marginBottom: '1.5rem' }}>
                Simple, honest pricing.
              </h2>
              <div style={{ display: 'flex', gap: 0, background: bg3, border: `1px solid ${border}`, borderRadius: 3, padding: 3, width: 'fit-content' }}>
                {['Monthly', 'Yearly — save 33%'].map((label, i) => (
                  <button key={i} onClick={() => setYearly(i === 1)} style={{ padding: '7px 18px', borderRadius: 2, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'Syne',sans-serif", letterSpacing: '0.04em', background: (i === 1) === yearly ? bg2 : 'transparent', color: (i === 1) === yearly ? text : muted, boxShadow: (i === 1) === yearly ? `0 1px 4px rgba(0,0,0,0.15)` : 'none' }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', maxWidth: 800 }}>
          <Reveal delay={0.1}>
            <div style={{ background: bg2, border: `1px solid ${border}`, borderRadius: 4, padding: '2.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Free</p>
              <div style={{ marginBottom: '1.75rem' }}>
                <span style={{ fontFamily: "'Instrument Serif',serif", fontSize: 52, fontWeight: 400, color: text }}>$0</span>
                <p style={{ fontSize: 13, color: muted, marginTop: 4 }}>Forever free · No card needed</p>
              </div>
              <div style={{ borderTop: `1px solid ${border}`, paddingTop: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.7rem', marginBottom: '2rem' }}>
                {freeFeatures.map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ color: accent, fontSize: 14, marginTop: 1 }}>✓</span>
                    <span style={{ fontSize: 14, color: muted2 }}>{f}</span>
                  </div>
                ))}
              </div>
              <button className="btn-ghost" style={{ width: '100%' }}>Get started free</button>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div style={{ background: bg2, border: `2px solid ${accent}`, borderRadius: 4, padding: '2.5rem', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', boxShadow: d ? `0 0 60px rgba(200,247,90,0.07)` : `0 0 60px rgba(200,247,90,0.12)` }}>
              <div style={{ position: 'absolute', top: -13, left: '2rem', background: accent, color: '#080808', fontSize: 10, fontWeight: 700, padding: '3px 14px', borderRadius: 2, letterSpacing: '0.1em' }}>MOST POPULAR</div>
              <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Pro</p>
              <div style={{ marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontFamily: "'Instrument Serif',serif", fontSize: 52, fontWeight: 400, color: text }}>{yearly ? '$3.33' : '$4.99'}</span>
                  <span style={{ fontSize: 15, color: muted }}>/mo</span>
                </div>
                <p style={{ fontSize: 13, color: muted, marginTop: 4 }}>
                  {yearly ? 'Billed $39.99/year · 2 months free 🎉' : 'Billed monthly · Cancel anytime'}
                </p>
              </div>
              <div style={{ borderTop: `1px solid rgba(200,247,90,0.2)`, paddingTop: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.7rem', marginBottom: '2rem' }}>
                {proFeatures.map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ color: accent, fontSize: 14, marginTop: 1 }}>✓</span>
                    <span style={{ fontSize: 14, color: text }}>{f}</span>
                  </div>
                ))}
              </div>
              <button className="btn-g" style={{ width: '100%' }}>
                Start Pro — {yearly ? '$39.99/yr' : '$4.99/mo'} →
              </button>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.3}>
          <p style={{ fontSize: 12, color: muted, marginTop: '1.5rem', fontFamily: "'DM Mono',monospace", letterSpacing: '0.04em' }}>
            All prices in USD · Indian students can pay in INR · Secure payments via Stripe
          </p>
        </Reveal>
      </section>

      <div style={{ borderTop: `1px solid ${border}` }} />

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: '8rem 3rem', background: bg3 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '4rem', alignItems: 'start' }}>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: accent, letterSpacing: '0.1em', textTransform: 'uppercase' }}>FAQ</span>
              <div>
                <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 'clamp(2.4rem,4vw,3.8rem)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', color: text, marginBottom: '3rem' }}>
                  Common questions.
                </h2>
                {faqs.map((faq, i) => (
                  <div key={i} className="faq-row" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: 16, fontWeight: 500, color: text, letterSpacing: '-0.01em' }}>{faq.q}</span>
                      <span style={{ color: muted, fontSize: 22, transition: 'transform 0.3s', transform: openFaq === i ? 'rotate(45deg)' : 'none', flexShrink: 0, lineHeight: 1 }}>+</span>
                    </div>
                    {openFaq === i && (
                      <p style={{ fontSize: 14, color: muted2, lineHeight: 1.75, marginTop: '1rem', maxWidth: 580 }}>{faq.a}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <div style={{ borderTop: `1px solid ${border}` }} />

      {/* ── FINAL CTA ── */}
      <section style={{ padding: '10rem 3rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 50%, rgba(200,247,90,0.05) 0%, transparent 65%)`, pointerEvents: 'none' }} />
        <Reveal>
          <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: accent, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '2rem' }}>Start today</p>
            <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 'clamp(3rem,7vw,6rem)', fontWeight: 400, lineHeight: 1.0, letterSpacing: '-0.03em', color: text, marginBottom: '2.5rem' }}>
              Ready to finally<br />
              <em style={{ color: accent }}>understand</em> maths?
            </h2>
            <p style={{ fontSize: 17, color: muted2, marginBottom: '3rem', maxWidth: 480, margin: '0 auto 3rem', lineHeight: 1.75 }}>
              Join students from every corner of the world. Upload your first chapter in 30 seconds.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn-g" style={{ fontSize: 15, padding: '1rem 2.5rem' }}>Let's begin studying →</button>
              <button className="btn-ghost" style={{ fontSize: 15 }}>View pricing</button>
            </div>
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '1.75rem' }}>Free to start · No card needed · Cancel anytime</p>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${border}`, padding: '2rem 3rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <span style={{ fontFamily: "'Instrument Serif',serif", fontSize: 20, fontWeight: 400 }}>Study<span style={{ color: accent }}>Notio</span></span>
          <p style={{ fontSize: 12, color: muted, fontFamily: "'DM Mono',monospace", letterSpacing: '0.04em' }}>© 2026 STUDYNOTIO · BUILT FOR STUDENTS WHO WANT TO ACTUALLY LEARN</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy', 'Terms', 'Contact'].map(l => (
              <a key={l} href="#" style={{ fontSize: 12, color: muted, textDecoration: 'none', fontFamily: "'DM Mono',monospace", letterSpacing: '0.04em', textTransform: 'uppercase' }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </>
  )
}