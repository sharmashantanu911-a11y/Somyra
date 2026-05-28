import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function useInView(threshold = 0.1): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

const Reveal: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(24px)',
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`
    }}>
      {children}
    </div>
  );
};

const T = '#2DD4BF';
const styles: Record<string, React.CSSProperties> = {
  page: { background: '#080808', color: '#F5F5F5', fontFamily: "'DM Sans', sans-serif", minHeight: '100vh', overflowX: 'hidden' },
  nav: { position: 'sticky', top: 0, zIndex: 99, background: 'rgba(8,8,8,0.92)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '14px 0' },
  navInner: { maxWidth: 1100, margin: '0 auto', padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logoWrap: { display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' },
  navLinks: { display: 'flex', alignItems: 'center', gap: 4 },
  navLink: { fontSize: 13.5, color: '#6B7280', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', transition: 'color 0.2s', textDecoration: 'none' },
  btnTeal: { display: 'inline-flex', alignItems: 'center', gap: 6, background: T, color: '#030B09', fontWeight: 700, fontSize: 14, padding: '12px 24px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", textDecoration: 'none', transition: 'all 0.2s' },
  btnGhost: { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', color: '#F5F5F5', fontWeight: 500, fontSize: 14, padding: '12px 24px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.18)', cursor: 'pointer', textDecoration: 'none', transition: 'all 0.2s' },
  section: { padding: '80px 0' },
  container: { maxWidth: 1100, margin: '0 auto', padding: '0 28px' },
  containerNarrow: { maxWidth: 820, margin: '0 auto', padding: '0 28px' },
  eyebrow: { display: 'inline-block', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: T, fontFamily: 'monospace', marginBottom: 14, padding: '4px 12px', background: 'rgba(45,212,191,0.06)', border: '1px solid rgba(45,212,191,0.15)', borderRadius: 20 },
  h2: { fontSize: 'clamp(26px,4vw,44px)', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.12, marginBottom: 14, color: '#F5F5F5' },
  sub: { fontSize: 16, color: '#9CA3AF', lineHeight: 1.7, maxWidth: 520, marginBottom: 48 },
  card: { background: '#141414', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16 },
};

// Somyra SVG logo (matches app sidebar)
const SomyraLogo: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3h18v6H9v2h12v10H3v-6h12v-2H3V3z" />
  </svg>
);

// ── MOBILE NAV ──
function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {open && (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', zIndex: 100 }} />
      )}
      <div style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, width: 280, maxWidth: '85vw',
        background: '#080808', borderRight: '1px solid rgba(255,255,255,0.07)',
        zIndex: 101, padding: '28px 24px', display: 'flex', flexDirection: 'column',
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 30, height: 30, background: 'rgba(45,212,191,0.12)', border: '1px solid rgba(45,212,191,0.28)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T }}>
              <SomyraLogo size={16} />
            </div>
            <span style={{ fontSize: 17, fontWeight: 800, color: '#F5F5F5', letterSpacing: '-0.03em' }}>Somyra</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6B7280', fontSize: 24, cursor: 'pointer', padding: 4 }}>✕</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[{l:'How It Works',h:'#how'},{l:'Features',h:'#features'},{l:'Pricing',h:'#pricing'}].map(item => (
            <a key={item.l} href={item.h} onClick={onClose} style={{ fontSize: 15, color: '#9CA3AF', padding: '10px 12px', borderRadius: 8, textDecoration: 'none' }}>{item.l}</a>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <a href="/signin" onClick={onClose} style={{ ...styles.navLink, display: 'block', textAlign: 'center', marginBottom: 10 }}>Sign In</a>
        <a href="/signup" onClick={onClose} style={{ ...styles.btnTeal, justifyContent: 'center', padding: '12px 20px' }}>Start Free</a>
      </div>
    </>
  );
}

// ── SIDEBAR ──
function Sidebar() {
  const navigate = useNavigate();
  const items = [
    { id: 'home', label: 'Home', icon: '◈' },
    { id: 'profile', label: 'Profile Audit', icon: '◎' },
    { id: 'postwriter', label: 'Post Writer', icon: '✎' },
    { id: 'topicgen', label: 'Topic Generator', icon: '⊞' },
    { id: 'biogen', label: 'Bio Generator', icon: '▣' },
    { id: 'outreach', label: 'Smart Outreach', icon: '◉' },
    { id: 'voice', label: 'Voice Profile', icon: '♪' },
    { id: 'saved', label: 'Saved Library', icon: '✦' },
  ];
  return (
    <aside style={{
      width: 220, flexShrink: 0, position: 'sticky', top: 78, alignSelf: 'flex-start',
      maxHeight: 'calc(100vh - 100px)', overflowY: 'auto', borderRadius: 28,
      border: '1px solid rgba(255,255,255,0.05)', background: '#0C0C0C', padding: 20,
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {items.map((item, i) => (
          <React.Fragment key={item.id}>
            {i === 1 && <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '8px 0' }} />}
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                borderRadius: 10, fontSize: 13, fontWeight: 500, color: '#6B7280',
                border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.2s', width: '100%',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#F5F5F5'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#6B7280'; }}
            >
              <span style={{ fontSize: 14, color: T, width: 18, textAlign: 'center' }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          </React.Fragment>
        ))}
      </div>
      <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ background: 'rgba(45,212,191,0.06)', border: '1px solid rgba(45,212,191,0.12)', borderRadius: 10, padding: 12 }}>
          <p style={{ fontSize: 10, color: T, fontWeight: 700, marginBottom: 4, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Pro Tip</p>
          <p style={{ fontSize: 10.5, color: '#6B7280', lineHeight: 1.5 }}>Analyze your profile first to get personalized content suggestions.</p>
        </div>
      </div>
    </aside>
  );
}

// ── HERO ──
function Hero() {
  const [n, setN] = useState(0);
  useEffect(() => {
    let c = 0; const target = 1247;
    const t = setInterval(() => { c += 22; if (c >= target) { setN(target); clearInterval(t); } else setN(c); }, 18);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ position: 'relative', padding: 'clamp(60px,10vw,100px) 0 clamp(48px,8vw,72px)', overflow: 'hidden', background: '#080808' }}>
      <div style={{ position: 'absolute', top: -160, left: '50%', transform: 'translateX(-50%)', width: 'min(700px,90vw)', height: 'min(600px,80vw)', background: 'radial-gradient(ellipse,rgba(45,212,191,0.08) 0%,transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.022) 1px,transparent 1px)', backgroundSize: '52px 52px', WebkitMaskImage: 'radial-gradient(ellipse 80% 55% at 50% 0%,black,transparent)', maskImage: 'radial-gradient(ellipse 80% 55% at 50% 0%,black,transparent)', pointerEvents: 'none' }} />

      <div style={{ ...styles.container, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <Reveal>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#141414', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 40, padding: '6px 16px 6px 6px', marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
              {['#FF6B6B','#FFB347','#4ECB71','#4DABF7','#9775FA'].map((bg, i) => (
                <div key={i} style={{ width: 26, height: 26, borderRadius: '50%', background: bg, border: '2px solid #141414', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', marginLeft: i > 0 ? -8 : 0, position: 'relative', zIndex: 5 - i }}>
                  {['R','P','A','T','S'][i]}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {[...Array(5)].map((_, i) => <span key={i} style={{color:T,fontSize:11}}>★</span>)}
            </div>
            <span style={{ fontSize: 12, color: '#9CA3AF', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>Trusted by <strong style={{color:'#F5F5F5'}}>{n.toLocaleString()}+</strong> LinkedIn professionals</span>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <h1 style={{ fontSize: 'clamp(28px,5vw,52px)', fontWeight: 900, letterSpacing: '-0.045em', lineHeight: 1.1, marginBottom: 22, color: '#F5F5F5', maxWidth: 800 }}>
            Build a LinkedIn Presence That Closes Deals Without Hiring a Ghostwriter
          </h1>
        </Reveal>

        <Reveal delay={120}>
          <p style={{ fontSize: 'clamp(15px,2vw,18px)', color: '#9CA3AF', lineHeight: 1.72, maxWidth: 540, marginBottom: 32, padding: '0 12px' }}>
            Somyra audits your profile like a senior strategist, writes posts that sound like you, and generates outreach that actually gets replies. Founders go from invisible to inbound in their first week.
          </p>
        </Reveal>

        <Reveal delay={180}>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
            <a href="/signup" style={styles.btnTeal}>Audit My Profile Free</a>
            <a href="#how" style={styles.btnGhost}>Watch 2 Minute Walkthrough</a>
          </div>
          <p style={{ fontSize: 12.5, color: '#6B7280', fontFamily: 'monospace', marginBottom: 52 }}>No credit card. Free forever plan. Takes 60 seconds to set up.</p>
        </Reveal>

        <Reveal delay={220}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#141414', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px 8px', marginBottom: 52, flexWrap: 'wrap', justifyContent: 'center', gap: 0, width: '100%', maxWidth: 680 }}>
            {[['4.9','Average Rating','stars'],['3x','Profile View Increase',''],['500+','Profiles Audited',''],['#1','AI LinkedIn Tool','']].map(([num,label,type],i,arr) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '0 clamp(12px,3vw,24px)' }}>
                  {type === 'stars' ? <div style={{display:'flex',gap:2}}>{[...Array(5)].map((_,j) => <span key={j} style={{color:T,fontSize:13}}>★</span>)}</div> : null}
                  <span style={{ fontSize: 'clamp(18px,2.5vw,22px)', fontWeight: 900, color: '#F5F5F5', letterSpacing: '-0.04em' }}>{num}</span>
                  <span style={{ fontSize: 11.5, color: '#6B7280', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{label}</span>
                </div>
                {i < arr.length - 1 && <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.07)' }} />}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={280}>
          <div style={{ width: '100%', maxWidth: 720, position: 'relative' }}>
            <div style={{ ...styles.card, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.6)' }}>
              <div style={{ background: '#0D0D0D', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['#FF5F57','#FFBD2E','#28CA41'].map(c => <div key={c} style={{width:10,height:10,borderRadius:'50%',background:c}}/>)}
                </div>
                <span style={{ fontSize: 12, color: '#6B7280', fontFamily: 'monospace', flex: 1 }}>Profile Audit · Marcus Reid AI</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: T, background: 'rgba(45,212,191,0.08)', border: '1px solid rgba(45,212,191,0.15)', borderRadius: 6, padding: '2px 8px', fontFamily: 'monospace' }}>Score: 82/100</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))' }}>
                <div style={{ padding: 20, borderRight: '1px solid rgba(255,255,255,0.07)' }}>
                  <p style={{ fontSize: 10.5, fontWeight: 700, color: '#374151', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 14 }}>Headline Rewrite</p>
                  <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)', borderRadius: 8, padding: 12, marginBottom: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#F87171', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'monospace', display: 'block', marginBottom: 6 }}>Before</span>
                    <p style={{ fontSize: 12.5, color: '#9CA3AF', lineHeight: 1.5 }}>"Founder at TechCo | Building SaaS | Passionate about growth"</p>
                  </div>
                  <div style={{ textAlign: 'center', fontSize: 14, color: '#374151', margin: '6px 0' }}>↓</div>
                  <div style={{ background: 'rgba(45,212,191,0.06)', border: '1px solid rgba(45,212,191,0.15)', borderRadius: 8, padding: 12 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: T, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'monospace', display: 'block', marginBottom: 6 }}>AI Rewrite</span>
                    <p style={{ fontSize: 12.5, color: '#9CA3AF', lineHeight: 1.5 }}>"I help B2B SaaS founders add $50K ARR through LinkedIn without running ads"</p>
                  </div>
                </div>
                <div style={{ padding: 20 }}>
                  {([['Headline',90,'#2DD4BF'],['About',74,'#FBBF24'],['Keywords',68,'#F87171'],['Experience',85,'#2DD4BF'],['Engagement Hook',72,'#FBBF24']] as const).map(([l,v,c]) => (
                    <div key={l} style={{ marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: '#6B7280', fontFamily: 'monospace' }}>{l}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: c, fontFamily: 'monospace' }}>{v}</span>
                      </div>
                      <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: `${v}%`, height: '100%', background: c, borderRadius: 2 }}/>
                      </div>
                    </div>
                  ))}
                  <div style={{ background: 'rgba(45,212,191,0.06)', border: '1px solid rgba(45,212,191,0.12)', borderRadius: 8, padding: '10px 12px', marginTop: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: T, display: 'block', marginBottom: 5, fontFamily: 'monospace', letterSpacing: '0.08em', textTransform: 'uppercase' }}>AI Insight</span>
                    <p style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 1.5, fontStyle: 'italic' }}>Your About starts with "I am" reframe around the reader outcome to triple profile views.</p>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ position: 'absolute', bottom: -30, left: '50%', transform: 'translateX(-50%)', width: '50%', height: 30, background: T, filter: 'blur(50px)', opacity: 0.12 }}/>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

// ── LOGO STRIP ──
function LogoStrip() {
  return (
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '22px 0', overflow: 'hidden' }}>
      <p style={{ textAlign: 'center', fontSize: 11, color: '#374151', fontFamily: 'monospace', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Used by professionals across</p>
      <div style={{ overflow: 'hidden', position: 'relative' }}>
        <div className="logo-scroll" style={{ display: 'flex', width: 'max-content' }}>
          {[...Array(2)].map((_,r) => ['Bootstrapped Founders','VC Backed Startups','Sales Teams','Executive Coaches','B2B Agencies','Consultants','SaaS Companies','LinkedIn Creators'].map((l,i) => (
            <span key={`${r}-${i}`} style={{ padding: '0 28px', fontSize: 13, color: '#374151', fontWeight: 600, borderRight: '1px solid rgba(255,255,255,0.06)', whiteSpace: 'nowrap' }}>{l}</span>
          )))}
        </div>
      </div>
    </div>
  );
}

// ── PAIN ──
function Pain() {
  return (
    <div style={{ ...styles.section, background: '#0D0D0D' }}>
      <div style={styles.container}>
        <Reveal>
          <span style={styles.eyebrow}>Sound Familiar?</span>
          <h2 style={styles.h2}>You are not bad at LinkedIn.<br/><span style={{color:T}}>You just don't have the right system.</span></h2>
          <p style={styles.sub}>Every founder we talk to says the same three things.</p>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>
          {[
            { e:'😤', t:"You're posting but nothing is happening", b:"You write a post, get twelve likes from colleagues, and wonder why you bothered. Meanwhile someone else posts a three liner and gets fifty DMs." },
            { e:'😰', t:"Your profile looks like everyone else's", b:"'Founder | Entrepreneur | Passionate about innovation.' Sound familiar? Your profile is the first thing a prospect sees and it is giving them no reason to connect with you." },
            { e:'😩', t:"Outreach feels like shouting into a void", b:"Copy paste DMs get ignored. You have tried personalizing manually but it takes forever and the reply rate is still embarrassing. There has to be a better way and there is." },
          ].map((p,i) => (
            <Reveal key={i} delay={i * 80}>
              <div style={{ ...styles.card, padding: 28, transition: 'transform 0.2s' }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>{p.e}</div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: '#F5F5F5', letterSpacing: '-0.025em', lineHeight: 1.25, marginBottom: 12 }}>{p.t}</h3>
                <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7 }}>{p.b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── TRANSFORM TABLE ──
function Transform() {
  const rows = [
    ['A profile that gets ignored','A profile that makes people reach out to you'],
    ['Posting randomly and hoping something sticks','Publishing with a system that builds real authority every week'],
    ['Generic DMs that nobody ever replies to','Personalized outreach with three times the reply rate'],
    ['Spending hours writing and still sounding robotic','Generating posts in minutes that sound exactly like you'],
    ['No idea if LinkedIn is even working for you','A growth tracker showing real momentum in your dashboard'],
  ];
  return (
    <div style={{ ...styles.section, background: '#080808' }}>
      <div style={styles.containerNarrow}>
        <Reveal>
          <span style={styles.eyebrow}>The Difference</span>
          <h2 style={styles.h2}>What changes when you<br/><span style={{color:T}}>use Somyra for 30 days</span></h2>
        </Reveal>
        <Reveal delay={80}>
          <div style={{ ...styles.card, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#0D0D0D', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ padding: '14px 24px', fontSize: 11, fontWeight: 700, color: '#F87171', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'monospace', borderRight: '1px solid rgba(255,255,255,0.07)' }}>Without Somyra</div>
              <div style={{ padding: '14px 24px', fontSize: 11, fontWeight: 700, color: T, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'monospace' }}>With Somyra</div>
            </div>
            {rows.map(([bad,good],i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: i < rows.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#6B7280', lineHeight: 1.5, borderRight: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ color: '#F87171', fontSize: 16, flexShrink: 0 }}>✗</span>{bad}
                </div>
                <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#9CA3AF', lineHeight: 1.5 }}>
                  <span style={{ color: T, fontSize: 14, flexShrink: 0 }}>✓</span>{good}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  );
}

// ── HOW IT WORKS ──
function HowItWorks() {
  return (
    <div style={{ ...styles.section, background: '#0D0D0D' }} id="how">
      <div style={styles.container}>
        <Reveal>
          <span style={styles.eyebrow}>How It Works</span>
          <h2 style={styles.h2}>Up and running in<br/><span style={{color:T}}>under 10 minutes</span></h2>
          <p style={styles.sub}>Three steps. No onboarding call. No learning curve.</p>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 2, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', marginBottom: 40 }}>
          {[
            { n:'01', t:'Connect Your LinkedIn', b:'Paste your LinkedIn URL. Somyra reads your profile and builds a complete picture of your headline, about section, keywords, and positioning in seconds.' },
            { n:'02', t:'Get Your Audit and Voice Profile', b:'Marcus Reid AI gives you a real strategic audit with scores and specific rewrites. Then you train your Voice Profile so everything sounds like you.' },
            { n:'03', t:'Write, Post, and Reach Out', b:'Generate posts in Deep Mode, build a full week of topics, and send personalized outreach that your ideal customer actually replies to.' },
          ].map((s,i) => (
            <Reveal key={i} delay={i * 90}>
              <div style={{ background: '#141414', padding: '32px 28px', height: '100%', transition: 'background 0.2s' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: T, fontFamily: 'monospace', marginBottom: 20, letterSpacing: '0.06em' }}>{s.n}</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#F5F5F5', letterSpacing: '-0.025em', lineHeight: 1.25, marginBottom: 12 }}>{s.t}</h3>
                <p style={{ fontSize: 13.5, color: '#6B7280', lineHeight: 1.68 }}>{s.b}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={120}>
          <div style={{ border: '2px dashed rgba(255,255,255,0.08)', borderRadius: 16, padding: 'clamp(32px,6vw,52px)', textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: T, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', cursor: 'pointer' }}>
              <svg width="20" height="24" viewBox="0 0 20 24" fill="#030B09"><path d="M0 0l20 12L0 24V0z"/></svg>
            </div>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#F5F5F5', marginBottom: 8 }}>2 minute product walkthrough</p>
            <p style={{ fontSize: 13, color: '#374151', fontFamily: 'monospace' }}>Video coming soon. See the full audit and post writer in action.</p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

// ── FEATURES ──
function Features() {
  const feats = [
    {
      tag:'Feature 01', icon:'🎯',
      title:'Profile Audit That Actually Tells You What to Fix',
      benefit:'Stop guessing why your profile is not converting. Get a score, a rewrite, and a strategy.',
      body:'Marcus Reid AI analyzes every section of your profile and gives you a score breakdown, specific rewrites you can apply in one click, and a full target audience analysis.',
      points:['Score breakdown by section','One click AI rewrites','Target Audience AI analysis','Deep Strategy and Quick Audit modes'],
      visual: (
        <div style={{ ...styles.card, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#F5F5F5' }}>Your Profile Score</span>
            <span style={{ fontSize: 28, fontWeight: 900, color: T, letterSpacing: '-0.04em' }}>82<span style={{fontSize:13,color:'#9CA3AF'}}>/100</span></span>
          </div>
          {([['Headline',90,'#2DD4BF','Strong leads with outcome'],['About',74,'#FBBF24','Starts with "I am" reframe around reader'],['Keywords',68,'#F87171','Missing 6 high intent keywords']] as const).map(([l,v,c,insight]) => (
            <div key={l} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#9CA3AF' }}>{l}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: c, fontFamily: 'monospace', background: `${c}15`, border: `1px solid ${c}25`, borderRadius: 5, padding: '1px 7px' }}>{v}</span>
              </div>
              <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden', marginBottom: 5 }}>
                <div style={{ width: `${v}%`, height: '100%', background: c, borderRadius: 3 }}/>
              </div>
              <p style={{ fontSize: 11.5, color: '#6B7280', fontStyle: 'italic' }}>{insight}</p>
            </div>
          ))}
        </div>
      )
    },
    {
      tag:'Feature 02', icon:'✍️',
      title:'Posts That Sound Like You, Not Like ChatGPT',
      benefit:'Train Somyra on your voice once. Every post will sound like you on your best day.',
      body:'Your Voice Profile captures your tone, vocabulary, and writing patterns. Deep Mode generates structured, algorithm friendly posts in three variants. Done in under 5 minutes.',
      points:['Voice Profile trained on your style','Deep Mode for high performance formats','Three variants per generation','Hook first structure built for reach'],
      visual: (
        <div style={{ ...styles.card, overflow: 'hidden' }}>
          <div style={{ background: '#0D0D0D', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '12px 16px' }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#374151', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'monospace', display: 'block', marginBottom: 6 }}>Topic</span>
            <p style={{ fontSize: 13, color: '#9CA3AF' }}>"Why most founders fail on LinkedIn even when they have great content"</p>
          </div>
          <div style={{ padding: 14 }}>
            <div style={{ background: '#181818', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '12px 14px', marginBottom: 12 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: T, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'monospace', display: 'block', marginBottom: 7 }}>Variant 1 · Hook: Controversial</span>
              <p style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.65 }}>Most LinkedIn advice is backwards.<br/><br/>Everyone tells you to "be consistent." But I have seen founders post daily for six months with zero inbound.<br/><br/>The real problem is positioning, not frequency.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: T, fontFamily: 'monospace', background: 'rgba(45,212,191,0.06)', borderRadius: 8, padding: '7px 12px' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: T, boxShadow: `0 0 6px ${T}`, flexShrink: 0, display: 'inline-block' }}/>
              Voice Profile Active sounds like you
            </div>
          </div>
        </div>
      )
    },
    {
      tag:'Feature 03', icon:'📡',
      title:'Outreach That Gets Replies Instead of Getting Ignored',
      benefit:"Stop sending the same DM to fifty people. Generate messages based on each prospect's actual profile.",
      body:'Build your ICP, pull prospect profiles, and generate first touch messages that reference specific things about them. Track every conversation in the built in CRM.',
      points:['ICP Builder with filters','Profile based message personalization','Follow up sequence generator','Built in CRM tracker'],
      visual: (
        <div style={{ ...styles.card, padding: 18 }}>
          <div style={{ background: '#181818', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 14, marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(45,212,191,0.12)', border: '1px solid rgba(45,212,191,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: T, flexShrink: 0 }}>R</div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#F5F5F5' }}>To: Rahul Verma · Head of Sales</p>
                <p style={{ fontSize: 11, color: '#374151', fontFamily: 'monospace' }}>Generated from profile · First touch</p>
              </div>
            </div>
            <p style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.65 }}>Hey Rahul, saw your post about the Q4 pipeline squeeze and it hit close to home.<br/><br/>I work with sales leaders building inbound on LinkedIn without it eating their week. Most see two to three times the reply rates within 30 days.<br/><br/>Worth a quick chat?</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
            {[['68%','Open Rate',T],['31%','Reply Rate',T],['3.1x','vs Generic','#FBBF24']].map(([n,l,c]) => (
              <div key={l} style={{ background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '10px 8px', textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: 'clamp(16px,2vw,20px)', fontWeight: 900, color: c, letterSpacing: '-0.04em', marginBottom: 3 }}>{n}</span>
                <span style={{ fontSize: 11, color: '#6B7280', fontFamily: 'monospace' }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      tag:'Feature 04', icon:'💡',
      title:'Topic Generator That Eliminates Writer Block',
      benefit:'Never stare at a blank screen again. Get dozens of topic ideas tailored to your industry and audience.',
      body:'Generate a full month of content ideas in seconds. Each topic comes with a suggested hook type, angle, and target audience. Pick the winners and turn them into posts with one click.',
      points:['30 topics per generation','Hook type suggestions for each idea','Industry specific topic clusters','One click send to Post Writer'],
      visual: (
        <div style={{ ...styles.card, overflow: 'hidden' }}>
          <div style={{ background: '#0D0D0D', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#374151', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'monospace' }}>Generated for</span>
            <span style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'monospace' }}>B2B SaaS · Founder</span>
          </div>
          <div style={{ padding: 14 }}>
            {[
              { t:'Why your ICP is not engaging and how to fix it', h:'Contrarian', c:T },
              { t:'The one metric that matters more than followers', h:'Data Driven', c:'#FBBF24' },
              { t:'How we closed 3 deals from a single LinkedIn post', h:'Story', c:'#4ECB71' },
              { t:'Stop optimizing for likes and start optimizing for DMs', h:'Hot Take', c:'#F87171' },
              { t:'The 3 3 3 framework for consistent LinkedIn growth', h:'How To', c:'#4DABF7' },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: `${row.c}15`, border: `1px solid ${row.c}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: row.c, flexShrink: 0 }}>{i + 1}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12.5, color: '#9CA3AF', lineHeight: 1.4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.t}</p>
                </div>
                <span style={{ fontSize: 9, fontWeight: 700, color: row.c, fontFamily: 'monospace', background: `${row.c}12`, border: `1px solid ${row.c}20`, borderRadius: 4, padding: '2px 7px', whiteSpace: 'nowrap', flexShrink: 0 }}>{row.h}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
  ];

  return (
    <div style={{ ...styles.section, background: '#0D0D0D' }} id="features">
      <div style={styles.container}>
        <Reveal>
          <span style={styles.eyebrow}>Features</span>
          <h2 style={styles.h2}>Four tools.<br/><span style={{color:T}}>One system that works.</span></h2>
        </Reveal>
        {feats.map((f,i) => (
          <Reveal key={f.tag} delay={60}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 48,
              alignItems: 'center',
              marginBottom: 64,
            }}>
              <div style={{ order: i % 2 === 1 ? 2 : 1 }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: '#374151', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'monospace', display: 'block', marginBottom: 12 }}>{f.tag}</span>
                <h3 style={{ fontSize: 'clamp(18px,2.2vw,26px)', fontWeight: 800, color: '#F5F5F5', letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 14, fontWeight: 600, color: T, marginBottom: 12, lineHeight: 1.5 }}>{f.benefit}</p>
                <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.7, marginBottom: 20 }}>{f.body}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                  {f.points.map(p => (
                    <div key={p} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13.5, color: '#9CA3AF' }}>
                      <span style={{ color: T, fontSize: 14, flexShrink: 0 }}>✓</span>{p}
                    </div>
                  ))}
                </div>
                <a href="/signup" style={styles.btnTeal}>Try {f.icon} Free</a>
              </div>
              <div style={{ order: i % 2 === 1 ? 1 : 2 }}>{f.visual}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

// ── COMPARISON TABLE ──
function ComparisonTable() {
  const cols = ['Somyra', 'Taplio', 'Supergrow', 'MagicPost'];
  const rows = [
    { label: 'AI Post Writer', values: ['full', 'full', 'full', 'full'] },
    { label: 'Profile Audit and Strategy', values: ['full', 'limited', 'none', 'none'] },
    { label: 'Smart Outreach and DMs', values: ['full', 'none', 'none', 'none'] },
    { label: 'Voice Profile Learning', values: ['full', 'none', 'none', 'none'] },
    { label: 'Topic Generator', values: ['full', 'full', 'limited', 'limited'] },
    { label: 'LinkedIn Account Safety', values: ['full', 'limited', 'full', 'full'] },
    { label: 'Follow Up Sequences', values: ['full', 'none', 'none', 'none'] },
    { label: 'ICP Builder', values: ['full', 'none', 'none', 'none'] },
    { label: 'Starting Price', values: ['free', 'paid', 'paid', 'paid'] },
  ];

  const iconMap: Record<string, React.ReactNode> = {
    full: <span style={{color:'#22C55E',fontSize:16}}>✓</span>,
    limited: <span style={{color:'#FBBF24',fontSize:16}}>△</span>,
    none: <span style={{color:'#F87171',fontSize:16}}>✗</span>,
    free: <span style={{color:T,fontSize:13,fontWeight:700}}>$0</span>,
    paid: <span style={{color:'#F87171',fontSize:13,fontWeight:700}}>$$</span>,
  };

  return (
    <div style={{ ...styles.section, background: '#080808' }}>
      <div style={styles.container}>
        <Reveal>
          <span style={styles.eyebrow}>Comparison</span>
          <h2 style={styles.h2}>How we stack up against<br/><span style={{color:T}}>the alternatives</span></h2>
          <p style={styles.sub}>Somyra packs more features into a single tool than most competitors combined.</p>
        </Reveal>
        <Reveal delay={60}>
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', minWidth: 600, borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'monospace', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>Feature</th>
                  {cols.map((c, i) => (
                    <th key={c} style={{
                      textAlign: 'center', padding: '14px 16px', fontSize: 13, fontWeight: 700,
                      color: i === 0 ? T : '#6B7280',
                      borderTop: i === 0 ? `2px solid ${T}` : '1px solid rgba(255,255,255,0.07)',
                      borderLeft: i === 0 ? `1px solid ${T}30` : 'none',
                      borderRight: i === cols.length - 1 ? '1px solid rgba(255,255,255,0.07)' : i === 0 ? `1px solid ${T}30` : 'none',
                      borderBottom: '1px solid rgba(255,255,255,0.07)',
                      background: i === 0 ? 'rgba(45,212,191,0.04)' : 'transparent',
                      whiteSpace: 'nowrap',
                    }}>
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => (
                  <tr key={row.label}>
                    <td style={{
                      padding: '12px 16px', fontSize: 13.5, color: '#9CA3AF', fontWeight: 500,
                      borderBottom: ri < rows.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    }}>{row.label}</td>
                    {row.values.map((v, ci) => (
                      <td key={`${ri}-${ci}`} style={{
                        textAlign: 'center', padding: '12px 8px',
                        borderBottom: ri < rows.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                        borderRight: ci === cols.length - 1 ? '1px solid rgba(255,255,255,0.04)' : ci === 0 ? '1px solid rgba(45,212,191,0.1)' : 'none',
                        borderLeft: ci === 0 ? '1px solid rgba(45,212,191,0.1)' : 'none',
                        background: ci === 0 ? 'rgba(45,212,191,0.02)' : 'transparent',
                      }}>
                        {iconMap[v]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 11, color: '#374151', fontFamily: 'monospace', marginTop: 12, textAlign: 'center' }}>
            Full feature set as of May 2026. Competitor feature availability may change.
          </p>
        </Reveal>
      </div>
    </div>
  );
}

// ── TESTIMONIALS (Marquee) ──
function Testimonials() {
  const tests = [
    { n:'Rohan Mehta', r:'Founder, B2B SaaS', av:'R', m:'4.5x profile views', t:'I rewrote my headline the same day I got my audit. Impressions went from 400 to 1,800 a week. The specificity of the feedback is unlike anything I have seen in a tool at this price point.' },
    { n:'Priya Kulkarni', r:'Sales Director', av:'P', m:'4x reply rate', t:'I was sending fifty DMs a week and getting two replies. With Smart Outreach I send twenty and get seven or eight replies. The ICP builder alone changed how I think about prospecting.' },
    { n:'Arjun Nair', r:'Executive Coach', av:'A', m:'Voice 9.5/10', t:'The Voice Profile is genuinely good. I showed my posts to a client who has known me for three years and he could not tell the difference. That was the bar I needed it to clear.' },
    { n:'Tanvi Shah', r:'Strategy Consultant', av:'T', m:'+2,600 followers', t:'I went from 800 to 3,400 followers in seven weeks. More importantly, four inbound consulting inquiries in that window and two converted. Somyra has paid for itself many times over.' },
    { n:'Vikram Joshi', r:'Startup Founder', av:'V', m:'3x connection rate', t:'My connection acceptance rate tripled after the profile rewrite. The message builder creates outreach that actually sounds like I researched the person. Game changer.' },
    { n:'Neha Gupta', r:'Brand Strategist', av:'N', m:'50 hours saved', t:'I used to spend five hours a week writing posts. Now I spend thirty minutes. The voice profile keeps my tone consistent and I never stare at a blank screen anymore.' },
  ];

  return (
    <div style={{ ...styles.section, background: '#080808', overflow: 'hidden' }}>
      <div style={styles.container}>
        <Reveal>
          <span style={styles.eyebrow}>Real Results</span>
          <h2 style={styles.h2}>Don't take our word for it.<br/><span style={{color:T}}>Take theirs.</span></h2>
          <p style={styles.sub}>Every testimonial below is from a real user with a specific result.</p>
        </Reveal>
      </div>
      <div className="marquee-container" style={{ marginBottom: 16 }}>
        <div className="marquee-track marquee-right" style={{ display: 'flex', gap: 16, width: 'max-content' }}>
          {[...Array(2)].map((_, dupIdx) => tests.map((t,i) => (
            <div key={`r1-${dupIdx}-${i}`} style={{ ...styles.card, padding: 24, minWidth: 340, maxWidth: 380, flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', gap: 2 }}>{[...Array(5)].map((_,j) => <span key={j} style={{color:T,fontSize:12}}>★</span>)}</div>
                <span style={{ fontSize: 11, fontWeight: 700, color: T, background: 'rgba(45,212,191,0.08)', border: '1px solid rgba(45,212,191,0.15)', borderRadius: 6, padding: '3px 8px', fontFamily: 'monospace' }}>{t.m}</span>
              </div>
              <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.72, marginBottom: 20, fontStyle: 'italic' }}>"{t.t}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(45,212,191,0.12)', border: '1px solid rgba(45,212,191,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: T, flexShrink: 0 }}>{t.av}</div>
                <div>
                  <p style={{ fontSize: 13.5, fontWeight: 700, color: '#F5F5F5' }}>{t.n}</p>
                  <p style={{ fontSize: 12, color: '#6B7280' }}>{t.r}</p>
                </div>
              </div>
            </div>
          )))}
        </div>
      </div>
      <div className="marquee-container" style={{ marginBottom: 16 }}>
        <div className="marquee-track marquee-left" style={{ display: 'flex', gap: 16, width: 'max-content' }}>
          {[...Array(2)].map((_, dupIdx) => [...tests].reverse().map((t,i) => (
            <div key={`r2-${dupIdx}-${i}`} style={{ ...styles.card, padding: 24, minWidth: 340, maxWidth: 380, flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', gap: 2 }}>{[...Array(5)].map((_,j) => <span key={j} style={{color:T,fontSize:12}}>★</span>)}</div>
                <span style={{ fontSize: 11, fontWeight: 700, color: T, background: 'rgba(45,212,191,0.08)', border: '1px solid rgba(45,212,191,0.15)', borderRadius: 6, padding: '3px 8px', fontFamily: 'monospace' }}>{t.m}</span>
              </div>
              <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.72, marginBottom: 20, fontStyle: 'italic' }}>"{t.t}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(45,212,191,0.12)', border: '1px solid rgba(45,212,191,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: T, flexShrink: 0 }}>{t.av}</div>
                <div>
                  <p style={{ fontSize: 13.5, fontWeight: 700, color: '#F5F5F5' }}>{t.n}</p>
                  <p style={{ fontSize: 12, color: '#6B7280' }}>{t.r}</p>
                </div>
              </div>
            </div>
          )))}
        </div>
      </div>
    </div>
  );
}

// ── FOUNDER ──
function Founder() {
  return (
    <div style={{ ...styles.section, background: '#0D0D0D' }}>
      <div style={styles.containerNarrow}>
        <Reveal>
          <div style={{ ...styles.card, padding: 'clamp(28px,4vw,40px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 40, alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(45,212,191,0.12)', border: '2px solid rgba(45,212,191,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 900, color: T }}>S</div>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#F5F5F5' }}>Shantanu Sharma</p>
              <p style={{ fontSize: 12, color: '#6B7280' }}>Founder, Somyra</p>
              <div style={{ display: 'flex', gap: 2 }}>{[...Array(5)].map((_,i) => <span key={i} style={{color:T,fontSize:11}}>★</span>)}</div>
            </div>
            <div>
              <span style={styles.eyebrow}>Why I Built This</span>
              <p style={{ fontSize: 15, color: '#9CA3AF', lineHeight: 1.75, marginBottom: 14 }}>"I dropped out of college and left my job in 2024 to go all in on LinkedIn strategy for founders. I spent months doing profile revamps and ghostwriting manually and I kept seeing the same problems.</p>
              <p style={{ fontSize: 15, color: '#9CA3AF', lineHeight: 1.75, marginBottom: 14 }}>Great founders with terrible profiles. Smart people writing posts that got ignored. Outreach that felt like spam because it was too generic.</p>
              <p style={{ fontSize: 15, color: '#9CA3AF', lineHeight: 1.75, marginBottom: 20 }}>I built Somyra because I was tired of LinkedIn being a black box. The strategy that works is not a secret. It just needed to be made accessible. That is what this is."</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['500+ profiles audited','1 year ghostwriting experience','Built solo in India'].map(b => (
                  <span key={b} style={{ fontSize: 11.5, color: '#6B7280', background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '4px 12px', fontFamily: 'monospace' }}>{b}</span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

// ── PRICING ──
function Pricing() {
  const [annual, setAnnual] = useState(false);
  const plans = [
    { name:'Free', price:{m:'$0',a:'$0'}, note:'forever', desc:'Try every feature before you commit.', cta:'Start Free', href:'/signup', style:'plain' as const,
      feats:['5 Profile Audits','10 Posts Written','30 Topics Generated','10 Outreach Messages','5 Voice Profile posts','10 Saved items'] },
    { name:'Pro', price:{m:'$19',a:'$13'}, note:'/mo', desc:'For founders and professionals who want consistent LinkedIn growth.', cta:'Start Pro', href:'/signup?plan=pro', style:'featured' as const, badge:'Most Popular',
      feats:['30 Profile Audits','60 Posts Written','Unlimited Topics','500 Outreach Messages','10 Voice Profile posts','200 Saved items','LinkedIn Growth Tracker','Priority AI model tier'] },
    { name:'Max', price:{m:'$39',a:'$29'}, note:'/mo', desc:'For high volume creators and teams who need no limits.', cta:'Start Max', href:'/signup?plan=max', style:'dark' as const,
      feats:['30 Profile Audits','Unlimited Posts','Unlimited Topics','1000 Outreach Messages','20 Voice Profile posts','Unlimited Saved items','LinkedIn Growth Tracker','Top AI intelligence layer','Early access to new tools'] },
  ];
  return (
    <div style={{ ...styles.section, background: '#080808' }} id="pricing">
      <div style={styles.container}>
        <Reveal>
          <span style={styles.eyebrow}>Pricing</span>
          <h2 style={styles.h2}>Start free. Upgrade when<br/><span style={{color:T}}>you see results.</span></h2>
          <p style={styles.sub}>No contracts. Cancel anytime. Most users upgrade within two weeks.</p>
        </Reveal>
        <Reveal delay={60}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48, justifyContent: 'center' }}>
            <span style={{ fontSize: 14, color: annual ? '#6B7280' : '#F5F5F5', fontWeight: 500 }}>Monthly</span>
            <div onClick={() => setAnnual(!annual)} style={{ width: 44, height: 24, borderRadius: 12, background: annual ? 'rgba(45,212,191,0.15)' : '#141414', border: `1px solid ${annual ? 'rgba(45,212,191,0.3)' : 'rgba(255,255,255,0.1)'}`, position: 'relative', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ position: 'absolute', top: 3, left: annual ? 23 : 3, width: 16, height: 16, borderRadius: '50%', background: annual ? T : '#6B7280', transition: 'all 0.2s' }}/>
            </div>
            <span style={{ fontSize: 14, color: annual ? '#F5F5F5' : '#6B7280', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
              Annual
              <span style={{ fontSize: 11, background: 'rgba(45,212,191,0.1)', color: T, border: '1px solid rgba(45,212,191,0.2)', borderRadius: 4, padding: '2px 7px', fontFamily: 'monospace', fontWeight: 700 }}>Save 32%</span>
            </span>
          </div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16, marginBottom: 32 }}>
          {plans.map((p,i) => (
            <Reveal key={p.name} delay={i * 80}>
              <div style={{ position: 'relative', background: p.style === 'featured' ? 'linear-gradient(140deg,#141414,#0E1C1A)' : p.style === 'dark' ? '#181818' : 'transparent', border: `1px solid ${p.style === 'featured' ? 'rgba(45,212,191,0.4)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 16, padding: 32, boxShadow: p.style === 'featured' ? '0 0 50px rgba(45,212,191,0.07)' : 'none', height: '100%', display: 'flex', flexDirection: 'column' }}>
                {p.badge && <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: T, color: '#030B09', fontSize: 11, fontWeight: 800, padding: '4px 14px', borderRadius: 20, whiteSpace: 'nowrap', fontFamily: 'monospace', letterSpacing: '0.04em' }}>{p.badge}</div>}
                <div style={{ marginBottom: 28 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 10 }}>{p.name}</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                    <span style={{ fontSize: 44, fontWeight: 900, color: '#F5F5F5', letterSpacing: '-0.05em' }}>{annual ? p.price.a : p.price.m}</span>
                    <span style={{ fontSize: 14, color: '#6B7280' }}>{p.note}</span>
                  </div>
                  {annual && p.price.a !== '$0' && <p style={{ fontSize: 11.5, color: '#6B7280', fontFamily: 'monospace', marginTop: 3 }}>billed annually</p>}
                  <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.55, marginTop: 10 }}>{p.desc}</p>
                </div>
                <div style={{ flex: 1, marginBottom: 28 }}>
                  {p.feats.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 13.5, color: '#9CA3AF', marginBottom: 10 }}>
                      <span style={{ color: T, fontSize: 14, flexShrink: 0 }}>✓</span>{f}
                    </div>
                  ))}
                </div>
                <a href={p.href} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '13px 20px', borderRadius: 10, fontWeight: 700, fontSize: 14,
                  background: p.style === 'featured' ? T : 'transparent',
                  color: p.style === 'featured' ? '#030B09' : '#F5F5F5',
                  border: p.style === 'featured' ? 'none' : '1px solid rgba(255,255,255,0.18)',
                  textDecoration: 'none', transition: 'all 0.2s',
                }}>{p.cta}</a>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={100}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(45,212,191,0.08), rgba(45,212,191,0.02))',
            border: '1px solid rgba(45,212,191,0.25)',
            borderRadius: 16, padding: '24px 28px',
            display: 'flex', alignItems: 'flex-start', gap: 18,
          }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(45,212,191,0.1)', border: '1px solid rgba(45,212,191,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 22 }}>🔒</span>
            </div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 800, color: '#F5F5F5', marginBottom: 6 }}>30 Day Money Back Guarantee</p>
              <p style={{ fontSize: 13.5, color: '#9CA3AF', lineHeight: 1.65 }}>If you are on a paid plan and do not see improvement in your profile views or outreach replies within 30 days, email us and we will refund every rupee. No questions, no process, no waiting.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

// ── FAQ ──
function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    { q:'Will it actually sound like me or like a bot?', a:'This is the question we hear most. Somyra Voice Profile trains on your actual writing patterns, tone, and vocabulary. Pro and Max users get the highest intelligence AI tier specifically to maintain voice consistency. The output reads like you wrote it on your best day, not like a robot trying to impersonate you.' },
    { q:'How long before I see real results?', a:'Most users see a measurable increase in profile views within the first week after implementing their audit recommendations. Outreach reply rates improve immediately. Content reach takes two to four weeks to build momentum because consistent posting is still part of the equation.' },
    { q:"I'm not a writer. Will this still work for me?", a:'Especially for you. You do not write anything from scratch. You give Somyra a topic, it generates three variants, you pick one and tweak a word or two. The whole process takes under five minutes per post. Non-writers are consistently our happiest users.' },
    { q:'What if I already have a strong profile?', a:'Run the audit and see. Most profiles that founders think are "fine" score between 60 and 75 out of 100 and have three to five specific, fixable issues. The audit will tell you exactly what is holding you back or confirm you are in great shape.' },
    { q:'Is my data safe? Do you train AI on my content?', a:'Your data is yours. We do not sell it, do not share it with third parties, and do not use your Voice Profile or content to train models. Everything lives only in your account.' },
    { q:'Can I cancel anytime?', a:'Yes. One click from your dashboard. No cancellation calls, no retention flow, no guilt. You keep access until the end of your billing period and then you are done.' },
  ];
  return (
    <div style={{ ...styles.section, background: '#0D0D0D' }}>
      <div style={styles.containerNarrow}>
        <Reveal>
          <span style={styles.eyebrow}>FAQ</span>
          <h2 style={styles.h2}>Questions people<br/><span style={{color:T}}>actually ask</span></h2>
        </Reveal>
        <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {faqs.map((f,i) => (
            <Reveal key={i} delay={i * 30}>
              <div onClick={() => setOpen(open === i ? null : i)} style={{ background: '#141414', border: `1px solid ${open === i ? 'rgba(45,212,191,0.25)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 10, padding: '18px 22px', cursor: 'pointer', transition: 'border-color 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, fontSize: 15, fontWeight: 600, color: '#F5F5F5' }}>
                  <span>{f.q}</span>
                  <span style={{ fontSize: 22, color: T, flexShrink: 0, fontWeight: 300, lineHeight: 1 }}>{open === i ? '−' : '+'}</span>
                </div>
                {open === i && <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.72, marginTop: 12 }}>{f.a}</p>}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── FINAL CTA ──
function FinalCTA() {
  return (
    <div style={{ padding: 'clamp(64px,10vw,112px) 0', textAlign: 'center', position: 'relative', overflow: 'hidden', background: '#080808' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 'min(700px,90vw)', height: 'min(400px,60vw)', background: 'radial-gradient(ellipse,rgba(45,212,191,0.08) 0%,transparent 65%)', pointerEvents: 'none' }}/>
      <div style={{ ...styles.containerNarrow, position: 'relative', zIndex: 1 }}>
        <Reveal>
          <span style={styles.eyebrow}>Get Started Free</span>
          <h2 style={{ fontSize: 'clamp(28px,5vw,52px)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 18, color: '#F5F5F5' }}>
            Your LinkedIn is either building your business or wasting your time.
          </h2>
          <p style={{ fontSize: 16, color: '#9CA3AF', lineHeight: 1.7, marginBottom: 36 }}>
            Audit your profile, build your voice, and start publishing and outreaching with a system that works. Do it in the next ten minutes.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
            <a href="/signup" style={{ ...styles.btnTeal, fontSize: 15, padding: '15px 26px', borderRadius: 11 }}>Audit My Profile Free</a>
            <a href="#pricing" style={{ ...styles.btnGhost, fontSize: 15, padding: '15px 26px', borderRadius: 11 }}>See Pricing</a>
          </div>
          <p style={{ fontSize: 12.5, color: '#6B7280', fontFamily: 'monospace' }}>No credit card. Free forever plan. Cancel paid plans anytime.</p>
        </Reveal>
      </div>
    </div>
  );
}

// ── FOOTER ──
function Footer() {
  const [pulse, setPulse] = useState(false);
  useEffect(() => { const t = setInterval(() => setPulse(p => !p), 2000); return () => clearInterval(t); }, []);

  const linkStyle: React.CSSProperties = { display: 'block', fontSize: 13, color: '#6B7280', marginBottom: 9, textDecoration: 'none', transition: 'color 0.2s' };
  const footerLinks = [
    { t:'Tools', l:[{l:'Profile Audit',h:'/linkedin-profile-audit'},{l:'Post Writer',h:'/linkedin-post-generator'},{l:'Smart Outreach',h:'/linkedin-dm-generator'},{l:'Topic Generator',h:'/linkedin-topic-generator'},{l:'Voice Profile',h:'/dashboard'}] },
    { t:'Product', l:[{l:'How It Works',h:'#how'},{l:'Pricing',h:'#pricing'},{l:"What's New",h:'#'},{l:'Blog',h:'/blog'}] },
    { t:'Company', l:[{l:'About',h:'#'},{l:'Contact',h:'/contact'},{l:'Privacy',h:'/privacy'},{l:'Terms',h:'/terms'}] },
  ];

  return (
    <footer style={{ background: '#080808', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(40px,6vw,56px) 28px 44px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 48 }}>
        <div style={{ maxWidth: 220 }}>
          <a href="/" style={styles.logoWrap}>
            <div style={{ width: 30, height: 30, background: 'rgba(45,212,191,0.12)', border: '1px solid rgba(45,212,191,0.28)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T }}>
              <SomyraLogo size={16} />
            </div>
            <span style={{ fontSize: 17, fontWeight: 800, color: '#F5F5F5', letterSpacing: '-0.03em' }}>Somyra</span>
          </a>
          <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6, marginBottom: 16 }}>Your AI copilot for LinkedIn. Build presence, write better, and close more.</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11.5, color: '#6B7280', background: '#141414', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '5px 12px', fontFamily: 'monospace' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E', boxShadow: pulse ? '0 0 0 3px rgba(34,197,94,0.2)' : 'none', transition: 'box-shadow 0.6s', flexShrink: 0, display: 'inline-block' }}/>
            All systems operational
          </div>
        </div>
        {footerLinks.map(col => (
          <div key={col.t}>
            <p style={{ fontSize: 10.5, fontWeight: 700, color: '#374151', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 14 }}>{col.t}</p>
            {col.l.map(link => <a key={link.l} href={link.h} style={linkStyle}>{link.l}</a>)}
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '16px 28px 28px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <p style={{ fontSize: 12, color: '#374151', fontFamily: 'monospace' }}>© 2026 Somyra AI. All rights reserved.</p>
        <p style={{ fontSize: 12, fontFamily: 'monospace', color: '#374151' }}>Made with <span style={{color:'#EF4444'}}>♥</span> in India by <span style={{color:'#9CA3AF'}}>Shantanu Sharma</span></p>
      </div>
    </footer>
  );
}

// ── ROOT ──
const LandingPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }
        a:hover { opacity: 0.85; }
        .logo-scroll { animation: scroll 28s linear infinite; }
        @keyframes scroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .marquee-container { overflow: hidden; position: relative; padding: 0 28px; }
        .marquee-track { display: flex; gap: 16; }
        .marquee-right { animation: marqueeRight 40s linear infinite; }
        .marquee-left { animation: marqueeLeft 40s linear infinite; }
        .marquee-container:hover .marquee-right,
        .marquee-container:hover .marquee-left { animation-play-state: paused; }
        @keyframes marqueeRight { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes marqueeLeft { from{transform:translateX(-50%)} to{transform:translateX(0)} }
        @media (max-width: 640px) {
          .marquee-right { animation-duration: 30s; }
          .marquee-left { animation-duration: 30s; }
        }
      `}</style>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <a href="/" style={styles.logoWrap}>
            <div style={{ width: 30, height: 30, background: 'rgba(45,212,191,0.12)', border: '1px solid rgba(45,212,191,0.28)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T }}>
              <SomyraLogo size={16} />
            </div>
            <span style={styles.logoName}>Somyra</span>
          </a>

          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {['How It Works','Features','Pricing'].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(/ /g,'')}`} style={styles.navLink}>{l}</a>
            ))}
            <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.08)', margin: '0 6px' }}/>
            <a href="/signin" style={styles.navLink}>Sign In</a>
            <a href="/signup" style={styles.btnTeal}>Start Free</a>
          </div>

          <button
            onClick={() => setMobileOpen(true)}
            className="mobile-hamburger"
            style={{ display: 'none', background: 'none', border: 'none', color: '#9CA3AF', fontSize: 22, cursor: 'pointer', padding: 6 }}
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Main content with sidebar layout */}
      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '0 28px', display: 'flex', gap: 28 }}>
        <div className="landing-sidebar" style={{ display: 'block' }}>
          <Sidebar />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Hero />
          <LogoStrip />
          <Pain />
          <Transform />
          <HowItWorks />
          <Features />
          <ComparisonTable />
          <Testimonials />
          <Founder />
          <Pricing />
          <FAQ />
          <FinalCTA />
        </div>
      </div>

      <Footer />

      <style>{`
        @media (max-width: 1024px) {
          .landing-sidebar { display: none !important; }
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-hamburger { display: block !important; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
