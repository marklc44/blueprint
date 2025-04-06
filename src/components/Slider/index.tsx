import { ReactNode } from 'react'
import styles from './Slider.module.css'

export interface SliderProps {
  children: ReactNode
  slideCount: number
  currSlideIndex: number
}

const Slider = ({ children, slideCount, currSlideIndex }: SliderProps) => {
  return (
    <div className={styles['slider']} style={{
      width: `${slideCount * 100}%`,
      transform: `translateX(-${currSlideIndex > 0 ? currSlideIndex * (100 / slideCount) : 0}%)`,
    }}>
      {children}
    </div>
  )
}

export default Slider