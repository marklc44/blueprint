import { getAllScreeners, getScreenerByName } from "@/api/screener"
import { getScreenerPage } from "@/actions"
import Form from "@/components/Form"
import { ScreenerJson } from "@/types/screener"
import Link from "next/link"
import { notFound } from 'next/navigation'

export const revalidate = 60 // 86400 // daily
export const dynamicParams = true

export async function generateStaticParams() {
  const pages = await getAllScreeners()
  // console.log('pages: ', pages[0].screenerSections[0])

  const params = pages.reduce((acc, curr) => {
    const { name, screenerSections } = curr
    if (!screenerSections) {
      return
    }
    if (screenerSections) {
      const sections = screenerSections.map((_, idx) => {
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
  const page = await getScreenerPage(name.toUpperCase())

  if (!page) {
    return notFound()
  }
  const { name: screenerName, disorder, fullName, content } = page
  const sectionNum = parseInt(section)
  const contentSection = content?.sections?.[sectionNum - 1]
  
  return (
    <article>
      <section className={'screener-meta row bg-pale-gray'}>
        <div className={'row-inner'}>
          <h1>{screenerName}</h1>
          <div className={'header'}>
            <p>Full Name: {fullName}</p>
            <p>Disorder: {disorder}</p>
          </div>
        </div>
      </section>
      <section className={'screener-section row'}>
        <div className={'row-inner'}>
          <section className={'instructions'}>
            <h2 className={'text-2xl mb-4'}><span className="font-bold">Ask the patient: </span>{contentSection?.title}</h2>
          </section>
          <Form type={contentSection.type} displayName={content.displayName} questions={contentSection.questions} answers={contentSection.answers} />
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