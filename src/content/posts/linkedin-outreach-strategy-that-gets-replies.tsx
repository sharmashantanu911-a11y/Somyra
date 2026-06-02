import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPostLayout } from '../../components/seo/BlogPostLayout';

const LinkedinOutreachStrategyThatGetsReplies: React.FC = () => {
  const faqSchemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the best LinkedIn outreach strategy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The best strategy follows four phases: target the right people, warm them up by engaging with their content, send a value-first message that asks for nothing, and follow up through a second channel within 48 hours."
        }
      },
      {
        "@type": "Question",
        "name": "How many connection requests should I send per day?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "LinkedIn allows about 100 connection requests per week. Sending 15 to 20 highly targeted requests per day is more effective than hitting the limit with generic invites."
        }
      },
      {
        "@type": "Question",
        "name": "Should I send a message with my connection request?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, always include a note. Keep it to two sentences. Reference something specific about their work or a recent post. Do not pitch anything in the connection request."
        }
      },
      {
        "@type": "Question",
        "name": "How long should I wait before following up?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Wait 48 to 72 hours after they accept your connection before sending your first message. If they do not respond within five days, move to a second channel like email."
        }
      },
      {
        "@type": "Question",
        "name": "What is the best time to send LinkedIn outreach messages?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Tuesday through Thursday between 8 AM and 10 AM in the prospect's time zone consistently shows the highest response rates. Monday mornings and Friday afternoons are the worst."
        }
      },
      {
        "@type": "Question",
        "name": "How do I find prospects on LinkedIn?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Use LinkedIn Sales Navigator for advanced filtering, or search by job title, industry, company size, and location using LinkedIn's native search. Follow companies in your target industry and monitor who engages with their content."
        }
      },
      {
        "@type": "Question",
        "name": "Should I use LinkedIn automation tools for outreach?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Automation tools violate LinkedIn's terms of service and produce low quality results. Manual, targeted outreach consistently outperforms automated spray and pray."
        }
      },
      {
        "@type": "Question",
        "name": "How do I warm up a prospect before messaging them?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Engage with their posts for one to two weeks before reaching out. Leave thoughtful comments, share their content with your take, and let them notice your name before you ever send a message."
        }
      },
      {
        "@type": "Question",
        "name": "What response rate should I expect from LinkedIn outreach?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A well targeted, personalized outreach campaign should achieve 30 to 50 percent response rates. If you are seeing below 20 percent, your targeting or messaging needs work."
        }
      },
      {
        "@type": "Question",
        "name": "Should I follow up on LinkedIn or switch to email?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Switch to email after one LinkedIn follow up. Multi-channel outreach that uses LinkedIn for the first touch and email for the follow up consistently outperforms staying in one channel."
        }
      }
    ]
  };

  return (
      <BlogPostLayout
        faqSchema={faqSchemaData}
        category="Outreach"
        title="The LinkedIn Outreach Strategy That Actually Gets Replies"
        wordCount={1800}
        publishedDate="May 23, 2026"
        description="Most outbound on LinkedIn is terrible. This strategy breaks down exactly how to find, approach, and convert high-value prospects without sounding like a spam bot."
        slug="linkedin-outreach-strategy-that-gets-replies"
      >
        <div className="space-y-6">
          <p className="text-[#888888] leading-relaxed">
            The era of spray and pray automated outreach on LinkedIn is dead. If you are sending connection requests with generic pitch slaps attached, you are burning your own pipeline. Prospects are more skeptical than ever, and LinkedIn's algorithm penalizes accounts that send too many low quality invitations.
          </p>

          <p className="text-[#888888] leading-relaxed">
            This guide walks through a complete outreach system. It covers who to target, how to warm them up, what to say, and how to follow up without being annoying.
          </p>

          <div className="mt-8 bg-[#1a1a1a] border border-[#333] rounded-2xl p-6">
            <h3 className="text-xl font-extrabold text-white mb-3">The Short Answer</h3>
            <p className="text-[#2DD4BF] font-semibold leading-relaxed">
              Target 15 to 20 high-fit prospects per day. Warm them up by engaging their content for one week. Send a connection request with a specific, non-promotional note. After they connect, wait 48 hours. Send one value-first message. If no reply in five days, move to email. Track your response rate and cut anyone below 20 percent.
            </p>
          </div>

          <p className="text-[#888888] leading-relaxed">
            If you need the exact message framework to use once a prospect connects, read our guide on <Link to="/blog/linkedin-dm-formula-that-gets-replies" className="text-[#2DD4BF] underline">the DM formula that gets replies</Link>. This post covers everything that happens before and after that message.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Phase 1: Target the Right People</h2>

          {/* AEO BLOCK */}
          <div className="bg-[#0D0D0D] border-l-4 border-[#2DD4BF] rounded-r-xl p-6 my-6">
            <p className="text-xs font-extrabold text-[#2DD4BF] uppercase tracking-widest mb-1">QUESTION:</p>
            <p className="text-lg font-bold text-white mb-3">How do I find the right prospects for LinkedIn outreach?</p>
            <p className="text-xs font-extrabold text-[#2DD4BF] uppercase tracking-widest mb-1">ANSWER:</p>
            <p className="text-[#888888] leading-relaxed">
              Define three attributes: job title, company size, and a trigger event. Build a list of 100 prospects. Work through them in groups of 20 per day. Do not send requests to everyone at once. Test and iterate on your targeting as you learn what works.
            </p>
          </div>

          <p className="text-[#888888] leading-relaxed">
            Most outreach fails before a single message is sent. The problem is not the copy. The problem is the target list. If you are messaging people who have no authority, no budget, and no reason to care about what you offer, no message in the world will save you.
          </p>

          <h3 className="text-xl font-bold text-white mt-6 mb-3">Define your ideal prospect profile</h3>
          <p className="text-[#888888] leading-relaxed">
            Write down three attributes. Job title, company size, and one specific trigger event. A trigger event could be a new funding round, a recent hire in a relevant role, or a public announcement about a strategic shift. People in the middle of a change are far more likely to respond.
          </p>
          <p className="text-[#888888] leading-relaxed">
            Do not add more than three filters. Overly narrow profiles produce lists of five people, which makes the whole exercise pointless. Start broad enough to have 100 prospects, then refine as you learn which segments actually reply.
          </p>

          <h3 className="text-xl font-bold text-white mt-6 mb-3">Use Sales Navigator or LinkedIn search</h3>
          <p className="text-[#888888] leading-relaxed">
            LinkedIn's native search is sufficient for most industries. Use boolean search strings with job titles and exclude terms to narrow results. Sales Navigator adds advanced filters like company growth rate, years in role, and seniority level. If you do more than 50 outreaches per month, Navigator pays for itself.
          </p>

          <h3 className="text-xl font-bold text-white mt-6 mb-3">Build a list of 100 prospects</h3>
          <p className="text-[#888888] leading-relaxed">
            Start with a batch of 100 people who match your ideal profile. Do not send requests to all of them at once. Work through them in groups of 20 per day. This keeps your account safe and lets you iterate on your approach as you learn what works.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Phase 2: Warm Them Up Before You Reach Out</h2>

          {/* AEO BLOCK */}
          <div className="bg-[#0D0D0D] border-l-4 border-[#2DD4BF] rounded-r-xl p-6 my-6">
            <p className="text-xs font-extrabold text-[#2DD4BF] uppercase tracking-widest mb-1">QUESTION:</p>
            <p className="text-lg font-bold text-white mb-3">How do I warm up a prospect before reaching out on LinkedIn?</p>
            <p className="text-xs font-extrabold text-[#2DD4BF] uppercase tracking-widest mb-1">ANSWER:</p>
            <p className="text-[#888888] leading-relaxed">
              Engage with their content for one week before sending a connection request. Leave thoughtful comments that add value. Share their content with your network. Let your name become familiar before you ask for their attention. This doubles your acceptance rate.
            </p>
          </div>

          <p className="text-[#888888] leading-relaxed">
            The single biggest difference between outreach that works and outreach that feels like spam is whether the prospect recognizes your name when your request arrives. Warming up is how you build that recognition.
          </p>

          <h3 className="text-xl font-bold text-white mt-6 mb-3">Engage with their content for one week</h3>
          <p className="text-[#888888] leading-relaxed">
            Follow your prospects. Spend five minutes per day scrolling their posts. Leave one thoughtful comment per prospect per week. Do not write "great post." Write something that adds to the conversation. A different perspective, a relevant data point, or a question that shows you read carefully.
          </p>

          <h3 className="text-xl font-bold text-white mt-6 mb-3">Share their content with your audience</h3>
          <p className="text-[#888888] leading-relaxed">
            If a prospect publishes something genuinely useful, share it with your network and tag them. This is the highest signal warm up move available. It shows you value their thinking enough to put your own reputation behind it.
          </p>

          <h3 className="text-xl font-bold text-white mt-6 mb-3">Let them notice you before you arrive</h3>
          <p className="text-[#888888] leading-relaxed">
            After a week of genuine engagement, your name will look familiar when your connection request arrives. That familiarity is the difference between "accept" and "ignore." The warm up phase is not manipulation. It is simply demonstrating that you pay attention before you ask for attention.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Phase 3: The Connection Request</h2>

          {/* AEO BLOCK */}
          <div className="bg-[#0D0D0D] border-l-4 border-[#2DD4BF] rounded-r-xl p-6 my-6">
            <p className="text-xs font-extrabold text-[#2DD4BF] uppercase tracking-widest mb-1">QUESTION:</p>
            <p className="text-lg font-bold text-white mb-3">What should I write in a LinkedIn connection request note?</p>
            <p className="text-xs font-extrabold text-[#2DD4BF] uppercase tracking-widest mb-1">ANSWER:</p>
            <p className="text-[#888888] leading-relaxed">
              Two sentences maximum. Reference something specific about their work. Say why you want to connect. Do not pitch anything. The goal is context, not conversion. 'I have been following your posts about X. Would love to connect and follow your work.'
            </p>
          </div>

          <p className="text-[#888888] leading-relaxed">
            The connection request note is not the place to pitch. It is the place to establish context. You have 300 characters. Use them to explain why you want to connect and what you appreciate about their work.
          </p>

          <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl p-6 mt-4">
            <p className="text-[#888888] leading-relaxed">
              "Hey [Name], I have been following your posts about [specific topic]. Your take on [specific point] was particularly useful. Would love to connect and follow your work."
            </p>
          </div>

          <p className="text-[#888888] leading-relaxed">
            That is it. Two sentences. No pitch. No call to action besides the connection itself. If they accept, you earn the right to send one message.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Phase 4: The First Message</h2>

          {/* AEO BLOCK */}
          <div className="bg-[#0D0D0D] border-l-4 border-[#2DD4BF] rounded-r-xl p-6 my-6">
            <p className="text-xs font-extrabold text-[#2DD4BF] uppercase tracking-widest mb-1">QUESTION:</p>
            <p className="text-lg font-bold text-white mb-3">What should I say in my first message after connecting?</p>
            <p className="text-xs font-extrabold text-[#2DD4BF] uppercase tracking-widest mb-1">ANSWER:</p>
            <p className="text-[#888888] leading-relaxed">
              Wait 48 hours. Reference something from their profile or content. Offer something valuable with no strings attached. End with a soft ask. Never pitch in the first message. Give value first and earn the right to ask for something later.
            </p>
          </div>

          <p className="text-[#888888] leading-relaxed">
            Wait 48 hours after they accept your connection. Then send one message. This message must do three things. Reference something specific from their profile or content. Offer something valuable with no strings attached. End with a soft ask.
          </p>

          <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl p-6 mt-4">
            <p className="text-[#888888] leading-relaxed">
              "Hey [Name], I really enjoyed your post about [specific topic]. I put together a framework on [related topic] that I think you would find useful based on your recent work. Happy to send it over if you are interested. No catch."
            </p>
          </div>

          <p className="text-[#888888] leading-relaxed">
            For a deeper breakdown of this message structure and four alternative templates, check our post on <Link to="/blog/linkedin-dm-formula-that-gets-replies" className="text-[#2DD4BF] underline">the LinkedIn DM formula</Link>. The key principle is the same: give value first, ask later.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Phase 5: The Follow-Up Sequence</h2>

          {/* AEO BLOCK */}
          <div className="bg-[#0D0D0D] border-l-4 border-[#2DD4BF] rounded-r-xl p-6 my-6">
            <p className="text-xs font-extrabold text-[#2DD4BF] uppercase tracking-widest mb-1">QUESTION:</p>
            <p className="text-lg font-bold text-white mb-3">How do I follow up on LinkedIn without being annoying?</p>
            <p className="text-xs font-extrabold text-[#2DD4BF] uppercase tracking-widest mb-1">ANSWER:</p>
            <p className="text-[#888888] leading-relaxed">
              Send one LinkedIn follow up after 3 days of no reply. If no response, move to email after 7 days. Send one final email at day 14. Then stop and add them to a nurture list. Three touches is the maximum before you damage your brand.
            </p>
          </div>

          <p className="text-[#888888] leading-relaxed">
            Most replies come after the first follow up, not after the first message. The follow up is where the conversion happens. But you need to follow up correctly or you destroy the goodwill you built.
          </p>

          <h3 className="text-xl font-bold text-white mt-6 mb-3">Day 3: First LinkedIn follow up</h3>
          <p className="text-[#888888] leading-relaxed">
            If the prospect did not respond to your first message within three days, send a short follow up. Three days gives them enough time to have seen your message without being so long that they forget who you are. Reference your previous message and add one new piece of value.
          </p>
          <p className="text-[#888888] leading-relaxed">
            "Hey [Name], wanted to circle back on my previous message. I also came across this [article or resource] that relates to your recent [project or post]. Thought you might find it useful either way."
          </p>

          <h3 className="text-xl font-bold text-white mt-6 mb-3">Day 7: Move to email</h3>
          <p className="text-[#888888] leading-relaxed">
            If the LinkedIn follow up gets no reply, find their email address using a tool like Hunter or Apollo. Send a short email referencing your LinkedIn conversation.
          </p>
          <p className="text-[#888888] leading-relaxed">
            "I sent you a message on LinkedIn last week. I know LinkedIn inboxes are noisy. I wanted to reach out here directly because I think [specific value] would be genuinely useful to you."
          </p>
          <p className="text-[#888888] leading-relaxed">
            The email channel works because it is less crowded than LinkedIn DMs and your message does not disappear into a notification graveyard. Keep the email shorter than the LinkedIn message. Prospects who ignore LinkedIn often reply to email.
          </p>

          <h3 className="text-xl font-bold text-white mt-6 mb-3">Day 14: Final email touch</h3>
          <p className="text-[#888888] leading-relaxed">
            One last email follow up. Reference both previous touches and add a new angle. A relevant case study, a new trigger event you noticed, or a mutual connection mention if you have one.
          </p>
          <p className="text-[#888888] leading-relaxed">
            If no reply after this, stop. Move them to a nurture list and re-engage in three to six months when you have new context or a new offer. Pushing past three touches damages your brand and wastes your time. The goal is not to convince someone who is not interested. It is to find the people who are interested but busy.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Phase 6: Measure and Iterate</h2>

          <p className="text-[#888888] leading-relaxed">
            Outreach without metrics is guessing. Track these three numbers for every batch of 20 prospects.
          </p>

          <h3 className="text-xl font-bold text-white mt-6 mb-3">Connection acceptance rate</h3>
          <p className="text-[#888888] leading-relaxed">
            If fewer than 50 percent of your connection requests are accepted, your targeting or your note needs work. Test changing the note first. If that does not move the number, your prospect profile is wrong.
          </p>

          <h3 className="text-xl font-bold text-white mt-6 mb-3">Message response rate</h3>
          <p className="text-[#888888] leading-relaxed">
            Aim for 30 to 50 percent. If you are below 20 percent, your message is too promotional, too long, or not specific enough. Shorten it and make the value offer more concrete.
          </p>

          <h3 className="text-xl font-bold text-white mt-6 mb-3">Meeting booked rate</h3>
          <p className="text-[#888888] leading-relaxed">
            This is your ultimate metric. If you are getting replies but no meetings, the problem is in your conversation after the reply, not in your outreach. Your offer or your qualification criteria may need adjustment.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">How to Handle Common Objections</h2>

          <p className="text-[#888888] leading-relaxed">
            Even the best outreach sequences get rejections. The difference is how you handle them.
          </p>

          <h3 className="text-xl font-bold text-white mt-6 mb-3">"Not interested right now."</h3>
          <p className="text-[#888888] leading-relaxed">
            Thank them for the reply and ask if you can check back in three months. Most people who say "not interested" mean "not interested right now at this exact moment." A polite follow up later often converts.
          </p>

          <h3 className="text-xl font-bold text-white mt-6 mb-3">"Send me more information."</h3>
          <p className="text-[#888888] leading-relaxed">
            This is a brush off disguised as interest. Do not send a brochure. Reply with a specific question that qualifies them. "Happy to. Can you tell me what your biggest challenge is with [relevant topic] right now?" If they answer, you have a real conversation. If they ghost, they were not serious.
          </p>

          <h3 className="text-xl font-bold text-white mt-6 mb-3">"I do not have budget."</h3>
          <p className="text-[#888888] leading-relaxed">
            Price objections are often trust objections in disguise. Instead of discounting, ask what would need to change for them to prioritize this. If they cannot articulate a scenario, the objection is real. If they can, you have a path forward when the timing improves.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">What Not to Do</h2>

          {/* AEO BLOCK */}
          <div className="bg-[#0D0D0D] border-l-4 border-[#2DD4BF] rounded-r-xl p-6 my-6">
            <p className="text-xs font-extrabold text-[#2DD4BF] uppercase tracking-widest mb-1">QUESTION:</p>
            <p className="text-lg font-bold text-white mb-3">What should I avoid in LinkedIn outreach?</p>
            <p className="text-xs font-extrabold text-[#2DD4BF] uppercase tracking-widest mb-1">ANSWER:</p>
            <p className="text-[#888888] leading-relaxed">
              Do not use automation tools. Do not pitch in the connection request. Do not send the same message to everyone. Manual, personalized outreach that focuses on building context before asking for anything consistently outperforms automated approaches.
            </p>
          </div>

          <p className="text-[#888888] leading-relaxed">
            Here are the mistakes that ruin outreach campaigns faster than anything else.
          </p>

          <h3 className="text-xl font-bold text-white mt-6 mb-3">Do not use automation tools</h3>
          <p className="text-[#888888] leading-relaxed">
            Automation tools violate LinkedIn's terms of service. They also produce terrible results because they cannot do the warm up phase. If you use automation, your prospects will recognize the generic template and ignore you.
          </p>

          <h3 className="text-xl font-bold text-white mt-6 mb-3">Do not pitch in the connection request</h3>
          <p className="text-[#888888] leading-relaxed">
            Sending a pitch with your connection request is the fastest way to get ignored or reported. The prospect has no context about who you are. They owe you nothing. Earn the conversation before you ask for anything.
          </p>

          <h3 className="text-xl font-bold text-white mt-6 mb-3">Do not send the same message to everyone</h3>
          <p className="text-[#888888] leading-relaxed">
            Copy paste outreach is obvious and insulting. Every message must reference something specific to that prospect. If you cannot find something specific to say about someone, they are probably not the right prospect.
          </p>

          <p className="text-[#888888] leading-relaxed">
            For more on writing messages that do not sound robotic, read our analysis of <Link to="/blog/why-linkedin-posts-sound-robotic" className="text-[#2DD4BF] underline">why LinkedIn content sounds robotic</Link> and how to fix it. The principles apply to DMs just as much as they apply to posts.
          </p>

          <div className="mt-10 bg-[#141414] border border-[#2DD4BF]/20 rounded-2xl p-8 text-center shadow-2xl">
            <h3 className="text-2xl font-extrabold text-white mb-4">Somyra writes your LinkedIn outreach messages in your voice.</h3>
            <Link to="/linkedin-post-generator?utm_source=seo&utm_medium=organic&utm_campaign=blog-outreach-mid-cta" className="inline-block px-8 py-4 bg-[#2DD4BF] text-black font-extrabold rounded-xl hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] transition-all">Try Somyra Free</Link>
          </div>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Conclusion</h2>

          <p className="text-[#888888] leading-relaxed">
            LinkedIn outreach is not about sending more messages. It is about sending better messages to the right people with the right warm up. Target carefully. Warm up genuinely. Give value first. Follow up through multiple channels. Measure everything.
          </p>

          <p className="text-[#888888] leading-relaxed">
            Follow this system and you will never have to guess whether your outreach is working again.
          </p>

          <div className="mt-10 bg-[#141414] border border-[#2DD4BF]/20 rounded-2xl p-8 text-center shadow-2xl">
            <h3 className="text-2xl font-extrabold text-white mb-4">Ready to scale your outreach? Generate on-brand messages in seconds.</h3>
            <Link to="/linkedin-post-generator?utm_source=seo&utm_medium=organic&utm_campaign=blog-outreach-final-cta" className="inline-block px-8 py-4 bg-[#2DD4BF] text-black font-extrabold rounded-xl hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] transition-all">Get Started</Link>
          </div>
        </div>
      </BlogPostLayout>
  );
};

export default LinkedinOutreachStrategyThatGetsReplies;
