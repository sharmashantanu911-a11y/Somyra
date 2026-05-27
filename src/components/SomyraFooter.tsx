import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface FooterLinkProps {
  to?: string;
  href?: string;
  className?: string;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ to, href, className = '', children }) => {
  if (to) {
    return (
      <Link to={to} className={`footer-link ${className}`}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href || '#'} className={`footer-link ${className}`}>
      {children}
    </a>
  );
};

const StatusDot: React.FC = () => {
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setPulse(p => !p), 2000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="status-badge">
      <span className={`status-dot ${pulse ? 'pulse' : ''}`} />
      All systems operational
    </span>
  );
};

const SomyraFooter: React.FC = () => {
  return (
    <>
      <style>{`
        /* ─── FOOTER WRAPPER ─── */
        .somyra-footer {
          background: #080808;
          border-top: 1px solid rgba(255,255,255,0.06);
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Subtle teal glow at top edge */
        .somyra-footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #2DD4BF 40%, #2DD4BF 60%, transparent);
          opacity: 0.35;
        }

        /* ─── MAIN FOOTER BODY ─── */
        .footer-body {
          max-width: 1200px;
          margin: 0 auto;
          padding: 64px 32px 48px;
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 64px;
          align-items: start;
        }

        /* ─── BRAND COLUMN ─── */
        .brand-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
          text-decoration: none;
        }

        .brand-logo:hover {
          opacity: 0.9;
        }

        .logo-mark {
          width: 32px;
          height: 32px;
          background: rgba(45, 212, 191, 0.12);
          border: 1px solid rgba(45, 212, 191, 0.25);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .logo-mark svg {
          width: 18px;
          height: 18px;
          color: #2DD4BF;
          fill: currentColor;
        }

        .brand-name {
          font-size: 18px;
          font-weight: 600;
          color: #F0F0F0;
          letter-spacing: -0.02em;
        }

        .brand-tagline {
          font-size: 13px;
          color: #6B7280;
          line-height: 1.6;
          margin-bottom: 20px;
          font-weight: 400;
          max-width: 220px;
        }

        /* Status badge */
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 12px;
          color: #6B7280;
          background: #141414;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          padding: 5px 12px 5px 9px;
          margin-bottom: 28px;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.01em;
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #22C55E;
          flex-shrink: 0;
          transition: box-shadow 0.6s ease;
        }

        .status-dot.pulse {
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
        }

        /* Social icons */
        .social-row {
          display: flex;
          gap: 10px;
        }

        .social-btn {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: #141414;
          border: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6B7280;
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .social-btn:hover {
          background: rgba(45, 212, 191, 0.12);
          border-color: rgba(45, 212, 191, 0.3);
          color: #2DD4BF;
          transform: translateY(-1px);
        }

        .social-btn svg {
          width: 15px;
          height: 15px;
          fill: currentColor;
        }

        /* ─── NAV COLUMNS ─── */
        .nav-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
        }

        .nav-col-title {
          font-size: 11px;
          font-weight: 600;
          color: #374151;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 16px;
          font-family: 'DM Mono', monospace;
        }

        .nav-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 0;
          margin: 0;
        }

        .footer-link {
          font-size: 13.5px;
          color: #6B7280;
          text-decoration: none;
          font-weight: 400;
          transition: color 0.2s ease;
          display: inline-block;
        }

        .footer-link:hover {
          color: #F0F0F0;
        }

        .footer-link.highlight {
          color: #2DD4BF;
          font-weight: 500;
        }

        .footer-link.highlight:hover {
          color: #5EEAD4;
        }

        /* New badge on a link */
        .badge-new {
          display: inline-flex;
          align-items: center;
          background: rgba(45, 212, 191, 0.12);
          border: 1px solid rgba(45,212,191,0.2);
          color: #2DD4BF;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.06em;
          padding: 1px 6px;
          border-radius: 4px;
          margin-left: 6px;
          vertical-align: middle;
          font-family: 'DM Mono', monospace;
        }

        /* ─── DIVIDER ─── */
        .footer-divider {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 32px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        /* ─── FOOTER BOTTOM ─── */
        .footer-bottom {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px 32px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .footer-copy {
          font-size: 12.5px;
          color: #374151;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.01em;
        }

        .footer-copy span {
          color: #6B7280;
        }

        .legal-links {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .legal-link {
          font-size: 12.5px;
          color: #374151;
          text-decoration: none;
          transition: color 0.2s ease;
          padding: 0 8px;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.01em;
        }

        .legal-link:hover {
          color: #6B7280;
        }

        .legal-sep {
          width: 1px;
          height: 12px;
          background: rgba(255,255,255,0.06);
        }

        .built-with {
          font-size: 12.5px;
          color: #374151;
          font-family: 'DM Mono', monospace;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .built-with svg {
          width: 12px;
          height: 12px;
          fill: #EF4444;
          flex-shrink: 0;
        }

        .built-with span {
          color: #6B7280;
        }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 960px) {
          .footer-body {
            grid-template-columns: 1fr;
            gap: 48px;
            padding: 48px 24px 40px;
          }
          .nav-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 32px 24px;
          }
          .brand-tagline { max-width: 100%; }
        }

        @media (max-width: 600px) {
          .footer-body {
            padding: 40px 20px 32px;
          }
          .nav-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 28px 20px;
          }
          .footer-bottom {
            padding: 16px 20px 24px;
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .legal-links {
            flex-wrap: wrap;
          }
          .built-with {
            display: none;
          }
        }
      `}</style>

      <footer className="somyra-footer">
        {/* ── BODY ── */}
        <div className="footer-body">
          {/* Brand col */}
          <div className="brand-col">
            <Link to="/" className="brand-logo">
              <div className="logo-mark">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3h18v6H9v2h12v10H3v-6h12v-2H3V3z" />
                </svg>
              </div>
              <span className="brand-name">Somyra</span>
            </Link>

            <p className="brand-tagline">
              Your AI copilot for LinkedIn. Build presence, write better, and close more.
            </p>

            <StatusDot />

            <div className="social-row">
              {/* LinkedIn */}
              <a href="https://www.linkedin.com/in/sharmashantanu911" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              {/* X / Twitter */}
              <a href="#" className="social-btn" aria-label="X (Twitter)">
                <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              {/* YouTube */}
              <a href="#" className="social-btn" aria-label="YouTube">
                <svg viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Nav grid */}
          <div className="nav-grid">
            {/* TOOLS */}
            <div className="nav-col">
              <p className="nav-col-title">Tools</p>
              <ul className="nav-list">
                <li><FooterLink to="/linkedin-profile-audit">Profile Audit</FooterLink></li>
                <li><FooterLink to="/linkedin-post-generator">Post Writer</FooterLink></li>
                <li><FooterLink to="/linkedin-topic-generator">Topic Generator</FooterLink></li>
                <li>
                  <FooterLink to="/linkedin-dm-generator">
                    Smart Outreach
                    <span className="badge-new">NEW</span>
                  </FooterLink>
                </li>
                <li><FooterLink to="/linkedin-hook-generator">Hook Generator</FooterLink></li>
              </ul>
            </div>

            {/* PRODUCT */}
            <div className="nav-col">
              <p className="nav-col-title">Product</p>
              <ul className="nav-list">
                <li><FooterLink to="/#how-it-works">How It Works</FooterLink></li>
                <li><FooterLink to="/#pricing">Pricing</FooterLink></li>
                <li><FooterLink to="/blog">Blog</FooterLink></li>
                <li><FooterLink to="/" className="highlight">Start Free →</FooterLink></li>
              </ul>
            </div>

            {/* USE CASES */}
            <div className="nav-col">
              <p className="nav-col-title">Use Cases</p>
              <ul className="nav-list">
                <li><FooterLink to="/">Founders</FooterLink></li>
                <li><FooterLink to="/">Executives</FooterLink></li>
                <li><FooterLink to="/">Sales Pros</FooterLink></li>
                <li><FooterLink to="/">Consultants</FooterLink></li>
              </ul>
            </div>

            {/* COMPANY */}
            <div className="nav-col">
              <p className="nav-col-title">Company</p>
              <ul className="nav-list">
                <li><FooterLink to="/contact">Contact</FooterLink></li>
                <li><FooterLink to="/privacy">Privacy</FooterLink></li>
                <li><FooterLink to="/terms">Terms</FooterLink></li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div className="footer-divider" />

        {/* ── BOTTOM BAR ── */}
        <div className="footer-bottom">
          <p className="footer-copy">
            © 2026 <span>Somyra AI.</span> All rights reserved.
          </p>

          <div className="legal-links">
            <Link to="/privacy" className="legal-link">Privacy</Link>
            <div className="legal-sep" />
            <Link to="/terms" className="legal-link">Terms</Link>
            <div className="legal-sep" />
            <Link to="/contact" className="legal-link">Contact</Link>
          </div>

          <div className="built-with">
            Made with&nbsp;
            <svg viewBox="0 0 24 24"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/></svg>
            &nbsp;in <span>India</span>&nbsp;by&nbsp;<span>Shantanu Sharma</span>
          </div>
        </div>
      </footer>
    </>
  );
};

export default SomyraFooter;
