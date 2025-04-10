# Submission for Blueprint.ai fullstack exercise
 - Candidate: Mark Centoni
 - Position: Software Engineer (Growth)
 - Github: https://github.com/marklc44
 - Site: https://markcentoni.com

Application repo: https://github.com/marklc44/blueprint
Application demo: https://blueprint-mark-centoni.vercel.app
There's a redirect that will take you directly to the single screener page: https://blueprint-mark-centoni.vercel.app/assessments/bpds/section/1
Eventually use the homepage to login or index and navigate multiple screeners.

---

## Problem
The exercise is to create a full stack application that presents a user with a mental health diagnostic screening questionnaire to help determine the severity of symptoms they may be experiencing, and aid a trained therapist in creating a treatment plan. Using questions categorized by domain along with domain scoring rules, the questionnaire response is converted to 0 or more evidence-based Level-2 assessments.

## Solution
*Terminology:* I'm using the term Screener to be the questionnaire with one more sections. An assessment, as I understand it, is the code or acronym for a grouping of symptoms, and is the objective of the Screener, but not necessarily the questionnaire itself.

The application uses a SQLite/LibSQL database hosted on Turso managed hosting with the "serverless" API layer built with Prisma ORM, one API route and Next.js server actions. The frontend is built on Next.js app routing with multiple dynamic route params, React, and hosted on Vercel. The application is written in TypeScript, using Tailwind4 for styling and Jest for unit testing.

The repo on Github has two branches, main and develop, that align with Vercel production and preview environments respectively. Minimal unit testing is done with Jest, and Github actions could be included to run prebuild unit tests, but are not here.

Generally, tech stack choices were made for a small scope with fast development, fast performance, reasonable reliability and maintainability at no cost.

### Solution: Database
See `prisma/schema.prisma`
I used a relational SQLite database with 7 tables. The data could lend itself to a nosql document db, but I went with what I know best. Would discuss with the team in the real world.
 - Screener - main questionnaire object
 - ScreenerSection - one item in the `screener.content.sections` array, 1 screener to many ScreenerSections
 - Question - question object with domain mapping, many questions to many ScreenerSections. 
 - QuestionsOnScreenerSections - join table for m to m Questions and ScreenerSections. Order of questions is by createdAt. Not optimal - should add a question index here.
 - Domain - one domain scoring rule with Assessment result and score threshold, 1 domain to many questions
 - ScreenerResponse - answers to screener questions, many screener responses to 1 ScreenerSection
 - Answer - answer to a single question, many answers to 1 ScreenerResponse

#### ORM: Prisma
Prisma makes it very fast to design a schema, connect to local and external databases, create and run migrations in multiple environments, is easy to understand and maintain, and provides some guardrails against common antipatterns

#### Data Caveats
 - Answers is a JSON object on ScreenerSection, but probably should be a model of AnswerOptions on its own with a type field and the JSON field for options, so different AnswerOptions could be pulled based on the type of the ScreenerSection.
 - The screener JSON structure did not include the domain along with the questions which gave me the most pause. In person, I would ask why domain was not included. I included it and took the question mapping from the screener questions for expediency, but maybe earned demerits for it. Curious to know if the JSON structure was intended to be a hard requirement and why.

### Solution: API design
- `getAllScreeners` - Fetch all screeners for page routing
- `getScreenerByName` - Fetch screener by name. If use cases arise, could add general getScreener, taking more query params, but for now, simple. Question/domain mapping is returned with the screener in one call with include. Could be more performant if question domain were included in screener JSON questions.
- `storeScreenerResponse` - store answers in the db. At some point, would want to relate this to a therapist/company and a user filling out the response. This is the only endpoint with an API route because we access it from the client. It is possible to do this as a server action on form submission as well, but the results are currently stored and displayed without a route change in the client.
- `getDomains` - get domain scoring rules and assessment mapping for calculating results.

### Solution: Business logic/controllers
- `generateStaticParams` - where we transform the result of `getAllScreeners` to page params `{ name, section }` to build routes
- `getScreenerPage` - Uses `getScreenerByName` to get a single screener and `transformScreener` to transform it match the JSON object structure with added question domain mapping. As above, the structure of the object is slightly different from the example as domain is included with each question rather than making another call or returning a separate object.
- `storeScreenerResponse` - Stores the response to the screener. Additional util for calculating the results from domain and answers used in the client.
- `calculateScores` and `calculateAssessments` - generate the list of assessments to display to the user, modular for unit testing

### Solution: Testing
 - Using Jest for unit tests. Could use Vitest, but can cause issues with Vercel Analytics if not configured correctly.
 - Includes unit tests for `calculateScores` and `calculateAssessments`.
 - Should add unit tests for `transformScreener`.

### Solution: Routing
 - Using Next.js, industry standard router recommended by the React team, and lots of developers know it. 
 - App router used to take advantage of caching and Incremental Static Regeneration. The data seems fairly static, and can be cached, refreshed daily to start.
 - Route parameter pattern `/assessments/[name]/section/[section]` where name is the `sreener.name` string and section is an integer aligned with the index of the section in the `screener.content.sections` array. It may be more clear to replace "assessments" with "screeners" or "questionnaires" in the route, but would defer to a more knowledgeable person.
 - If a screener has multiple sections, a link to the next section is presented at the bottom of the page

### Solution: Presentation
Uses Tailwind4 mostly in CSS modules. Tailwind4 is new, with breaking changes and this was my first brush with it. It has lots of perf improvements and seems to reduce css size with CSS modules. Still investigating. For me, CSS modules make Tailwind more readable and maintainable, especially for responsive breakpoints. No external component library.

#### Assessments Page Component
Async server component that takes routing params, fetches a single screener, the approriate screener section, displays screener meta data and passes question data to the form. Posthog tracking added for analytics, wrapping the root layout with a Posthog provider with suspense so child server components are not forced to render on the client, per Posthog docs.

#### Form, Question and Options Components
Multistep form client component using React and simple formData state management. Each question is revealed via transition like a carousel. 
 - Form Component - The form is a client component because it is interactive on the client using effects and react state to navigate and submit results. The form component handles the state, field transitions and submission. Submission is handled via ajax to showcase my ability to do that and to produce interactivity on the page, but could be done with a form action and page change to a results page. Form is controlled
 - Question Component - the field component is a reusable presentation for questions that behaves as the form component tells it to.
 - Standard Options Component - displays the options for this field type. In the real world, there might be different field types, so could render different Options components based on screener type.

#### Progress Bar Component
From the total number of fields and the array index of each field, calculate progress (in the form component) and pass to the progress bar to update its inner length.

#### Results Component
After answers are stored and assessment is calculated, display the results in a dialog overlaid on the page. Shows a success or error message for the store results call.

## To be production ready
Get eng and cross-functional team input. It's important to incorporate other ideas and build a prod app in a way the team can be productive. I'm assuming this app is going to part of or used in conjunction with other product offerings.

### Prod: Workflow
 - Git Workflow (start), Github Workflow (CI/CD), variants
 - Communication - deployment channels, PR/MR templates, hotfix and patch process, etc.
 - Integrate with project management workflow, Agile, Scrum, etc.

 ### Prod: Types and cleanup
 - Fix 3 @ts-expect-errors with todos
 - Fix ScreenerHack with an explicit chain of Prisma types describing the db call result
 - Left some console logs for your convenience. Remove.
 - Consider stricter linting/formatting rules. Discuss with team.

### Prod: DB/API
 - Better error handling: log serverside fetch errors, return db create errors, parse messages and display in toasts with actions to the user when relevant (i.e. start over or resubmit)
 - API/UX - add suspense with fallback if important data cannot be added in UI (i.e. if dynamically loaded Screener can't be generated, provide a link to home or try again, etc.)
 - Multiple db envs to align with app envs (dev, test, prod/main)
 - Better migration scripts - Prisma migration/push scripts don't work OTB with Turso, so using their CLI. Or migrate to a service like PlanetScale (not free).

### Prod: Testing
 - Unit test all utilities and API. Current coverage is minimal. Hook into Github actions for build tests.
 - Less brittle data mocking
 - Add component testing and consider Storybook as way to orchestrate component testing and create docs. Sync with design on component library.
 - Add E2E when complexity of data states can no longer be modeled well enough modularly (Playwright is great)

### Prod: Logging/Observability
 - Sentry can handle all needs for prod launch. Might be able to get away with just Vercel Logs for a bit as data fetching will be serverside and cached. 
 - Further tooling and analysis with Splunk, New Relic, etc. to consider.

### Prod: Users, Auth and Security
 - Need some admin functionality to manage the questionnaires, in UI or external system. Auth and permissions for admin, curation, monetization and security. Spam could fill up the db pretty quickly (though there's little reason to do so, now)
 - Auth service like Clerk or Supabase, or custom. 
 - Stateful sessions stored in DB are most secure, but could use bearer tokens, JWT with middleware and frequent refresh strategy.
 - An external CDN with rules on the edge for rate limiting and blacklisting

### Prod: Performance
 - Nextjs ISR is good for this scope. Tweak simple revalidation interval based on how frequently we expect Screener create/update.
 - As complexity grows, consider tagging content for more granular data revalidation, or using webhooks to revalidate based on third party updates.
 - DB indexing, normalized caching, could be useful if searching/filtering larger number of screeners.

### Prod: Presentation/UX
 - Discuss CSS modules/tailwind with team. I like CSS modules for readability of responsive and element state styling, especially with Tailwind4's improved bundling, but others may not. 
 - Theming with design team: general polish, split into shared and specific components, with custom or third party component library.
 - Some theme colors were taken from the Blueprint marketing site, but otherwise minimal theming. I haven't ramped up on translating `tailwind.config.ts` theme to CSS based theming of Tailwind4 for device sizes, etc.
 - Design sucks - typography and vertical spacing not great. Knowledge of the subject matter (and a designer) would lead to better presentation of meta data, visual grouping and information hierarchy.
 - Blank awkward space after last question. Could move buttons up, retain last question, or display completed message.
 - Navigation and home: starting point with some way to group and navigate through assessment screeners, possibly gating and/or curating screeners for specific users
 - Questions slider and results dialog are crude - clean up spacing, alignment, transitions, interactions
 - Responsive - functionally cross-device supported css/js, but needs device testing, more responsive styling.
 - Clean up html structure, CSS utility usage - fast and loose with utilities inline vs in modules in some places, nested `<section>` elements
 - Accessibility aria attrs, also helps in test/experiment element selection
 - Store strings in consts for consistency and easier translation/localization (eventually)
 - Favicon, device icons, page metadata

### Prod: Analytics/Experimentation/Feature Flagging
Simple to begin with. I like Posthog because it covers web analytics, product analytics, CDP/event pipelines, warehouse, feature flagging, experiments all with significant cost savings over other common options, and will take a while to grow out of.

## Code I'm proud of
None of the code I've written in the last 5-7 years is public. Happy to discuss key parts. Some projects:
 - [NextMe](https://web.nextmeapp.com) - queue management
Nextjs/React, Laravel backend. Lead frontend engineer and contributing backend engineer. (Not the marketing site, just the app.)

 - [Plastiq](https://plastiq.com) - payments
React/Nodejs, WordPress, Segment/Braze/Snowflake/Salesforce - Architected GTM tech stack, multiple iterations of the marketing site as IC, built and managed a GTM tech and product eng team

 - [Hopelab](https://hopelab.org) - nonprofit mental health investment
Headless WordPress/Graphql/Nextjs/React - lead frontend engineer, contributing backend engineer, hired and managed contractors. (Excuse the design.)




