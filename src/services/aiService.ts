
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
  clean = clean.replace(/^```json\n?/, '').replace(/\n?```$/, '');
  // Find the first { and last }
  const firstBrace = clean.indexOf('{');
  const lastBrace = clean.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
    clean = clean.slice(firstBrace, lastBrace + 1);
  }
  return clean;
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
  
  return {
    ...fallback,
    ...data,
    mode,
    overallScore: typeof data.overallScore === 'number' ? data.overallScore : 0,
    verdict: data.verdict || fallback.verdict,
    communicates: data.communicates || fallback.communicates,
    lenses: data.lenses || fallback.lenses,
    theGood: Array.isArray(data.theGood) ? data.theGood : [],
    theBad: Array.isArray(data.theBad) ? data.theBad : [],
    semanticGaps: Array.isArray(data.semanticGaps) ? data.semanticGaps : [],
    recommendations: Array.isArray(data.recommendations) ? data.recommendations : [],
    rewrites: Array.isArray(data.rewrites) ? data.rewrites : [],
    problems: Array.isArray(data.problems) ? data.problems : [],
    nextSteps: Array.isArray(data.nextSteps) ? data.nextSteps : [],
    actionPlan: Array.isArray(data.actionPlan) ? data.actionPlan : [],
  };
}

function buildQuickAuditPrompt(): string {
  return `You are a brutally honest LinkedIn strategist. You diagnose identity, authority, and positioning.
GOAL: Turn a generic profile into a clear authority snapshot.
TONE: Direct, sharp, human, slightly tough but respectful. No corporate fluff. No motivational filler.

INSTRUCTIONS:
- Identify what a stranger thinks within seconds of landing on the profile.
- Explain what the profile currently communicates in plain conversational English.
- Produce a headline that is specific, clean, and sharp.
- Produce a rewritten about section, not just guidance.
- Produce a next step that is the highest leverage move.
- Identify the biggest missed opportunity based on the user's goals.
- If this output could apply to 100 other people, it is wrong. Rewrite it until it becomes specific to this person.
- Think step-by-step internally, but only output final structured JSON. Do not reveal reasoning.

SCORING:
- 0 to 50 = weak or unclear presence
- 51 to 85 = good foundation but not distinctive
- 86 to 100 = strong authority and positioning

JSON STRUCTURE:
{
  "mode": "quick",
  "overallScore": number,
  "verdict": "one clear specific verdict sentence",
  "communicates": "two to three paragraphs of plain conversational English explaining the perceived identity",
  "lenses": {
    "seo": { "score": number, "feedback": "string" },
    "authority": { "score": number, "feedback": "string" },
    "narrative": { "score": number, "feedback": "string" }
  },
  "theGood": ["string"],
  "theBad": ["string"],
  "semanticGaps": ["string"],
  "problems": [{ "title": "string", "impact": "string", "fix": "string" }],
  "headline": "copy-paste ready headline",
  "about": "copy-paste ready about section",
  "quickFix": { "improvedHeadline": "string", "improvedAbout": "string", "aboutDirection": "string" },
  "nextStep": { "action": "string", "description": "string", "effort": "string" },
  "biggestMissedOpportunity": "string",
  "nextSteps": ["string"],
  "recommendations": [{ "title": "string", "description": "string", "impact": "High|Medium" }],
  "depthExpansion": "string",
  "upgradeCTA": "string"
}`;
}

function buildStrategicAuditPrompt(): string {
  return `You are the world's most precise LinkedIn identity strategist. You don't just give feedback; you build an identity strategy.
GOAL: Turn the profile into a strategic asset that converts attention into trust.
TONE: Direct, sharp, human, professional-grade. No generic filler. No robotic tone.

INSTRUCTIONS:
- Define the user's current identity and the one they should own.
- Identify what category they belong in or should belong in.
- Define how their profile should convert attention into trust.
- Produce full rewrites for headline and about section (not templates).
- Connect profile positioning to content direction and monetization.
- Create a clear before/after transformation.
- If this output could apply to 100 other people, it is wrong. Rewrite it until it becomes specific to this person.
- Think step-by-step internally, but only output final structured JSON. Do not reveal reasoning.

SCORING:
- Use section scores that reflect headline, about, experience, featured, posts, and strategic coherence.
- 0 to 50 = weak or unclear presence
- 51 to 85 = good foundation but not distinctive
- 86 to 100 = strong authority and positioning

JSON STRUCTURE:
{
  "mode": "strategic",
  "overallScore": number,
  "verdict": "sharp specific verdict",
  "communicates": "detailed breakdown of perceived identity",
  "lenses": {
    "seo": { "score": number, "feedback": "string" },
    "authority": { "score": number, "feedback": "string" },
    "narrative": { "score": number, "feedback": "string" }
  },
  "theGood": ["string"],
  "theBad": ["string"],
  "semanticGaps": ["string"],
  "scores": { "headline": number, "about": number, "experience": number, "featured": number, "posts": number, "coherence": number },
  "rewrites": [{ "section": "Headline|About|Experience", "original": "string", "suggested": "string", "strategy": "string" }],
  "messagingClarity": { "who": "string", "result": "string", "how": "string", "why": "string" },
  "contentDirection": { "strategy": "string", "ideas": ["string"] },
  "beforeAfter": { "before": "string", "after": "string" },
  "actionPlan": [{ "title": "string", "description": "string", "effort": "string" }],
  "recommendations": [{ "title": "string", "description": "string", "impact": "High|Medium" }],
  "completeness": number,
  "problems": [{ "title": "string", "impact": "string", "fix": "string" }],
  "positioning": {
    "currentIdentity": "string",
    "perceivedProblem": "string",
    "newIdentity": "string",
    "category": "string",
    "unfairAdvantage": "string"
  },
  "authorityBreakdown": {
    "clarity": number,
    "specificity": number,
    "differentiation": number,
    "credibility": number,
    "conversion": number
  },
  "firstImpression": { "recruiter": "string", "client": "string", "peer": "string" },
  "monetization": { "bestOffer": "string", "whyItFits": "string", "pricingAngle": "string" },
  "contentEngine": { "pillars": ["string"], "angles": ["string"], "authorityPlan": "string" },
  "transformation": { "before": "string", "after": "string", "bridge": "string" }
}`;
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
  },
  quickFormData?: {
    whoAreYou: string;
    currentHeadline: string;
    headlineOption: string;
    aboutSection: string;
    aboutOption: string;
    whatDoYouWant: string;
    goals: string[];
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
      deepFormData.audience && deepFormData.audience.length > 0 ? 'Target Audience: ' + deepFormData.audience.join(', ') : '',
      deepFormData.struggles && deepFormData.struggles.length > 0 ? 'Current struggles on LinkedIn: ' + deepFormData.struggles.join(', ') : '',
      deepFormData.otherStruggle ? 'Other struggle: ' + deepFormData.otherStruggle : '',
      deepFormData.achievements ? 'Key achievements: ' + deepFormData.achievements : '',
      deepFormData.skills ? 'Key skills: ' + deepFormData.skills : '',
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
  const maxTokens = mode === 'quick' ? 2000 : 4000;

  if (DEBUG_AI) {
    console.log(`[DEBUG] Calling AI for profile analysis (${mode})`);
    console.log(`[DEBUG] Temperature: ${temperature}, MaxTokens: ${maxTokens}`);
  }

  try {
    const text = await aiChat(userPrompt, systemPrompt, temperature, maxTokens, signal, `Profile Analysis (${mode})`);
    
    if (text === "Generation failed. Please try again.") {
      throw new Error(text);
    }

    if (DEBUG_AI) {
      console.log(`[DEBUG] Raw AI response length: ${text.length}`);
    }

    try {
      const cleanJson = sanitizeJsonResponse(text);
      const parsed = JSON.parse(cleanJson);
      
      if (DEBUG_AI) {
        console.log(`[DEBUG] Successfully parsed JSON. Score: ${parsed.overallScore}`);
      }

      return normalizeProfileAnalysis(parsed, mode);
    } catch (e) {
      console.error("JSON Parse Error in Profile Analysis:", e);
      if (DEBUG_AI) {
        console.log("[DEBUG] Raw response that failed to parse:", text);
      }
      return getFallbackProfileAnalysis(mode);
    }
  } catch (error: any) {
    if (error.name === 'AbortError') throw error;
    console.error("Profile analysis failed:", error);
    // Return fallback instead of throwing to prevent UI crash
    return getFallbackProfileAnalysis(mode);
  }
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
