import { Section } from "@/types/screener"
import styles from './StandardOptions.module.css'

export interface OptionsProps {
  answers: Section['answers']
  handleClick: (id: string) => void
}

export const StandardOptions = ({ answers, handleClick }: OptionsProps) => {
  return (
    <ul className={styles['container']}>
      {answers?.map((item) => {
        return (
          <li key={`answer-${item.title}`} className={styles['option']}>
            <p>{item.value}: {item.title}</p>
          </li>
        )
      })}
    </ul>
  )
}

export default StandardOptions