import { Path } from 'react-konva'
import { useRef, useEffect, useCallback } from 'react'
import { recalcPath } from './utils/recalc-path.ts'
import type { Station } from '../../stations/station/types.ts'
import type { Line } from '../../../store/slices/metro-slices.ts'

interface CurvedLineProps {
  id: string
  line: Line
  fromStation: Station
  toStation: Station
  curvatureRef: React.MutableRefObject<Record<number, number>>
}

export const CurvedLine = ({ id, line, fromStation, toStation, curvatureRef }: CurvedLineProps) => {
  const pathRef = useRef<any>(null)

  // Функция для обновления пути
  const updatePath = useCallback(() => {
    if (pathRef.current) {
      const curvature = curvatureRef.current[line.id] ?? line.curvatureLines ?? 50

      // Сохраняем оригинальные координаты для быстрого пересчета
      pathRef.current.attrs.originalCoords = {
        from: fromStation,
        to: toStation,
        line: line,
        curvature: curvature
      }

      const newData = recalcPath(fromStation, toStation, line, curvature)
      pathRef.current.data(newData)
    }
  }, [fromStation, toStation, line, curvatureRef])

  // Инициализация и обновление при изменении позиций станций
  useEffect(() => {
    updatePath()
  }, [fromStation, toStation, updatePath])

  // Подписка на изменения кривизны через интервал (дешевле чем useEffect с зависимостью)
  useEffect(() => {
    const interval = setInterval(() => {
      if (pathRef.current && pathRef.current.attrs.originalCoords) {
        const currentCurvature = curvatureRef.current[line.id] ?? line.curvatureLines ?? 50
        const storedCurvature = pathRef.current.attrs.originalCoords.curvature

        // Обновляем только если кривизна изменилась
        if (currentCurvature !== storedCurvature) {
          const { from, to, line: storedLine } = pathRef.current.attrs.originalCoords
          const newData = recalcPath(from, to, storedLine, currentCurvature)
          pathRef.current.data(newData)
          pathRef.current.attrs.originalCoords.curvature = currentCurvature
          pathRef.current.getLayer()?.batchDraw()
        }
      }
    }, 16) // ~60 FPS

    return () => clearInterval(interval)
  }, [line.id, line.curvatureLines, curvatureRef])

  return (
    <Path
      id={id}
      ref={pathRef}
      stroke={line.color}
      strokeWidth={4}
      lineCap="round"
      lineJoin="round"
      shadowColor="rgba(0,0,0,0.3)"
      shadowBlur={6}
      listening={false} // ✅ Отключаем обработку событий для повышения производительности
    />
  )
}