import { type ChangeEvent, useEffect, useState } from 'react'
import type { ICircleRadiusProps } from './types.ts'
import styles from './circle-radius.module.css'

const CircleRadius = ({ activeLineId, circleRadiusRef }: ICircleRadiusProps) => {
  const [radiusValue, setRadiusValue] = useState(0)

  useEffect(() => {
    if (activeLineId !== null && circleRadiusRef?.current) {
      const currentRadius = circleRadiusRef.current
      setRadiusValue(currentRadius)
    }
  }, [activeLineId, circleRadiusRef])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newRadius = Number(e.target.value)
    setRadiusValue(newRadius)

    if (activeLineId === null || !circleRadiusRef?.current) return
    circleRadiusRef.current = newRadius
  }

  if (!activeLineId) return null

  return (
    <div className={styles.wrapper}>
      <span>Радиус кольцевой линии:</span>
      <input
        type="range"
        min="50"
        max="1000"
        step="2"
        value={radiusValue}
        onChange={handleChange}
        className={styles.range}
      />
      <span className={styles.value}>{Math.round(radiusValue)} px</span>
    </div>
  )
}

export { CircleRadius }