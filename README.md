Somyra

AI-powered LinkedIn copilot for professionals, creators, and founders.

Live: https://somyra.online/

Somyra is an AI-powered productivity platform designed to help professionals build a stronger LinkedIn presence through content creation, profile analysis, outreach, hooks, topic discovery, and personalized writing.

I designed, built, deployed, and operated Somyra independently, taking it from product concept to a live production application.

---

✨ What Somyra Does

Somyra brings several LinkedIn workflows into one AI-powered workspace.

- ✍️ AI Post Writer
  Generate and refine LinkedIn posts while maintaining a personalized writing style.

- 🎯 Profile Audit
  Analyze a LinkedIn profile and identify opportunities to improve positioning and presentation.

- 🗣️ Voice Profile
  Build a reusable representation of a user's writing style so generated content feels more personal.

- 💬 Smart Outreach
  Generate personalized outreach and direct-message content.

- 🪝 Hook Generator
  Create attention-grabbing opening lines for LinkedIn content.

- 💡 Topic Generator
  Discover relevant content ideas based on a user's profile and goals.

---

🏗️ Architecture

Somyra follows a client-to-server architecture designed to keep sensitive operations such as AI requests and payment processing away from the browser.

┌──────────────────────┐
│      React Client    │
│  TypeScript + Vite   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Server / Functions │
│  API + Business Logic│
└───────┬───────┬──────┘
        │       │
        ▼       ▼
┌────────────┐ ┌────────────────┐
│  Supabase  │ │  AI Providers  │
│ Auth + Data│ │ LLM Generation │
└────────────┘ └────────────────┘
        │
        ▼
┌──────────────────────┐
│    Dodo Payments     │
│ Checkout + Webhooks  │
└──────────────────────┘

The production application is deployed using Netlify and its serverless functions.

---

🧠 AI Engineering

AI generation is handled server-side rather than exposing provider credentials in the client.

The AI layer includes:

- Model selection based on product/user requirements
- Model fallback handling
- Request timeouts
- Retry logic
- Response validation
- Usage and generation limits
- Structured generation workflows
- Graceful handling of provider failures

This allows the application to continue operating when an individual model or request fails and provides a foundation for controlling AI cost and reliability.

---

🔐 Authentication & User Data

Somyra uses Supabase for application authentication and user-related data.

The application separates client-side functionality from server-side operations and keeps sensitive provider credentials outside the frontend.

User-specific application state includes information such as:

- Authentication/session state
- Profile information
- Usage limits
- Subscription state
- Product preferences

---

💳 Subscriptions & Payments

Somyra includes a subscription system powered by Dodo Payments.

The payment flow includes:

1. Server-side checkout creation
2. Subscription lifecycle handling
3. Cancellation support
4. Webhook processing
5. Updating application subscription state

Webhook-driven events allow payment state to be synchronized with the application instead of relying solely on client-side information.

---

📊 Launch & Usage

Somyra was publicly launched as a real production application rather than remaining a local portfolio project.

During its initial launch period, analytics recorded:

Metric| Result
Active users| 371
New users| 372
Page/screen views| 1,986
US users| 196
India users| 56

These numbers represent the initial launch period and are included to demonstrate real-world product usage.

---

🛠️ Tech Stack

Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router

Backend

- Node.js
- Express
- Netlify Functions
- REST APIs

AI

- Groq-hosted LLMs
- Prompt-based generation
- Model routing and fallback
- Retry and timeout handling

Data & Authentication

- Supabase
- PostgreSQL
- Authentication
- Session management

Payments

- Dodo Payments
- Webhooks
- Subscription management

Deployment

- Netlify
- Serverless functions
- Environment-based configuration

---

📁 Project Structure

somyra/
├── api/
├── netlify/
│   └── functions/
├── public/
├── src/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── services/
│   └── utils/
├── .env.example
├── netlify.toml
├── package.json
└── README.md

The codebase is organized around reusable UI components, feature modules, hooks, services, utilities, and server-side functions.

---

🚀 Running Locally

Prerequisites

- Node.js 18+
- npm

1. Clone the repository

git clone https://github.com/sharmashantanu911-a11y/Somyra.git
cd Somyra

2. Install dependencies

npm install

3. Configure environment variables

Create a local environment file:

cp .env.example .env.local

Add your own development credentials.

Never commit real API keys, payment secrets, database passwords, or other credentials to GitHub.

4. Start the development server

npm run dev

The application will be available at the local development URL shown by Vite.

---

🔑 Environment Variables

Somyra requires environment configuration for services such as:

SUPABASE_URL=
SUPABASE_ANON_KEY=
GROQ_API_KEY=
DODO_API_KEY=
DODO_WEBHOOK_SECRET=

The exact variables required may depend on the enabled application features.

Do not use production credentials locally or commit ".env" files to the repository.

---

🧪 Engineering Focus

Somyra was built with particular attention to:

- End-to-end product ownership
- AI reliability
- Graceful API failure handling
- Authentication and authorization boundaries
- Usage and subscription controls
- Server-side secret management
- Payment webhook reliability
- Responsive user experience
- Production deployment

---

📈 Future Improvements

Potential areas for future development include:

- More sophisticated AI evaluation and quality scoring
- Improved AI cost optimization
- Streaming generation
- More granular usage analytics
- Expanded personalization
- Automated testing coverage
- Improved observability and error monitoring
- More advanced content-performance feedback

---

👨‍💻 About the Builder

Somyra was independently designed and developed by Shantanu Sharma.

I'm an AI-focused product engineer interested in building AI-native products, SaaS applications, developer tools, and full-stack systems.

Portfolio: https://somyra.online/
GitHub: https://github.com/sharmashantanu911-a11y
LinkedIn: https://www.linkedin.com/in/sharmanu911

---

📄 License

This project is primarily maintained as a portfolio and product project.

Please contact the author before using substantial portions of the source code in another product.
