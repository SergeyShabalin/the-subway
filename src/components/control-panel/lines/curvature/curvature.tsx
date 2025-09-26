import { type ChangeEvent, useEffect, useState } from 'react'
import type { ICurvatureProps } from './types.ts'
import styles from './curvature.module.css'

const Curvature = ({ activeLineId, curvatureRef }: ICurvatureProps) => {
  const [curvatureValue, setCurvatureValue] = useState(0)

  useEffect(() => {
    if (activeLineId !== null && curvatureRef?.current) {
      const currentCurvature =
        curvatureRef.current[activeLineId as number] ?? 50
      setCurvatureValue(currentCurvature)
    }
  }, [activeLineId, curvatureRef])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newCurvature = Number(e.target.value)
    setCurvatureValue(newCurvature)

    if (activeLineId === null || !curvatureRef?.current) return
    curvatureRef.current[activeLineId as number] = newCurvature
  }

  if (!activeLineId) return null

  return (
    <div className={styles.wrapper}>
      <span>Кривизна линии:</span>
      <input
        type="range"
        min="-300"
        max="300"
        step="1"
        value={curvatureValue}
        onChange={handleChange}
        className={styles.range}

      />
      <span className={styles.value} >{curvatureValue}</span>
    </div>
  )
}

export { Curvature }
