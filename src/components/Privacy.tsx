import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ShieldCheck, Lock } from 'lucide-react';
import { SEO } from './SEO';

interface PrivacyProps {
  onBack: () => void;
}

export const Privacy: React.FC<PrivacyProps> = ({ onBack }) => {
  return (
    <>
      <SEO
        title="Privacy Policy | Somyra"
        description="Read the Privacy Policy for Somyra — how we collect, safeguard, and disclose information resulting from your use of our platform."
        canonical="https://somyra.online/privacy"
      />
      <div className="fixed inset-0 z-[120] bg-[#080808] overflow-y-auto scroll-smooth">
      <div className="flex flex-col items-center w-full min-h-screen py-20 md:py-32 px-6">
        <div className="w-full max-w-[800px]">
          <button 
            onClick={onBack}
            className="group flex items-center gap-2 text-muted hover:text-teal-accent transition-colors mb-12 text-sm font-bold uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>

          <header className="mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-accent/10 border border-teal-accent/20 mb-6">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-accent" />
              <span className="text-[10px] font-black text-teal-accent uppercase tracking-widest">Privacy Policy</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Privacy Policy</h1>
            <p className="text-muted font-medium">Last updated: April 3, 2026</p>
          </header>

          <div className="space-y-12 text-[#A0A0A0] leading-[1.8] text-[15px] md:text-base">
            <section>
              <h2 className="text-white text-xl font-black mb-6 flex items-center gap-3">
                <span className="text-teal-accent/40">01.</span> Introduction
              </h2>
              <div className="space-y-4">
                <p>Welcome to Somyra.</p>
                <p>Shantanu Sharma, operating as Somyra ("we", "us", "our") operates https://somyra.in (referred to as "Service").</p>
                <p>This Privacy Policy governs your visit to https://somyra.in and explains how we collect, safeguard, and disclose information that results from your use of our Service.</p>
                <p>We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy. Unless otherwise defined in this Privacy Policy, terms used here have the same meanings as in our Terms of Service at https://somyra.in/terms.</p>
              </div>
            </section>

            <section>
              <h2 className="text-white text-xl font-black mb-6 flex items-center gap-3">
                <span className="text-teal-accent/40">02.</span> Information We Collect
              </h2>
              <div className="space-y-4">
                <p>We collect several types of information to provide and improve our Service.</p>
                <ul className="list-disc ml-6 space-y-4">
                  <li>
                    <strong className="text-white">Personal Data:</strong> While using our Service, we may ask you to provide personally identifiable information including email address, name, and LinkedIn profile content you voluntarily paste.
                  </li>
                  <li>
                    <strong className="text-white">Usage Data:</strong> We automatically collect information about how you interact with the Service, including IP address, browser type, and diagnostic data.
                  </li>
                  <li>
                    <strong className="text-white">Content Data:</strong> When you use features like Profile Audit or Post Writer, we process the text you submit solely to deliver the service. This content is stored securely in our database.
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-white text-xl font-black mb-6 flex items-center gap-3">
                <span className="text-teal-accent/40">03.</span> Tracking and Cookies
              </h2>
              <p>We use cookies and similar tracking technologies to monitor activity on the Service and store certain information. You can instruct your browser to refuse all cookies, however, some parts of the Service may not function properly if cookies are disabled.</p>
            </section>

            <section>
              <h2 className="text-white text-xl font-black mb-6 flex items-center gap-3">
                <span className="text-teal-accent/40">04.</span> How We Use Your Data
              </h2>
              <ul className="list-disc ml-6 space-y-2">
                <li>To provide, operate, and maintain the Service.</li>
                <li>To process your subscription and manage billing.</li>
                <li>To personalize your experience.</li>
                <li>To provide customer support and respond to inquiries.</li>
                <li>To analyze usage patterns and improve the Service.</li>
                <li>To comply with legal obligations.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-xl font-black mb-6 flex items-center gap-3">
                <span className="text-teal-accent/40">05.</span> Data Retention
              </h2>
              <p>We retain your personal data only for as long as necessary to fulfill the purposes described in this Privacy Policy. If you delete your account, we will delete or anonymize your personal data within 30 days, except where retention is required by law.</p>
            </section>

            <section>
              <h2 className="text-white text-xl font-black mb-6 flex items-center gap-3">
                <span className="text-teal-accent/40">06.</span> Security of Data
              </h2>
              <p>We take the security of your data seriously and implement commercially reasonable technical and organizational measures to protect it. However, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security of your data.</p>
            </section>

            <section className="pb-20">
              <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 text-center">
                <Lock className="w-8 h-8 text-teal-accent mx-auto mb-4" />
                <h3 className="text-white font-black mb-4 uppercase tracking-widest text-sm">Your Data, Your Control</h3>
                <p className="text-muted mb-6 px-10">You have the right to access, correct, or delete your personal data at any time. Simply contact us to exercise these rights.</p>
                <a href="mailto:somyra@proton.me" className="text-teal-accent font-black hover:opacity-80 transition-opacity">support@somyra.in</a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};
