import { Line } from 'react-konva'
import { getPointOnCircle } from './utils/get-point-on-circle.ts'

const StraightLine = ({line, segment, fromStation, toStation}) => {

  const p1 = getPointOnCircle(
    { x: fromStation.x, y: fromStation.y },
    { x: toStation.x, y: toStation.y },
    12+1 // радиус станции +1, чтобы линия не вылезала за окружность
  )

  const p2 = getPointOnCircle(
    { x: toStation.x, y: toStation.y },
    { x: fromStation.x, y: fromStation.y },
    12+1
  )

  return (
    <div>
      <Line
        key={`${line.id}-${segment.fromStationId}-${segment.toStationId}`}
        points={[p1.x, p1.y, p2.x, p2.y]}
        stroke={line.color}
        strokeWidth={4}
        lineCap="square"
        lineJoin="miter"
        shadowColor="rgba(0,0,0,0.2)"
        shadowBlur={5}
      />
    </div>
  )
}

export { StraightLine }