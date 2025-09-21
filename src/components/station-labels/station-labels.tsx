import { Text } from 'react-konva'
import { useMetro } from '../../store/hooks/use-metro.ts'

interface StationLabelsProps {
  dragOffsetsRef: React.MutableRefObject<Record<number, { x: number; y: number }>>
}

export const StationLabels = ({ dragOffsetsRef }: StationLabelsProps) => {
  const { metroNetwork } = useMetro()

  return (
    <>
      {metroNetwork.flatMap(line =>
        line.stations.map(station => {
          const offset = dragOffsetsRef.current[station.id] || { x: 0, y: 0 }
          return (
            <Text
              key={`label-${station.id}`}
              id={`label-${station.id}`}
              x={station.x + (station.labelOffset?.x || 0) + offset.x}
              y={station.y + (station.labelOffset?.y || 0) + offset.y}
              text={station.label}
              fontSize={14}
              fontFamily="Arial"
              fill="#9CEEF7"
              align="center"
              verticalAlign="middle"
              letterSpacing={1.2}
            />
          )
        })
      )}
    </>
  )
}
