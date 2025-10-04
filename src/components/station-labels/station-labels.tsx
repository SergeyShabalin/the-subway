import { Text } from 'react-konva'
import { useMetro } from '@/store/hooks/use-metro.ts'
import type { IStationLabelsProps } from '@components/station-labels/types.ts'
import {   useState } from 'react'

export const StationLabels = ({ dragOffsetsRef }: IStationLabelsProps) => {
  const { metroNetwork } = useMetro()
  const [draggedLabelId, setDraggedLabelId] = useState<number | null>(null)




  return (
    <>
      {metroNetwork.flatMap((line) =>
        line.stations.map((station) => {
          const offset = dragOffsetsRef.current[station.id] || { x: 0, y: 0 }
          const isDragged = draggedLabelId === station.id

          return (
            <Text
              key={`label-${station.id}`}
              id={`label-${station.id}`}
              x={station.x + (station.labelOffset?.x || 0) + offset.x}
              y={station.y + (station.labelOffset?.y || 0) + offset.y}
              text={station.label}
              fontSize={14}
              fill={isDragged ? "#FFFFFF" : "#9CEEF7"}
              align="center"
              verticalAlign="middle"
              letterSpacing={1.2}
              draggable={true}
            />
          )
        }),
      )}
    </>
  )
}