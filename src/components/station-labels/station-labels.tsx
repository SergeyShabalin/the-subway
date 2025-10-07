import { Text } from 'react-konva'
import { useMetro } from '@/store/hooks/use-metro.ts'
import type { IStationLabelsProps } from '@components/station-labels/types.ts'
import { useState } from 'react'

interface StationLabelsProps extends IStationLabelsProps {
  lineDragOffset?: { x: number; y: number } | null
}

export const StationLabels = ({ dragOffsetsRef, lineDragOffset }: StationLabelsProps) => {
  const { metroNetwork, activeLineId } = useMetro()
  const [draggedLabelId, setDraggedLabelId] = useState<number | null>(null)

  return (
    <>
      {metroNetwork.flatMap((line) => {
        return line.stations.map((station) => {
          // Если линия перемещается, используем смещение линии для ВСЕХ элементов
          const effectiveOffset = lineDragOffset && activeLineId === line.id ? {
            x: lineDragOffset.x,
            y: lineDragOffset.y
          } : (dragOffsetsRef.current[station.id] || { x: 0, y: 0 })

          const isDragged = draggedLabelId === station.id

          return (
            <Text
              key={`label-${station.id}`}
              id={`label-${station.id}`}
              x={station.x + (station.labelOffset?.x || 0) + effectiveOffset.x}
              y={station.y + (station.labelOffset?.y || 0) + effectiveOffset.y}
              text={station.label}
              fontSize={14}
              fill={isDragged ? "#FFFFFF" : "#9CEEF7"}
              align="center"
              verticalAlign="middle"
              letterSpacing={1.2}
              draggable={false}
            />
          )
        })
      })}
    </>
  )
}