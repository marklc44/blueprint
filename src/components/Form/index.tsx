'use client'
import { Section, Content } from '@/types/screener'
import styles from './Form.module.css'
import ProgressBar from '../ProgressBar'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Question from '../Question'
import Slider from '../Slider'
import Slide from '../Slider/Slide'

/**
 * 
 * TODO: Calculate and display the results by domain as we go?
 */

export interface FormProps {
  type: Section['type']
  displayName: Content['display_name']
  questions: Section['questions']
  answers: Section['answers']
}

const Form = ({ type, displayName, questions, answers }: FormProps) => {
  const [currIndex, setCurrIndex] = useState(0)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    console.log('currIndex: ', currIndex)
  }, [currIndex])

  const progress = useMemo(() => {
    return Array.isArray(questions) ? (currIndex / questions.length) * 100 : 0
  }, [currIndex, questions])

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    
    const submitData = Object.keys(formData).map((item) => {
      return {
        question_id: item,
        value: formData[item],
      }
    })
    console.log('formatted data: ', submitData)
    // action to submit
    
    // open results display
  }, [formData])

  // On completing an answer
  const handleNext = (questionId, value, idx) => {
    console.log('value: ', value)
    // update slide index
    setCurrIndex(idx + 1)
    // update answer state
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

  useEffect(() => {
    console.log('formData: ', formData)
  }, [formData])
  
  return (
    <section className={styles['container']}>
      <ProgressBar progress={progress} />
      <div className={styles['form-meta']}>
        <p>Assessment Screener Display Name: {displayName}</p>
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