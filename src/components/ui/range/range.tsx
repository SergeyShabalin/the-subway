import { type ChangeEvent, type ReactNode, useState } from 'react'
import styles from './range.module.css'
import { ArrowIcon } from '@assets/arrow-icon.tsx'

export interface IRangeProps {
  value: number
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  icon: ReactNode
  placeholder: string
  min: number
  max: number
  step: number
}

const Range = ({ value, onChange, icon, placeholder, min, max, step }: IRangeProps) => {
  const [isOpen, setIsOpen] = useState(false) // по умолчанию закрыто

  const toggleOpenCloseHandler = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.placeholder} ${isOpen ? styles.placeholderActive : ''}`}
        onClick={toggleOpenCloseHandler}
      >
        {placeholder}
       <div className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ''}`}><ArrowIcon strokeColor={'gray'} /> </div>
      </div>

      <div className={`${styles.combo} ${isOpen ? styles.comboOpen : ''}`}>
        <div className={styles.comboContent}>
          <div className={styles.icon}>{icon}</div>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            className={styles.input}
          />
          <span className={styles.value}>{Math.round(value)}</span>
        </div>
      </div>
    </div>
  )
}
export { Range }