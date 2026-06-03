import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPostLayout } from '../../components/seo/BlogPostLayout';

const LinkedinDmFormulaThatGetsReplies: React.FC = () => {
  const faqSchemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is a good LinkedIn DM opening line?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The best LinkedIn DM opening lines reference something specific about the recipient, like a post they wrote, a milestone at their company, or a problem you know they are working through. Generic openers like I came across your profile signal that you did not actually pay attention."
        }
      },
      {
        "@type": "Question",
        "name": "How long should a LinkedIn DM be?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Under 100 words for the first message. People decide whether to reply within the first two sentences. A long message signals that you are going to ask for a lot of their time. Keep it readable in 15 seconds."
        }
      },
      {
        "@type": "Question",
        "name": "What is the best LinkedIn DM formula?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The best formula has four lines. Line 1 is a specific relevance hook referencing something real about them. Line 2 is who you are and why you are relevant to them. Line 3 is a soft ask, always a question never a pitch. Line 4 is an easy out making it OK to say no."
        }
      },
      {
        "@type": "Question",
        "name": "How do I send a LinkedIn DM without being salesy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Lead with relevance, not with your product. Reference something specific about their work. Ask a genuine question instead of pitching. Give them an easy way to decline. The goal of the first message is not to close a deal. It is to earn a reply."
        }
      },
      {
        "@type": "Question",
        "name": "How many LinkedIn DMs should I send per day?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ten to fifteen personalized DMs per day is a sustainable volume for most professionals. Sending more than that usually means you are sacrificing personalization for volume. Quality matters far more than quantity in DM outreach."
        }
      },
      {
        "@type": "Question",
        "name": "Should I connect before sending a LinkedIn DM?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, in most cases. Sending a DM to someone who is not in your network may land in their message requests folder which many users never check. Connect with a personalized note first and send your message after they accept."
        }
      },
      {
        "@type": "Question",
        "name": "What is the best time to send LinkedIn DMs?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Tuesday through Thursday during business hours in the recipient's time zone tend to get the best response rates. Early mornings before the workday starts or lunch hours also work well. Monday mornings and Friday afternoons are generally worse."
        }
      },
      {
        "@type": "Question",
        "name": "How do I follow up on a LinkedIn DM?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Wait three to five days before following up. Add new context instead of checking in. Reference something that happened in their industry since your first message or share a relevant resource. Never send a just checking in message."
        }
      },
      {
        "@type": "Question",
        "name": "What is the biggest mistake in LinkedIn outreach?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Asking for too much too soon. A thirty minute call is a huge ask for someone who does not know you. The first message should aim for a simple reply. Let the relationship build before escalating the ask."
        }
      },
      {
        "@type": "Question",
        "name": "Should I use AI to write LinkedIn DMs?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, if the AI is trained on your voice and you personalize the output. Generic AI templates are easy to spot and get ignored. A tool that learns your style and generates tailored messages based on the recipient's profile can save time without sacrificing quality."
        }
      }
    ]
  };

  return (
      <BlogPostLayout
        faqSchema={faqSchemaData}
        category="Outreach"
        title="The LinkedIn DM Formula That Gets Replies (Without Being Salesy)"
        wordCount={1600}
        publishedDate="May 23, 2026"
        description="Most LinkedIn DMs get ignored in the first sentence. Here is the exact message structure with real examples that makes people actually want to reply."
        slug="linkedin-dm-formula-that-gets-replies"
      >
        <div className="space-y-6">

          <p className="text-[#888888] leading-relaxed">
            You know exactly what the bad DM looks like because you have received it hundreds of times. The message that starts with I came across your profile and was really impressed by your background. You never reply to these messages. Yet when you sit down to send outreach, you use the same template and wonder why your inbox stays empty.
          </p>

          <p className="text-[#888888] leading-relaxed">
            The problem is the same in both cases. The message gives the recipient no compelling reason to respond. It is generic. It is selfish. And it asks for too much before earning anything.
          </p>

          <p className="text-[#888888] leading-relaxed">
            This guide breaks down the exact four line formula that consistently gets replies. It works for sales, networking, and collaboration. The structure is the same. Only the specifics change.
          </p>

          <div className="bg-[#141414] border border-[#2DD4BF]/20 rounded-2xl p-6 sm:p-8 my-8 text-center">
            <p className="text-lg font-bold text-white mb-3">
              Write DMs that get replies without sounding like a template.
            </p>
            <p className="text-[#888888] mb-4 text-sm">
              Somyra's <Link to="/linkedin-dm-generator?utm_source=seo&utm_medium=organic&utm_campaign=blog-dm-intro-cta" className="text-[#2DD4BF] font-semibold hover:underline">LinkedIn DM Generator</Link> creates personalized messages based on the recipient's profile in your voice.
            </p>
            <Link to="/linkedin-dm-generator?utm_source=seo&utm_medium=organic&utm_campaign=blog-dm-intro-cta" className="inline-block px-6 py-3 bg-[#2DD4BF] text-black font-semibold text-sm rounded-xl hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] transition-all">Try Somyra Free</Link>
          </div>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">The Direct Answer</h2>

          <div className="bg-[#0D0D0D] border-l-4 border-[#2DD4BF] rounded-r-xl p-6 my-6">
            <p className="text-xs font-semibold text-[#2DD4BF] uppercase tracking-widest mb-1">QUESTION:</p>
            <p className="text-lg font-bold text-white mb-3">What is a good LinkedIn DM opening line?</p>
            <p className="text-xs font-semibold text-[#2DD4BF] uppercase tracking-widest mb-1">ANSWER:</p>
            <p className="text-[#888888] leading-relaxed">
              A good LinkedIn DM opening line references something specific about the recipient. A post they wrote. A milestone at their company. A problem they are working through. Generic openers like I came across your profile signal that you did not pay attention. Specificity is the only thing that separates a message that gets a reply from one that gets ignored.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Why Most LinkedIn DMs Get Ignored</h2>

          <div className="bg-[#0D0D0D] border-l-4 border-[#2DD4BF] rounded-r-xl p-6 my-6">
            <p className="text-xs font-semibold text-[#2DD4BF] uppercase tracking-widest mb-1">QUESTION:</p>
            <p className="text-lg font-bold text-white mb-3">Why do most LinkedIn DMs fail?</p>
            <p className="text-xs font-semibold text-[#2DD4BF] uppercase tracking-widest mb-1">ANSWER:</p>
            <p className="text-[#888888] leading-relaxed">
              Most DMs fail because they are too long, too self focused, or too pushy. They start with a pitch instead of context. They ask for something before giving anything. They sound like templates. A DM that references something specific about the recipient and offers value first will get replies.
            </p>
          </div>

          <p className="text-[#888888] leading-relaxed">
            The decision to ignore a DM happens in the first sentence. There are three specific reasons most messages fail.
          </p>

          <p className="text-lg font-bold text-white mt-6 mb-2">1. The opener signals a bulk template</p>
          <p className="text-[#888888] leading-relaxed">
            Nobody believes that a stranger was deeply impressed by their profile out of nowhere. Generic praise is worse than no praise because it immediately tells the recipient that you copied and pasted.
          </p>

          <p className="text-lg font-bold text-white mt-6 mb-2">2. The sender leads with what they want</p>
          <p className="text-[#888888] leading-relaxed">
            If the first message asks for a thirty minute call without establishing relevance, the recipient has no reason to say yes. You have to earn the right to make an ask.
          </p>

          <p className="text-lg font-bold text-white mt-6 mb-2">3. The ask is disproportionate to the relationship</p>
          <p className="text-[#888888] leading-relaxed">
            Asking for a thirty minute call from someone who does not know you is a massive demand on their time. The first message should aim for a simple reply. Nothing more.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">The 4-Line DM Formula</h2>

          <div className="bg-[#0D0D0D] border-l-4 border-[#2DD4BF] rounded-r-xl p-6 my-6">
            <p className="text-xs font-semibold text-[#2DD4BF] uppercase tracking-widest mb-1">QUESTION:</p>
            <p className="text-lg font-bold text-white mb-3">What is the best formula for a LinkedIn DM?</p>
            <p className="text-xs font-semibold text-[#2DD4BF] uppercase tracking-widest mb-1">ANSWER:</p>
            <p className="text-[#888888] leading-relaxed">
              The 4-Line DM Formula is: Line 1 references something specific from their profile or content. Line 2 states why you are reaching out. Line 3 offers something valuable with no strings attached. Line 4 ends with a soft ask that is easy to say yes to.
            </p>
          </div>

          <p className="text-[#888888] leading-relaxed">
            The most effective DMs follow a strict four line structure. Each line has a specific job. Miss any line and your response rate drops.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">Line 1: The Relevance Hook</h3>
          <p className="text-[#888888] leading-relaxed">
            This line references something specific about the recipient. A post they wrote that you found valuable. A company milestone you noticed. A problem you know they are working on based on their recent activity. The hook must be real. Do not fake interest. If you cannot find something genuinely relevant, do not send the message.
          </p>
          <div className="bg-[#0D0D0D] border border-white/5 rounded-lg p-4 my-4">
            <p className="text-[#2DD4BF] text-sm font-bold mb-1">Example</p>
            <p className="text-[#888888] italic">
              "I saw your post about scaling offshore design teams and it resonated. We have faced the same challenges."
            </p>
          </div>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">Line 2: Relevant Introduction</h3>
          <p className="text-[#888888] leading-relaxed">
            One sentence explaining who you are and why your background is relevant to them. This is not your life story. It is a single line that connects your experience to their situation. If you cannot connect the two in one sentence, your message is not specific enough.
          </p>
          <div className="bg-[#0D0D0D] border border-white/5 rounded-lg p-4 my-4">
            <p className="text-[#2DD4BF] text-sm font-bold mb-1">Example</p>
            <p className="text-[#888888] italic">
              "I run an SEO agency that has helped three agencies in your market solve this exact staffing problem."
            </p>
          </div>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">Line 3: The Soft Ask</h3>
          <p className="text-[#888888] leading-relaxed">
            This must be a question, never a pitch. A question invites a response. A pitch invites silence. The ask should be small. Not a thirty minute call. A quick thought. A yes or no. A reaction. Make it easy to say yes to.
          </p>
          <div className="bg-[#0D0D0D] border border-white/5 rounded-lg p-4 my-4">
            <p className="text-[#2DD4BF] text-sm font-bold mb-1">Example</p>
            <p className="text-[#888888] italic">
              "Are you currently exploring alternative staffing models for next quarter?"
            </p>
          </div>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">Line 4: The Easy Out</h3>
          <p className="text-[#888888] leading-relaxed">
            Give them permission to say no. A simple line like no worries if not or if timing is off completely understand. This removes the pressure and makes the recipient more likely to respond because they do not feel trapped. Paradoxically, giving them an out makes them more likely to say yes.
          </p>
          <div className="bg-[#0D0D0D] border border-white/5 rounded-lg p-4 my-4">
            <p className="text-[#2DD4BF] text-sm font-bold mb-1">Example</p>
            <p className="text-[#888888] italic">
              "No worries if this is not relevant right now. Just wanted to put it on your radar."
            </p>
          </div>

          <p className="text-[#888888] leading-relaxed">
            For a deeper breakdown of how to structure your overall LinkedIn presence to support your outreach, read the <Link to="/blog/linkedin-outreach-strategy-that-gets-replies" className="text-[#2DD4BF] font-semibold hover:underline">LinkedIn outreach strategy guide</Link> and the <Link to="/blog/linkedin-profile-optimization-checklist" className="text-[#2DD4BF] font-semibold hover:underline">LinkedIn profile optimization checklist</Link>. Your profile is often the first thing people check after receiving your DM.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Examples by Outreach Type</h2>

          <p className="text-[#888888] leading-relaxed">
            Here is how the same four line formula applies to three different outreach scenarios.
          </p>

          <div className="bg-[#141414] border border-white/10 rounded-xl p-6 my-8">
            <p className="text-xs font-semibold text-[#2DD4BF] uppercase tracking-widest mb-3">SALES OUTREACH EXAMPLE</p>
            <div className="bg-[#0D0D0D] rounded-lg p-4">
              <p className="text-[#888888] text-sm italic">
                "I saw your post about the difficulty of scaling offshore design teams and it resonated heavily. My team has built the exact infrastructure to solve this for three other agencies in your market. Are you currently exploring alternative staffing models for the upcoming quarter? No worries if the timing is not right just wanted to start the conversation."
              </p>
            </div>
          </div>

          <div className="bg-[#141414] border border-white/10 rounded-xl p-6 my-8">
            <p className="text-xs font-semibold text-[#2DD4BF] uppercase tracking-widest mb-3">NETWORKING OUTREACH EXAMPLE</p>
            <div className="bg-[#0D0D0D] rounded-lg p-4">
              <p className="text-[#888888] text-sm italic">
                "Your breakdown of the recent Google algorithm update was the most tactical analysis I have seen all week. I run an SEO consultancy focused on ecommerce and am trying to connect with other technical marketers. Are you open to a quick connection? Totally understand if you are focused on other things right now."
              </p>
            </div>
          </div>

          <div className="bg-[#141414] border border-white/10 rounded-xl p-6 my-8">
            <p className="text-xs font-semibold text-[#2DD4BF] uppercase tracking-widest mb-3">COLLABORATION OUTREACH EXAMPLE</p>
            <div className="bg-[#0D0D0D] rounded-lg p-4">
              <p className="text-[#888888] text-sm italic">
                "I loved your recent podcast episode discussing retention strategies for enterprise software. I am hosting a digital summit on that exact topic next month and would love to have you on a panel. Do you have capacity for a quick discussion about it next week? No pressure at all if your schedule is packed."
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">The Follow-Up That Works</h2>

          <div className="bg-[#0D0D0D] border-l-4 border-[#2DD4BF] rounded-r-xl p-6 my-6">
            <p className="text-xs font-semibold text-[#2DD4BF] uppercase tracking-widest mb-1">QUESTION:</p>
            <p className="text-lg font-bold text-white mb-3">How do I follow up on a LinkedIn DM?</p>
            <p className="text-xs font-semibold text-[#2DD4BF] uppercase tracking-widest mb-1">ANSWER:</p>
            <p className="text-[#888888] leading-relaxed">
              Wait 3 to 5 days after your first message. Keep the follow up shorter than the original. Reference your previous message and add one new piece of value. Do not ask why they did not reply. If they still do not respond after one follow up, let it go.
            </p>
          </div>

          <p className="text-[#888888] leading-relaxed">
            The follow up is where most outreach dies. The standard just checking in message tells the recipient that you have nothing new to offer but still want something from them.
          </p>

          <p className="text-[#888888] leading-relaxed">
            A good follow up adds new context. Reference something that happened in their industry since your first message. Share a relevant resource. Mention a mutual connection. The follow up should feel like a new touchpoint, not a reminder.
          </p>

          <p className="text-[#888888] leading-relaxed">
            Wait three to five days before following up. Any sooner and you seem desperate. Any later and the context is lost. One follow up is sufficient. Two is the maximum. If they do not respond after two messages, move on.
          </p>

          {/* IMAGE PLACEHOLDER: Timeline showing the DM outreach flow - Day 1: First message → Day 5: Follow up with new context → Day 10: Final message → Move on */}

          <div className="bg-[#141414] border border-[#2DD4BF]/20 rounded-2xl p-6 sm:p-8 my-8 text-center">
            <p className="text-lg font-bold text-white mb-3">
              Scale your personalized outreach without losing quality.
            </p>
            <p className="text-[#888888] mb-4 text-sm">
              Somyra's <Link to="/linkedin-dm-generator?utm_source=seo&utm_medium=organic&utm_campaign=blog-dm-middle-cta" className="text-[#2DD4BF] font-semibold hover:underline">LinkedIn DM Generator</Link> creates tailored messages based on each recipient's profile. Also check out the <Link to="/linkedin-post-generator?utm_source=seo&utm_medium=organic&utm_campaign=blog-dm-middle-cta" className="text-[#2DD4BF] font-semibold hover:underline">LinkedIn Post Generator</Link> to create content that makes people want to connect with you.
            </p>
            <Link to="/linkedin-dm-generator?utm_source=seo&utm_medium=organic&utm_campaign=blog-dm-middle-cta" className="inline-block px-6 py-3 bg-[#2DD4BF] text-black font-semibold text-sm rounded-xl hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] transition-all">Try Somyra Free</Link>
          </div>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div>
              <p className="text-lg font-bold text-white mb-2">What is a good LinkedIn DM opening line?</p>
              <p className="text-[#888888] leading-relaxed">
                Reference something specific about the recipient. A post they wrote, a milestone at their company, or a problem they are working through. Generic openers like I came across your profile signal that you did not pay attention.
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-white mb-2">How long should a LinkedIn DM be?</p>
              <p className="text-[#888888] leading-relaxed">
                Under 100 words for the first message. People decide whether to reply within the first two sentences. A long message signals a big ask. Keep it readable in 15 seconds.
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-white mb-2">How do I send a DM without being salesy?</p>
              <p className="text-[#888888] leading-relaxed">
                Lead with relevance, not with your product. Reference something specific about their work. Ask a genuine question. Give them an easy way to say no. The goal of the first message is not to close a deal. It is to earn a reply.
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-white mb-2">How many DMs should I send per day?</p>
              <p className="text-[#888888] leading-relaxed">
                Ten to fifteen personalized DMs per day is sustainable. Sending more usually means you are sacrificing personalization for volume. Quality matters far more than quantity in DM outreach.
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-white mb-2">Should I connect before sending a DM?</p>
              <p className="text-[#888888] leading-relaxed">
                Yes. Sending a DM to someone outside your network goes to their message requests folder which many users ignore. Connect with a personalized note first and message after they accept.
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-white mb-2">What is the best time to send LinkedIn DMs?</p>
              <p className="text-[#888888] leading-relaxed">
                Tuesday through Thursday during business hours in the recipient's time zone gets the best response rates. Early mornings and lunch hours also work. Monday mornings and Friday afternoons are worse.
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-white mb-2">How do I follow up on a LinkedIn DM?</p>
              <p className="text-[#888888] leading-relaxed">
                Wait three to five days. Add new context instead of just checking in. Reference something that happened in their industry since your first message. One follow up is enough. Two is the maximum.
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-white mb-2">What is the biggest DM mistake?</p>
              <p className="text-[#888888] leading-relaxed">
                Asking for too much too soon. A thirty minute call is a huge ask from someone who does not know you. The first message should aim for a simple reply. Build the relationship before escalating the ask.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Summary</h2>

          <p className="text-[#888888] leading-relaxed">
            The goal of a first LinkedIn DM is not to close a deal. It is to earn a reply. Everything else follows from that initial response.
          </p>

          <p className="text-[#888888] leading-relaxed">
            Use the four line formula for every message. Hook, introduction, soft ask, easy out. Keep it under 100 words. Personalize every line. Follow up once with new context. And if they do not respond, move on without taking it personally.
          </p>

          <p className="text-[#888888] leading-relaxed">
            For a complete outreach system that covers finding the right prospects and structuring your approach, read the <Link to="/blog/linkedin-outreach-strategy-that-gets-replies" className="text-[#2DD4BF] font-semibold hover:underline">LinkedIn outreach strategy that gets replies</Link>. Your <Link to="/linkedin-dm-generator?utm_source=seo&utm_medium=organic&utm_campaign=blog-dm-final-cta" className="text-[#2DD4BF] font-semibold hover:underline">LinkedIn DM Generator</Link> can help you scale the formula while keeping each message personal.
          </p>

          <div className="mt-12 bg-[#141414] border border-[#2DD4BF]/20 rounded-2xl p-8 text-center shadow-2xl">
            <p className="text-2xl font-semibold text-white mb-4">
              Stop sending DMs that get ignored. Start getting replies.
            </p>
            <p className="text-[#888888] mb-6 text-sm">
              Somyra's <Link to="/linkedin-dm-generator?utm_source=seo&utm_medium=organic&utm_campaign=blog-dm-final-cta" className="text-[#2DD4BF] font-semibold hover:underline">LinkedIn DM Generator</Link> writes personalized messages based on each recipient's profile. Try it free.
            </p>
            <Link to="/linkedin-dm-generator?utm_source=seo&utm_medium=organic&utm_campaign=blog-dm-final-cta" className="inline-block px-8 py-4 bg-[#2DD4BF] text-black font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] transition-all">Try Somyra Free</Link>
          </div>

        </div>
      </BlogPostLayout>
  );
};

export default LinkedinDmFormulaThatGetsReplies;
