import { Line } from 'react-konva'
import type { FC } from 'react'
import type { MetroLine, Segment, Station } from '../../store/types' // ← Уточни путь!

export const DiameterLine: FC<{
  line: MetroLine
  segment: Segment
  fromStation: Station
  toStation: Station
}> = ({ line, segment, fromStation, toStation }) => {
  const radius = 12 // радиус станции (должен соответствовать Circle в Station)
  const x1 = fromStation.x
  const y1 = fromStation.y
  const x2 = toStation.x
  const y2 = toStation.y

  // Направляющий вектор
  const dx = x2 - x1
  const dy = y2 - y1
  const length = Math.sqrt(dx * dx + dy * dy)

  // Нормализованный направляющий вектор
  const nx = dx / length
  const ny = dy / length

  // Перпендикулярный вектор
  const px = -ny
  const py = nx

  const offset = 4 // расстояние между двумя линиями

  // Смещение точек на радиус от центра станции
  const p1a = {
    x: x1 + nx * radius + px * offset,
    y: y1 + ny * radius + py * offset,
  }
  const p2a = {
    x: x2 - nx * radius + px * offset,
    y: y2 - ny * radius + py * offset,
  }

  const p1b = {
    x: x1 + nx * radius - px * offset,
    y: y1 + ny * radius - py * offset,
  }
  const p2b = {
    x: x2 - nx * radius - px * offset,
    y: y2 - ny * radius - py * offset,
  }

  return (
    <>
      <Line
        key={`${line.id}-${segment.fromStationId}-${segment.toStationId}-a`}
        points={[p1a.x, p1a.y, p2a.x, p2a.y]}
        stroke={line.color}
        strokeWidth={1.2}
        lineCap="round"
        lineJoin="miter"
        shadowColor="rgba(0,0,0,0.2)"
        shadowBlur={3}
        globalAlpha={0.8}
      />
      <Line
        key={`${line.id}-${segment.fromStationId}-${segment.toStationId}-b`}
        points={[p1b.x, p1b.y, p2b.x, p2b.y]}
        stroke={line.color}
        strokeWidth={1.2}
        lineCap="round"
        lineJoin="miter"
        shadowColor="rgba(0,0,0,0.2)"
        shadowBlur={3}
        globalAlpha={0.8}
      />
    </>
  )
}