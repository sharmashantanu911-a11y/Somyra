import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, FileText, CheckCircle2 } from 'lucide-react';

interface TermsProps {
  onBack: () => void;
}

export const Terms: React.FC<TermsProps> = ({ onBack }) => {
  return (
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
              <FileText className="w-3.5 h-3.5 text-teal-accent" />
              <span className="text-[10px] font-black text-teal-accent uppercase tracking-widest">Legal Document</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Terms of Service</h1>
            <p className="text-muted font-medium">Last updated: April 3, 2026</p>
          </header>

          <div className="space-y-12 text-[#A0A0A0] leading-[1.8] text-[15px] md:text-base">
            <section>
              <h2 className="text-white text-xl font-black mb-6 flex items-center gap-3">
                <span className="text-teal-accent/40">01.</span> Introduction
              </h2>
              <div className="space-y-4">
                <p>Welcome to Somyra. Please read these Terms of Service carefully before using our platform.</p>
                <p>These Terms of Service ("Terms") govern your use of the website located at https://somyra.in and all related services operated by Shantanu Sharma, an individual operating under the brand name Somyra ("we", "us", "our"). Our Privacy Policy also governs your use of the Service and explains how we collect, safeguard, and disclose information resulting from your use of our platform. Please read it at https://somyra.in/privacy.</p>
                <p>Your agreement with us includes these Terms and our Privacy Policy ("Agreements"). By accessing or using Somyra, you acknowledge that you have read, understood, and agree to be bound by these Agreements.</p>
                <p>If you do not agree with these Agreements, you may not use the Service. You may contact us at <a href="mailto:somyra@proton.me" className="text-teal-accent font-bold hover:underline">support@somyra.in</a> to discuss any concerns.</p>
                <p>These Terms apply to all visitors, users, and others who access or use the Service.</p>
              </div>
            </section>

            <section>
              <h2 className="text-white text-xl font-black mb-6 flex items-center gap-3">
                <span className="text-teal-accent/40">02.</span> Communications
              </h2>
              <p>By creating an account on our Service, you agree to receive product updates, feature announcements, and occasional promotional materials. You may opt out of non-essential communications at any time by following the unsubscribe link in any email or by contacting us at <a href="mailto:somyra@proton.me" className="text-teal-accent font-bold hover:underline">support@somyra.in</a>.</p>
            </section>

            <section>
              <h2 className="text-white text-xl font-black mb-6 flex items-center gap-3">
                <span className="text-teal-accent/40">03.</span> Purchases
              </h2>
              <div className="space-y-4">
                <p>If you wish to purchase any subscription plan made available through the Service, you may be asked to provide information relevant to your purchase including payment details.</p>
                <p>You represent and warrant that you have the legal right to use any payment method in connection with your purchase and that all information you provide is true, correct, and complete.</p>
                <p>We use third party payment processors to facilitate transactions. By submitting your payment information, you authorize us to share that information with our payment processor subject to our Privacy Policy.</p>
                <p>We reserve the right to refuse or cancel any order at any time for reasons including but not limited to pricing errors, suspected fraud, unauthorized transactions, or abuse of the platform including but not limited to creating multiple accounts to circumvent usage limits or obtain unauthorized access to paid features.</p>
              </div>
            </section>

            <section>
              <h2 className="text-white text-xl font-black mb-6 flex items-center gap-3">
                <span className="text-teal-accent/40">04.</span> Subscriptions
              </h2>
              <div className="space-y-4">
                <p>Certain features of the Service are available on a subscription basis. You will be billed in advance on a recurring basis according to the billing cycle you select, either monthly or annual.</p>
                <p>Your subscription will automatically renew at the end of each billing cycle under the same conditions unless you cancel before the renewal date. You may cancel your subscription at any time through your account settings.</p>
                <p>A valid payment method is required to maintain an active subscription. By providing payment information, you authorize us to charge all applicable subscription fees to that payment method.</p>
                <p>If automatic billing fails, we will notify you and provide a period to update your payment information before access is restricted.</p>
                <p>Only one discount or promotional offer may be applied per subscription at any time.</p>
              </div>
            </section>

            <section>
              <h2 className="text-white text-xl font-black mb-6 flex items-center gap-3">
                <span className="text-teal-accent/40">05.</span> Fee Changes
              </h2>
              <p>We reserve the right to modify subscription fees at any time. Any fee changes will take effect at the start of the next billing cycle following reasonable prior notice to you via email. Your continued use of the Service after a fee change constitutes your agreement to the updated pricing.</p>
            </section>

            <section>
              <h2 className="text-white text-xl font-black mb-6 flex items-center gap-3">
                <span className="text-teal-accent/40">06.</span> Refunds and Cancellations
              </h2>
              <div className="space-y-4">
                <p>All subscription payments are final. We do not offer refunds for partial billing periods or unused generations within a billing cycle.</p>
                <p>If you believe a charge was made in error, please contact us within 7 days of the charge at <a href="mailto:somyra@proton.me" className="text-teal-accent font-bold hover:underline">support@somyra.in</a> and we will review your case. We handle billing disputes on a case by case basis and reserve the right to issue or decline refunds at our sole discretion.</p>
                <p>Cancelling your subscription will stop future charges. You will retain access to your paid plan until the end of the current billing period.</p>
              </div>
            </section>

            <section>
              <h2 className="text-white text-xl font-black mb-6 flex items-center gap-3">
                <span className="text-teal-accent/40">07.</span> Free Tier
              </h2>
              <p>We offer a free tier with limited usage that does not require a payment method. We reserve the right to modify, limit, or discontinue the free tier at any time without prior notice. Free tier usage is subject to these Terms in the same manner as paid subscriptions.</p>
            </section>

            <section>
              <h2 className="text-white text-xl font-black mb-6 flex items-center gap-3">
                <span className="text-teal-accent/40">08.</span> Content
              </h2>
              <div className="space-y-4">
                <p>Somyra allows you to input text, paste LinkedIn profile content, and generate AI assisted written content ("Content"). You are solely responsible for the Content you input and generate through the Service, including its accuracy, legality, and appropriateness.</p>
                <p>By using the Service, you represent and warrant that your use of any generated Content does not violate the rights of any third party including copyright, privacy, or publicity rights.</p>
                <p>You retain ownership of any original content you input into the Service. You also acknowledge that AI generated content produced by Somyra is provided as a writing aid and does not constitute professional advice of any kind.</p>
                <p>We are not responsible for how you use, publish, or distribute content generated through Somyra. You are solely responsible for reviewing generated content before publishing it anywhere.</p>
                <p>In certain cases, AI generated content may be inaccurate, incomplete, or unsuitable for your specific context. Somyra will not be held liable for any consequences arising from the use of AI generated content.</p>
              </div>
            </section>

            <section>
              <h2 className="text-white text-xl font-black mb-6 flex items-center gap-3">
                <span className="text-teal-accent/40">09.</span> Prohibited Uses
              </h2>
              <div className="space-y-4">
                <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>In any way that violates any applicable law or regulation in India or internationally.</li>
                  <li>To exploit, harm, or attempt to harm minors in any way.</li>
                  <li>To impersonate any person or entity or misrepresent your identity or affiliation.</li>
                  <li>To transmit unsolicited promotional material, spam, or chain communications.</li>
                  <li>In any way that infringes upon the intellectual property, privacy, or other rights of any person or entity.</li>
                  <li>To engage in any conduct that restricts or inhibits any other user's enjoyment of the Service.</li>
                  <li>In any way that violates LinkedIn's Terms of Service.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-white text-xl font-black mb-6 flex items-center gap-3">
                <span className="text-teal-accent/40">10.</span> Analytics
              </h2>
              <p>We use Google Analytics to monitor and analyze usage of our Service. Google Analytics collects data such as pages visited, time spent, and device information to help us improve the Service.</p>
            </section>

            <section className="pb-20">
              <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 text-center">
                <h3 className="text-white font-black mb-4 uppercase tracking-widest text-sm">Have Questions?</h3>
                <p className="text-muted mb-6">If you have any questions about these Terms, please contact us.</p>
                <a href="mailto:somyra@proton.me" className="text-teal-accent font-black hover:opacity-80 transition-opacity">support@somyra.in</a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
