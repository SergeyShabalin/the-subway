import { Line } from 'react-konva'
import { useRef, useEffect } from 'react'
import type { MetroLine, Segment, Station } from '../../types'

interface StraightLineProps {
  id: string
  line: MetroLine
  segment: Segment
  fromStation: Station
  toStation: Station
  dragOffsetsRef?: React.MutableRefObject<Record<number, { x: number; y: number }>>
  radius?: number
}

export const StraightLine = ({
                               id,
                               line,
                               segment,
                               fromStation,
                               toStation,
                               dragOffsetsRef,
                               radius = 13
                             }: StraightLineProps) => {
  const lineRef = useRef<any>(null)

  const recalcLine = () => {
    const dxFrom = dragOffsetsRef?.current?.[fromStation.id]?.x ?? 0
    const dyFrom = dragOffsetsRef?.current?.[fromStation.id]?.y ?? 0
    const dxTo = dragOffsetsRef?.current?.[toStation.id]?.x ?? 0
    const dyTo = dragOffsetsRef?.current?.[toStation.id]?.y ?? 0

    const start = { x: fromStation.x + dxFrom, y: fromStation.y + dyFrom }
    const end = { x: toStation.x + dxTo, y: toStation.y + dyTo }

    // вектор линии
    const dx = end.x - start.x
    const dy = end.y - start.y
    const len = Math.sqrt(dx*dx + dy*dy)
    if (len === 0) return [start.x, start.y, end.x, end.y]

    const ux = dx / len
    const uy = dy / len

    // смещаем точки от центров станций по радиусу
    return [
      start.x + ux * radius,
      start.y + uy * radius,
      end.x - ux * radius,
      end.y - uy * radius
    ]
  }

  useEffect(() => {
    if (!lineRef.current) return
    lineRef.current.attrs.originalCoords = { from: fromStation, to: toStation, radius }
    lineRef.current.points(recalcLine())
    lineRef.current.getLayer()?.batchDraw()
  }, [fromStation, toStation, dragOffsetsRef, line, radius])

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

