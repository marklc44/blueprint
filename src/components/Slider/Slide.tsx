import { ReactNode } from 'react'
import styles from './Slider.module.css'

export interface SlideProps {
  children: ReactNode
  slideCount: number
}

const Slide = ({ children, slideCount }: SlideProps) => {
  return (
    <div
      className={styles['slide']}
      style={{
        width: `${100 / slideCount}%`,
        flexBasis: `${100 / slideCount}%`,
      }}
    >{children}</div>
  )
}

export default Slide