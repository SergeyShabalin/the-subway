// Stations.tsx

import { useCallback, useMemo, useState } from 'react'
import { useMetro } from '../../store/hooks/use-metro.ts'
import { Station } from './station/station.tsx'

interface StationsProps {
  dragOffsets: Record<number, { x: number; y: number }>
  updateDragOffset: (stationId: number, dx: number, dy: number) => void
  clearDragOffset: (stationId: number) => void
}

const Stations = ({ dragOffsets, updateDragOffset, clearDragOffset }: StationsProps) => {
  const { metroNetwork } = useMetro()
  const [hoveredStationId, setHoveredStationId] = useState<number | null>(null)

  const handleMouseEnter = useCallback((id: number) => {
    setHoveredStationId(id)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoveredStationId(null)
  }, [])

  // 👇 Важно: мы больше не вызываем updateStationPosition здесь — только в Station
  // Поэтому handleDragMove и handleDragEnd — не нужны!

  const memoizedStations = useMemo(() =>
      metroNetwork.flatMap((line) =>
        line.stations.map((station) => ({
          ...station,
        })),
      ),
    [metroNetwork]
  )

  return (
    <>
      {memoizedStations.map((station) => (
        <Station
          dragOffsets={dragOffsets}
          key={`station-${station.id}`}
          station={station}
          hoveredStationId={hoveredStationId}
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
          updateDragOffset={updateDragOffset}
          clearDragOffset={clearDragOffset}
        />
      ))}
    </>
  )
}

export { Stations }