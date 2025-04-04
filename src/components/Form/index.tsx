'use client'
import { Section } from '@/types/screener'
import styles from './Form.module.css'
import ProgressBar from '../ProgressBar'
import { useMemo, useState } from 'react'

/**
 * 
 * TODO: Calculate and display the results by domain as we go?
 */

const Form = ({ questions, answers }: { questions: Section['questions'], answers: Section['answers'] }) => {
  const [currIndex, setCurrIndex] = useState(0)

  const progress = useMemo(() => {
    return Array.isArray(questions) ? (currIndex / questions.length) * 100 : 0
  }, [currIndex, questions])

  const handleSubmit = () => {
    //
  }
  // On completing an answer
  const handleNext = (questionId, value) => {
    setCurrIndex(currIndex + 1)
    // update answer state
  }
  const handlePrev = () => {
    setCurrIndex(currIndex - 1)
  }
  return (
    <section className={styles['container']}>
      <ProgressBar progress={progress} />
      <form className={styles['form']}></form>
    </section>
  )
}

export default Form