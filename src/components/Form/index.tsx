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

/**
 * 
 * TODO: Calculate and display the results by domain as we go?
 */

export interface FormProps {
  type: Section['type']
  displayName: Content['display_name']
  questions: Section['questions']
  answers: Section['answers']
  screenerSectionId: string
  domains: any
}

const Form = ({
  type,
  displayName,
  questions,
  answers,
  screenerSectionId,
  domains,
}: FormProps) => {
  const [currIndex, setCurrIndex] = useState(0)
  const [formData, setFormData] = useState({})
  const [results, setResults] = useState([])

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
    // action to submit
    // calcualte results
    const results = calculateAssessments(submission, domains)
    setResults(results)
    // try {
    //   const res = await submitScreenerResponse(submission)

    // } catch (error) {
    //   console.error(error)
    // }

    // open results display
  }, [formData, screenerSectionId, domains])

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
    // setResults([])
  }

  useEffect(() => {
    console.log('formData: ', formData)
  }, [formData])
  
  return (
    <section className={styles['container']}>
      <div className={styles['form-meta']}>
        <p>Assessment Screener Display Name: {displayName}</p>
      </div>
      <ProgressBar progress={progress} />
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
                {idx > 0 && <button onClick={() => handlePrev()}>&laquo; back</button>}
              </Slide>
            )
          })}
        </Slider>
        {currIndex >= questions.length && (
          <button type="submit">Submit Answers</button>
        )}
      </form>
    </section>
  )
}

export default Form