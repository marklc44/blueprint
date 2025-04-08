import { getAllScreeners } from "@/api/screener"
import { getScreenerPage } from "@/actions"
import Form from "@/components/Form"
import Link from "next/link"
import { notFound } from 'next/navigation'
import { getDomains } from "@/api/response"
import { Section } from "@/types/screener"

export const revalidate = 60 // 86400 // daily
export const dynamicParams = true

export async function generateStaticParams() {
  const pages = await getAllScreeners()

  // @ts-expect-error TODO: ran out of time
  const params = pages.reduce((acc, curr) => {
    const { name, screenerSections } = curr
    if (!screenerSections) {
      return
    }
    if (screenerSections) {
      const sections = screenerSections.map((_, idx) => {
        const section = (idx + 1).toString()
        return {
          name,
          section,
        }
      })
      // @ts-expect-error TODO: ran out of time
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
  const page = await getScreenerPage(name.toUpperCase())
  const domains = await getDomains()

  if (!page) {
    return notFound()
  }
  const { name: screenerName, disorder, fullName, content } = page
  const sectionNum = parseInt(section)
  // @ts-expect-error TODO
  const contentSection: Section = content?.sections?.[sectionNum - 1]
  
  return (
    <article className={'relative'}>
      <section className={'screener-meta row bg-pale-gray'}>
        <div className={'row-inner'}>
          <h1 className="text-4xl"><span className="font-bold">{screenerName}</span> | {fullName}</h1>
          <div className={'header'}>
            <p><span className="font-bold">Disorder:</span> {disorder}</p>
          </div>
        </div>
      </section>
      <section className={'screener-section row'}>
        <div className={'row-inner'}>
          <section className={'instructions'}>
            <p>Assessment Screener Display Name: {content.displayName}</p>
            <h2 className={'text-2xl mb-2'}><span className="font-bold">Ask the patient: </span>{contentSection?.title}</h2>
          </section>
          <Form
            type={contentSection.type}
            questions={contentSection.questions}
            answers={contentSection.answers}
            screenerSectionId={contentSection.id}
            domains={domains}
          />
          <section className={'page-footer'}>
            {content.sections.length > sectionNum && (
              <Link className={'inline-block'}href={`/assessments/${name}/sections/${sectionNum + 1}`}>
                Next section &#12299;
              </Link>
            )}
          </section>
        </div>
      </section>
    </article>
  )
}