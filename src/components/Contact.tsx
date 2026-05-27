import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Mail, User, Briefcase, Bug, Linkedin, ExternalLink } from 'lucide-react';

interface ContactProps {
  onBack: () => void;
}

export const Contact: React.FC<ContactProps> = ({ onBack }) => {
  const cards = [
    {
      icon: Mail,
      title: "Support",
      description: "For questions about your account, billing, or the product.",
      email: "support@somyra.in",
      href: "mailto:somyra@proton.me",
      note: "Typically responds within 24 to 48 hours"
    },
    {
      icon: User,
      title: "Connect with the Founder",
      description: "Somyra is built by Shantanu Sharma. For product feedback or feature requests.",
      button: "Connect on LinkedIn",
      href: "https://www.linkedin.com/in/sharmashantanu911"
    },
    {
      icon: Briefcase,
      title: "Business and Press",
      description: "For partnerships, collaborations, or press inquiries.",
      email: "support@somyra.in",
      href: "mailto:somyra@proton.me",
      note: "Use subject line Business or Press"
    },
    {
      icon: Bug,
      title: "Report an Issue",
      description: "Found something not working right? Tell us what happened, what you were trying to do, and your browser and device.",
      email: "support@somyra.in",
      href: "mailto:somyra@proton.me",
      note: "Use subject line Bug Report"
    }
  ];

  return (
    <div className="fixed inset-0 z-[120] bg-[#080808] overflow-y-auto scroll-smooth w-full h-full">
      <div className="w-full max-w-[800px] mx-auto px-6 py-20 md:py-32">
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 text-muted hover:text-teal-accent transition-colors mb-12 text-sm font-bold uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        <header className="mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Contact</h1>
          <div className="text-[#A0A0A0] leading-[1.8] text-lg">
            We typically respond within 24 to 48 hours on business days to all inquiries.
          </div>
        </header>

        <div className="grid gap-6">
          {cards.map((card, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#141414] border-l-[3px] border-teal-accent p-8 rounded-2xl group hover:border-l-[5px] transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2.5 bg-teal-accent/10 rounded-xl">
                  <card.icon className="w-5 h-5 text-teal-accent" />
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">{card.title}</h2>
              </div>
              <p className="text-[#A0A0A0] leading-relaxed mb-6">
                {card.description}
              </p>
              
              {card.email && (
                <div className="space-y-2">
                  <a 
                    href={card.href}
                    className="text-teal-accent font-black hover:opacity-80 transition-opacity inline-flex items-center gap-2"
                  >
                    {card.email}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  {card.note && (
                    <p className="text-[11px] text-muted font-medium uppercase tracking-[0.1em]">{card.note}</p>
                  )}
                </div>
              )}

              {card.button && (
                <a 
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3 border border-teal-accent/30 rounded-xl text-teal-accent text-sm font-bold hover:bg-teal-accent/5 transition-all group-hover:border-teal-accent"
                >
                  <Linkedin className="w-4 h-4" />
                  {card.button}
                </a>
              )}
            </motion.div>
          ))}
        </div>

        <footer className="mt-20 text-center pb-20">
          <div className="space-y-2">
            <p className="text-muted text-sm font-medium">Shantanu Sharma operating as Somyra</p>
            <p className="text-muted text-sm font-medium">Sanjay Gandhi Colony, Aligarh</p>
            <p className="text-muted text-sm font-medium">Uttar Pradesh, India</p>
          </div>
        </footer>
      </div>
    </div>
  );
};
