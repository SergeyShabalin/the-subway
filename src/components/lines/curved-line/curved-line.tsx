import { Path } from 'react-konva'
import { useRef, useEffect } from 'react'
import type { MetroLine, Segment, Station } from '../../types'

interface CurvedLineProps {
  id: string
  line: MetroLine
  segment: Segment
  fromStation: Station
  toStation: Station
  dragOffsetsRef?: React.MutableRefObject<Record<number, { x: number; y: number }>>
}

export const CurvedLine = ({ id, line, segment, fromStation, toStation, dragOffsetsRef }: CurvedLineProps) => {
  const pathRef = useRef<any>(null)

  const recalcPath = () => {
    const dxFrom = dragOffsetsRef?.current?.[fromStation.id]?.x ?? 0
    const dyFrom = dragOffsetsRef?.current?.[fromStation.id]?.y ?? 0
    const dxTo = dragOffsetsRef?.current?.[toStation.id]?.x ?? 0
    const dyTo = dragOffsetsRef?.current?.[toStation.id]?.y ?? 0

    const p1 = { x: fromStation.x + dxFrom, y: fromStation.y + dyFrom }
    const p2 = { x: toStation.x + dxTo, y: toStation.y + dyTo }

    const midX = (p1.x + p2.x) / 2
    const midY = (p1.y + p2.y) / 2

    const dx = p2.x - p1.x
    const dy = p2.y - p1.y
    const length = Math.sqrt(dx * dx + dy * dy)
    if (length === 0) return ''

    const perpX = -dy / length
    const perpY = dx / length
    const curvature = line.curvatureLines ?? 50

    const control = { x: midX + perpX * curvature, y: midY + perpY * curvature }

    const getPointOnCircleTowardsControl = (center: { x: number; y: number }, ctrl: { x: number; y: number }, radius: number) => {
      const dx = ctrl.x - center.x
      const dy = ctrl.y - center.y
      const len = Math.sqrt(dx * dx + dy * dy)
      if (len === 0) return center
      return { x: center.x + (dx / len) * radius, y: center.y + (dy / len) * radius }
    }

    const start = getPointOnCircleTowardsControl(p1, control, 13)
    const end = getPointOnCircleTowardsControl(p2, control, 13)

    return `M ${start.x},${start.y} Q ${control.x},${control.y} ${end.x},${end.y}`
  }

  useEffect(() => {
    if (pathRef.current) {
      pathRef.current.attrs.originalCoords = {
        from: fromStation,
        to: toStation,
        curvature: line.curvatureLines ?? 50
      }
      pathRef.current.data(recalcPath())
      pathRef.current.getLayer()?.batchDraw()
    }
  }, [fromStation, toStation, line, dragOffsetsRef])

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
    />
  )
}
