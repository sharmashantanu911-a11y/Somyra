import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPostLayout } from '../../components/seo/BlogPostLayout';

const HowToWriteLinkedinAboutSection: React.FC = () => {
  const faqSchemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What should I write in my LinkedIn About section?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Your LinkedIn About section should open with the problem your target audience has, not with your background. Then explain who you help and how, provide one or two pieces of specific proof, and end with a clear call to action. Write in first person, use short paragraphs for readability, and avoid generic phrases like 'passionate professional' or 'results-driven leader.'"
        }
      },
      {
        "@type": "Question",
        "name": "How long should a LinkedIn About section be?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Between 200 and 400 words is the sweet spot. Long enough to establish credibility and speak to your audience, short enough that someone will actually read it. LinkedIn shows the first 300 characters before a 'see more' prompt, so make that opening count."
        }
      },
      {
        "@type": "Question",
        "name": "Should I write my LinkedIn About section in first or third person?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "First person. Third person feels formal and distant, like someone else wrote it, which is exactly the impression you do not want to create. Write how you would introduce yourself in person."
        }
      },
      {
        "@type": "Question",
        "name": "What is the best formula for a LinkedIn About section?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The best formula is: hook with a problem, identify your audience and outcome, provide proof with numbers, add social proof signals, and end with a call to action. Each section should be one to two short paragraphs."
        }
      },
      {
        "@type": "Question",
        "name": "How do I start my LinkedIn About section?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Start with the problem your reader has, not with your name or title. You have 300 characters before the 'see more' cutoff. Use them to make the reader think 'this person understands me.'"
        }
      },
      {
        "@type": "Question",
        "name": "Should I include a call to action in my LinkedIn About section?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, absolutely. Without a call to action, readers finish your section and do nothing. Tell them exactly what to do next, whether that is sending a DM, visiting your website, or downloading a resource."
        }
      },
      {
        "@type": "Question",
        "name": "What are common mistakes in LinkedIn About sections?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The most common mistakes are opening with 'passionate professional,' writing your resume in paragraph form, using generic claims without proof, skipping the call to action, and trying to appeal to everyone instead of one specific audience."
        }
      },
      {
        "@type": "Question",
        "name": "How many paragraphs should a LinkedIn About section have?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Five to seven short paragraphs is ideal. Each paragraph should serve one purpose: hook, audience identification, solution, proof, social proof, call to action. Keep every paragraph under three sentences."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use bullet points in my LinkedIn About section?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, emoji bullet points work well because they break up text and draw the eye. Use them sparingly for key accomplishments or a short list of services. Do not use them for your entire section."
        }
      },
      {
        "@type": "Question",
        "name": "How often should I update my LinkedIn About section?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Every six to twelve months, or whenever your focus changes. An outdated About section that still talks about a previous role or old services signals that you are not active on the platform."
        }
      }
    ]
  };

  return (
      <BlogPostLayout
        faqSchema={faqSchemaData}
        category="Profile"
        title="How to Write a LinkedIn About Section That Actually Converts"
        wordCount={1700}
        publishedDate="May 23, 2026"
        description="Most LinkedIn About sections are either blank or a resume summary. Here is the structure that makes the right people reach out, with a formula you can use today."
        slug="how-to-write-linkedin-about-section"
      >
        <div className="space-y-6">
          <p className="text-[#888888] leading-relaxed">
            The About section is the most visited and most wasted piece of real estate on a LinkedIn profile. Visitors scroll down there after they are already interested in who you are. That is a moment of high intent. Yet most professionals either leave it blank or paste in a dry resume summary that answers none of the reader's questions.
          </p>

          <p className="text-[#888888] leading-relaxed">
            This post gives you the structural formula that turns that high intent traffic into inbound messages. No fluff, no theory. Just the exact framework we use to rewrite About sections for founders and executives.
          </p>

          <div className="mt-8 bg-[#1a1a1a] border border-[#333] rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-3">The Short Answer</h3>
            <p className="text-[#2DD4BF] font-semibold leading-relaxed">
              Open with your reader's problem, name who you help and the outcome you create, prove it with one specific result, and end with a clear call to action. Write in first person. Use short paragraphs. Skip the buzzwords.
            </p>
          </div>

          <p className="text-[#888888] leading-relaxed">
            If you want the full walkthrough on how to structure your entire profile, read our guide on <Link to="/blog/linkedin-profile-optimization-checklist" className="text-[#2DD4BF] underline">LinkedIn profile optimization</Link>. For help with your content strategy, check out <Link to="/blog/what-to-post-on-linkedin-when-you-have-no-ideas" className="text-[#2DD4BF] underline">what to post when you have no ideas</Link>.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">The Five Mistakes That Kill Your About Section</h2>

          {/* AEO BLOCK */}
          <div className="bg-[#0D0D0D] border-l-4 border-[#2DD4BF] rounded-r-xl p-6 my-6">
            <p className="text-xs font-semibold text-[#2DD4BF] uppercase tracking-widest mb-1">QUESTION:</p>
            <p className="text-lg font-bold text-white mb-3">What are the most common mistakes in LinkedIn About sections?</p>
            <p className="text-xs font-semibold text-[#2DD4BF] uppercase tracking-widest mb-1">ANSWER:</p>
            <p className="text-[#888888] leading-relaxed">
              The five most common mistakes are opening with meaningless labels, writing your resume in paragraph form, making claims without proof, forgetting the call to action, and trying to appeal to everyone. Each mistake makes your About section less effective at converting readers into leads.
            </p>
          </div>

          <p className="text-[#888888] leading-relaxed">
            Before we talk about what works, let us identify what is currently not working. Most About sections fail for the same five reasons.
          </p>

          <h3 className="text-xl font-bold text-white mt-6 mb-3">1. You open with a meaningless label</h3>
          <p className="text-[#888888] leading-relaxed">
            "I am a passionate marketing professional." That sentence tells the reader nothing. Everyone claims to be passionate. Everyone claims to be a professional. You have 300 characters before the "see more" cutoff. Do not waste them on a label that could describe any of your competitors.
          </p>

          <h3 className="text-xl font-bold text-white mt-6 mb-3">2. You write your resume in paragraph form</h3>
          <p className="text-[#888888] leading-relaxed">
            Your experience section already lists your roles. Repeating them in the About section adds zero new information. The reader already scrolled past your job history. They came to the About section to understand how you think and whether you can solve their problem.
          </p>

          <h3 className="text-xl font-bold text-white mt-6 mb-3">3. You make claims without proof</h3>
          <p className="text-[#888888] leading-relaxed">
            "I have extensive experience in B2B SaaS." How extensive? What did you achieve? Anyone can claim experience. A specific number attached to a real result is what creates trust. Without proof, your section reads like a wish list.
          </p>

          <h3 className="text-xl font-bold text-white mt-6 mb-3">4. You forget the call to action</h3>
          <p className="text-[#888888] leading-relaxed">
            A reader finishes your About section and thinks "great, this person seems qualified." Then they do nothing. Without a call to action, you leave the outcome to chance. Tell them what to do next. A DM. A link. A download. Make it one clear step.
          </p>

          <h3 className="text-xl font-bold text-white mt-6 mb-3">5. You try to appeal to everyone</h3>
          <p className="text-[#888888] leading-relaxed">
            When you write for every possible reader, you connect with none of them. A generic About section feels generic. A specific About section that names one audience, one problem, and one outcome feels like it was written for that one person. That is exactly the feeling you want to create.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">The Formula That Works</h2>

          {/* AEO BLOCK */}
          <div className="bg-[#0D0D0D] border-l-4 border-[#2DD4BF] rounded-r-xl p-6 my-6">
            <p className="text-xs font-semibold text-[#2DD4BF] uppercase tracking-widest mb-1">QUESTION:</p>
            <p className="text-lg font-bold text-white mb-3">What is the best formula for a LinkedIn About section?</p>
            <p className="text-xs font-semibold text-[#2DD4BF] uppercase tracking-widest mb-1">ANSWER:</p>
            <p className="text-[#888888] leading-relaxed">
              Line 1 to 2 names the reader's specific problem. Line 3 to 5 identifies who you help and the outcome. Line 6 to 7 injects proof with a specific result. Line 8 to 9 adds a social proof signal. Line 10 ends with a clear call to action.
            </p>
          </div>

          <p className="text-[#888888] leading-relaxed">
            A high converting About section is not a creative writing exercise. It is a structured argument built on a specific formula. Here is the exact breakdown.
          </p>

          <h3 className="text-xl font-bold text-white mt-6 mb-3">Line 1 to 2: Name the problem</h3>
          <p className="text-[#888888] leading-relaxed">
            Do not write "I help businesses grow." That is too vague. Write "Most B2B founders spend their first year on LinkedIn posting content that attracts zero clients because they optimize for likes instead of positioning." Name the pain. Make it specific enough that the reader feels a small shock of recognition.
          </p>

          <h3 className="text-xl font-bold text-white mt-6 mb-3">Line 3 to 5: Identify who you help and the outcome</h3>
          <p className="text-[#888888] leading-relaxed">
            "I help seed stage B2B founders build organic content engines that generate qualified pipeline." You need two things in this section. One, the exact type of person you work with. Two, the specific outcome they get. If you can describe the outcome in terms of money, time saved, or risk reduced, do it.
          </p>

          <h3 className="text-xl font-bold text-white mt-6 mb-3">Line 6 to 7: Inject the proof</h3>
          <p className="text-[#888888] leading-relaxed">
            "Last year, this system helped three startups double their inbound leads within four months." Use numbers. A single data point is more persuasive than a paragraph of adjectives. If you are early in your career and lack client results, use proof from your current role or a relevant project.
          </p>

          <h3 className="text-xl font-bold text-white mt-6 mb-3">Line 8 to 9: Add a social proof signal</h3>
          <p className="text-[#888888] leading-relaxed">
            Mention who you have worked with, where you have been published, or what systems you have built. "My work has been featured in Forbes and Inc." or "I built the content program that grew Acme Corp's blog traffic by 300 percent." This reinforces the proof from the previous step.
          </p>

          <h3 className="text-xl font-bold text-white mt-6 mb-3">Line 10: End with a call to action</h3>
          <p className="text-[#888888] leading-relaxed">
            "If you are tired of paying for clicks that do not convert, send me a DM to see the framework." One sentence. One action. No multiple choice. A single clear call to action converts better than a list of options.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Before and After: The Same Person, Two Different Sections</h2>

          {/* AEO BLOCK */}
          <div className="bg-[#0D0D0D] border-l-4 border-[#2DD4BF] rounded-r-xl p-6 my-6">
            <p className="text-xs font-semibold text-[#2DD4BF] uppercase tracking-widest mb-1">QUESTION:</p>
            <p className="text-lg font-bold text-white mb-3">What does a good LinkedIn About section look like compared to a bad one?</p>
            <p className="text-xs font-semibold text-[#2DD4BF] uppercase tracking-widest mb-1">ANSWER:</p>
            <p className="text-[#888888] leading-relaxed">
              A bad About section opens with generic phrases like 'passionate professional' and focuses on responsibilities. A good About section opens with the reader's problem, states who you help and how, includes a measurable result, and ends with a clear next step.
            </p>
          </div>

          <p className="text-[#888888] leading-relaxed">
            Here is what most About sections look like today.
          </p>

          <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl p-6 mt-4">
            <p className="text-[#888888] italic leading-relaxed">
              "I am a seasoned marketing leader with ten years of experience driving growth for software companies. I am passionate about data driven results and building high performing teams. I specialize in demand generation, content marketing, and account based strategies."
            </p>
          </div>

          <p className="text-[#888888] leading-relaxed">
            That section converts nobody. It is generic, self focused, and ends without direction. Now here is the same person using the formula.
          </p>

          <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl p-6 mt-4">
            <p className="text-[#2DD4BF] leading-relaxed">
              "Most early stage software companies burn through their initial marketing budget running paid ads that convert poorly because their core positioning is weak. I help seed stage B2B founders build organic content engines that generate qualified pipeline before they spend a dollar on advertising. Last year, this system helped three startups double their inbound leads within four months. If you are tired of paying for clicks that do not convert, send me a DM to see the framework."
            </p>
          </div>

          <p className="text-[#888888] leading-relaxed">
            The second version names a specific problem, identifies the exact audience, provides a measurable result, and ends with a clear next step. That is the difference between a section people skim and a section that generates inbound messages.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Why the Opening Line Matters Most</h2>

          {/* AEO BLOCK */}
          <div className="bg-[#0D0D0D] border-l-4 border-[#2DD4BF] rounded-r-xl p-6 my-6">
            <p className="text-xs font-semibold text-[#2DD4BF] uppercase tracking-widest mb-1">QUESTION:</p>
            <p className="text-lg font-bold text-white mb-3">How do I start my LinkedIn About section?</p>
            <p className="text-xs font-semibold text-[#2DD4BF] uppercase tracking-widest mb-1">ANSWER:</p>
            <p className="text-[#888888] leading-relaxed">
              Use one of three approaches. Name a specific audience problem to create recognition. Make a contrarian statement to create curiosity. Lead with a specific result to build authority immediately. Avoid starting with 'I am a' followed by your job title.
            </p>
          </div>

          <p className="text-[#888888] leading-relaxed">
            LinkedIn shows the first 300 characters of your About section. Everything after that is hidden behind a "see more" button. If those 300 characters do not hook the reader, they never see the rest.
          </p>

          <p className="text-[#888888] leading-relaxed">
            Most people waste this real estate on a version of "I am a..." followed by their job title. The reader already saw your title in the headline. Using your opening line to repeat it is a missed opportunity. The best opening lines do one of three things.
          </p>

          <h3 className="text-xl font-bold text-white mt-6 mb-3">Option A: Name a specific audience problem</h3>
          <p className="text-[#888888] leading-relaxed">
            "Most sales teams waste 40 percent of their outreach on leads that will never convert." This immediately signals to the right reader that you understand their world.
          </p>

          <h3 className="text-xl font-bold text-white mt-6 mb-3">Option B: Make a contrarian statement</h3>
          <p className="text-[#888888] leading-relaxed">
            "Posting every day on LinkedIn is the fastest way to get ignored." A statement that challenges common advice forces the reader to pause and think. That pause is the moment they decide to keep reading.
          </p>

          <h3 className="text-xl font-bold text-white mt-6 mb-3">Option C: Lead with a specific result</h3>
          <p className="text-[#888888] leading-relaxed">
            "I helped a solo founder grow from zero to 50,000 followers in eight months without a single viral post." The specificity of the number and the timeframe makes the claim believable. It is the most direct form of authority building.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">How to Know If Your About Section Is Working</h2>

          {/* AEO BLOCK */}
          <div className="bg-[#0D0D0D] border-l-4 border-[#2DD4BF] rounded-r-xl p-6 my-6">
            <p className="text-xs font-semibold text-[#2DD4BF] uppercase tracking-widest mb-1">QUESTION:</p>
            <p className="text-lg font-bold text-white mb-3">How do I know if my LinkedIn About section is working?</p>
            <p className="text-xs font-semibold text-[#2DD4BF] uppercase tracking-widest mb-1">ANSWER:</p>
            <p className="text-[#888888] leading-relaxed">
              Track how many inbound messages you receive each week and your profile to connection conversion rate. If views are high but messages are low, the problem is in your About section or headline. If views are low, the problem is in your content strategy.
            </p>
          </div>

          <p className="text-[#888888] leading-relaxed">
            You can measure whether your About section is effective without guessing. Track how many inbound messages you receive each week. If the number stays flat after you rewrite your section, the issue is usually one of two things. Either your problem statement is not specific enough, or your call to action is not compelling.
          </p>

          <p className="text-[#888888] leading-relaxed">
            The other signal is profile to connection conversion. LinkedIn provides a weekly analytics email that shows how many people viewed your profile. If views are high but messages are low, the problem is in your About section or your headline. If views are low, the problem is in your content strategy, which is a separate issue we cover in our guide on <Link to="/blog/how-to-write-linkedin-posts-that-get-engagement" className="text-[#2DD4BF] underline">writing posts that get engagement</Link>.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">How to Write Each Paragraph</h2>

          <p className="text-[#888888] leading-relaxed">
            The structure within each paragraph matters as much as the overall formula. Here is the rule: every paragraph does exactly one job and then stops.
          </p>

          <h3 className="text-xl font-bold text-white mt-6 mb-3">The problem paragraph</h3>
          <p className="text-[#888888] leading-relaxed">
            State the pain. Then twist the knife by explaining why the current solutions fail. "Most companies waste marketing budget because they treat content as an afterthought. They write three blog posts, see no results, and conclude content does not work." Twisting the knife shows you understand the frustration on a deeper level.
          </p>

          <h3 className="text-xl font-bold text-white mt-6 mb-3">The solution paragraph</h3>
          <p className="text-[#888888] leading-relaxed">
            Name your approach and the specific outcome it produces. "I build three month organic content roadmaps that align with your sales cycle." That is sharper and more specific than "I provide comprehensive marketing services."
          </p>

          <h3 className="text-xl font-bold text-white mt-6 mb-3">The proof paragraph</h3>
          <p className="text-[#888888] leading-relaxed">
            One result. One sentence. No adjectives. "I helped an enterprise client increase inbound demo requests by 40 percent in one quarter." That is all you need. The number does the persuasive work, not the adjectives.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">The Full Template You Can Copy</h2>

          <p className="text-[#888888] leading-relaxed">
            Here is a complete template. Replace the bracketed sections with your details and you have a working About section in five minutes.
          </p>

          <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl p-6 mt-4">
            <p className="text-[#888888] leading-relaxed">
              "Most [target audience] waste [specific resource] on [common approach] that does not work because [core reason]. I help [same audience] achieve [specific outcome] using [your method]. Last [time period], I helped [client or project] achieve [specific result with number]. If you are ready to [desired action], send me a message and I will share the [specific deliverable]."
            </p>
          </div>

          <div className="mt-10 bg-[#141414] border border-[#2DD4BF]/20 rounded-2xl p-8 text-center shadow-2xl">
            <h3 className="text-2xl font-semibold text-white mb-4">Somyra's Deep Strategy audit rewrites your About section for you.</h3>
            <Link to="/linkedin-profile-audit?utm_source=seo&utm_medium=organic&utm_campaign=blog-about-section-mid-cta" className="inline-block px-8 py-4 bg-[#2DD4BF] text-black font-extrabold rounded-xl hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] transition-all">Audit My Profile</Link>
          </div>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Conclusion</h2>

          <p className="text-[#888888] leading-relaxed">
            Your About section is not your autobiography and it is not a digital resume. It is a positioning document written for one specific reader. When the right person lands on your profile, reads that section, and thinks "this person understands my problem exactly," that is the moment they send you a message.
          </p>

          <p className="text-[#888888] leading-relaxed">
            Use the formula. Skip the buzzwords. Give them proof. Tell them what to do next. That is the entire system.
          </p>

          <div className="mt-10 bg-[#141414] border border-[#2DD4BF]/20 rounded-2xl p-8 text-center shadow-2xl">
            <h3 className="text-2xl font-semibold text-white mb-4">Not sure if your profile is converting? Run a free audit.</h3>
            <Link to="/linkedin-profile-audit?utm_source=seo&utm_medium=organic&utm_campaign=blog-about-section-final-cta" className="inline-block px-8 py-4 bg-[#2DD4BF] text-black font-extrabold rounded-xl hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] transition-all">Audit My Profile</Link>
          </div>
        </div>
      </BlogPostLayout>
  );
};

export default HowToWriteLinkedinAboutSection;
