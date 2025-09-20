// StationLabels.tsx

import { Text } from 'react-konva'
import { useMetro } from '../../store/hooks/use-metro.ts'

interface StationLabelProps {
  dragOffsets: Record<number, { x: number; y: number }>
}

const StationLabels = ({ dragOffsets }: StationLabelProps) => {
  const { metroNetwork } = useMetro()

  return (
    <>
      {metroNetwork.flatMap((line) =>
        line.stations.map((station) => {
          const offset = dragOffsets[station.id] || { x: 0, y: 0 }
          console.log(offset, offset.x, offset.y)
          return (
            <Text
              key={`label-${station.id}`}
              x={station.x + station.labelOffset.x + offset.x }
              y={station.y + station.labelOffset.y + offset.y}
              text={`${station.id} ${station.label}`}
              fontSize={14}
              fontFamily="Arial, sans-serif"
              fill="#9CEEF7"
              align="center"
              verticalAlign="middle"
              letterSpacing={1.2}
            />
          )
        }),
      )}
    </>
  )
}

export { StationLabels }