import styles from './ProgressBar.module.css'

const ProgressBar = ({ progress }: { progress: number }) => {
  return (
    <section className={styles['container']}>
      <div className={styles['outer']}>
        <div
          className={styles['inner']}
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </section>
  )
}

export default ProgressBar