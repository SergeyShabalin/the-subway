
import type { ChangeEvent, ReactNode } from 'react'
import styles from './range.module.css'

export interface IRangeProps {
  value: number
  onChange:  (e: ChangeEvent<HTMLInputElement>) => void
  icon: ReactNode
  placeholder: string
}

const Range = ({ value, onChange, icon, placeholder }: IRangeProps) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.placeholder}>{placeholder}</span>

      <div className={styles.combo}>
        <div className={styles.icon}> {icon}</div>

        <input
          type="range"
          min="5"
          max="2000"
          step="20"
          value={value}
          onChange={onChange}
          className={styles.input}

        />
        <span className={styles.value}>{Math.round(value)}</span>
      </div>

    </div>
  )
}

export { Range }
