import { useMemo, useState, useCallback } from 'react'
import { useMetro } from '../../store/hooks/use-metro.ts'
import { Station } from './station/station.tsx'
import type { Stage } from 'konva/lib/Stage'

interface StationsProps {
  dragOffsetsRef: React.MutableRefObject<Record<number, { x: number; y: number }>>
  stageRef: React.RefObject<Stage>
  circleRadiusRef: React.MutableRefObject<number>
}

export const Stations = ({ dragOffsetsRef, stageRef, circleRadiusRef }: StationsProps) => {
  const { metroNetwork } = useMetro()
  const [hoveredStationId, setHoveredStationId] = useState<number | null>(null)

  const handleMouseEnter = useCallback((id: number) => setHoveredStationId(id), [])
  const handleMouseLeave = useCallback(() => setHoveredStationId(null), [])

  const stations = useMemo(
    () => metroNetwork.flatMap(line => line.stations),
    [metroNetwork]
  )

  return (
    <>
      {stations.map(station => (
        <Station
          key={`station-${station.id}`}
          station={station}
          dragOffsetsRef={dragOffsetsRef}
          stageRef={stageRef}
          hoveredStationId={hoveredStationId}
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
          circleRadiusRef={circleRadiusRef}
        />
      ))}
    </>
  )
}