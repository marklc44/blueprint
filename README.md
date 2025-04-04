# Submission for Blueprint.ai fullstack exercise
Candidate: Mark Centoni
Position: Software Engineer (Growth)
Github: https://github.com/marklc44
Site: https://markcentoni.com

Application demo: https://assessements.vercel.app/
There's a redirect that will take you directly to the screener page, but could potentially display a list of links to multiple screeners on home instead.

---

## Problem
The exercise is to create a full stack application that presents a user with a mental healthdiagnostic screening questionnaire to help determine the severity of symptoms they may be experiencing, and aid a trained therapist in creating a treatment plan. Using questions categorized by domain along with domain scoring rules, the questionnaire response is converted to 0 or more evidence-based Level-2 assessments.

## The solution
The application uses a LibSQL database hosted on Turso managed hosting with the API layer build with Prisma ORM and Next.js server actions. The frontend is built on Next.js routing with React, and the entire app is hosted on Vercel. The entire application is written in TypeScript, using TailwindCSS for styling.

Github hosts the codebase repo with two branches, main and develop, that align with Vercel production and preview environments respectively. Github actions could be included to run prebuild unit tests, but are not here.

Generally, the tech stack choices were made for a small scope with fast development, no cost and reliability.

### Database design
See `prisma/schema.prisma`
A relational database with 6 tables: User (not strictly required), Screener, Question, ScreenerResponse, Answer, Domain. The convention with Prisma is to use singular models, but these could easily be plural. Prisma makes it very fast to design a schema, connect to local and external databases, create and run migrations in multiple environments, is easy to understand and maintain, and provides some guardrails against common antipatterns for someone like me who doesn't design databases on a regular basis.

Tbh, the requirement for screener Json structure which did not include the domain along with the questions gave me the most pause. If it were in person, I would ask why domain was not included. If it were, that json doc would be the single source of truth for a questionnaire without requiring a model for a question which would benefit performance and maybe point more toward a nosql implementation. I'm not familiar enough with screeners to know whether the intent was that an admin be able to mix and match questions to create screeners like other form/custom field builders, or there are existing frontends relying on that delivery structure, etc. Curious to know if the json structure was intended to be a hard requirement and why.

### API design
- getAllScreeners - Get all screeners for page routing
- getScreenerByName - Get screener by name. If use cases arise, could generalize this to getScreener, taking more query params, but for now, simple. Question/domain mapping is returned with the screener in one call with include. Could be more performant if question domain were included in screener Json questions.
- storeScreenerResponse - store answers in the db. At some point, would want to relate this to a therapist/company and a user filling out the response.
getDomains - get domain scoring rules and assessment mapping for calculating results.

### Business logic/controllers
- fetchScreener - Takes a screener name which comes from page route params. For that reason, the name is unique in the schema - if that is not possible, then switch to using the ID in routing. Gets and transforms screener and question domain mapping. As above, the transformation could be potentially unnecessary.
- submitScreenerResponse - Takes the screener response and domain rules. Stores the answers and calculates the results. Additional util for calculating the results from domain and answers.

### Routing
Using Next.js as the industry standard router recommended by the React team, and lots of developers know it. App router used so we don't have to write API routes, and since the data is relatively static, the pages and data can be statically rendered for performance, server rendered on revalidation and still allow client interactivity in the page's child components as needed.
Nested under assessments/ with a route parameter for the assessmentName field from the schema for potentially presenting a list of different assessments that could later be curated/gated by permission or assignment. Home page is a simple list of assessment links. Data for route params is pulled in generateStaticParams, which returns an array of params objects, each with a name key.

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
After answers are stored and assessment is calculated, display the results.






