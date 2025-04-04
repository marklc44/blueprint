import { getAllScreeners, getScreenerByName } from "@/api/screener"
import Form from "@/components/Form"
import { ScreenerJson } from "@/types/screener"
import { Prisma } from "@prisma/client"

export const revalidate = 60 // 86400 // daily
export const dynamicParams = true

export async function generateStaticParams() {
  const pages = await getAllScreeners()
  const params = pages.map((page) => {
    const { name } = page
    return {
      name: name.toLowerCase(),
    }
  })
  
  return params
}

export interface PageName {
  name: string
}

export default async function AssessmentPage({ params }: { params: PageName }) {
  const { name } = await params
  const page = await getScreenerByName(name)
  const screenerJson = page?.screenerJson as ScreenerJson
  const { name: screenerName, disorder, full_name, content } = screenerJson
  console.log('content: ', content)

  // TODO: handle multiple possible sections
  // move through screener sections with a different transition than questions
  const section1 = content?.sections?.[0]
  
  return <div>
    <section className={'screener-meta'}>
      <h1>{screenerName}</h1>
      <div className={'header'}>
        <p>Full Name: {full_name}</p>
        <p>Disorder: {disorder}</p>
      </div>
    </section>
    <section className={'screener-section'}>
      <section className={'instructions'}>
        <h2>Ask the patient: {section1?.title}</h2>
      </section>
      <Form questions={section1.questions} answers={section1.answers} />
      {/**
       * TODO: for multiple possible content sections, consider adding Next Section (section title)
       * Next Section would link to another the next content section in the screener
       * If so, add the section # to routing
       */}
    </section>
    

    

  </div>
}