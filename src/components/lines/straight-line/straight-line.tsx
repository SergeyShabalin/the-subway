import { Line } from 'react-konva'
import { useRef, useEffect } from 'react'
import type { MetroLine, Segment, Station } from '../../types'

interface StraightLineProps {
  id: string
  line: MetroLine
  segment: Segment
  fromStation: Station
  toStation: Station
  radiusStation?: number
}

export const StraightLine = ({
                               id,
                               line,
                               segment,
                               fromStation,
                               toStation,
                               radiusStation = 12+1
                             }: StraightLineProps) => {
  const lineRef = useRef<any>(null)

  const getPointOnCircleTowardsTarget = (
    center: { x: number; y: number },
    target: { x: number; y: number },
    radiusStation: number
  ) => {
    const dx = target.x - center.x
    const dy = target.y - center.y
    const len = Math.sqrt(dx * dx + dy * dy)

    let dirX = 1, dirY = 0

    if (len !== 0) {
      dirX = dx / len
      dirY = dy / len
    }

    return {
      x: center.x + dirX * radiusStation,
      y: center.y + dirY * radiusStation
    }
  }

  const recalcLine = () => {
    const p1 = { x: fromStation.x, y: fromStation.y }
    const p2 = { x: toStation.x, y: toStation.y }

    const start = getPointOnCircleTowardsTarget(p1, p2, radiusStation)
    const end = getPointOnCircleTowardsTarget(p2, p1, radiusStation)

    return [start.x, start.y, end.x, end.y]
  }

  useEffect(() => {
    const points = recalcLine()
    if (lineRef.current) {
      lineRef.current.points(points)
      lineRef.current.getLayer()?.batchDraw()
    }
  }, [
    fromStation.x,
    fromStation.y,
    toStation.x,
    toStation.y,
    radiusStation
  ])

  return (
    <Line
      id={id}
      ref={lineRef}
      points={recalcLine()}
      stroke={line.color}
      strokeWidth={4}
      lineCap="square"
      lineJoin="miter"
      shadowColor="rgba(0,0,0,0.2)"
      shadowBlur={5}
    />
  )
}