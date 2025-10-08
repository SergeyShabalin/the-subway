import { Line } from 'react-konva'
import type { FC } from 'react'
import type { MetroLine, Segment, Station } from '../../types'

interface DiameterLineProps {
  line: MetroLine
  segment: Segment
  fromStation: Station
  toStation: Station
}

export const DiameterLine: FC<DiameterLineProps> = ({ line, segment, fromStation, toStation }) => {
  const radius = 15
  const x1 = fromStation.x
  const y1 = fromStation.y
  const x2 = toStation.x
  const y2 = toStation.y

  const dx = x2 - x1
  const dy = y2 - y1
  const length = Math.sqrt(dx * dx + dy * dy)
  const nx = dx / length
  const ny = dy / length
  const px = -ny
  const py = nx
  const offset = 4

  const p1a = { x: x1 + nx * radius + px * offset, y: y1 + ny * radius + py * offset }
  const p2a = { x: x2 - nx * radius + px * offset, y: y2 - ny * radius + py * offset }
  const p1b = { x: x1 + nx * radius - px * offset, y: y1 + ny * radius - py * offset }
  const p2b = { x: x2 - nx * radius - px * offset, y: y2 - ny * radius - py * offset }

  return (
      <>
        <Line
            id={`line-${line.id}-${fromStation.id}-${toStation.id}-a`}
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
            id={`line-${line.id}-${fromStation.id}-${toStation.id}-b`}
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
