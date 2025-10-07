import { Line } from 'react-konva'
import { getPointOnCircleEdge } from '@components/stations/station/station.tsx'


interface StraightLineProps {
  id: string
  line: any
  fromStation: any
  toStation: any
  segment: any
}

export const StraightLine = ({ id, line, fromStation, toStation, segment }: StraightLineProps) => {
  // Рассчитываем точки для прямой линии с учетом радиусов станций
  const stationRadius = 14
  const offset = 4

  // Определяем вариант смещения для параллельных линий
  const variant = segment.variant || 'default'

  const fromEdge = getPointOnCircleEdge(fromStation, toStation, stationRadius)
  const toEdge = getPointOnCircleEdge(toStation, fromStation, stationRadius)

  // Вектор направления линии
  const dx = toStation.x - fromStation.x
  const dy = toStation.y - fromStation.y
  const length = Math.sqrt(dx * dx + dy * dy) || 1
  const nx = dx / length
  const ny = dy / length

  // Перпендикулярный вектор для смещения
  const px = -ny
  const py = nx

  // Применяем смещение в зависимости от варианта
  let actualOffset = 0
  if (variant === 'a') actualOffset = offset
  else if (variant === 'b') actualOffset = -offset

  const points = [
    fromEdge.x + px * actualOffset,
    fromEdge.y + py * actualOffset,
    toEdge.x + px * actualOffset,
    toEdge.y + py * actualOffset,
  ]

  return (
    <Line
      id={id}
      points={points}
      stroke={line.color}
      strokeWidth={4}
      lineCap="round"
      lineJoin="round"
      shadowColor="rgba(0,0,0,0.3)"
      shadowBlur={6}
      listening={false}
      perfectDrawEnabled={false}
    />
  )
}