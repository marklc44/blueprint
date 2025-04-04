'use client'
import StandardOptions from "../StandardOptions"
import styles from './Question.module.css'

export interface QuestionProps {
  question: any
  type: string
  answers: any
  handleAnswer: (id: string, value: number) => void
}

const StandardQuestion = ({ question, type, answers, handleAnswer }: QuestionProps) => {
  return (
    <section className={styles['container']}>
      <h3>{question.title}</h3>
      <StandardOptions answers={answers} handleClick={handleAnswer} />
    </section>
  )
}

export default StandardQuestion