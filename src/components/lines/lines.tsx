import { FC } from 'react'
import { useMetro } from '../../store/hooks/use-metro.ts'
import { StraightLine } from './straight-line/straight-line.tsx'
import { CurvedLine } from './curved-line/curved-line.tsx'
import { DiameterLine } from './diameter-line/diameter-line.tsx'
import type { Stage } from 'konva/lib/Stage'

interface LinesProps {
  dragOffsetsRef: React.MutableRefObject<Record<number, { x: number; y: number }>>
  stageRef: React.RefObject<Stage>
  curvatureRef: React.MutableRefObject<Record<number, number>>
  circleRadiusRef: React.MutableRefObject<number>
}

export const Lines: FC<LinesProps> = ({ dragOffsetsRef, curvatureRef }) => {
  const { metroNetwork } = useMetro()

  return (
    <>
      {metroNetwork.flatMap(line => {
        const segments = [...line.segments]

        if (line.locking && line.stations.length >= 2) {
          const first = line.stations[0]
          const last = line.stations[line.stations.length - 1]
          const hasLoop = line.segments.some(
            seg => seg.fromStationId === last.id && seg.toStationId === first.id
          )
          if (!hasLoop) {
            segments.push({ fromStationId: last.id, toStationId: first.id, timeMinutes: 0 })
          }
        }

        return segments.flatMap(seg => {
          const from = line.stations.find(s => s.id === seg.fromStationId)
          const to = line.stations.find(s => s.id === seg.toStationId)
          if (!from || !to) return []

          const offsetFrom = dragOffsetsRef.current[from.id] || { x: 0, y: 0 }
          const offsetTo = dragOffsetsRef.current[to.id] || { x: 0, y: 0 }

          const fromPos = { ...from, x: from.x + offsetFrom.x, y: from.y + offsetFrom.y }
          const toPos = { ...to, x: to.x + offsetTo.x, y: to.y + offsetTo.y }

          const key = `${line.id}-${seg.fromStationId}-${seg.toStationId}`
          if (line.renderStyle === 'linear') {
            return (
              <StraightLine
                key={key}
                id={`line-${line.id}-${seg.fromStationId}-${seg.toStationId}`}
                line={line}
                segment={seg}
                fromStation={fromPos}
                toStation={toPos}
              />
            )
          }
          if (line.renderStyle === 'circular') {
            return (
              <CurvedLine
                key={key}
                id={`line-${line.id}-${seg.fromStationId}-${seg.toStationId}`}
                line={line}
                fromStation={fromPos}
                toStation={toPos}
                curvatureRef={curvatureRef}
              />
            )
          }
          if (line.renderStyle === 'diameter') {
            return (
              <DiameterLine
                key={key}
                id={`line-${line.id}-${seg.fromStationId}-${seg.toStationId}`}
                line={line}
                segment={seg}
                fromStation={fromPos}
                toStation={toPos}
              />
            )
          }
          return []
        })
      })}
    </>
  )
}