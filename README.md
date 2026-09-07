# Approachable Landing

Marketing and course-discovery site for **[Approachable](https://approachable.dev)** — an AI education platform that helps working professionals go from *AI Curious* to *AI Capable* through mentor-led cohorts, live deep-dive workshops, and recorded courses.

Built with **Next.js 15**, **React 19**, and **TypeScript**, deployed on Vercel at [approachable.dev](https://approachable.dev).

---

## What This Project Does

This repository powers the public-facing website for Approachable. It serves three main purposes:

1. **Cohort enrollment** — A long-form landing page for the 6-week Claude AI cohort (small-group, mentor-led, max 20 seats). Visitors can explore the curriculum, meet the mentor, view pricing, and register via an external form.

2. **Live course catalog** — A browsable grid of focused 360-minute live workshops on AI agents, Claude Code, open-source LLMs, and related topics. Users can mark courses as "interested" with a like button.

3. **Recorded course sales pages** — Rich detail pages for self-paced courses (curriculum, pricing, FAQs, video previews) that drive purchases on the separate learning platform at [learn.approachable.dev](https://learn.approachable.dev).

The site also tracks conversions (Google Analytics, Microsoft Clarity) and fires a GA conversion event on the post-registration thank-you page.

---

## Pages & Routes

| Route | File | Description |
|-------|------|-------------|
| `/` | `src/app/page.tsx` | **Home / Cohort landing page.** Hero, cohort details, curriculum (4 sessions + capstone), outcomes, how-it-works, mentor bio, LinkedIn testimonials, pricing with countdown timer, registration steps, and FAQ. |
| `/live-courses` | `src/app/live-courses/page.tsx` | **Live course catalog.** Grid of upcoming and launched deep-dive workshops with tags, duration, status, and interest (heart) buttons. |
| `/courses/[slug]` | `src/app/courses/[slug]/page.tsx` | **Recorded course detail page.** Hero image, instructor info, pricing panel, curriculum accordion, FAQ, sticky purchase bar, and optional video previews. Currently one course is published (see below). |
| `/thank-you` | `src/app/thank-you/page.tsx` | **Post-registration confirmation.** Shown after cohort signup; lists next steps and fires a Google Analytics conversion event. |
| `/not-found` | `src/app/not-found.tsx` | **404 handler.** Redirects unknown URLs back to the home page. |

### Live Courses (catalog)

Defined in `src/lib/courses-data.ts`. These appear on `/live-courses` and link to `/courses/[slug]` when a full JSON content file exists.

| Course | Slug | Status |
|--------|------|--------|
| Building AI Agents with n8n | `building-ai-agents-with-n8n` | Launched |
| Claude Code Deep Dive | `claude-code-deep-dive` | Coming soon |
| Building AI Agents with OpenAI Agents SDK | `building-ai-agents-with-open-ai-agents-sdk` | Coming soon |
| Open Source LLMs Deep Dive | `open-source-llms-deep-dive` | Coming soon |

### Recorded Courses (full detail pages)

Full course content lives in `src/data/courses/*.json` and is loaded by `src/lib/course-content.ts`.

| Course | Slug | Type |
|--------|------|------|
| AI Mastery for Working Professionals | `ai-mastery-for-working-professionals` | Recorded (48 videos, 5+ hours) |

To add a new recorded course: create a JSON file under `src/data/courses/`, add its slug to `COURSE_SLUGS` in `src/app/courses/[slug]/page.tsx`, and optionally add a card in `courses-data.ts` for the live catalog.

---

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/likes` | `POST` | Toggle course interest (like/unlike). Persists to **Upstash Redis** keyed by IP + course ID. Falls back to `localStorage` on the client if the API is unavailable. |

---

## Key Features

### Cohort landing (`/`)
- Cohort schedule, seat count, and pricing driven by `src/lib/cohort-config.ts`
- Early-bird vs late pricing with a live countdown (`PricingSection`)
- Embedded Vimeo cohort overview video
- LinkedIn review carousel with lightbox
- Floating CTA bar and sticky header
- External registration form (`COHORT.formUrl`)


### Course detail (`/courses/[slug]`)
- JSON-driven content (sessions, videos, quizzes, projects)
- HLS video preview modal (`hls.js`) for unlocked preview lessons
- Sticky bottom purchase bar
- SEO metadata and Open Graph tags per course

### Analytics
- **Google Analytics** (`G-XG391DQQCV`) — page views, CTA clicks, checkout funnel, thank-you conversions
- **Microsoft Clarity** — session recordings and heatmaps
- CTA tracking helper in `src/lib/analytics.ts`

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| UI | React 19, CSS Modules + global CSS, Tailwind CSS 4 |
| Language | TypeScript 5 |
| Video | hls.js (HLS stream previews) |
| Storage | Upstash Redis (course likes) |
| Analytics | Google Analytics, Microsoft Clarity |
| Deployment | Vercel |

---

## Project Structure

```
approachable-landing/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Home / cohort landing
│   │   ├── layout.tsx          # Root layout, fonts, analytics scripts
│   │   ├── globals.css         # Global styles and design tokens
│   │   ├── live-courses/       # Live course catalog
│   │   ├── courses/[slug]/     # Recorded course detail pages
│   │   ├── thank-you/          # Post-registration page
│   │   ├── not-found.tsx       # 404 → redirect home
│   │   └── api/likes/          # Course likes API
│   ├── components/             # Shared UI components
│   │   ├── Header.tsx, Footer.tsx, Banner.tsx
│   │   ├── PricingSection.tsx, FloatingCta.tsx
│   │   ├── LinkedInReviews.tsx, Lightbox.tsx
│   │   └── course/             # Course-specific components
│   ├── data/courses/           # Course content JSON files
│   └── lib/                    # Config, data helpers, analytics
│       ├── cohort-config.ts    # Cohort dates, pricing, form URL
│       ├── courses-data.ts     # Live course catalog metadata
│       ├── course-content.ts   # JSON loader for recorded courses
│       └── analytics.ts        # GA event helpers
├── public/                     # Static assets (logo, images, favicons)
├── next.config.ts
├── vercel.json
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install & run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

---

## Environment Variables

Create a `.env.local` file for local development. Only the likes API requires secrets:

| Variable | Required | Description |
|----------|----------|-------------|
| `COURSE_LIKES_KV_REST_API_URL` | For `/api/likes` | Upstash Redis REST API URL |
| `COURSE_LIKES_KV_REST_API_TOKEN` | For `/api/likes` | Upstash Redis REST API token |

Without these, the live-courses like button still works via `localStorage` fallback on the client.

---

## Configuration

### Cohort settings

Edit `src/lib/cohort-config.ts` to update:
- Cohort start date, time, and timezone
- Seat count and availability
- Pricing (India INR / International USD)
- Early-bird deadline and late pricing
- Registration form URL

### Adding a recorded course

1. Add `src/data/courses/your-course-slug.json` following the schema in `src/lib/course-content.ts`
2. Register the slug in `COURSE_SLUGS` inside `src/app/courses/[slug]/page.tsx`
3. Optionally add a catalog entry in `src/lib/courses-data.ts`

---

## Deployment

The site is configured for **Vercel** (`vercel.json`). Push to the connected Git repository to trigger automatic deploys.

Production URL: **https://approachable.dev**

Related services (external to this repo):
- Learning platform: [learn.approachable.dev](https://learn.approachable.dev)
- Cohort registration: configured via `COHORT.formUrl` in `cohort-config.ts`

---

## Contact

- **Mentor:** Ranbeer Makin — [LinkedIn](https://www.linkedin.com/in/ranbeer/)
- **Support:** ranbeer@gmail.com
- **Organization:** [BIGINT Solutions](https://www.bigintsolutions.com)
