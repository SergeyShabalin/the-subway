// Stations.tsx
import { useEffect, useMemo } from 'react'
import { useMetro } from '@/store/hooks/use-metro.ts'
import { Station } from './station/station.tsx'
import type { IStationsProps } from '@components/stations/types.ts'
import { useStationCursor } from '@components/stations/station/hooks/use-change-cursor-station.ts'

interface StationsProps extends IStationsProps {
  lineMoveEnabled: boolean
  setLineDragOffset: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>
}

export const Stations = ({
                           dragOffsetsRef,
                           stageRef,
                           circleRadiusRef,
                           rotationAngleRef,
                           lineMoveEnabled,
                           setLineDragOffset
                         }: StationsProps) => {
  const { metroNetwork, activeLineId } = useMetro()
  const {
    hoveredStationId,
    handleMouseEnter,
    handleMouseLeave,
    updateCursor
  } = useStationCursor(stageRef)

  // Создаем массив уникальных станций
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

  // Принудительное обновление stage при изменении позиций станций
  useEffect(() => {
    if (stageRef?.current) {
      stageRef.current.batchDraw()
    }
  }, [uniqueStations.map(s => `${s.x}-${s.y}`).join('|')])

  return (
    <>
      {uniqueStations.map((station) => {
        const stationLine = metroNetwork.find(line =>
          line.stations.some(s => s.id === station.id)
        )

        const isActiveCircular =
          stationLine?.renderStyle === 'circular' &&
          stationLine?.locking &&
          stationLine.id === activeLineId

        const canMoveCircularLine = isActiveCircular && lineMoveEnabled

        return (
          <Station
            key={`station-${station.id}`}
            station={station}
            dragOffsetsRef={dragOffsetsRef}
            stageRef={stageRef}
            circleRadiusRef={circleRadiusRef}
            rotationAngleRef={rotationAngleRef}
            isHovered={hoveredStationId === station.id}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            updateCursor={updateCursor}
            isActiveCircular={isActiveCircular && !lineMoveEnabled}
            lineMoveEnabled={lineMoveEnabled}
            setLineDragOffset={setLineDragOffset}
            activeLineId={activeLineId}
            canMoveCircularLine={canMoveCircularLine}
            stationLine={stationLine}
          />
        )
      })}
    </>
  )
}