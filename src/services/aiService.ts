import { supabase } from '../lib/supabase';

// ─────────────────────────────────────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────────────────────────────────────

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
  formatting_preferences: {
    use_bullets: boolean;
    use_bold: boolean;
    use_emojis: boolean;
    emoji_density: 'none' | 'low' | 'high';
  };
  vocabulary_complexity: 'simple' | 'medium' | 'advanced';
}

// ─────────────────────────────────────────────────────────────────────────────
// TIER DETECTION
// Reads from Supabase profiles table (is_pro / is_max booleans).
// The old code read from localStorage subscription.planId which never existed
// in Somyra's schema, causing every user to be treated as Free tier.
// ─────────────────────────────────────────────────────────────────────────────

async function detectUserTier(): Promise<'Free' | 'Pro' | 'Max'> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return 'Free';

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('is_pro, is_max')
      .eq('id', session.user.id)
      .single();

    if (error || !profile) return 'Free';
    if (profile.is_max) return 'Max';
    if (profile.is_pro) return 'Pro';
    return 'Free';
  } catch {
    return 'Free';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CORE AI CHAT FUNCTION
// ─────────────────────────────────────────────────────────────────────────────

async function aiChat(
  prompt: string,
  systemPrompt: string = "",
  temperature: number = 0.8,
  maxTokens: number = 2048,
  signal?: AbortSignal,
  featureName: string = "AI"
): Promise<string> {
  // FIX: Detect tier from Supabase, not from a non-existent localStorage field
  const tier = await detectUserTier();

  try {
    console.log(`[REQUEST] Feature: ${featureName} | Tier: ${tier}`);

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ];

    // Create timeout controller (55s — to match Vercel limit)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 55000);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, temperature, max_tokens: maxTokens, tier }),
      signal: signal || controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || errorData.error || `Status ${response.status}`;
      throw new Error(`AI service error: ${errorMessage}`);
    }

    const data = await response.json();

    if (!data.choices || !data.choices.length) {
      throw new Error("AI service returned no choices");
    }

    const result = data.choices[0].message?.content;

    if (typeof result !== 'string' || result.trim().length <= 1) {
      throw new Error("AI service returned empty content");
    }

    return result;
  } catch (error: any) {
    if (error.name === 'AbortError') throw error;
    console.error(`[ERROR] ${featureName} failed for Tier ${tier}:`, error.message);
    return "Generation failed. Please try again.";
  }
}

const DEBUG_AI = import.meta.env.DEV === true;

// ─────────────────────────────────────────────────────────────────────────────
// JSON HELPERS
// ─────────────────────────────────────────────────────────────────────────────

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

  // Fix common trailing comma errors before JSON.parse
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

  // Bridge Marcus Reid's JSON keys to existing UI expectations
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

      if (mode === 'strategic') {
        bridgedData.rewrites = [
          { section: 'Headline', suggested: headline, strategy: 'Marcus Reid Strategy' },
          { section: 'About', suggested: about, strategy: 'Marcus Reid Strategy' }
        ];
      } else {
        bridgedData.rewrites = {
          ...data.rewrites,
          headline,
          aboutSection: about,
          about
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

// ─────────────────────────────────────────────────────────────────────────────
// CLEANUP — Post-processing for persona output
// FIX: The original function had a critical self-overwrite bug.
// It applied all the regex transforms to `cleaned`, then on line 1572
// it reassigned `cleaned = text` (the original!) and redid the transforms
// from scratch, discarding all the intermediate work. This meant the final
// `cleaned` variable was always the result of the SECOND pass starting from
// raw `text`, not from the already-cleaned `cleaned`. This is fine for most
// cases but meant the first pass was wasted work and any state built in the
// first pass was silently thrown away. Consolidated into a single clean pass.
// ─────────────────────────────────────────────────────────────────────────────

function cleanupPersonaOutput(text: string): string {
  if (!text) return text;

  return text
    // Strip AI labels at the start
    .replace(/^(Hook|Body|Summary|Note|Post|Post text|Here is your post|Analysis):\s*/im, '')
    .replace(/^(Hook|Body|Summary|Note|Post|Post text|Here is your post|Analysis)\s*-\s*/im, '')
    // Replace em-dashes with comma-space
    .replace(/—/g, ', ')
    // Replace space-hyphen-space with comma (common AI pattern)
    .replace(/\\s+-\\s+/g, ', ')
    // Replace mid-word hyphens used as separators
    .replace(/([a-z])\\s*-\\s*([a-z])/gi, '$1, $2')
    // Remove "Hook:" labels mid-post
    .replace(/\\n\\s*Hook:\\s*/gi, '\\n\\n')
    // Fix double commas
    .replace(/,\\s*,/g, ',')
    // Normalize each line (trim whitespace per line, preserve paragraph breaks)
    .split('\\n')
    .map(line => line.trim())
    .join('\\n')
    // Collapse 3+ blank lines to 2
    .replace(/\\n{3,}/g, '\\n\\n')
    .trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// PROMPT BUILDERS
// ─────────────────────────────────────────────────────────────────────────────

const FORBIDDEN_WORDS = "utilize, leverage, navigate, delve, foster, empower, unlock, seamlessly, robust, innovative, cutting-edge, thought leader, game changer, move the needle, circle back, deep dive, synergy, paradigm shift, holistic, transformative, impactful, actionable, best practices, pain points, value proposition, low hanging fruit, bandwidth, ecosystem, scalable, disruption, pivot, journey, space as in the marketing space, folks, supercharge, harness, spearhead, dynamic, multifaceted, elevate, pave the way, relentless, hustle, grind, crushing it, killing it, showing up, lean in, unpack, touch base, at the end of the day, it is what it is, when all is said and done, the fact of the matter, in today's world, fast paced, ever changing, landscape, narrative, authentic, genuine, passionate, excited to announce, thrilled to share, humbled, blessed, grateful for the opportunity";

function getCorePhilosophyPrompt(styleReport: StyleReport | null = null) {
  const allowBullets = styleReport?.formatting_preferences?.use_bullets ?? false;
  const allowBold = styleReport?.formatting_preferences?.use_bold ?? false;
  const allowEmojis = styleReport?.formatting_preferences?.use_emojis ?? false;

  return `THE CORE PHILOSOPHY:
We are not writing LinkedIn content. We are writing things worth reading. There is a difference. LinkedIn content is optimized for engagement. Things worth reading are optimized for truth. The goal of every single output is one thing — make the reader read it twice. Not because it is clever. Because it is true in a way they have not heard before. Every word must earn its place. If a word is not doing work cut it. If a sentence is not moving the story forward cut it. If a paragraph is not adding something new cut it.

THE READER TEST:
Before outputting any content ask: if a complete stranger read this while scrolling would they slow down? Would they finish it? Would they think about it after? If the answer is no to any of these rewrite it. The post must create a small but real feeling in the reader. Not inspiration. Not motivation. Something more subtle — recognition. The feeling of yes that is exactly right.

WRITING VOICE — NON NEGOTIABLE:
- Daily life words only. If a word would feel weird to say out loud in a normal conversation do not use it.
- NO COMPLEX OR ACADEMIC VOCABULARY. We speak as a trusted friend, not a textbook.
- NO EM-DASHES (—). Use commas, periods, or colons instead.
- NO MID-SENTENCE HYPHENS (-). Hyphens are strictly for bullet points at the start of a line.
- No three part lists as the entire structure of a post.
- No inspirational quote as the opener.
- No numbered lessons format (except for explicit lists if allowed).
- No fake vulnerability — I almost quit but then I realized.
- No performed emotion — the tears, the sleepless nights, the journey.
- Real emotion only — the specific feeling of a specific moment.
- No generic hooks — unpopular opinion, hot take, most people do not know this.
- Hooks must earn attention through specificity and truth not through pattern.
- Rhythm matters. Read every post out loud in your head.
- Flow matters. Each sentence must pull you into the next one naturally.
- Every post must have one clear point. Not two. Not three. One.

FORBIDDEN WORDS — ABSOLUTE BAN:
${FORBIDDEN_WORDS}
Also ban: em dashes (—), mid-sentence hyphens (-), ellipsis used more than once per post, any word that sounds like it belongs in a TED talk or a corporate email.

FORMATTING RULES:
- Format follows content always.
${allowBullets ? "- USE BULLET POINTS (-, •) if it helps clarity, as the user prefers this style." : "- NEVER use bullet points."}
${allowBold ? "- USE BOLD TEXT for emphasis if it helps clarity, as the user prefers this style." : "- NEVER use bold text."}
${allowEmojis ? `- USE EMOJIS naturally (${styleReport?.formatting_preferences?.emoji_density || 'low'} density).` : "- NEVER use emojis."}
- Short punchy posts — one sentence per line.
- Longer narrative posts — paragraphs of 2 to 4 sentences.
- Hashtags maximum 3 at the very end only.
- Line breaks between paragraphs always — no wall of text ever.

SILENT QUALITY CHECK — RUN BEFORE EVERY SINGLE OUTPUT:
- DOES THIS HAVE A LABEL LIKE "Hook:" or "Body:"? (If yes, REMOVE IT. Output raw text ONLY).
- Are there any complex/academic words that could be simplified?
- Is there a single em-dash (—) or mid-sentence hyphen (-) anywhere? (Remove it).
- Does the "Visual Rhythm" (number of words per line and line breaks) match the samples?
- Is there a single AI pattern anywhere — list, transition word, performed emotion?
- Does the rhythm work?`;
}

function getFreeUserFallbackPrompt(): string {
  return `YOU ARE THE VIRAL GHOSTWRITER.

No voice profile exists for this user, so you step in as a world-class LinkedIn ghostwriter who has written 500+ viral posts (10k+ impressions each) for founders, executives, and creators across every industry.

You understand what makes people stop scrolling. You write posts that feel like a real human sat down and said something true, not something optimized.

YOUR WRITING DNA:
- You open with a line that creates a micro-tension, a surprise, or a pattern interrupt. Never a question. Never "Unpopular opinion." Never "Most people don't know this."
- You write one idea per line. Short sentences. Punchy. The reader should feel momentum pulling them down the post.
- Every paragraph is 1 to 3 sentences max. White space is your weapon.
- You sound like a smart friend sharing a real observation over coffee, not a thought leader performing for an audience.
- You use specific details, names, numbers, and moments. "A client" becomes "a Series A founder in fintech." "Recently" becomes "last Tuesday."
- You end with a single sharp landing, a line that makes the reader pause and think. Not a generic question. Not a CTA. A truth that echoes.
- You never use corporate vocabulary, performed emotion, or fake vulnerability.
- You never write in list-of-lessons format unless it genuinely serves the point.
- You never write anything that could have come from any of 10,000 other LinkedIn accounts.

VIRAL STRUCTURE PATTERNS YOU ROTATE BETWEEN:
1. Contrarian Truth: State something true that goes against conventional wisdom. Prove it with a specific story or observation.
2. Micro-Story: Start in the middle of a moment. Build tension. Deliver a turn. Land on a single takeaway.
3. Observation Post: Notice something specific about your industry that most people feel but nobody says. Say it clearly.
4. Before/After: Show the gap between what people think and what actually happens. Be specific.
5. One Decision: The single decision, conversation, or realization that changed everything. No dramatization, just the real version.

THE STANDARD: Every post you write should make someone think "I wish I wrote that." Not because it is clever. Because it is true in a way they have not heard before.`;
}

function formatStyleReportForPrompt(styleReport: StyleReport | null): string {
  if (!styleReport) return '';

  const lines: string[] = ['VOICE STYLE RULES — FOLLOW EXACTLY:'];

  if ((styleReport as any).sentence_structure) {
    lines.push(`- Sentence length: ${(styleReport as any).sentence_structure}`);
  }
  if ((styleReport as any).vocabulary_level) {
    lines.push(`- Vocabulary: ${(styleReport as any).vocabulary_level} — match this exactly`);
  }
  if ((styleReport as any).tone) {
    lines.push(`- Tone: ${(styleReport as any).tone}`);
  }
  if (styleReport.opening_patterns) {
    lines.push(`- How they open posts: ${styleReport.opening_patterns}`);
  }
  if (styleReport.closing_patterns) {
    lines.push(`- How they close posts: ${styleReport.closing_patterns}`);
  }
  if ((styleReport as any).recurring_themes?.length) {
    lines.push(`- Themes they write about: ${(styleReport as any).recurring_themes.join(', ')}`);
  }
  if (styleReport.formatting_preferences) {
    const f = styleReport.formatting_preferences;
    lines.push(`- Uses bullet points: ${f.use_bullets ? 'yes' : 'no'}`);
    lines.push(`- Uses bold text: ${f.use_bold ? 'yes' : 'no'}`);
    lines.push(`- Uses emojis: ${f.use_emojis ? 'yes' : 'no'}`);
  }
  if ((styleReport as any).unique_patterns) {
    lines.push(`- Unique writing patterns: ${(styleReport as any).unique_patterns}`);
  }
  if (styleReport.thought_patterns) {
    lines.push(`- Worldview: ${styleReport.thought_patterns.worldview}`);
    lines.push(`- What they notice: ${styleReport.thought_patterns.noticing}`);
  }
  if (styleReport.avg_sentence_length) lines.push(`- Sentence length notes: ${styleReport.avg_sentence_length}`);
  if (styleReport.paragraph_structure) lines.push(`- Paragraph structure: ${styleReport.paragraph_structure}`);
  if (styleReport.vocabulary_fingerprint) lines.push(`- Core vocabulary: ${styleReport.vocabulary_fingerprint}`);

  return lines.join('\\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE AUDIT PROMPT BUILDERS
// ─────────────────────────────────────────────────────────────────────────────

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
    "aboutSection": "string — completely new about section 150 to 300 words. First person. No bullet points. Never opens with I am. Use \\\\n\\\\n between paragraphs. Never copies the user input."
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
    "aboutSection": "string — completely new about section 200 to 400 words. First person. No bullets. Never opens with I am. Use \\\\n\\\\n between paragraphs. Never copies user input."
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

// ─────────────────────────────────────────────────────────────────────────────
// TARGET AUDIENCE GENERATION
// ─────────────────────────────────────────────────────────────────────────────

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
${target ? `- Focus only on the ${target === 'primary' ? 'Primary' : 'Secondary'} audience but return both in JSON.` : ''}

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

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE ANALYSIS (Quick + Strategic)
// ─────────────────────────────────────────────────────────────────────────────

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
    profileContent = [
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
    ].filter(line => line.trim() !== '').join('\\n\\n');
  }

  if (mode === 'strategic' && deepFormData) {
    profileContent = [
      deepFormData.role ? 'My role: ' + deepFormData.role : '',
      deepFormData.specificFocus ? 'My specific focus or niche: ' + deepFormData.specificFocus : '',
      deepFormData.experienceLevel ? 'Years of experience: ' + deepFormData.experienceLevel : '',
      deepFormData.industry ? 'My industry: ' + deepFormData.industry : '',
      deepFormData.headlineOption === 'have' && deepFormData.headline ? 'Current Headline: ' + deepFormData.headline : '',
      deepFormData.headlineOption === 'none' ? 'Headline: No headline yet — write one from scratch based on my profile' : '',
      deepFormData.headlineOption === 'rewrite' && deepFormData.headline ? 'Headline to completely rewrite: ' + deepFormData.headline : '',
      deepFormData.aboutOption === 'have' && deepFormData.about ? 'Current About Section: ' + deepFormData.about : '',
      deepFormData.aboutOption === 'none' && deepFormData.aboutAnswers
        ? 'About Section: Write from scratch using — What I do: ' + deepFormData.aboutAnswers.whatDoYouDo + ' | Who I help: ' + deepFormData.aboutAnswers.whoDoYouHelp + ' | Result I create: ' + deepFormData.aboutAnswers.result + ' | What makes me different: ' + deepFormData.aboutAnswers.different
        : '',
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
    ].filter(line => line.trim() !== '').join('\\n\\n');
  }

  console.log('Profile content length: ' + profileContent.length);

  const systemPrompt = mode === 'quick' ? buildQuickAuditPrompt() : buildStrategicAuditPrompt();
  const userPrompt = `Analyze this LinkedIn profile and return the JSON analysis.

PROFILE DATA:
${profileContent}

${voiceProfile && voiceProfile.length > 0 ? `VOICE PROFILE SAMPLES (Match this style in rewrites):
${voiceProfile.join('\\n---\\n')}` : ''}

IMPORTANT: Return ONLY valid JSON. No markdown, no preamble.`;

  const temperature = 0.4;
  const maxTokens = mode === 'quick' ? 2500 : 4500;

  let lastError: Error | null = null;
  const MAX_ATTEMPTS = 2;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      if (attempt > 1) {
        console.log(`[RETRY] Attempt ${attempt} after parse failure...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const text = await aiChat(userPrompt, systemPrompt, temperature, maxTokens, signal, `Profile Analysis (${mode})`);

      if (text === "Generation failed. Please try again.") {
        throw new Error(text);
      }

      const cleanJson = sanitizeJsonResponse(text);
      let parsed: any;
      try {
        parsed = JSON.parse(cleanJson);
      } catch (parseError) {
        throw new Error('Analysis failed to parse. Attempting retry...');
      }

      if (!parsed.profileDiagnosis || !parsed.rewrites) {
        throw new Error('Analysis failed to parse. Response missing required keys.');
      }

      return normalizeProfileAnalysis(parsed, mode);
    } catch (err: any) {
      lastError = err;
      if (err.message?.includes('service error') || err.name === 'AbortError') {
        throw err;
      }
      console.error(`[ERROR] Attempt ${attempt} failed: ${err.message}`);
      if (attempt === MAX_ATTEMPTS) break;
    }
  }

  console.error("Profile analysis ultimately failed after retries:", lastError);
  return getFallbackProfileAnalysis(mode);
}

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE SECTION REGENERATION
// ─────────────────────────────────────────────────────────────────────────────

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
- Use \\n\\n between paragraphs
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

// ─────────────────────────────────────────────────────────────────────────────
// VOICE PROFILE / STYLE REPORT
// ─────────────────────────────────────────────────────────────────────────────

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
  "post_length_range": "shortest and longest post and what the average is",
  "formatting_preferences": {
    "use_bullets": "true if they use - or bullet or numbers",
    "use_bold": "true if they use bold text",
    "use_emojis": "true if emojis are present",
    "emoji_density": "none, low, or high"
  },
  "vocabulary_complexity": "simple (everyday words), medium, or advanced (industry jargon)"
}

IMPORTANT: Specifically note if they use em-dashes (—). If they do not use them, we must avoid them in generation.
IMPORTANT: Note their preference for simple vs complex words. We prioritize simplicity.`;

  const voiceData = voiceProfile!.map((post, i) => `[SAMPLE POST ${i + 1}]: ${post}`).join('\\n');

  const userPrompt = `Extract thought and style patterns from these sample posts:
${voiceData}`;

  try {
    const response = await aiChat(userPrompt, systemPrompt, 0.3, 2000, undefined, "Voice Profile Analysis");
    if (response === "Generation failed. Please try again.") {
      return null;
    }
    const cleanJson = sanitizeJsonResponse(response);
    const parsed = JSON.parse(cleanJson);

    // Normalize boolean fields — the model sometimes returns strings "true"/"false"
    if (parsed.formatting_preferences) {
      const fp = parsed.formatting_preferences;
      fp.use_bullets = fp.use_bullets === true || fp.use_bullets === 'true';
      fp.use_bold = fp.use_bold === true || fp.use_bold === 'true';
      fp.use_emojis = fp.use_emojis === true || fp.use_emojis === 'true';
      if (!['none', 'low', 'high'].includes(fp.emoji_density)) {
        fp.emoji_density = 'none';
      }
    }

    return parsed as StyleReport;
  } catch (e) {
    console.error("Style analysis failed:", e);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// TOPIC GENERATOR
// ─────────────────────────────────────────────────────────────────────────────

export async function generateTopics(
  profession: string,
  goals: string,
  audience: string,
  styleReport: StyleReport | null
) {
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

  const text = await aiChat(userPrompt, systemPrompt, 0.95, 2000, undefined, "Topic Generator");
  if (text === "Generation failed. Please try again.") {
    return [];
  }
  try {
    const cleanJson = sanitizeJsonResponse(text);
    return JSON.parse(cleanJson).topics;
  } catch (e) {
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST WRITER
// ─────────────────────────────────────────────────────────────────────────────

export async function generatePost(topic: string, style: string, profileContext: ProfileData | null) {
  const isTier2 = !!profileContext;

  let systemPrompt = isTier2
    ? `TIER 2 — SIGNED IN USER — THE INFORMED VIRAL GHOSTWRITER:

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

${getFreeUserFallbackPrompt()}

${getCorePhilosophyPrompt()}`
    : `TIER 1 — ANONYMOUS USER — THE VIRAL GHOSTWRITER:

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

${getFreeUserFallbackPrompt()}

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

  return await aiChat(userPrompt, systemPrompt, 0.9, 1000, undefined, "Post Writer");
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
    // Fallback gracefully — still write a post, just without voice matching
    return await generatePost(topic, 'storytelling', profileContext);
  }

  // STEP 2 — VOICE GENERATION
  try {
    onPhaseChange('crafting');
    const systemPrompt2 = `VOICE POSSESSION — CALL 2:

BEFORE YOU WRITE A SINGLE WORD, you must deeply study every writing sample below.
Do not skim. Do not rush. Read each post at least twice.

YOU ARE ANALYZING:
1. TONE — Are they serious, playful, dry, warm, provocative, calm? What is the emotional temperature?
2. STYLE — Do they write in fragments or full sentences? Short bursts or flowing paragraphs? Casual or polished?
3. PHRASES — What words and phrases do they naturally reach for? What transitions do they use? What filler words appear?
4. STRUCTURE — How do they open? How long are their paragraphs? Where do they place the turn? How do they close?
5. EMOTIONS — Do they share vulnerability? Are they understated or expressive? Do they use humor, irony, directness?
6. RHYTHM — Read the posts out loud in your head. Feel the pacing. Some writers punch. Some writers flow. Match theirs exactly.
7. VOCABULARY LEVEL — Simple everyday words or industry-specific language? Match the exact complexity level.
8. WHAT THEY NEVER DO — This is equally important. If they never use emojis, you never use emojis. If they never ask questions at the end, you don't either.

Only after you have fully internalized their voice, write the post AS THEM.
You are not writing "in a similar style." You are writing as if you ARE this person.
A reader who knows them should not be able to tell the difference.

${formatStyleReportForPrompt(styleReport)}

THEIR ACTUAL WRITING SAMPLES — STUDY THESE DEEPLY:
${voiceProfile.map((post, i) => `[SAMPLE ${i + 1}]:\\n${post}`).join('\\n\\n')}

VOICE MATCHING RULES — NON-NEGOTIABLE:
- Match their exact sentence length patterns. If they average 8 words per sentence, you average 8.
- Match their paragraph length. If they write 1-line paragraphs, write 1-line paragraphs.
- Match their opening style. If they open with observations, open with an observation. If they open mid-story, open mid-story.
- Match their closing style. If they end with a question, end with a question. If they end with a statement, end with a statement.
- Use their vocabulary. If they say "wild" instead of "surprising", say "wild."
- Match their line break rhythm exactly.
- If their samples never use bullet points, never use bullet points.
- If their samples use short punchy lines, use short punchy lines.
- If their samples use longer paragraphs, use longer paragraphs.
- Remove any word that does not sound like them based on the samples above.

OUTPUT RULE:
Raw post text only.
No labels. No commentary. No preamble.
Just the post exactly as they would write it.

${getCorePhilosophyPrompt(styleReport)}`;

    const userPrompt2 = `Write the one-and-only final LinkedIn post as this person about: ${topic}
${profileContext ? `Profile Context: ${JSON.stringify(profileContext)}` : ''}

IMPORTANT RESTRAINT:
- Output the RAW post text only.
- NEVER add labels like "Hook:", "Body:", or "Summary".
- NEVER add preamble like "Here is your post:".
- The first line MUST be the hook.
- Match the visual pacing and rhythm of the user samples provided in the system prompt.`;

    initialPost = await aiChat(userPrompt2, systemPrompt2, 0.85, 1200, signal, "Voice Profile Call 2 generation");
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

      const refinedPost = await aiChat(userPrompt3, systemPrompt3, 0.8, 1500, signal, "Deep Mode Call 3 refinement");
      if (refinedPost === "Generation failed. Please try again.") {
        return cleanupPersonaOutput(initialPost);
      }
      return cleanupPersonaOutput(refinedPost);
    }

    return cleanupPersonaOutput(initialPost);
  } catch (err: any) {
    if (err.name === 'AbortError') throw err;
    return initialPost || "Generation failed.";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// BIO AND HEADLINE
// ─────────────────────────────────────────────────────────────────────────────

export async function generateBio(
  role: string,
  skills: string,
  achievements: string,
  goal: string,
  styleReport: StyleReport | null
) {
  const systemPrompt = `BIO AND HEADLINE:
Headline: what you do, for whom, with one specific result if possible. Under 12 words.
Bio: sounds like the person talking to someone they respect but just met. Not a resume. Not a mission statement. A person.
${styleReport ? "For Pro users, match their precise vocabulary, directness, and formatting (bold/bullets) exactly." : ""}

${getCorePhilosophyPrompt(styleReport)}`;

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

  const text = await aiChat(userPrompt, systemPrompt, 0.45, 600, undefined, "Bio and Headline");
  if (text === "Generation failed. Please try again.") {
    return { headlines: [], about: "" };
  }
  try {
    const cleanJson = sanitizeJsonResponse(text);
    const parsed = JSON.parse(cleanJson);
    if (parsed.about) {
      parsed.about = cleanupPersonaOutput(parsed.about);
    }
    return parsed;
  } catch (e) {
    return { headlines: [], about: "" };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SMART OUTREACH
// ─────────────────────────────────────────────────────────────────────────────

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

Crucial rules:
1. Specificity — reference something real from the research Context.
2. Brevity — UNDER 60 words always.
3. No pitch — start a conversation, do not pitch.
${styleReport ? "4. VOICE MATCH — Replicate the user's sentence length and tone from their style report." : ""}

OUTPUT RESTRAINT:
- Output the raw message ONLY.
- No labels, no preamble, no commentary.

Relationship context rules:
- Cold: Shortest and most specific observation.
- Warm: Reference their exact content or engagement.
- Reconnect: Acknowledge the gap naturally.
- Referral: Lead with the mutual connection.

${getCorePhilosophyPrompt(styleReport)}`;

  const userPrompt = `Write a personalized LinkedIn outreach message.
Target: ${target}
Relationship Level: ${relationship}
Prospect Research/Context: ${researchContext}
End Goal: ${goal}
${styleReport ? `Voice Blueprint: ${JSON.stringify(styleReport)}` : ''}`;

  const text = await aiChat(userPrompt, systemPrompt, 0.75, 300, undefined, "Smart Outreach");
  return cleanupPersonaOutput(text);
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
    const cleanJson = sanitizeJsonResponse(textResponse);
    return JSON.parse(cleanJson);
  } catch (e) {
    return {
      specificity: "Yellow",
      length: "Yellow",
      pitchLevel: "Yellow",
      humanFeel: "Yellow",
      explanation: "Scoring failed to parse."
    };
  }
}

export async function generateFollowUp(
  scenario: string,
  firstMessage: string,
  styleReport?: StyleReport | null
) {
  const systemPrompt = `FOLLOW-UP INTELLIGENCE:
You write highly situational follow-up messages. Do not use generic "bumping this" templates.
Keep the relationship preserving and natural.
Under 40 words.
${getCorePhilosophyPrompt(styleReport || null)}`;

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

  const text = await aiChat(prompt, systemPrompt, 0.7, 300, undefined, "Follow Up Intelligence");
  return cleanupPersonaOutput(text);
}

export async function generateICPClarity(
  bestClient: string,
  worstClient: string,
  uniqueProblem: string
) {
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

// ─────────────────────────────────────────────────────────────────────────────
// TONE ANALYSIS
// ─────────────────────────────────────────────────────────────────────────────

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
    const cleanJson = sanitizeJsonResponse(textResponse);
    return JSON.parse(cleanJson);
  } catch (e) {
    return { tone: "Unknown", suggestions: [] };
  }
}

