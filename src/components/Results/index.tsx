'use client'
import styles from './Results.module.css'

export interface ResultsProps {
  results?: string[]
  handleClose: () => void
}

const Results = ({ results, handleClose }: ResultsProps) => {
  return (
    <>
      <div className={styles['backdrop']} onClick={() => handleClose()}></div>
      <section className={styles['container']}>
        <h3 className={styles['title']}>Assessment Results</h3>
        <div className={styles['assessments']}>
          {results?.map((item: string) => {
            return <span key={`result-${item}`}>{item}</span>
          })}
        </div>
        <button className="button results" onClick={() => handleClose()}>Close</button>
      </section>
    </>
    
    
  )
}

export default Results