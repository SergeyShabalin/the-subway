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

  const stations = useMemo(
    () => metroNetwork.flatMap((line) => line.stations),
    [metroNetwork],
  )

  // Принудительное обновление stage при изменении позиций станций
  useEffect(() => {
    if (stageRef?.current) {
      stageRef.current.batchDraw()
    }
  }, [stations.map(s => `${s.x}-${s.y}`).join('|')])

  return (
    <>
      {stations.map((station) => {
        const stationLine = metroNetwork.find(line =>
          line.stations.some(s => s.id === station.id)
        )

        const isActiveCircular =
          stationLine?.renderStyle === 'circular' &&
          stationLine?.locking &&
          stationLine.id === activeLineId

        // Разрешаем перемещение кольцевой линии, если она активна и включен режим перемещения линии
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
            isActiveCircular={isActiveCircular && !lineMoveEnabled} // Запрещаем индивидуальное перемещение только если не включен режим перемещения линии
            lineMoveEnabled={lineMoveEnabled}
            setLineDragOffset={setLineDragOffset}
            activeLineId={activeLineId}
            canMoveCircularLine={canMoveCircularLine}
            stationLine={stationLine} // Передаем информацию о линии станции
          />
        )
      })}
    </>
  )
}