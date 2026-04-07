import React from 'react';
import { Copy, Check, FileText } from 'lucide-react';

export function OutreachTemplates({ handleCopy, copied }: { handleCopy: (text: string, id: string) => void, copied: string | null }) {
  const templates = [
    {
      id: 't1',
      category: 'Cold Outreach',
      title: 'The Observation Hook',
      scenario: 'You noticed a specific pain point they mentioned in a post or article.',
      content: "Hi [Name],\n\nNoticed in your recent post you're balancing growth with technical debt. It's a tough line to walk.\n\nI actually just helped [Similar Company] solve this exact bottleneck without slowing down feature releases.\n\nOpen to a quick note on how?"
    },
    {
      id: 't2',
      category: 'Warm (Engaged)',
      title: 'The Mutual Value',
      scenario: 'They commented on your post recently.',
      content: "Hey [Name], thanks for the perspective on my post about [Topic] yesterday.\n\nYour point about [Specific Thing They Said] was spot on. I’m actually putting together a small guide on this specifically for [Industry] founders.\n\nWould you be open to me sending it over when it's done?"
    },
    {
      id: 't3',
      category: 'Follow-Up',
      title: 'The Graceful Push',
      scenario: 'No reply after 5 days.',
      content: "Hi [Name],\n\nUsually when I don't hear back it means you're slammed or it's just not a priority right now.\n\nIf it's the latter, absolutely no worries—I'll stop reaching out. If you're just busy, is there a better month to reconnect?"
    },
    {
      id: 't4',
      category: 'Referral',
      title: 'The Direct Bridge',
      scenario: 'Mutual connection suggested you talk.',
      content: "Hi [Name],\n\n[Mutual Connection] suggested we connect. They mentioned you're currently rebuilding your [Department/Function] and thought my experience at [Your Company] might be relevant.\n\nDo you have 10 minutes next Tuesday to share notes?"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-teal-accent/5 border border-teal-accent/20 rounded-2xl p-6 mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center sm:items-start gap-5 transition-all">
         <div className="w-12 h-12 bg-teal-accent/10 rounded-full flex items-center justify-center shrink-0 border border-teal-accent/20 shadow-[0_0_15px_rgba(45,212,191,0.1)]">
            <FileText className="w-6 h-6 text-teal-accent" />
         </div>
         <div>
            <h3 className="text-white font-bold text-base mb-1.5">Human-Verified Templates</h3>
            <p className="text-[13px] md:text-sm text-muted leading-relaxed max-w-2xl">
              Before doing automated generation, sometimes you just need inspiration. Here are high-converting text blueprints. Customize the brackets and fire away.
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((t) => (
          <div key={t.id} className="bg-bg-secondary border border-border-card p-6 rounded-2xl flex flex-col justify-between hover:border-teal-accent/30 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-accent bg-teal-accent/10 px-2.5 py-1 rounded-full">
                  {t.category}
                </span>
                <button 
                  onClick={() => handleCopy(t.content, `template-${t.id}`)}
                  className="p-2 text-muted hover:text-white transition-colors rounded-lg hover:bg-white/5"
                  title="Copy Template"
                >
                  {copied === `template-${t.id}` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <h4 className="text-white font-bold text-sm mb-1">{t.title}</h4>
              <p className="text-[11px] text-muted mb-4">{t.scenario}</p>
              <div className="bg-white/5 p-4 rounded-xl">
                <p className="text-[13px] text-slate-300 leading-relaxed whitespace-pre-wrap">{t.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
