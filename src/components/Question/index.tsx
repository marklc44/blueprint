'use client'
import type { Section, ScreenerQuestion } from "@/types/screener"
import StandardOptions from "../StandardOptions"
import styles from './Question.module.css'

export interface QuestionProps {
  index: number
  question: ScreenerQuestion
  type: Section['type']
  answers: Section['answers']
  handleAnswer: (id: string, value: number, idx: number) => void
  handlePrev: () => void
}

const Question = ({
  index,
  question,
  type,
  answers,
  handleAnswer
}: QuestionProps) => {

  return (
    <section className={styles['container']}>
      <h3 className={styles['title']}>{question.title}</h3>
      <input type="hidden" name={question.question_id} />
      {/** TODO: handle other answer types */}
      {type === 'standard' && (
        <StandardOptions
          answers={answers}
          handleClick={(value) => {
            handleAnswer(question.questionId, value, index)
          }}
        />
      )}
    </section>
  )
}

export default Question