import { Text } from 'react-konva'
import { useMemo, useContext } from 'react'
import { useMetro } from '@/store/hooks/use-metro.ts'
import { ThemeContext } from '@/context'
import { THEME_COLORS } from '@/const.ts'
import type { StationLabelsComponentProps } from '@components/station-labels/types.ts'

export const StationLabels = ({
                                dragOffsetsRef,
                                lineDragOffset
                              }: StationLabelsComponentProps) => {
  const { metroNetwork } = useMetro()
  const { theme } = useContext(ThemeContext)
  const themeColors = THEME_COLORS[theme]

  // Получаем все ВИЗУАЛЬНЫЕ станции (в новой структуре отрисовываем по визуальным точкам)
  const visualStations = useMemo(() => {
    return Object.values(metroNetwork.visuals.stations)
  }, [metroNetwork.visuals.stations])

  return (
    <>
      {visualStations.map((visualStation) => {
        const visualId = visualStation.id

        // Получаем связанные логические станции
        const logicalIds = metroNetwork.connections.visualToLogical[visualId] || []
        if (logicalIds.length === 0) {
          console.warn(`No logical stations for visual station ${visualId}`)
          return null
        }

        // Берем первую логическую станцию для имени (в пересадочном узле все имена одинаковые)
        const firstLogicalId = logicalIds[0]
        const logicalStation = metroNetwork.logic.stations[firstLogicalId]
        if (!logicalStation) {
          console.warn(`No logical station ${firstLogicalId} for visual station ${visualId}`)
          return null
        }

        // Получаем линии, проходящие через эту визуальную точку
        const lineIds = metroNetwork.connections.stationLines[visualId] || []
        const isTransfer = lineIds.length > 1 || visualStation.displayMode === 'multiple'

        // Вычисляем смещения
        let effectiveOffset = { x: 0, y: 0 }

        // 1. Для каждой логической станции проверяем индивидуальное смещение
        logicalIds.forEach(logicalId => {
          const stationOffset = dragOffsetsRef?.current?.[logicalId]
          if (stationOffset) {
            effectiveOffset.x += stationOffset.x
            effectiveOffset.y += stationOffset.y
          }
        })

        // 2. Смещение линии (применяем ко всем линиям, проходящим через станцию)
        lineIds.forEach(lineId => {
          if (lineDragOffset && lineDragOffset.lineId === lineId) {
            effectiveOffset.x += lineDragOffset.x || 0
            effectiveOffset.y += lineDragOffset.y || 0
          }
        })

        // Вычисляем финальные координаты с округлением
        const x = Math.round(
          visualStation.x +
          (visualStation.labelOffset?.x || 0) +
          effectiveOffset.x
        )

        const y = Math.round(
          visualStation.y +
          (visualStation.labelOffset?.y || 0) +
          effectiveOffset.y
        )

        return (
          <Text
            key={`label-${visualId}`}
            id={`label-${visualId}`}
            x={x}
            y={y}
            text={logicalStation.name}
            fontSize={isTransfer ? 13 : 12}
            fontWeight={isTransfer ? 'bold' : 'normal'}
            fill={themeColors.stationLabel}
            align="center"
            listening={true}
            perfectDrawEnabled={false}
            shadowForStrokeEnabled={false}
            verticalAlign="middle"
            letterSpacing={1.5}
            draggable={true}
          />
        )
      })}
    </>
  )
}