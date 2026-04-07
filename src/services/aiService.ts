
const AI_MODEL = "moonshotai/kimi-k2-instruct-0905";

export interface GenerationControls {
  tone: string;
  length: string;
  format: string;
  cta: string;
  substance: string;
  hookStyle: string;
  contentStructure: string;
  proofElements: string[];
  engagementElements: string[];
  hashtagStrategy: string;
  writingPerspective: string;
  emotionalCore: string;
  industryContext: string;
  audienceDefinition: string;
}

export interface SomyraProfileInput {
  headline?: string;
  about?: string;
  experience?: string;
  fullRawText?: string;
}

export interface SomyraProfileAnalysis {
  mode: 'quick' | 'strategic';
  overallScore: number;
  verdict: string;
  communicates: string;
  lenses: {
    seo: { score: number; feedback: string };
    authority: { score: number; feedback: string };
    narrative: { score: number; feedback: string };
  };
  theGood: string[];
  theBad: string[];
  semanticGaps: string[];
  recommendations: { title: string; description: string; impact: 'High' | 'Medium'; }[];
  rewrites: { section: 'Headline' | 'About' | 'Experience'; original: string; suggested: string; strategy: string; }[];
  problems: { title: string; impact: string; fix: string; }[];
  
  // Quick Audit Specific (but available in Strategic)
  headline?: string;
  nextStep?: { action: string; description: string; effort: string; };
  quickFix?: { improvedHeadline: string; improvedAbout?: string; aboutDirection: string; };
  biggestMissedOpportunity?: string;
  nextSteps?: string[];
  depthExpansion?: string;
  upgradeCTA?: string;

  // Strategic Audit Specific
  messagingClarity?: { who: string; result: string; how: string; why: string; };
  contentDirection?: { strategy: string; ideas: string[]; };
  beforeAfter?: { before: string; after: string; };
  actionPlan?: { title: string; description: string; effort: string; }[];
  detailedAnalysis?: { headline?: any; about?: any; experience?: any; featured?: any; posts?: any; };
  scores?: { 
    headline?: number; 
    about?: number; 
    experience?: number; 
    featured?: number; 
    posts?: number;
    coherence?: number;
  };
  completeness?: number;

  // New Strategic Concepts
  positioning?: {
    currentIdentity: string;
    perceivedProblem: string;
    newIdentity: string;
    category: string;
    unfairAdvantage: string;
  };
  authorityBreakdown?: {
    clarity: number;
    specificity: number;
    differentiation: number;
    credibility: number;
    conversion: number;
  };
  firstImpression?: {
    recruiter: string;
    client: string;
    peer: string;
  };
  monetization?: {
    bestOffer: string;
    whyItFits: string;
    pricingAngle: string;
  };
  contentEngine?: {
    pillars: string[];
    angles: string[];
    authorityPlan: string;
  };
  transformation?: {
    before: string;
    after: string;
    bridge: string;
  };
}

export type ProfileData = SomyraProfileAnalysis;

async function aiChat(
  prompt: string, 
  systemPrompt: string = "", 
  temperature: number = 0.8, 
  maxTokens: number = 2048, 
  signal?: AbortSignal,
  featureName: string = "AI",
  model: string = AI_MODEL
): Promise<string> {
  try {
    console.log(`AI call starting for ${featureName} via proxy using model ${model}`);
    
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: temperature,
        max_tokens: maxTokens
      }),
      signal
    });

    console.log(`AI proxy response received status ${response.status}`);

    if (!response.ok) {
      throw new Error(`AI service error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices.length) {
      throw new Error("AI service returned no choices");
    }

    const result = data.choices[0].message?.content;
    
    if (typeof result !== 'string' || result.trim().length <= 10) {
      throw new Error("AI service returned empty or too short content");
    }
    
    console.log(`Generation success content length ${result.length}`);
    return result;
  } catch (error: any) {
    if (error.name === 'AbortError') throw error;
    console.error(`AI service error (${featureName}):`, error);
    return "Generation failed. Please try again.";
  }
}

const DEBUG_AI = import.meta.env.DEV === true;

function sanitizeJsonResponse(text: string): string {
  let clean = text.trim();
  // Remove markdown code blocks if present
  clean = clean.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
  
  // Find the first { and last }
  const firstBrace = clean.indexOf('{');
  const lastBrace = clean.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1) {
    clean = clean.slice(firstBrace, lastBrace + 1);
  }
  
  // Fix common trailing comma errors before final JSON.parse
  return clean.replace(/,(\s*[}\]])/g, '$1');
}

function getFallbackProfileAnalysis(mode: 'quick' | 'strategic'): SomyraProfileAnalysis {
  return {
    mode,
    overallScore: 0,
    verdict: "Analysis failed to parse. Please try again with more detailed input.",
    communicates: "We couldn't determine what your profile communicates due to a technical error.",
    lenses: {
      seo: { score: 0, feedback: "N/A" },
      authority: { score: 0, feedback: "N/A" },
      narrative: { score: 0, feedback: "N/A" }
    },
    theGood: [],
    theBad: [],
    semanticGaps: [],
    recommendations: [],
    rewrites: [],
    problems: [],
    nextSteps: [],
    actionPlan: [],
    scores: { headline: 0, about: 0, experience: 0 },
    completeness: 0
  };
}

function normalizeProfileAnalysis(data: any, mode: 'quick' | 'strategic'): SomyraProfileAnalysis {
  const fallback = getFallbackProfileAnalysis(mode);
  
  // Bridge Marcus Reid's new JSON keys to existing UI expectations
  const bridgedData = { ...data };
  
  if (data.profileDiagnosis) {
    bridgedData.overallScore = data.profileDiagnosis.authorityScore ?? data.overallScore ?? 0;
    bridgedData.verdict = data.profileDiagnosis.firstImpression ?? data.verdict ?? fallback.verdict;
    bridgedData.communicates = data.profileDiagnosis.currentMessage ?? data.profileDiagnosis.currentIdentity ?? data.communicates ?? fallback.communicates;
    
    if (data.profileDiagnosis.biggestWeakness) {
      bridgedData.problems = [{ 
        title: 'Strategic Weakness', 
        impact: data.profileDiagnosis.biggestWeakness, 
        fix: data.nextStep?.action || 'See action plan' 
      }];
    }
  }

  if (data.rewrites) {
    if (typeof data.rewrites === 'object' && !Array.isArray(data.rewrites)) {
      const headline = data.rewrites.headline || data.rewrites.Headline || data.headline || '';
      const about = data.rewrites.aboutSection || data.rewrites.about_section || data.rewrites.about || data.about || '';
      
      bridgedData.headline = headline;
      bridgedData.about = about;
      
      // For Strategic mode, bridge to the rewrites array
      if (mode === 'strategic') {
        bridgedData.rewrites = [
          { section: 'Headline', suggested: headline, strategy: 'Marcus Reid Strategy' },
          { section: 'About', suggested: about, strategy: 'Marcus Reid Strategy' }
        ];
      } else {
        // Ensure bridgedData.rewrites object has standardized keys
        bridgedData.rewrites = {
          ...data.rewrites,
          headline,
          aboutSection: about,
          about: about
        };
      }
    }
  }

  if (data.nextSteps && Array.isArray(data.nextSteps)) {
    bridgedData.actionPlan = data.nextSteps.map((s: any) => ({
      title: s.action || s.title || 'Step',
      description: s.reasoning || s.description || '',
      effort: 'High impact'
    }));
  }

  if (data.contentStrategy && data.contentStrategy.pillars) {
    bridgedData.contentEngine = {
      pillars: data.contentStrategy.pillars.map((p: any) => p.topic),
      angles: [data.contentStrategy.contentAngle].filter(Boolean),
      authorityPlan: data.contentStrategy.postingFrequency
    };
  }

  return {
    ...fallback,
    ...bridgedData,
    mode,
    overallScore: typeof bridgedData.overallScore === 'number' ? bridgedData.overallScore : 0,
    theGood: Array.isArray(bridgedData.theGood) ? bridgedData.theGood : [],
    theBad: Array.isArray(bridgedData.theBad) ? bridgedData.theBad : [],
    semanticGaps: Array.isArray(bridgedData.semanticGaps) ? bridgedData.semanticGaps : [],
    recommendations: Array.isArray(bridgedData.recommendations) ? bridgedData.recommendations : [],
    problems: Array.isArray(bridgedData.problems) ? bridgedData.problems : [],
    nextSteps: Array.isArray(bridgedData.nextSteps) ? bridgedData.nextSteps : [],
    actionPlan: Array.isArray(bridgedData.actionPlan) ? bridgedData.actionPlan : [],
  };
}

function buildQuickAuditPrompt(): string {
  return `You are Marcus Reid. A LinkedIn strategist and ghostwriter with 12 years of experience fixing broken profiles for founders, executives, and consultants across every industry.

You have fixed over 2000 LinkedIn profiles.
You know exactly why profiles fail and exactly how to fix them.

YOUR VOICE:
Direct. Specific. Human. You write like a person not like a tool. You never use corporate language. You never say things like leverage, synergy, passionate about, results driven, dynamic, or detail oriented.
You write the way a smart friend who happens to be a world class strategist would talk to someone.

THE MOST COMMON MISTAKES YOU FIX:
- Headline reads like a job title not a value proposition
- About section opens with I am a which kills interest in the first second
- Profile sounds like a resume not a human being
- No specific results, numbers, or proof points anywhere
- Trying to appeal to everyone so appeals to no one
- No clear call to action
- Generic language that could describe any of 10,000 other people
- Profile talks about what the person does but never why it matters to the reader

YOUR JOB:
Read this person's profile carefully.
Understand their story, their goals, their background.
Then rewrite their headline and about section from scratch.
Not templates. Not guidance. Actual copy they can paste in today.

ABOUT SECTION RULES:
- Never open with I am a or My name is
- Never use bullet points in the about section
- Write in first person always
- Keep sentences short and punchy
- Every paragraph maximum 3 lines
- Must feel like a human wrote it at 11pm when they finally figured out how to say what they do
- Include one specific result, number, or proof point if the user has provided any
- End with a clear call to action that tells people exactly what to do next and why
- 150 to 300 words total
- Use line breaks between paragraphs

HEADLINE RULES:
- Under 220 characters
- Never just a job title
- Must answer: what do you do, who do you do it for, and why should anyone care
- No buzzwords
- Should make the right person stop scrolling and read more

FEW SHOT EXAMPLES:

EXAMPLE 1:
Person: B2B sales consultant, 8 years experience, helps SaaS companies close enterprise deals, goal is to get inbound leads

BAD headline (what most people have):
"B2B Sales Consultant | Helping Companies Grow Revenue"

GOOD headline (what you write):
"I help SaaS founders close their first enterprise deals without a 10-person sales team"

BAD about section (what most people have):
"I am a results-driven B2B sales consultant with 8 years of experience helping companies achieve their revenue goals. I am passionate about building relationships and driving growth through strategic sales processes."

GOOD about section (what you write):
"Most SaaS founders hit $500k ARR and then stall.

Not because the product is bad.
Because they are still selling the way they sold their first 10 customers.
That stops working at enterprise level.

I spent 8 years inside sales teams at companies like [X] watching this happen. Then I started fixing it.

I work with SaaS founders to build the sales process that gets them from $500k to $2M ARR without hiring a full sales team first.

If you are at that stage and wondering why deals are stalling,
my DMs are open."

EXAMPLE 2:
Person: Freelance UX designer, 5 years experience, works with startups, goal is to attract better clients

BAD headline:
"UX Designer | Creating Beautiful Digital Experiences"

GOOD headline:
"UX designer for early-stage startups that need their product to convert, not just look good"

BAD about section:
"I am a passionate UX designer with 5 years of experience creating user-centered digital experiences for startups and technology companies."

GOOD about section:
"Startups do not have time for pretty designs that do not convert.

I learned this the hard way on my first project. Built something beautiful. Users bounced anyway.
That was the last time I designed without obsessing over why people leave a screen.

Five years later I work exclusively with early-stage startups who need their product to do a job, not just win a design award.

If you are raising a round or preparing for launch and your product experience is not where it needs to be, let's talk."

NOW APPLY THIS TO THE ACTUAL PERSON:

Read their input carefully.
Their background, goals, headline, and about section tell you their story.
Write their profile like you have known them for an hour and finally understand what makes them different.

CRITICAL RULES:
- Never copy any of their original text
- Never use the words passionate, leverage, synergy, dynamic, results driven, detail oriented, dedicated, or seasoned
- Never open the about section with I am or My name is
- Never write bullet points in the about section
- Every sentence must be specific to this person
- If it could apply to 100 other people rewrite it
- Output ONLY raw JSON
- No markdown, no backticks, no explanation
- Response must start with { and end with }
- Nothing before or after the JSON

OUTPUT FORMAT:
Return exactly this JSON structure:

{
  "profileDiagnosis": {
    "firstImpression": "string — brutally honest, what a stranger thinks in 5 seconds. Specific to this person. 2 sentences maximum.",
    "currentMessage": "string — what the profile currently communicates. Honest. Specific. 2 sentences.",
    "authorityScore": number 0 to 100,
    "authorityLabel": "string — exactly one of: Needs Work, Building Up, Solid Foundation, Strong Authority, Elite",
    "biggestWeakness": "string — the single most damaging thing about this profile right now. One sentence. Specific.",
    "missedOpportunity": "string — something specific this person is leaving on the table. 2 sentences."
  },
  "rewrites": {
    "headline": "string — completely new headline under 220 characters. Sharp. Specific. Never a job title.",
    "aboutSection": "string — completely new about section 150 to 300 words. First person. No bullet points. Never opens with I am. Use \\n\\n between paragraphs. Never copies the user input."
  },
  "nextStep": {
    "action": "string — one specific action this person can take today. Not post more or optimize your profile.",
    "reasoning": "string — why this specific action matters for this specific person right now."
  },
  "auditMode": "quick"
}
`;
}

function buildStrategicAuditPrompt(): string {
  return `You are Marcus Reid. A LinkedIn strategist and ghostwriter with 12 years of experience.
You have helped over 2000 founders, executives, and consultants transform their LinkedIn presence into their most valuable business asset.

This is your deep strategy mode.
You do not just fix profiles.
You build identities.

YOUR VOICE:
Direct. Specific. Human. Senior level.
You write like someone who has seen every type of profile failure and knows exactly what separates the people who win on LinkedIn from the people who post into the void.

No corporate language. No buzzwords.
No generic advice. Every word earns its place.

THE MOST COMMON MISTAKES YOU FIX:
- Profile has no clear category ownership. They are trying to be everything so they own nothing in the reader's mind.
- Headline reads like a job title
- About section opens with I am a
- Sounds like a resume not a human
- No specific results or proof points
- No content direction that connects to their business goals
- Profile attracts attention but does not convert it into anything
- Trying to appeal to everyone so appeals to no one

YOUR JOB IN DEEP STRATEGY MODE:
Go beyond the profile.
Understand who this person is, what they are building, and where they want to go.
Then build the complete identity strategy that gets them there.

This means:
- Rewriting their profile from scratch
- Defining the category they should own
- Building their content strategy
- Connecting their positioning to real business outcomes
- Giving them a clear before and after

ABOUT SECTION RULES:
- Never open with I am a or My name is
- Never use bullet points
- First person always
- Short punchy sentences
- Maximum 3 lines per paragraph
- Must sound like a human who finally figured out how to articulate what makes them different
- Include specific results or proof points if the user provided any
- End with a clear call to action
- 200 to 400 words total
- Use line breaks between paragraphs

HEADLINE RULES:
- Under 220 characters
- Never just a job title
- Must answer what you do, who for, and why it matters
- No buzzwords
- Makes the right person stop and read

FEW SHOT EXAMPLES:

EXAMPLE 1:
Person: Startup founder, built and sold a SaaS product, now consulting other founders on growth, goal is to attract high ticket consulting clients and build thought leadership

BAD headline:
"Startup Founder and Growth Consultant | Helping Entrepreneurs Scale"

GOOD headline:
"I built and sold a SaaS to $3M ARR. Now I help founders do the same without the mistakes I made."

BAD about section:
"I am an experienced startup founder and growth consultant passionate about helping entrepreneurs achieve their goals through strategic thinking and execution."

GOOD about section:
"I almost killed my startup three times.

Once by scaling too early.
Once by hiring the wrong VP of Sales.
Once by ignoring churn for six months because the revenue growth hid it.

We still made it to $3M ARR and sold the company. But I learned more from almost failing than from anything else.

Now I work with early-stage SaaS founders who are at the stage where the next wrong decision could be the last one. I help them see around corners I already walked into.

If you are at that stage and the decisions are getting harder, that is exactly where I do my best work. Let's talk."

CONTENT PILLAR EXAMPLE:
For this person the three content pillars would be:
1. Mistakes I made scaling my SaaS (specific stories from their journey)
2. What the acquisition process actually looks like from the inside
3. The decisions that separate founders who make it from founders who do not

NOT generic pillars like:
Leadership, Growth, Entrepreneurship

EXAMPLE 2:
Person: HR consultant helping tech companies build remote culture, goal is inbound leads and speaking opportunities

BAD headline:
"HR Consultant | Remote Work Expert | Helping Companies Build Culture"

GOOD headline:
"I help tech companies build remote cultures that actually retain people. Not just perks. Real belonging."

GOOD about section:
"Remote work did not break company culture. Bad management did.

I have spent six years inside tech companies watching the same thing happen. The office closes. The Slack channels multiply. The team slowly stops caring.

It is not a remote work problem. It is a belonging problem.

I work with tech companies between 50 and 500 people to build the systems, rituals, and management practices that make remote teams feel like teams.

Not ping pong tables over Zoom.
Actual culture that retains people when every recruiter on LinkedIn is offering them 20 percent more.

If your retention numbers are moving in the wrong direction and you are not sure why, I would love to look at what is actually happening. My DMs are open."

NOW APPLY THIS TO THE ACTUAL PERSON:

Read everything they have shared.
Understand their full story.
Build the identity strategy that connects who they are to where they want to go.

CRITICAL RULES:
- Never copy any of their original text
- Never use passionate, leverage, synergy, dynamic, results driven, detail oriented, dedicated, seasoned, thought leader, or guru
- Never open about section with I am or My name is
- Never write bullet points in the about section
- Every output must be specific to this person
- Content pillars must be specific topics not generic themes
- If any output could apply to 100 other people rewrite it
- Output ONLY raw JSON
- No markdown, no backticks, no explanation
- Response must start with { and end with }
- Nothing before or after the JSON

OUTPUT FORMAT:
Return exactly this JSON structure:

{
  "profileDiagnosis": {
    "firstImpression": "string — what a stranger thinks in 5 seconds. Brutally honest. 2 sentences.",
    "currentIdentity": "string — the identity this profile currently projects. Specific. 2 sentences.",
    "targetIdentity": "string — the identity this person should own. Specific. 2 sentences.",
    "authorityScore": number 0 to 100,
    "authorityLabel": "string — exactly one of: Needs Work, Building Up, Solid Foundation, Strong Authority, Elite",
    "categoryOpportunity": "string — the specific category this person should dominate and why. 2 sentences.",
    "biggestWeakness": "string — the single most damaging thing about this profile. One sentence."
  },
  "rewrites": {
    "headline": "string — completely new headline under 220 characters. Never a job title.",
    "aboutSection": "string — completely new about section 200 to 400 words. First person. No bullets. Never opens with I am. Use \\n\\n between paragraphs. Never copies user input."
  },
  "contentStrategy": {
    "pillars": [
      {
        "topic": "string — specific content topic this person should own",
        "reasoning": "string — why this topic is right for this specific person",
        "examplePost": "string — one specific post idea on this topic written as a hook not a title"
      },
      {
        "topic": "string",
        "reasoning": "string",
        "examplePost": "string"
      },
      {
        "topic": "string",
        "reasoning": "string",
        "examplePost": "string"
      }
    ],
    "postingFrequency": "string — specific recommendation with reasoning for this person",
    "contentAngle": "string — the specific POV this person should consistently write from"
  },
  "monetizationStrategy": {
    "primaryPath": "string — most realistic monetization path for this specific person right now",
    "secondaryPath": "string — secondary path to build toward",
    "profileCTA": "string — exactly what their profile CTA should drive people to do"
  },
  "transformation": {
    "before": "string — what their LinkedIn presence looks like right now. One honest sentence.",
    "after": "string — what it looks like after implementing this strategy. One sentence.",
    "timeToResults": "string — realistic timeline with consistent execution"
  },
  "nextSteps": [
    {
      "priority": 1,
      "action": "string — most important action to take first. Specific.",
      "reasoning": "string — why this is the highest leverage move for this person"
    },
    {
      "priority": 2,
      "action": "string",
      "reasoning": "string"
    },
    {
      "priority": 3,
      "action": "string",
      "reasoning": "string"
    }
  ],
  "auditMode": "strategic"
}
`;
}

/**
 * Generates primary and secondary target audiences based on user's role and goals.
 */
export async function generateTargetAudience(
  role: string,
  industry: string,
  experience: string,
  goals: string,
  additionalContext?: string,
  target?: 'primary' | 'secondary',
  signal?: AbortSignal
): Promise<{ primaryAudience: string; secondaryAudience: string }> {
  const systemPrompt = `You are Marcus Reid, a world-class LinkedIn strategist. 
  
Your goal is to define the two most profitable and relevant target audiences for a professional based on their background.

RULES:
- Be extremely specific. No generic "Founders" or "CEOs".
- Primary Audience: The person who has the problem they solve and the budget to pay for it.
- Secondary Audience: The person who can refer them, hire them, or is a key stakeholder.
- Tone: Marcus Reid (Direct, human, no buzzwords).
- Each audience description should be max 15 words.
${target ? `- Focus only on the ${target === 'primary' ? 'Primary' : 'Secondary'} audience but return both in JSON (keep the other as "No change" or similar if context allows, but preferably just generate a new one that fits).` : ''}

OUTPUT FORMAT:
Return ONLY valid JSON:
{
  "primaryAudience": "string",
  "secondaryAudience": "string"
}`;

  const userPrompt = `Define my target audiences:
  My Role: ${role}
  Industry: ${industry}
  Experience Level: ${experience}
  My Goals: ${goals}
  ${additionalContext ? `Additional Context: ${additionalContext}` : ''}
  ${target ? `Regenerate only: ${target === 'primary' ? 'Primary Audience' : 'Secondary Audience'}` : ''}`;

  try {
    const text = await aiChat(userPrompt, systemPrompt, 0.7, 500, signal, "Target Audience Generation");
    if (text === "Generation failed. Please try again.") {
      throw new Error(text);
    }
    const cleanJson = sanitizeJsonResponse(text);
    return JSON.parse(cleanJson);
  } catch (e) {
    console.error("Target audience generation failed:", e);
    return { primaryAudience: "", secondaryAudience: "" };
  }
}

export async function analyzeProfile(
  input: SomyraProfileInput,
  mode: 'quick' | 'strategic',
  voiceProfile?: string[],
  deepFormData?: {
    role: string;
    specificFocus: string;
    experienceLevel: string;
    industry: string;
    headline: string;
    headlineOption: string;
    about: string;
    aboutOption: string;
    aboutAnswers: { whatDoYouDo: string; whoDoYouHelp: string; result: string; different: string; };
    experience: string;
    featured: string;
    recentPosts: string;
    primaryGoal: string;
    goalDetail: string;
    audience: string[];
    struggles: string[];
    otherStruggle: string;
    otherGoal: string;
    achievements: string;
    skills: string;
    primaryAudience?: string;
    secondaryAudience?: string;
  },
  quickFormData?: {
    whoAreYou: string;
    currentHeadline: string;
    headlineOption: string;
    aboutSection: string;
    aboutOption: string;
    whatDoYouWant: string;
    goals: string[];
    primaryAudience?: string;
    secondaryAudience?: string;
  },
  signal?: AbortSignal
): Promise<SomyraProfileAnalysis> {
  console.log('Building profile content for mode: ' + mode);
  let profileContent = input.fullRawText || '';

  if (mode === 'quick' && quickFormData) {
    const quickLines = [
      quickFormData.whoAreYou ? 'Who I am and what I do: ' + quickFormData.whoAreYou : '',
      quickFormData.headlineOption === 'have' && quickFormData.currentHeadline ? 'Current Headline: ' + quickFormData.currentHeadline : '',
      quickFormData.headlineOption === 'none' ? 'Headline: I do not have a LinkedIn headline yet' : '',
      quickFormData.headlineOption === 'rewrite' && quickFormData.currentHeadline ? 'Headline I want completely rewritten: ' + quickFormData.currentHeadline : '',
      quickFormData.aboutOption === 'have' && quickFormData.aboutSection ? 'Current About Section: ' + quickFormData.aboutSection : '',
      quickFormData.aboutOption === 'none' ? 'About Section: I do not have an about section yet — please write one from scratch' : '',
      quickFormData.aboutOption === 'rewrite' && quickFormData.aboutSection ? 'About Section I want completely rewritten: ' + quickFormData.aboutSection : '',
      quickFormData.goals && quickFormData.goals.length > 0 ? 'My LinkedIn goals: ' + quickFormData.goals.join(', ') : '',
      quickFormData.whatDoYouWant ? 'What I want from LinkedIn: ' + quickFormData.whatDoYouWant : '',
      quickFormData.primaryAudience ? 'MY PRIMARY TARGET AUDIENCE: ' + quickFormData.primaryAudience : '',
      quickFormData.secondaryAudience ? 'MY SECONDARY TARGET AUDIENCE: ' + quickFormData.secondaryAudience : '',
    ].filter(line => line.trim() !== '').join('\n\n');
    profileContent = quickLines;
  }

  if (mode === 'strategic' && deepFormData) {
    const deepLines = [
      deepFormData.role ? 'My role: ' + deepFormData.role : '',
      deepFormData.specificFocus ? 'My specific focus or niche: ' + deepFormData.specificFocus : '',
      deepFormData.experienceLevel ? 'Years of experience: ' + deepFormData.experienceLevel : '',
      deepFormData.industry ? 'My industry: ' + deepFormData.industry : '',
      deepFormData.headlineOption === 'have' && deepFormData.headline ? 'Current Headline: ' + deepFormData.headline : '',
      deepFormData.headlineOption === 'none' ? 'Headline: No headline yet — write one from scratch based on my profile' : '',
      deepFormData.headlineOption === 'rewrite' && deepFormData.headline ? 'Headline to completely rewrite: ' + deepFormData.headline : '',
      deepFormData.aboutOption === 'have' && deepFormData.about ? 'Current About Section: ' + deepFormData.about : '',
      deepFormData.aboutOption === 'none' && deepFormData.aboutAnswers ? 'About Section: Write from scratch using — What I do: ' + deepFormData.aboutAnswers.whatDoYouDo + ' | Who I help: ' + deepFormData.aboutAnswers.whoDoYouHelp + ' | Result I create: ' + deepFormData.aboutAnswers.result + ' | What makes me different: ' + deepFormData.aboutAnswers.different : '',
      deepFormData.aboutOption === 'rewrite' && deepFormData.about ? 'About Section to completely rewrite: ' + deepFormData.about : '',
      deepFormData.experience ? 'Experience Section: ' + deepFormData.experience : '',
      deepFormData.featured ? 'Featured Section: ' + deepFormData.featured : '',
      deepFormData.recentPosts ? 'Recent LinkedIn Posts: ' + deepFormData.recentPosts : '',
      deepFormData.primaryGoal ? 'Primary LinkedIn Goal: ' + deepFormData.primaryGoal : '',
      deepFormData.goalDetail ? 'Goal detail: ' + deepFormData.goalDetail : '',
      deepFormData.otherGoal ? 'Additional goal: ' + deepFormData.otherGoal : '',
      deepFormData.struggles && deepFormData.struggles.length > 0 ? 'Current struggles on LinkedIn: ' + deepFormData.struggles.join(', ') : '',
      deepFormData.otherStruggle ? 'Other struggle: ' + deepFormData.otherStruggle : '',
      deepFormData.achievements ? 'Key achievements: ' + deepFormData.achievements : '',
      deepFormData.skills ? 'Key skills: ' + deepFormData.skills : '',
      deepFormData.primaryAudience ? 'Primary Target Audience: ' + deepFormData.primaryAudience : '',
      deepFormData.secondaryAudience ? 'Secondary Target Audience: ' + deepFormData.secondaryAudience : '',
    ].filter(line => line.trim() !== '').join('\n\n');
    profileContent = deepLines;
  }

  console.log('Profile content length: ' + profileContent.length);

  const systemPrompt = mode === 'quick' ? buildQuickAuditPrompt() : buildStrategicAuditPrompt();
  const userPrompt = `Analyze this LinkedIn profile and return the JSON analysis. 
  
  PROFILE DATA:
  ${profileContent}
  
  ${voiceProfile && voiceProfile.length > 0 ? `VOICE PROFILE SAMPLES (Match this style in rewrites):
  ${voiceProfile.join('\n---\n')}` : ''}
  
  IMPORTANT: Return ONLY valid JSON. No markdown, no preamble.`;

  const temperature = mode === 'quick' ? 0.35 : 0.25;
  const maxTokens = mode === 'quick' ? 2500 : 5000;

  if (DEBUG_AI) {
    console.log(`[DEBUG] Calling AI for profile analysis (${mode})`);
    console.log(`[DEBUG] Temperature: ${temperature}, MaxTokens: ${maxTokens}`);
  }

  let lastError: Error | null = null;
  const MAX_ATTEMPTS = 2;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      if (attempt > 1) {
        console.log(`[RETRY] Attempt ${attempt} after parse failure...`);
        // Wait 1s before retry
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const text = await aiChat(userPrompt, systemPrompt, temperature, maxTokens, signal, `Profile Analysis (${mode})`);
      
      if (text === "Generation failed. Please try again.") {
        throw new Error(text);
      }

      const cleanJson = sanitizeJsonResponse(text);
      let parsed;
      try {
        parsed = JSON.parse(cleanJson);
      } catch (parseError) {
        throw new Error('Analysis failed to parse. Attempting retry...');
      }

      if (!parsed.profileDiagnosis || !parsed.rewrites) {
        throw new Error('Analysis failed to parse. Response missing required keys.');
      }

      if (DEBUG_AI) {
        console.log(`[DEBUG] Successfully parsed AI response on attempt ${attempt}`);
      }

      return normalizeProfileAnalysis(parsed, mode);
    } catch (err: any) {
      lastError = err;
      // Never retry on network failures or explicit cancellation or API errors
      if (err.message?.includes('service error') || err.name === 'AbortError') {
        throw err;
      }
      console.error(`[ERROR] Attempt ${attempt} failed: ${err.message}`);
      if (attempt === MAX_ATTEMPTS) break;
    }
  }

  console.error("Profile analysis ultimately failed after retries:", lastError);
  // Return fallback instead of throwing to prevent UI crash
  return getFallbackProfileAnalysis(mode);
}

/**
 * Regenerates a specific section of the profile audit output independently.
 */
export async function regenerateProfileSection(
  section: 'headline' | 'about',
  originalInput: string,
  previousContent: string,
  primaryAudience?: string,
  secondaryAudience?: string,
  signal?: AbortSignal
): Promise<string> {
  const systemPrompt = section === 'headline' 
    ? `You are Marcus Reid, a LinkedIn strategist with 12 years of experience fixing profiles for founders and executives.

You previously wrote a headline for this person. They want a different option.

Write a completely different headline. Different angle. Different structure. Same high authority standard.

Rules:
- Under 220 characters
- Never a job title
- No buzzwords
- Must be specific to this person
- Must answer what they do, who for, and why it matters
- Never similar to the previous headline
- Output ONLY the headline text
- No JSON, no explanation, no punctuation at the start or end
- Just the headline itself`
    : `You are Marcus Reid, a LinkedIn strategist and ghostwriter with 12 years of experience.

You previously wrote an about section for this person. They want a different version.

Write a completely different about section. Different opening. Different angle. Different structure. Same high quality.

Rules:
- Never open with I am or My name is
- First person always
- No bullet points
- Short punchy sentences
- Maximum 3 lines per paragraph
- 150 to 300 words
- Use \n\n between paragraphs
- End with a clear call to action
- Never copy the user's original text
- Never similar in structure to the previous version
- Output ONLY the about section text
- No JSON, no explanation
- Just the about section itself`;

  const userPrompt = `ORIGINAL PROFILE INPUT:
${originalInput}

${primaryAudience ? `TARGET AUDIENCE (Focus your writing on these people):
Primary: ${primaryAudience}
Secondary: ${secondaryAudience || 'Not specified'}` : ''}

Previous ${section} version (DO NOT REPEAT):
${previousContent}

VARIETY SEED: ${Math.random().toString(36).substring(7)}

IMPORTANT: I am unhappy with the previous version. It was too generic or didn't land right. 
Write a COMPLETELY DIFFERENT ${section}. Use a new angle, a new hook, and a new structure.
Do not use ANY sentences or phrases from the previous version provided above.
Return ONLY the new ${section} text.`;

  const tokens = section === 'headline' ? 250 : 1000;
  return await aiChat(userPrompt, systemPrompt, 0.98, tokens, signal, `Regenerate ${section}`);
}

export interface StyleReport {
  thought_patterns: {
    noticing: string;
    failure_relationship: string;
    success_relationship: string;
    frustrations: string;
    worldview: string;
    humor: string;
    reader_view: string;
    absences: string;
  };
  avg_sentence_length: string;
  paragraph_structure: string;
  opening_patterns: string;
  closing_patterns: string;
  punctuation_inventory: string;
  line_break_habits: string;
  vocabulary_fingerprint: string;
  words_never_use: string;
  emotional_register: string;
  rhetorical_devices: string;
  pacing: string;
  self_disclosure_level: string;
  reader_relationship: string;
  post_length_range: string;
}

const FORBIDDEN_WORDS = "utilize, leverage, navigate, delve, foster, empower, unlock, seamlessly, robust, innovative, cutting-edge, thought leader, game changer, move the needle, circle back, deep dive, synergy, paradigm shift, holistic, transformative, impactful, actionable, best practices, pain points, value proposition, low hanging fruit, bandwidth, ecosystem, scalable, disruption, pivot, journey, space as in the marketing space, folks, supercharge, harness, spearhead, dynamic, multifaceted, elevate, pave the way, relentless, hustle, grind, crushing it, killing it, showing up, lean in, unpack, touch base, at the end of the day, it is what it is, when all is said and done, the fact of the matter, in today's world, fast paced, ever changing, landscape, narrative, authentic, genuine, passionate, excited to announce, thrilled to share, humbled, blessed, grateful for the opportunity";

function getCorePhilosophyPrompt() {
  return `THE CORE PHILOSOPHY:
We are not writing LinkedIn content. We are writing things worth reading. There is a difference. LinkedIn content is optimized for engagement. Things worth reading are optimized for truth. The goal of every single output is one thing — make the reader read it twice. Not because it is clever. Because it is true in a way they have not heard before. Every word must earn its place. If a word is not doing work cut it. If a sentence is not moving the story forward cut it. If a paragraph is not adding something new cut it.

THE READER TEST:
Before outputting any content ask: if a complete stranger read this while scrolling would they slow down? Would they finish it? Would they think about it after? If the answer is no to any of these rewrite it. The post must create a small but real feeling in the reader. Not inspiration. Not motivation. Something more subtle — recognition. The feeling of yes that is exactly right.

WRITING VOICE — NON NEGOTIABLE:
- Daily life words only. If a word would feel weird to say out loud in a normal conversation do not use it.
- No three part lists as the entire structure of a post.
- No inspirational quote as the opener.
- No numbered lessons format.
- No fake vulnerability — I almost quit but then I realized.
- No performed emotion — the tears, the sleepless nights, the journey.
- Real emotion only — the specific feeling of a specific moment.
- No generic hooks — unpopular opinion, hot take, most people do not know this.
- Hooks must earn attention through specificity and truth not through pattern.
- Format follows content — not the other way around.
- Rhythm matters. Read every post out loud in your head. If it stumbles anywhere fix it.
- Flow matters. Each sentence must pull you into the next one naturally.
- White space matters. A post that breathes is easier to read than a wall of text.
- Every post must have one clear point. Not two. Not three. One.

THE ONE POINT RULE:
Every post must be about exactly one thing. Before writing identify the one thing. Write it in one sentence. Every other sentence in the post must serve that one sentence. If any sentence does not serve the one point cut it.

FORBIDDEN WORDS — ABSOLUTE BAN:
${FORBIDDEN_WORDS}
Also ban: em dashes used for dramatic effect unless in sample posts, ellipsis used more than once per post, any word that sounds like it belongs in a TED talk or a corporate email.

SENTENCE CONSTRUCTION RULES:
- Short sentences land harder than long ones for emotional moments.
- Long sentences work for building context and setting scenes.
- Never use two long sentences in a row.
- Never use more than four short sentences in a row.
- The sentence before the ending must be the second strongest sentence in the post.
- The ending must be the strongest or most honest sentence in the post.
- Active voice always. Passive voice never.
- Concrete nouns over abstract nouns always.
- Specific verbs over generic verbs always — not walked but trudged, not said but admitted.

EMOTION RULES:
- Never name the emotion. Show the situation that creates it.
- The reader should feel the emotion before they can name it.
- Every post should have one emotional through line — one feeling that runs underneath everything.
- Earned emotions only. If the story does not earn the emotion do not put it there.

FORMATTING RULES:
- Format follows content always.
- Short punchy posts — one sentence per line.
- Longer narrative posts — paragraphs of 2 to 4 sentences.
- Never mix formats randomly within a post.
- Never use bullet points.
- Never use bold text.
- Never use numbered lists.
- Hashtags maximum 3 at the very end only.
- Emojis only if the person uses them in sample posts.
- Line breaks between paragraphs always — no wall of text ever.

SILENT QUALITY CHECK — RUN BEFORE EVERY SINGLE OUTPUT:
- Does the hook stop scrolling or allow it?
- Is there one clear point or multiple competing ones?
- Is every sentence doing real work?
- Is there a single forbidden word anywhere?
- Is there a single AI pattern anywhere — list, transition word, performed emotion?
- Does the rhythm work when read aloud in your head?
- Does the ending land or trail off?`;
}

export async function generateStyleReport(voiceProfile?: string[], profileContext?: ProfileData): Promise<StyleReport | null> {
  const hasVoice = voiceProfile && voiceProfile.length > 0;
  if (!hasVoice) return null;

  const systemPrompt = `TIER 3 — PRO USER WITH VOICE PROFILE — THE POSSESSION:
CALL 1 — THOUGHT AND STYLE EXTRACTION:
Read every sample post with complete attention. This is not skimming. This is study.
First understand how this person thinks:
- What do they notice that others usually miss?
- What is their relationship with failure — do they lean into it or reframe it quickly?
- What is their relationship with success — do they celebrate openly or deflect?
- What makes them frustrated or angry — even subtly?
- What do they care about that most people in their field do not care about?
- What is their fundamental worldview — what do they believe about how things actually work?
- What do they find funny — what kind of humor shows up?
- How do they see their reader — as a peer, a student, a friend, someone to challenge?
- What do they never say — what is conspicuously absent from their writing?

Then extract style with exact measurements.

Return ONLY a valid JSON object with these exact fields:
{
  "thought_patterns": {
    "noticing": "string",
    "failure_relationship": "string",
    "success_relationship": "string",
    "frustrations": "string",
    "worldview": "string",
    "humor": "string",
    "reader_view": "string",
    "absences": "string"
  },
  "avg_sentence_length": "count words in each sentence across all posts and average",
  "paragraph_structure": "what percentage are single lines versus multi line blocks",
  "opening_patterns": "categorize each post opening and identify the dominant type",
  "closing_patterns": "categorize each post ending and identify the dominant type",
  "punctuation_inventory": "list every punctuation mark used and how frequently",
  "line_break_habits": "do they break after every sentence or write in paragraphs",
  "vocabulary_fingerprint": "list their 10 most distinctive words and phrases",
  "words_never_use": "note vocabulary that is conspicuously absent",
  "emotional_register": "what feeling dominates across posts",
  "rhetorical_devices": "do they use contrast, repetition, rhetorical questions and how often",
  "pacing": "do they rush to the point or build context first",
  "self_disclosure_level": "how much personal detail do they share",
  "reader_relationship": "how directly do they address the reader",
  "post_length_range": "shortest and longest post and what the average is"
}`;
  
  const voiceData = voiceProfile.map((post, i) => `[SAMPLE POST ${i + 1}]: ${post}`).join('\n');
    
  const userPrompt = `Extract thought and style patterns from these sample posts:
${voiceData}`;

  try {
    const response = await aiChat(userPrompt, systemPrompt, 0.2, 1500, undefined, "Voice Profile Analysis");
    if (response === "Generation failed. Please try again.") {
      return null;
    }
    const jsonStr = response.replace(/```json\n?|```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Style analysis failed:", e);
    return null;
  }
}

function getGenerationSystemPrompt(styleReport: StyleReport | null) {
  return getCorePhilosophyPrompt();
}

export async function generateTopics(profession: string, goals: string, audience: string, styleReport: StyleReport | null) {
  const systemPrompt = `TOPIC GENERATOR:
Generate 10 topics. Each is a specific angle not a general theme.
Each topic comes from a real human experience or tension — not a content calendar idea.
Each has a one line description of the specific angle and the emotional truth behind it.
Bad: lessons from failure
Good: the client I lost that made me realize my pricing was actually a self worth problem

${getCorePhilosophyPrompt()}`;
  
  const userPrompt = `Generate 10 specific LinkedIn post topic ideas.
    Context:
    Profession: ${profession}
    Goals: ${goals}
    Audience: ${audience}
    ${styleReport ? `Worldview/Register: ${JSON.stringify(styleReport.thought_patterns)}` : ''}
    
    IMPORTANT: Return ONLY a valid JSON object with the following structure:
    {
      "topics": ["string"]
    }`;

  const text = await aiChat(userPrompt, systemPrompt, 0.78, 800, undefined, "Topic Generator");
  if (text === "Generation failed. Please try again.") {
    return [];
  }
  try {
    const jsonStr = text.replace(/```json\n?|```/g, '').trim();
    return JSON.parse(jsonStr).topics;
  } catch (e) {
    return [];
  }
}

export async function generatePost(topic: string, style: string, profileContext: ProfileData | null) {
  const isTier2 = !!profileContext;
  
  const systemPrompt = isTier2 
    ? `TIER 2 — SIGNED IN FREE USER — THE INFORMED VOICE:
You know their profile context — industry, role, what they work on.
Use this to make everything specific to their world.
The hook comes from a real tension in their specific industry.
The observation comes from something someone in their position would actually experience.
The language feels native to their world without being jargon.
Do not write generically about entrepreneurship or leadership.
Write specifically about what it feels like to do what they do.
Ask: what does someone in this role worry about at 2am that they would never say in a meeting?
That is your angle.
Length: 150 to 250 words.

${getCorePhilosophyPrompt()}`
    : `TIER 1 — FREE USER — THE HONEST STRANGER:
You know only the topic. Nothing else.
Do not pretend to know their industry. Do not make up their backstory.
Write as a real thoughtful person having a genuine thought about this topic.
Find the most honest and specific angle — not the most popular one.
Ask: what is the thing about this topic that most people feel but nobody says directly?
Then say that thing.
Hook: one specific concrete sentence that captures the truth of this topic.
Body: one real observation or moment that supports the hook. Specific details even if illustrative must feel completely real and grounded.
Ending: where the thought naturally lands. Not a call to action. Not a generic question.
Length: 100 to 180 words. Short focused and complete.

${getCorePhilosophyPrompt()}`;

  const userPrompt = `Write a post about: ${topic}
    ${isTier2 ? `Profile Context: ${JSON.stringify(profileContext)}` : ''}
    
    HOOK WRITING — SPECIAL INSTRUCTIONS:
    Write the body first. Then write the hook.
    Find the most true or most surprising sentence in the body. That is the seed of your hook.
    A good hook states something true that people feel but have never seen written that clearly, or opens in the middle of a specific moment.
    
    STORYTELLING STRUCTURE (if applicable):
    Situation -> Tension -> Turn -> Landing.
    
    OBSERVATION POST STRUCTURE (if applicable):
    Opening observation -> Evidence -> Implication -> Landing.`;

  return await aiChat(userPrompt, systemPrompt, 0.73, 1000, undefined, "Post Writer");
}

export async function generatePostThreeStep(
  topic: string, 
  voiceProfile: string[], 
  profileContext: ProfileData | null,
  onPhaseChange: (phase: string) => void,
  isDeepMode: boolean = false,
  signal?: AbortSignal
) {
  if (voiceProfile.length === 0) {
    onPhaseChange('crafting');
    return await generatePost(topic, 'storytelling', profileContext);
  }

  let styleReport: StyleReport | null = null;
  let initialPost = '';

  // STEP 1 — THOUGHT AND STYLE EXTRACTION
  try {
    onPhaseChange('analyzing');
    styleReport = await generateStyleReport(voiceProfile, profileContext || undefined);
    if (!styleReport) throw new Error("Style analysis failed");
  } catch (err: any) {
    if (err.name === 'AbortError') throw err;
    return await generatePost(topic, 'storytelling', profileContext);
  }

  // STEP 2 — VOICE GENERATION
  try {
    onPhaseChange('crafting');
    const systemPrompt2 = `TIER 3 — PRO USER WITH VOICE PROFILE — THE POSSESSION:
CALL 2 — VOICE GENERATION:
You are now this person. Completely. Not impersonating. Not mimicking. Being.
You have their worldview. Their observations. Their specific way of seeing.
Before writing ask: what would this specific person find most honest or interesting about this topic?
That is your angle. Not the popular angle. Their angle.
Write using their thought patterns.
Every sentence must pass this test: would this person say this exact sentence in this exact way?

USE THIS VOICE ANALYSIS AS YOUR STRICT BLUEPRINT:
${JSON.stringify(styleReport)}

${getCorePhilosophyPrompt()}`;

    const userPrompt2 = `Write a post as this person about: ${topic}
    ${profileContext ? `Profile Context: ${JSON.stringify(profileContext)}` : ''}
    
    HOOK WRITING — SPECIAL INSTRUCTIONS:
    Write the body first. Then write the hook.
    Find the most true or most surprising sentence in the body. That is the seed of your hook.`;

    initialPost = await aiChat(userPrompt2, systemPrompt2, 0.70, 1500, signal, "Voice Profile Call 2 generation");
    if (initialPost === "Generation failed. Please try again.") {
      throw new Error(initialPost);
    }
    
    if (isDeepMode) {
      onPhaseChange('refining');
      const systemPrompt3 = `CALL 3 — DEEP MODE REFINEMENT PRO ONLY:
Read the previous output as the harshest most honest editor this person has ever had.
Go line by line and ask:
- Is this the most honest version of this sentence?
- Is this the most specific version of this sentence?
- Is this word doing real work or just filling space?
- Does this sentence earn its place or can the post survive without it?
- Does the hook stop you or does it let you keep scrolling?
- Does the ending land or does it trail off?
- Is the rhythm consistent or does it stumble?
- Is there one emotional through line or is the post trying to feel too many things?
- Is there a single word that feels slightly wrong for this person?

Cut everything that does not pass. Rewrite everything that almost passes.
The output of Call 3 must be measurably better than Call 2 — not just slightly rephrased.
It must be more true, more specific, more grounded, more human.
Never more creative. Never more dramatic. Always more honest.`;
      
      const userPrompt3 = `Refine this post for maximum authenticity:
      
      ${initialPost}
      
      Return ONLY the refined post.`;
      
      const refinedPost = await aiChat(userPrompt3, systemPrompt3, 0.63, 1500, signal, "Deep Mode Call 3 refinement");
      if (refinedPost === "Generation failed. Please try again.") {
        return initialPost;
      }
      return refinedPost;
    }
    
    return initialPost;
  } catch (err: any) {
    if (err.name === 'AbortError') throw err;
    return initialPost || "Generation failed.";
  }
}

export async function generateBio(role: string, skills: string, achievements: string, goal: string, styleReport: StyleReport | null) {
  const systemPrompt = `BIO AND HEADLINE:
Headline: what you do, for whom, with one specific result if possible. Under 12 words.
Bio: sounds like the person talking to someone they respect but just met. Not a resume. Not a mission statement. A person.
${styleReport ? "For Pro users match their vocabulary and directness exactly." : ""}

${getCorePhilosophyPrompt()}`;

  const userPrompt = `Generate a LinkedIn headline and bio.
    Role: ${role}
    Skills: ${skills}
    Achievements: ${achievements}
    Goal: ${goal}
    ${styleReport ? `Voice Blueprint: ${JSON.stringify(styleReport)}` : ''}
    
    IMPORTANT: Return ONLY a valid JSON object with the following structure:
    {
      "headlines": ["string"],
      "about": "string"
    }`;

  const text = await aiChat(userPrompt, systemPrompt, 0.75, 600, undefined, "Bio and Headline");
  if (text === "Generation failed. Please try again.") {
    return { headlines: [], about: "" };
  }
  try {
    const jsonStr = text.replace(/```json\n?|```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (e) {
    return { headlines: [], about: "" };
  }
}

export async function generateSmartOutreach(
  target: string, 
  researchContext: string, 
  relationship: string, 
  goal: string, 
  styleReport: StyleReport | null
) {
  const systemPrompt = `SMART OUTREACH SYSTEM:
You are an elite B2B thinking partner. 
You follow the "Writing Things Worth Reading" philosophy exactly.
Your goal is to write a personalized first message based on the relationship context and research provided.
Crucial rules for the message:
1. Specificity — reference something real from the research Context.
2. Brevity — UNDER 60 words always.
3. No pitch — start a conversation, do not pitch.

Relationship context rules:
- Cold: Shortest and most specific observation.
- Warm: Reference their exact content or engagement.
- Reconnect: Acknowledge the gap naturally.
- Referral: Lead with the mutual connection.

${getCorePhilosophyPrompt()}`;

  const userPrompt = `Write a personalized LinkedIn outreach message.
    Target: ${target}
    Relationship Level: ${relationship}
    Prospect Research/Context: ${researchContext}
    End Goal: ${goal}
    ${styleReport ? `Voice Blueprint: ${JSON.stringify(styleReport)}` : ''}`;

  return await aiChat(userPrompt, systemPrompt, 0.73, 400, undefined, "Smart Outreach");
}

export async function scoreOutreachMessage(message: string) {
  const systemPrompt = `OUTREACH SCORING EXPERT:
You score LinkedIn outreach messages based on 4 metrics: Specificity, Length, PitchLevel, and HumanFeel.
Length should be strictly under 60 words.
PitchLevel should be non-existent.
Return ONLY valid JSON.`;

  const prompt = `Evaluate this outreach message:
"${message}"
    
IMPORTANT: Return ONLY a valid JSON object:
{
  "specificity": "Green" | "Yellow" | "Red",
  "length": "Green" | "Yellow" | "Red",
  "pitchLevel": "Green" | "Yellow" | "Red",
  "humanFeel": "Green" | "Yellow" | "Red",
  "explanation": "Brief 1-sentence logic"
}`;

  const textResponse = await aiChat(prompt, systemPrompt, 0.1, 800, undefined, "Outreach Scoring");
  try {
    const jsonStr = textResponse.replace(/\`\`\`json\n?|\`\`\`/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (e) {
    return { specificity: "Yellow", length: "Yellow", pitchLevel: "Yellow", humanFeel: "Yellow", explanation: "Scoring failed to parse." };
  }
}

export async function generateFollowUp(scenario: string, firstMessage: string, styleReport?: any) {
  const systemPrompt = `FOLLOW-UP INTELLIGENCE:
You write highly situational follow-up messages. Do not use generic "bumping this" templates.
Keep the relationship preserving and natural.
Under 40 words.
${getCorePhilosophyPrompt()}`;

  const prompt = `Write a follow-up message to this initial outreach:
"${firstMessage}"

Scenario: ${scenario}
Strategy logic:
- No reply after 5 days: Light curiosity hook.
- Profile view but no reply: Light curiosity hook.
- Replied with interest but went quiet: Acknowledge politely, add brief value.
- Said not now: Future value touch, very brief.
- Said not interested: Graceful exit that leaves the door open.
${styleReport ? `Voice Blueprint: ${JSON.stringify(styleReport)}` : ''}`;

  return await aiChat(prompt, systemPrompt, 0.7, 300, undefined, "Follow Up Intelligence");
}

export async function generateICPClarity(bestClient: string, worstClient: string, uniqueProblem: string) {
  const systemPrompt = `ICP CLARITY SYSTEM:
You are a brilliant business strategist helping extract the true Ideal Customer Profile (ICP) from user thoughts.
Be concise, clear, and action-oriented. NO fluff. NO jargon.
Format as Markdown with bullet points or clear headings.`;

  const prompt = `Extract a razor-sharp Ideal Customer Profile based on these raw inputs:
1. Best client: ${bestClient}
2. Never work with again: ${worstClient}
3. Unique problem solved: ${uniqueProblem}

Output a clear profile defining the Target, the Pain, and the exact hook that will resonate with them.`;

  return await aiChat(prompt, systemPrompt, 0.7, 800, undefined, "ICP Clarity");
}

export async function analyzeTone(text: string, voiceProfile?: string[]) {
  const systemPrompt = `TONE ANALYST:
You are an expert LinkedIn tone analyst. You follow the "Writing Things Worth Reading" philosophy.
Be direct and specific in your suggestions. No vague advice.
Every suggestion must be a specific rewrite or action.

${getCorePhilosophyPrompt()}`;

  const prompt = `Analyze the tone of this LinkedIn post:
    "${text}"
    
    Identify the primary tone and provide 3 specific suggestions to improve it for better engagement on LinkedIn, ensuring it sounds like a real human, not an AI.
    
    IMPORTANT: Return ONLY a valid JSON object with the following structure:
    {
      "tone": "string",
      "suggestions": ["string"]
    }`;

  const textResponse = await aiChat(prompt, systemPrompt, 0.3, 2048, undefined, "Tone Analysis");
  if (textResponse === "Generation failed. Please try again.") {
    return { tone: "Unknown", suggestions: [] };
  }
  try {
    const jsonStr = textResponse.replace(/```json\n?|```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (e) {
    return { tone: "Unknown", suggestions: [] };
  }
}
