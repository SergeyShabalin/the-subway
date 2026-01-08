import { useEffect, useMemo } from 'react'
import { useMetro } from '@/store/hooks/use-metro.ts'

import type { IStationsProps } from '@components/stations/types.ts'
 import { Station } from '@components/stations/station/station.tsx'
import { useStationCursor } from '@components/stations/station/hooks/use-change-cursor-station.ts'

interface StationsProps extends IStationsProps {
  setLineDragOffset: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>
}

export const Stations = ({
                           dragOffsetsRef,
                           stageRef,
                           circleRadiusRef,
                           rotationAngleRef,
                           setLineDragOffset
                         }: StationsProps) => {
  const { metroNetwork } = useMetro()
  const {
    hoveredStationId,
    handleMouseEnter,
    handleMouseLeave,
    updateCursor
  } = useStationCursor(stageRef)

  // Получаем все ВИЗУАЛЬНЫЕ станции
  const visualStations = useMemo(() => {
    return Object.values(metroNetwork.visuals.stations)
  }, [metroNetwork.visuals.stations])

  // Принудительное обновление stage при изменении позиций станций
  useEffect(() => {
    if (stageRef?.current) {
      stageRef.current.batchDraw()
    }
  }, [visualStations.map(s => `${s.x}-${s.y}`).join('|')])

  return (
    <>
      {visualStations.map((visualStation) => {
        // Получаем линии, проходящие через эту визуальную точку
        const lineIds = metroNetwork.connections.stationLines[visualStation.id] || []

        return (
          <Station
            key={`station-${visualStation.id}`}
            visualStation={visualStation}
            dragOffsetsRef={dragOffsetsRef}
            stageRef={stageRef}
            isHovered={hoveredStationId === visualStation.id}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            updateCursor={updateCursor}
            lineIds={lineIds}
            setLineDragOffset={setLineDragOffset}
          />
        )
      })}
    </>
  )
}