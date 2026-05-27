import React, { useState } from 'react';
import { MessageBuilder } from './MessageBuilder';
import { FollowUpIntelligence } from './FollowUpIntelligence';
import { ICPBuilder } from './ICPBuilder';
import { CRMTracker } from './CRMTracker';
import { OutreachTemplates } from './OutreachTemplates';

interface SmartOutreachProps {
  checkGenerationLimit: (feature: any) => boolean;
  trackEvent: (eventName: string, params?: any) => void;
  voicePosts: { content: string }[];
  profile: any;
  incrementUsage: (feature: any) => Promise<void>;
  showToast: (toastData: any) => void;
  setToast: React.Dispatch<React.SetStateAction<any>>;
  GenerationCounter: React.ComponentType<{ feature?: string }>;
  handleSave: (type: string, content: string, id: string) => Promise<void>;
  handleCopy: (text: string, id: string) => void;
  saving: string | null;
  copied: string | null;
  usageLimits: any;
  user?: any;
  onRequireAuth?: (feature: string, callback: () => void) => void;
}

export function SmartOutreach(props: SmartOutreachProps) {
  const [activeTab, setActiveTab] = useState<'message' | 'followup' | 'icp' | 'tracker' | 'templates'>('message');

  return (
    <div className="space-y-8">
      <div className="section-heading">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">Smart Outreach</h2>
          <p className="text-[13px] md:text-sm text-muted">Generate hyper-personalized DMs and track responses.</p>
        </div>
        <div className="flex items-start gap-2 sm:gap-4">
          {props.voicePosts.length > 0 && (
            <div className="flex items-center gap-2 px-3.5 py-1.5 sm:py-2 rounded-full bg-teal-accent/10 border border-teal-accent/20 min-h-[30px] sm:min-h-[34px]">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-teal-accent rounded-full animate-pulse" />
              <span className="text-xs sm:text-[13px] font-bold text-teal-accent uppercase tracking-wider">Voice Active</span>
            </div>
          )}
          <props.GenerationCounter feature="smart_outreach" />
        </div>
      </div>

      <div className="flex border-b border-border-card overflow-x-auto custom-scrollbar no-scrollbar-mobile pb-1">
        <button
          onClick={() => setActiveTab('message')}
          className={`pb-3 px-4 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'message' 
            ? 'border-teal-accent text-teal-accent' 
            : 'border-transparent text-muted hover:text-white'
          }`}
        >
          Message Builder
        </button>
        <button
          onClick={() => setActiveTab('icp')}
          className={`pb-3 px-4 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'icp' 
            ? 'border-teal-accent text-teal-accent' 
            : 'border-transparent text-muted hover:text-white'
          }`}
        >
          ICP Clarity
        </button>
        <button
          onClick={() => setActiveTab('followup')}
          className={`pb-3 px-4 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'followup' 
            ? 'border-teal-accent text-teal-accent' 
            : 'border-transparent text-muted hover:text-white'
          }`}
        >
          Follow-Up Intelligence
        </button>
        <button
          onClick={() => setActiveTab('tracker')}
          className={`pb-3 px-4 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'tracker' 
            ? 'border-teal-accent text-teal-accent' 
            : 'border-transparent text-muted hover:text-white'
          }`}
        >
          CRM Tracker
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`pb-3 px-4 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'templates' 
            ? 'border-teal-accent text-teal-accent' 
            : 'border-transparent text-muted hover:text-white'
          }`}
        >
          Templates
        </button>
      </div>

      <div className="pt-2">
        {activeTab === 'message' && <MessageBuilder {...props} />}
        {activeTab === 'followup' && <FollowUpIntelligence {...props} />}
        {activeTab === 'tracker' && <CRMTracker />}
        {activeTab === 'icp' && <ICPBuilder {...props} />}
        {activeTab === 'templates' && <OutreachTemplates handleCopy={props.handleCopy} copied={props.copied} />}
      </div>
    </div>
  );
}
