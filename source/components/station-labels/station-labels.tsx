import { Text } from 'react-konva'

import type { IStationLabelsProps } from '@components/station-labels/types.ts'
import { useState, useMemo, useContext } from 'react'
import { useMetro } from '@/store/hooks/use-metro.ts'
import { ThemeContext } from '@/context'
import { THEME_COLORS } from '@/const.ts'
interface StationLabelsProps extends IStationLabelsProps {
  lineDragOffset?: { x: number; y: number } | null
}

export const StationLabels = ({ dragOffsetsRef, lineDragOffset }: StationLabelsProps) => {
  const { metroNetwork } = useMetro()
  const [draggedLabelId, setDraggedLabelId] = useState<number | null>(null)
  const { theme } = useContext(ThemeContext)
  console.log(theme)


  const themeColors = THEME_COLORS[theme]
  // Создаем массив уникальных станций для лейблов
  const uniqueStations = useMemo(() => {
    const seenStations = new Set<number>()
    const result = []

    for (const line of metroNetwork) {
      for (const station of line.stations) {
        if (!seenStations.has(station.id)) {
          seenStations.add(station.id)
          result.push(station)
        }
      }
    }

    return result
  }, [metroNetwork])

  return (
    <>
      {uniqueStations.map((station) => {
          // Находим первую линию, к которой принадлежит станция
          const stationLine = metroNetwork.find(line =>
            line.stations.some(s => s.id === station.id)
          )

          // Если линия перемещается, используем смещение линии для ВСЕХ элементов
          const effectiveOffset = lineDragOffset  === stationLine?.id ? {
            x: lineDragOffset.x,
            y: lineDragOffset.y
          } : (dragOffsetsRef.current[station.id] || { x: 0, y: 0 })

          const isDragged = draggedLabelId === station.id

          return (
            <Text
              key={`label-${station.id}`} // Уникальный ключ
          id={`label-${station.id}`}
          x={station.x + (station.labelOffset?.x || 0) + effectiveOffset.x}
          y={station.y + (station.labelOffset?.y || 0) + effectiveOffset.y}
          text={station.label}
          fontSize={12}
              fill={isDragged ? themeColors.stationLabelDragged : themeColors.stationLabel}
          align="center"
          verticalAlign="middle"
          letterSpacing={1.2}
          draggable={true}
          />
        )
        })}
    </>
  )
}