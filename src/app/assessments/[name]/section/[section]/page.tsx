import { getAllScreeners, getScreenerByName } from "@/api/screener"
import Form from "@/components/Form"
import { ScreenerJson } from "@/types/screener"
import Link from "next/link"

export const revalidate = 60 // 86400 // daily
export const dynamicParams = true

export async function generateStaticParams() {
  const pages = await getAllScreeners()
  const params = pages.reduce((acc, curr) => {
    const { name } = curr
    const screenerJson = curr.screenerJson
    if (!screenerJson) {
      return
    }
    if (screenerJson) {
      const screener: ScreenerJson = screenerJson
      const sections = screener.content.sections.map((_, idx) => {
        return {
          name,
          section: idx.toString(),
        }
      })
      return acc.concat(sections)
    }
    
  }, [])
  
  return params
}

export interface PageName {
  name: string
  section: string
}

export default async function AssessmentPage({ params }: { params: PageName }) {
  const { name, section } = await params
  const page = await getScreenerByName(name)
  const screenerJson = page?.screenerJson as ScreenerJson
  const { name: screenerName, disorder, full_name, content } = screenerJson
  console.log('content: ', content)

  // TODO: handle multiple possible sections
  // move through screener sections with a different transition than questions
  const sectionNum = parseInt(section)
  console.log('sectionNum: ', sectionNum)
  console.log('content: ', content.sections[sectionNum - 1])
  const contentSection = content?.sections?.[sectionNum - 1]
  
  
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
        <h2>Ask the patient: {contentSection?.title}</h2>
      </section>
      <Form questions={contentSection.questions} answers={contentSection.answers} />
      <section className={'page-footer'}>
        {content.sections.length > sectionNum && (
          <Link className={'inline-block'}href={`/assessments/${name}/sections/${sectionNum + 1}`}>
            Next section &#12299;
          </Link>
        )}
      </section>
    </section>
    

    

  </div>
}