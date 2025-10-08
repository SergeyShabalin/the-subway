import { type ChangeEvent, useEffect, useState } from 'react'
import type { ICurvatureProps } from './types.ts'
import { Range } from '@components/ui/range/range.tsx'
import { CurvatureIcon } from '@assets/curvature-icon.tsx'
import { useMetro } from '@/store/hooks/use-metro.ts'

const Curvature = ({ activeLineId, curvatureRef }: ICurvatureProps) => {
  const { metroNetwork, actions: metroActions } = useMetro()
  const [curvatureValue, setCurvatureValue] = useState(50)

  // Находим активную линию
  const activeLine = activeLineId
    ? metroNetwork.find(line => line.id === activeLineId)
    : null

  // Инициализируем кривизну из данных линии при выборе
  useEffect(() => {
    if (activeLineId && activeLine) {
      // Берем кривизну из данных линии или используем значение по умолчанию
      const lineCurvature = activeLine.curvatureLines ?? 50
      setCurvatureValue(lineCurvature)

      // Обновляем ref
      curvatureRef.current[activeLineId] = lineCurvature
    }
  }, [activeLineId, activeLine, curvatureRef])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!activeLineId) return

    const newCurvature = Number(e.target.value)
    setCurvatureValue(newCurvature)

    // Обновляем ref для мгновенного отображения
    curvatureRef.current[activeLineId] = newCurvature

    // Сохраняем в store для персистентности
    metroActions.updateLineCurvature(activeLineId, newCurvature)
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