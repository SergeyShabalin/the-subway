// Lines.tsx — теперь рисует с offset’ами!

import { CurvedLine } from './curved-line/curved-line.tsx'
import { StraightLine } from './straight-line/straight-line.tsx'
import { DiameterLine } from './diameter-line/diameter-line.tsx'
import { useMetro } from '../../store/hooks/use-metro.ts'
import type { FC, ReactNode } from 'react'

interface LinesProps {
  dragOffsets: Record<number, { x: number; y: number }>
}

export const Lines: FC<LinesProps> = ({ dragOffsets }) => {
  const { metroNetwork } = useMetro()

  return (
    <>
      {metroNetwork.flatMap((line) => {
        const segments = [...line.segments]

        if (line.locking && line.stations.length >= 2) {
          const firstStation = line.stations[0]
          const lastStation = line.stations[line.stations.length - 1]

          const hasExistingSegment = line.segments.some(
            (seg) =>
              seg.fromStationId === lastStation.id &&
              seg.toStationId === firstStation.id,
          )

          if (!hasExistingSegment) {
            segments.push({
              fromStationId: lastStation.id,
              toStationId: firstStation.id,
              timeMinutes: 0,
            })
          }
        }

        return segments.flatMap((segment) => {
          const fromStation = line.stations.find(
            (s) => s.id === segment.fromStationId,
          )
          const toStation = line.stations.find(
            (s) => s.id === segment.toStationId,
          )

          if (!fromStation || !toStation) return []

          // 👇 ИСПОЛЬЗУЕМ dragOffsets — В РЕАЛЬНОМ ВРЕМЕНИ!
          const fromX = fromStation.x + (dragOffsets[fromStation.id]?.x || 0)
          const fromY = fromStation.y + (dragOffsets[fromStation.id]?.y || 0)
          const toX = toStation.x + (dragOffsets[toStation.id]?.x || 0)
          const toY = toStation.y + (dragOffsets[toStation.id]?.y || 0)

          const renderers: Record<string, ReactNode> = {
            linear: (
              <StraightLine
                key={`${line.id}-${segment.fromStationId}-${segment.toStationId}`}
                line={line}
                segment={segment}
                fromStation={{ ...fromStation, x: fromX, y: fromY }} // 👈 Передаём смещённые координаты
                toStation={{ ...toStation, x: toX, y: toY }}
              />
            ),
            circular: (
              <CurvedLine
                key={`${line.id}-${segment.fromStationId}-${segment.toStationId}`}
                line={line}
                segment={segment}
                fromStation={{ ...fromStation, x: fromX, y: fromY }}
                toStation={{ ...toStation, x: toX, y: toY }}
              />
            ),
            diameter: (
              <DiameterLine
                key={`${line.id}-${segment.fromStationId}-${segment.toStationId}`}
                line={line}
                segment={segment}
                fromStation={{ ...fromStation, x: fromX, y: fromY }}
                toStation={{ ...toStation, x: toX, y: toY }}
              />
            ),
          }

          return renderers[line.renderStyle] ? [renderers[line.renderStyle]] : []
        })
      })}
    </>
  )
}