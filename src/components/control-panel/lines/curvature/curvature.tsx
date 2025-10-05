import { type ChangeEvent, useEffect, useState } from 'react'
import type { ICurvatureProps } from './types.ts'
import styles from './curvature.module.css'
import { Range } from '@components/ui/range/range.tsx'
import { RadiusIcon } from '@assets/radius-icon.tsx'
import { CurvatureIcon } from '@assets/curvature-icon.tsx'

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
    <Range
      onChange={handleChange}
      value={curvatureValue}
      placeholder="Кривизна линии"
      icon={<CurvatureIcon strokeColor={'#1eda8c'} />}
      min={-300}
      max={300}
      step={1}
    />
  )
}

export { Curvature }
