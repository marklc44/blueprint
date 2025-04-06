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
The application uses a LibSQL database hosted on Turso managed hosting with the API layer build with Prisma ORM and Next.js server actions. The frontend is built on Next.js routing with React, and the entire app is hosted on Vercel. The entire application is written in TypeScript, using TailwindCSS for styling.

Github hosts the codebase repo with two branches, main and develop, that align with Vercel production and preview environments respectively. Github actions could be included to run prebuild unit tests, but are not here.

Generally, the tech stack choices were made for a small scope with fast development, no cost and reliability.

### Database
See `prisma/schema.prisma`
A relational SQLite database with 6 tables: User (not strictly required), Screener, Question, ScreenerResponse, Answer, Domain. The convention with Prisma is to use singular models, but these could easily be plural. Prisma makes it very fast to design a schema, connect to local and external databases, create and run migrations in multiple environments, is easy to understand and maintain, and provides some guardrails against common antipatterns for someone like me who doesn't design databases on a regular basis.

In production, the DB is hosted on Turso. In hindsight, I might have used MySQL/MariaDb because a Json field in Turso is trickier to work with, but Prisma makes it easy to switch. I'm  less experienced with nosql document dbs, so would be curious if a more experienced person would have gone that route. Also curious about Drizzle vs Prisma or other ORM suggestions.

Tbh, the requirement for screener Json structure which did not include the domain along with the questions gave me the most pause. In person, I would ask why domain was not included. If it were, that json doc would be the single source of truth for a questionnaire without requiring a model for a question which would benefit performance and maybe point more toward a nosql implementation. I'm not familiar enough with screeners to know whether the intent was that an admin be able to mix and match questions to create screeners like other form/custom field builders, or there are existing frontends relying on that format, etc. Curious to know if the json structure was intended to be a hard requirement and why.

### API design
- getAllScreeners - Get all screeners for page routing
- getScreenerByName - Get screener by name. If use cases arise, could add general getScreener, taking more query params, but for now, simple. Question/domain mapping is returned with the screener in one call with include. Could be more performant if question domain were included in screener Json questions.
- storeScreenerResponse - store answers in the db. At some point, would want to relate this to a therapist/company and a user filling out the response.
getDomains - get domain scoring rules and assessment mapping for calculating results.

### Business logic/controllers
- fetchScreener - Takes a screener name which comes from page route params. For that reason, the name is unique in the schema - if that is not possible, then switch to using the ID in routing. Gets and transforms screener and question domain mapping. As above, the transformation could be potentially unnecessary.
- submitScreenerResponse - Takes the screener response and domain rules. Stores the answers and calculates the results. Additional util for calculating the results from domain and answers.

### Routing
 - Using Next.js as the industry standard router recommended by the React team, and lots of developers know it. 
 - App router used to take advantage of caching and Incremental Static Regeneration, avoid writing API routes. 
 - The data is relatively static, and can be cached, currently refreshed daily.
 - Route parameter pattern `/assessments/[name]/section/[section]` where name is the `sreener.name` string and section is an integer aligned with the index of the section in the `screener.content.sections` array.
 - If a screener has multiple sections, a link to the next section is presented at the bottom of the page

### Assessments Page
Async server component that handles page params, fetches a single screener, displays screener meta data and passes question data to the form.

### Form
Multistep form client component using React and `react-hook-form` to simplify form field state management and potential validation. Each question is revealed via transition like a carousel. 
 - Form Component - The form is a client component because it is interactive on the client using effects and react state to navigate and submit results. The form component handles the state, field transitions and submission. Submission is handled via ajax to showcase my ability to do that, but could be done with a form action and page change to a results page. Form is uncontrolled
 - Field Component - the field component is a reusable presentation for questions that behaves as the form component tells it to. It contains a hidden number field to record results so the form data can be submitted via action. 
 - Options Component - displays the options for this field type. In the real world, there might be different field types, and prop for type pulling different types of fields or options.

### Progress Bar
From the total number of fields and the array index of each field (array index is a safe order because field order is included in the screener json), calculate progress (in the form component) and pass to the progress bar to update its inner length.

### Results
After answers are stored and assessment is calculated, display the results in a dialog overlaid on the page.


## To be production ready
A lot of this includes "discuss with team" because it's important to incorporate other ideas and build a prod app in a way the team can be productive. I'm assuming this app is going to part of or used in conjunction with other product offerings.

### Workflow
 - Where on the CI/CD spectrum do we want start?
 - Git Workflow (start), Github Workflow, variants
 - Communication - deployment channels, PR/MR templates, hotfix and patch process, etc.
 - Integrate with project management workflow, Agile, Scrum, etc.

### Testing
 - Unit test all utilities and API. Jest, Vitest or other team suggestion. Vitest can cause issues with Vercel Analytics. Hook into Github actions for build tests.
 - Component testing is not required for this scope, but if the roadmap indicates a component library will be helpful, consider Storybook as way to hook into component testing with other tools and create docs. And/or React Testing Library.
 - Add E2E when complexity of data states can no longer be modeled well enough modularly (Playwright is great)

### Logging/Observability
 - Sentry can handle all needs for prod launch. Might even be able to get away with just Vercel Logs for a bit as data fetching will be serverside and cached. 
 - Further tooling and analysis with Splunk, New Relic, etc. to consider.

### Add Users and Auth?
 - Someone will want to know who did what, store results or integrate with other systems at some point.
 - Auth service like Clerk or Supabase, or custom. 
 - Stateful sessions stored in DB are most secure, but could use bearer tokens.

### Performance
 - Nextjs ISR works fine in this scope. Tweak simple revalidation interval based on how frequently we expect Screener create/update.
 - As complexity grows, consider tagging content for more granular data revalidation, or using webhooks to revalidate based on third party updates.
 - DB indexing, normalized caching, could be useful if searching/filtering larger number of screeners.

### Presentation
 - Downgraded to Tailwindcss 3.4 because 4 is a breaking change that requires investigation. Possibly move to 4 for build perf and other goodies, but discuss tradeoffs in complexity with team. Tailwind is not a requirement.
 - I like CSS modules, especially with Tailwind for readability of responsive styling. Discuss with team.
 - Consider theming with design team: component library (headless and tailwind based is in fashion, light weight and easy to employ modularly, or custom). 
 - Flesh out CSS vars and/or theme config
 - Navigation and home: starting point with some way to group and navigate through assessment screeners, possibly gating and/or curating screeners for specific users

### Analytics/Experimentation/Feature Flagging
Simple to begin with. I like Posthog because it covers web analytics, product analytics, CDP/event pipelines, warehouse, feature flagging, experiments all with significant cost savings over other common options, and will take a while to grow out of.

## Code I'm proud of
None of the code I've written in the last 5-7 years is public. Take from that what you will. Some projects:
[NextMe](https://web.nextmeapp.com) - queue management
Nextjs/React, Laravel backend. Lead frontend engineer and contributing backend engineer. (Not the marketing site, just the app)

[Plastiq](https://plastiq.com) - payments
React/Nodejs, WordPress, Segment/Braze/Snowflake/Salesforce - Architected GTM tech stack, multiple iterations of the marketing site as IC, built and managed a GTM tech and product eng team

[Hopelab](https://hopelab.org) - nonprofit mental health investment
Headless WordPress/Graphql/Nextjs/React - lead frontend engineer, contributing backend engineer, hired and managed contractors. (Please excuse the design)




