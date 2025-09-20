
import { Path } from 'react-konva'
import type { MetroLine, Segment, Station } from '../../types'


interface CurvedLineProps {
  line: MetroLine
  segment: Segment
  fromStation: Station
  toStation: Station
}

export const CurvedLine = ({ line, segment, fromStation, toStation  }: CurvedLineProps) => {

  const curvature = line.curvatureLines ?? 50
  const p1 = { x: fromStation.x, y: fromStation.y }
  const p2 = { x: toStation.x, y: toStation.y }



  const midX = (p1.x + p2.x) / 2
  const midY = (p1.y + p2.y) / 2

  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  const length = Math.sqrt(dx * dx + dy * dy)

  if (length === 0) return null

  const perpX = -dy / length
  const perpY = dx / length



  const control = {
    x: midX + perpX * curvature,
    y: midY + perpY * curvature,
  }

  const getPointOnCircleTowardsControl = (
    center: { x: number; y: number },
    ctrl: { x: number; y: number },
    radius: number
  ) => {
    const dx = ctrl.x - center.x
    const dy = ctrl.y - center.y
    const len = Math.sqrt(dx * dx + dy * dy)
    if (len === 0) return center

    const unitX = dx / len
    const unitY = dy / len

    return {
      x: center.x + unitX * radius,
      y: center.y + unitY * radius,
    }
  }

  const startOnCircle = getPointOnCircleTowardsControl(p1, control, 12+1)
  const endOnCircle = getPointOnCircleTowardsControl(p2, control, 12+1)

  const pathData = `M ${startOnCircle.x},${startOnCircle.y} Q ${control.x},${control.y} ${endOnCircle.x},${endOnCircle.y}`

  return (
    <Path
      key={`${line.id}-${segment.fromStationId}-${segment.toStationId}`}
      data={pathData}
      stroke={line.color}
      strokeWidth={4}

      lineCap="round"
      lineJoin="round"
      shadowColor="rgba(0,0,0,0.3)"
      shadowBlur={6}
    />
  )
}