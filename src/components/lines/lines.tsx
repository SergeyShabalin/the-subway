// Lines.tsx
import { useMemo } from 'react'
import type { FC } from 'react'
import { useMetro } from '@/store/hooks/use-metro.ts'
import { StraightLine } from './straight-line/straight-line.tsx'
import { CurvedLine } from './curved-line/curved-line.tsx'
import { DiameterLine } from './diameter-line/diameter-line.tsx'
import type { ILinesProps } from '@components/lines/types.ts'
import { LineType } from '@components/lines/const.ts'

const lineComponents: Record<LineType, React.ComponentType<any>> = {
  [LineType.Linear]: StraightLine,
  [LineType.Circular]: CurvedLine,
  [LineType.Diameter]: DiameterLine,
}

interface LinesProps extends ILinesProps {
  lineDragOffset?: { x: number; y: number } | null
}

// Вспомогательная функция для получения актуальной позиции станции
const getStationPosition = (
  station: any,
  dragOffsetsRef: React.MutableRefObject<Record<number, { x: number; y: number }>>,
  lineDragOffset: { x: number; y: number } | null,
  activeLineId: number | null,
  stationLineId: number
) => {
  const individualOffset = dragOffsetsRef.current[station.id] || { x: 0, y: 0 }

  // Если есть смещение линии и это активная линия станции, применяем его
  const lineOffset = (lineDragOffset && activeLineId === stationLineId)
    ? lineDragOffset
    : { x: 0, y: 0 }

  return {
    x: station.x + individualOffset.x + lineOffset.x,
    y: station.y + individualOffset.y + lineOffset.y,
  }
}

export const Lines: FC<LinesProps> = ({ dragOffsetsRef, curvatureRef, lineDragOffset }) => {
  const { metroNetwork, activeLineId } = useMetro()

  const linesWithSegments = useMemo(() => {
    return metroNetwork.flatMap((line) => {
      const segments = [...line.segments]

      // Добавляем замыкающий сегмент для кольцевых линий
      if (line.locking && line.stations.length >= 2) {
        const first = line.stations[0]
        const last = line.stations[line.stations.length - 1]
        const hasLoop = line.segments.some(
          (seg) => seg.fromStationId === last.id && seg.toStationId === first.id,
        )
        if (!hasLoop) {
          segments.push({
            fromStationId: last.id,
            toStationId: first.id,
            timeMinutes: 0,
          })
        }
      }

      return segments.flatMap((seg) => {
        // Находим станции в текущей линии
        const fromStation = line.stations.find((s) => s.id === seg.fromStationId)
        const toStation = line.stations.find((s) => s.id === seg.toStationId)

        if (!fromStation || !toStation) return []

        // Получаем актуальные позиции станций
        const fromPos = getStationPosition(
          fromStation,
          dragOffsetsRef,
          lineDragOffset,
          activeLineId,
          line.id
        )

        const toPos = getStationPosition(
          toStation,
          dragOffsetsRef,
          lineDragOffset,
          activeLineId,
          line.id
        )

        const key = `line-${line.id}-${seg.fromStationId}-${seg.toStationId}`
        const lineType = line.renderStyle as LineType

        const LineComponent = lineComponents[lineType]
        if (!LineComponent) return null

        const baseProps = {
          id: key,
          line,
          fromStation: { ...fromStation, ...fromPos },
          toStation: { ...toStation, ...toPos },
          segment: seg,
        }

        switch (lineType) {
          case LineType.Linear:
          case LineType.Diameter:
            return (
              <LineComponent
                key={key}
                {...baseProps}
              />
            )
          case LineType.Circular:
            return (
              <LineComponent
                key={key}
                {...baseProps}
                curvatureRef={curvatureRef}
                dragOffsetsRef={dragOffsetsRef}
                lineDragOffset={lineDragOffset && activeLineId === line.id ? lineDragOffset : null}
              />
            )
          default:
            return null
        }
      }).filter(Boolean)
    })
  }, [
    metroNetwork,
    dragOffsetsRef.current,
    curvatureRef.current,
    lineDragOffset,
    activeLineId
  ])

  return <>{linesWithSegments}</>
}