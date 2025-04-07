# Submission for Blueprint.ai fullstack exercise
Candidate: Mark Centoni
Position: Software Engineer (Growth)
Github: https://github.com/marklc44
Site: https://markcentoni.com

Application demo: https://assessements.vercel.app/
There's a redirect that will take you directly to the screener page, but would want to create an index of screeners when there are more.

---

## Problem
The exercise is to create a full stack application that presents a user with a mental healthdiagnostic screening questionnaire to help determine the severity of symptoms they may be experiencing, and aid a trained therapist in creating a treatment plan. Using questions categorized by domain along with domain scoring rules, the questionnaire response is converted to 0 or more evidence-based Level-2 assessments.

## The solution
The application uses a SQLite/LibSQL database hosted on Turso managed hosting with the "serverless" API layer built with Prisma ORM, one API route and Next.js server actions. The frontend is built on Next.js app routing with multiple dynamic route params, React, and hosted on Vercel. The application is written in TypeScript, using Tailwind4 for styling.

The repo on Github repo has two branches, main and develop, that align with Vercel production and preview environments respectively. Minimal unit testing is done with Jest, and Github actions could be included to run prebuild unit tests, but are not here.

Generally, tech stack choices were made for a small scope with fast development, fast performance, reasonable reliability and maintainability at no cost.

### Database
See `prisma/schema.prisma`
I used a relational SQLite database with 7 tables. The data could lend itself to a nosql document db, but I went with what I know best. Would discuss with the team in the real world.
 - Screener - main questionnaire object
 - ScreenerSection - one item in the content.sections array, 1 screener to many ScreenerSections
 - Question - question object with domain mapping, many questions to many ScreenerSections. 
 - QuestionsOnScreenerSections - join table for m to m Questions and ScreenerSections. Order of questions is by createdAt. Not optimal - should add a question index here.
 - Domain - one domain scoring rule with Assessment result and score threshold, 1 domain to many questions
 - ScreenerResponse - answers to screener questions, many screener responses to 1 ScreenerSection
 - Answer - answer to a single question, many answers to 1 ScreenerResponse

#### Prisma
Prisma makes it very fast to design a schema, connect to local and external databases, create and run migrations in multiple environments, is easy to understand and maintain, and provides some guardrails against common antipatterns for someone like me who doesn't design databases on a regular basis.

In production, the DB is hosted on Turso.

#### Data Caveats
 - Answers is a JSON object on ScreenerSection, but probably should be a model of AnswerOptions on its own with a type and the JSON for options, so different AnswerOptions could be pulled in based on the type of the ScreenerSection.
 - The screener JSON structure did not include the domain along with the questions which gave me the most pause. In person, I would ask why domain was not included. I included it and took the question mapping from the screener questions for expediency, but maybe earned demerits for it. Curious to know if the JSON structure was intended to be a hard requirement and why.

### API design
- `getAllScreeners` - Fetch all screeners for page routing
- `getScreenerByName` - Fetch screener by name. If use cases arise, could add general getScreener, taking more query params, but for now, simple. Question/domain mapping is returned with the screener in one call with include. Could be more performant if question domain were included in screener JSON questions.
- `storeScreenerResponse` - store answers in the db. At some point, would want to relate this to a therapist/company and a user filling out the response. This is the only endpoint with an API route because we access it from the client. It is possible to do this as a server action on form submission as well, but the results are currently stored and displayed without a route change in the client.
- `getDomains` - get domain scoring rules and assessment mapping for calculating results.

### Business logic/controllers
- `getScreenerPage` - Uses `getScreenerByName` to get a single screener and `transformScreener` to transform it match the JSON object structure with added question domain mapping. The transformation doesn't have tests, but should. As above, the structure of the object is slightly different from the example as domain is included with each question rather than making another call or returning a separate object.
- `storeScreenerResponse` - Stores the response to the screener. Additional util for calculating the results from domain and answers used in the client.

### Testing
Using Jest for unit tests.

### Routing
 - Using Next.js, industry standard router recommended by the React team, and lots of developers know it. 
 - App router used to take advantage of caching and Incremental Static Regeneration. The data seems fairly static, and can be cached, refreshed daily to start.
 - Route parameter pattern `/assessments/[name]/section/[section]` where name is the `sreener.name` string and section is an integer aligned with the index of the section in the `screener.content.sections` array.
 - If a screener has multiple sections, a link to the next section is presented at the bottom of the page

### Presentation
Uses Tailwind4 mostly in CSS modules. Tailwind4 is new, with breaking changes and this was my first brush with it. It has lots of perf improvements and seems to reduce css size with CSS modules. Still investigating. For me, CSS modules make Tailwind more readable and maintainable, especially for responsive breakpoints. No external component library.

#### Assessments Page
Async server component that takes routing params, fetches a single screener, the approriate screener section, displays screener meta data and passes question data to the form.

#### Form
Multistep form client component using React and `react-hook-form` to simplify form field state management and potential validation. Each question is revealed via transition like a carousel. 
 - Form Component - The form is a client component because it is interactive on the client using effects and react state to navigate and submit results. The form component handles the state, field transitions and submission. Submission is handled via ajax to showcase my ability to do that, but could be done with a form action and page change to a results page. Form is uncontrolled
 - Question Component - the field component is a reusable presentation for questions that behaves as the form component tells it to. It contains a hidden number field to record results so the form data can be submitted via action. 
 - Standard Options Component - displays the options for this field type. In the real world, there might be different field types, so could render different Options components based on screener type.

#### Progress Bar
From the total number of fields and the array index of each field (array index is a safe order because field order is included in the screener JSON), calculate progress (in the form component) and pass to the progress bar to update its inner length.

### Results
After answers are stored and assessment is calculated, display the results in a dialog overlaid on the page.

## To be production ready
Get eng and cross-functional team input. It's important to incorporate other ideas and build a prod app in a way the team can be productive. I'm assuming this app is going to part of or used in conjunction with other product offerings.

### Workflow
 - Where on the CI/CD spectrum do we want start?
 - Git Workflow (start), Github Workflow, variants
 - Communication - deployment channels, PR/MR templates, hotfix and patch process, etc.
 - Integrate with project management workflow, Agile, Scrum, etc.

### Testing
 - Unit test all utilities and API. Current coverage is minimal. Hook into Github actions for build tests.
 - Add component testing and consider Storybook as way to hook into component testing with other tools and create docs. Sync with design on component library.
 - Add E2E when complexity of data states can no longer be modeled well enough modularly (Playwright is great)

### Design and Component Library

- Flesh out theme/css vars for typography, spacing, colors, etc. to maintain consistency, onboard team members quickly

### Logging/Observability
 - Sentry can handle all needs for prod launch. Might even be able to get away with just Vercel Logs for a bit as data fetching will be serverside and cached. 
 - Further tooling and analysis with Splunk, New Relic, etc. to consider.

### Users, Auth and Security
 - Need some admin functionality to manage the questionnaire, in UI or external system. Auth and permissions for admin, curation, monetization and security. Spam could fill up the db pretty quickly (though there's little reason to do so, now)
 - Auth service like Clerk or Supabase, or custom. 
 - Stateful sessions stored in DB are most secure, but could use bearer tokens, JWT with frequent refresh strategy.
 - An external CDN with rules on the edge for rate limiting and blacklisting

### Performance
 - Nextjs ISR works fine in this scope. Tweak simple revalidation interval based on how frequently we expect Screener create/update.
 - As complexity grows, consider tagging content for more granular data revalidation, or using webhooks to revalidate based on third party updates.
 - DB indexing, normalized caching, could be useful if searching/filtering larger number of screeners.

### Presentation/UX
 - I like CSS modules, especially with Tailwind4 for readability of responsive styling, but others may not. Discuss with team.
 - Theming with design team: general polish, split into shared and specific components, with custom or third party component library. I prefer lightweight, headless and tailwind based as is in fashion. Discuss with team. 
 - Some theme colors were taken from the Blueprint marketing site, but otherwise minimal theming
 - Design sucks - typography and vertical spacing are awful. Knowledge of the subject matter (and a designer) would lead to better presentation of meta data, visual grouping and information hierarchy.
 - Blank awkward space after last question. Could move buttons up, retain last question, or display complete message.
 - Navigation and home: starting point with some way to group and navigate through assessment screeners, possibly gating and/or curating screeners for specific users
 - Questions slider and results dialog are crude - clean spacing, alignment, transitions, interactions
 - Responsive - not using problematic css/js for mobile browsers, but very little responsive testing done. And text-size, layout etc.
 - Clean up html structure, css utility usage - got a little fast and loose with utilities inline vs in modules, usage of `<section>` where items evolved not to their own sections, etc.
 - Accessibility aria attrs, also helps in test/experiment element selection

### Analytics/Experimentation/Feature Flagging
Simple to begin with. I like Posthog because it covers web analytics, product analytics, CDP/event pipelines, warehouse, feature flagging, experiments all with significant cost savings over other common options, and will take a while to grow out of.

## Code I'm proud of
None of the code I've written in the last 5-7 years is public. Happy to discuss key parts. Some projects:
 - [NextMe](https://web.nextmeapp.com) - queue management
Nextjs/React, Laravel backend. Lead frontend engineer and contributing backend engineer. (Not the marketing site, just the app.)

 - [Plastiq](https://plastiq.com) - payments
React/Nodejs, WordPress, Segment/Braze/Snowflake/Salesforce - Architected GTM tech stack, multiple iterations of the marketing site as IC, built and managed a GTM tech and product eng team

 - [Hopelab](https://hopelab.org) - nonprofit mental health investment
Headless WordPress/Graphql/Nextjs/React - lead frontend engineer, contributing backend engineer, hired and managed contractors. (Excuse the design.)




