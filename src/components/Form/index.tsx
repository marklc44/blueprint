'use client'
import { Section, Content } from '@/types/screener'
import styles from './Form.module.css'
import ProgressBar from '../ProgressBar'
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import Question from '../Question'
import Slider from '../Slider'
import Slide from '../Slider/Slide'
import { submitScreenerResponse } from '@/actions'
import { calculateAssessments } from '@/utils/results'
import Results from '../Results'
import { Domain } from '@prisma/client'

export interface FormProps {
  type: Section['type']
  questions: Section['questions']
  answers: Section['answers']
  screenerSectionId: string
  domains: Array<Partial<Domain>>
}

const Form = ({
  type,
  questions,
  answers,
  screenerSectionId,
  domains,
}: FormProps) => {
  const [currIndex, setCurrIndex] = useState(0)
  const [formData, setFormData] = useState({})
  const [results, setResults] = useState<string[]>([])
  const [displayResults, setDisplayResults] = useState(false)
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null)

  useEffect(() => {
    console.log('results: ', results)
    console.log('questions: ', questions)
  }, [results, questions])

  const progress = useMemo(() => {
    return Array.isArray(questions) ? (currIndex / questions.length) * 100 : 0
  }, [currIndex, questions])

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault()
    
    const answers = Object.keys(formData).map((item) => {
      return {
        questionId: item,
        value: formData[item],
      }
    })
    const submission = {
      screenerSectionId,
      answers,
    }
    console.log('formatted data: ', submission)

    const results = calculateAssessments(submission, domains, questions)
    setResults(results)
    setDisplayResults(true)
    try {
      const res = await submitScreenerResponse(submission)
      // TODO: currently undefined, but storing correctly. Debug: app/api/responses/route.ts
      // then set response state to display a message that results have been saved or something went wrong
      console.log('res: ', res)
      setSavedSuccessMsg('Your answers have been saved!')
    } catch (error) {
      console.error(error)
      setSavedSuccessMsg('We were unable to save your answers. Please submit them again.')
    }

    // open results display
  }, [formData, screenerSectionId, domains, questions])

  // On completing an answer
  const handleNext = (questionId: string, value: number, idx: number) => {
    setCurrIndex(idx + 1)
    setFormData((prev) => {
      return {
        ...prev,
        [questionId]: value,
      }
    })
  }
  const handlePrev = () => {
    setCurrIndex(currIndex - 1)
  }
  const handleCloseResults = () => {
    setDisplayResults(false)
    setResults([])
    setCurrIndex(0)
    setFormData({})
    setSavedSuccessMsg(null)
  }

  useEffect(() => {
    console.log('formData: ', formData)
  }, [formData])
  
  return (
    <>
      <section className={styles['container']}> 
        <div className="mb-8">
          <ProgressBar progress={progress} />
        </div>
        <form className={styles['form']} onSubmit={(e) => handleSubmit(e)}>
          <Slider
            slideCount={questions.length}
            currSlideIndex={currIndex}
          >
            {questions.map((item, idx) => {
              return (
                <Slide
                  key={`slide-${idx}-question-${item.question_id}`}
                  slideCount={questions.length}
                >
                  <Question
                    index={idx}
                    question={item}
                    answers={answers}
                    type={type}
                    handleAnswer={handleNext}
                    handlePrev={handlePrev}
                  />
                </Slide>
              )
            })}
          </Slider>
          <div className="flex flex-row gap-4">
            {currIndex > 0 && <button className="button secondary" onClick={() => handlePrev()}>&laquo; back</button>}
            {currIndex >= questions.length && (
              <button className="button primary" type="submit">Submit Answers &raquo;</button>
            )}
          </div>
          
        </form>
      </section>
      {displayResults && <Results results={results} handleClose={handleCloseResults} message={savedSuccessMsg} />}
    </>
  )
}

export default Form