import { Range } from '@components/ui/range/range.tsx'
import { RotationIcon } from '@assets/rotation-icon.tsx'
import styles from './rotate-circular-line.module.css'
import type { ChangeEvent, FC } from 'react'
import { useState } from 'react'
import type { IRotateCircularLineProps } from './types'
import {Input} from "@components/ui";

/** Поворот кольцевой линии - ТОЛЬКО для круговых линий */

const RotateCircularLine: FC<IRotateCircularLineProps> = ({
  rotationAngleRef,
}) => {
  const [rotationAngle, setRotationAngle] = useState(0)

  const handleRotationChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newAngle = Number(e.target.value)
    setRotationAngle(newAngle)
    rotationAngleRef.current = newAngle * (Math.PI / 180)
  }

  const handleResetRotation = () => {
    setRotationAngle(0)
    rotationAngleRef.current = 0
  }

  return (
    <div style={{ marginBottom: '12px' }}>
      <Range
        onChange={handleRotationChange}
        value={rotationAngle}
        min={-180}
        max={180}
        step={1}
        placeholder={`Поворот: ${rotationAngle}°`}
        icon={<RotationIcon strokeColor={'#1185d8'} />}
      />
      <button onClick={handleResetRotation} className={styles.btn}>
        Сбросить поворот
      </button>
    </div>
  )
}

export { RotateCircularLine }
