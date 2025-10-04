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


const createLineComponent = (
  lineType: LineType,
  key: string,
  line: any,
  fromPos: any,
  toPos: any,
  segment: any,
  curvatureRef: any,
  dragOffsetsRef: any
) => {
  const LineComponent = lineComponents[lineType]
  if (!LineComponent) return null

  const baseProps = {
    id: key,
    line,
    fromStation: fromPos,
    toStation: toPos,
  }

  switch (lineType) {
    case LineType.Linear:
    case LineType.Diameter:
      return (
        <LineComponent
          key={key}
          {...baseProps}
          segment={segment}
        />
      )
    case LineType.Circular:
      return (
        <LineComponent
          key={key}
          {...baseProps}
          curvatureRef={curvatureRef}
          dragOffsetsRef={dragOffsetsRef}
        />
      )
    default:
      return null
  }
}

export const Lines: FC<ILinesProps> = ({ dragOffsetsRef, curvatureRef }) => {
  const { metroNetwork } = useMetro()

  const linesWithSegments = useMemo(() => {
    return metroNetwork.flatMap((line) => {
      const segments = [...line.segments]

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
        const fromStation = line.stations.find((s) => s.id === seg.fromStationId)
        const toStation = line.stations.find((s) => s.id === seg.toStationId)

        if (!fromStation || !toStation) return []

        const individualOffsetFrom = dragOffsetsRef.current[fromStation.id] || { x: 0, y: 0 }
        const individualOffsetTo = dragOffsetsRef.current[toStation.id] || { x: 0, y: 0 }

        const fromPos = {
          ...fromStation,
          x: fromStation.x + individualOffsetFrom.x,
          y: fromStation.y + individualOffsetFrom.y,
        }

        const toPos = {
          ...toStation,
          x: toStation.x + individualOffsetTo.x,
          y: toStation.y + individualOffsetTo.y,
        }

        const key = `line-${line.id}-${seg.fromStationId}-${seg.toStationId}`
        const lineType = line.renderStyle as LineType

        return createLineComponent(
          lineType,
          key,
          line,
          fromPos,
          toPos,
          seg,
          curvatureRef,
          dragOffsetsRef
        ) || []
      })
    })
  }, [metroNetwork, dragOffsetsRef, curvatureRef])

  return <>{linesWithSegments}</>
}