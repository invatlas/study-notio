'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const exams = ['JEE Mains', 'JEE Advanced', 'SAT', 'ACT', 'A-Levels', 'GCSE', 'IB Maths', 'CBSE Boards', 'IGCSE', 'AP Calculus', 'Other']

export default function Welcome() {
  const [name, setName] = useState('')
  const [selectedExam, setSelectedExam] = useState('')
  const [step, setStep] = useState(1)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.user_metadata?.full_name) {
        setName(data.user.user_metadata.full_name.split(' ')[0])
      }
    })
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne',sans-serif", padding: '2rem' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        @keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .fade{animation:fadeIn 0.7s cubic-bezier(0.16,1,0.3,1) forwards}
        .exam-chip{padding:0.5rem 1rem;border-radius:999px;border:1px solid rgba(255,255,255,0.1);background:transparent;color:#6b6860;font-family:'Syne',sans-serif;font-size:13px;cursor:pointer;transition:all 0.2s}
        .exam-chip:hover{border-color:rgba(200,247,90,0.3);color:#ede9e3}
        .exam-chip.selected{border-color:#c8f75a;background:rgba(200,247,90,0.08);color:#c8f75a}
        .continue-btn{background:#c8f75a;color:#080808;border:none;border-radius:6px;padding:0.9rem 2rem;font-size:13px;font-weight:700;cursor:pointer;font-family:'Syne',sans-serif;letter-spacing:0.08em;text-transform:uppercase;transition:all 0.2s;opacity:0.4}
        .continue-btn.active{opacity:1}
        .continue-btn.active:hover{background:#d4f96e;transform:translateY(-1px)}
      `}</style>

      <div className="fade" style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>

        {step === 1 && (
          <>
            <div style={{ fontSize: 48, marginBottom: '1.5rem' }}>🎓</div>
            <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: '2.8rem', color: '#ede9e3', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
              Welcome, {name || 'there'}.
            </h1>
            <p style={{ fontSize: 15, color: '#6b6860', marginBottom: '3rem', lineHeight: 1.7 }}>
              You're in. Let's set up your first study plan.<br />
              What exam are you preparing for?
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'center', marginBottom: '2.5rem' }}>
              {exams.map(exam => (
                <button key={exam} className={`exam-chip${selectedExam === exam ? ' selected' : ''}`} onClick={() => setSelectedExam(exam)}>
                  {exam}
                </button>
              ))}
            </div>

            <button className={`continue-btn${selectedExam ? ' active' : ''}`} disabled={!selectedExam} onClick={() => setStep(2)}>
              Continue →
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ fontSize: 48, marginBottom: '1.5rem' }}>⚡</div>
            <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: '2.8rem', color: '#ede9e3', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
              You're all set.
            </h1>
            <p style={{ fontSize: 15, color: '#6b6860', marginBottom: '1rem', lineHeight: 1.7 }}>
              Upload your first chapter and we'll build<br />your personalised study plan in seconds.
            </p>
            <p style={{ fontSize: 12, color: '#3a3835', fontFamily: "'DM Mono',monospace", marginBottom: '3rem', letterSpacing: '0.04em' }}>
              STUDYING FOR — <span style={{ color: '#c8f75a' }}>{selectedExam}</span>
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="continue-btn active" onClick={() => window.location.href = '/upload'}>
                Upload first chapter →
              </button>
              <button onClick={() => window.location.href = '/dashboard'} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '0.9rem 1.5rem', fontSize: 13, color: '#6b6860', cursor: 'pointer', fontFamily: "'Syne',sans-serif", transition: 'all 0.2s' }}>
                Go to dashboard
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  )
}