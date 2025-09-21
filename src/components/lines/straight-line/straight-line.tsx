import { Line } from 'react-konva'
import { getPointOnCircle } from './utils/get-point-on-circle.ts'

const StraightLine = ({ id, line, segment, fromStation, toStation }) => {
  const p1 = getPointOnCircle(
    { x: fromStation.x, y: fromStation.y },
    { x: toStation.x, y: toStation.y },
    13
  )
  const p2 = getPointOnCircle(
    { x: toStation.x, y: toStation.y },
    { x: fromStation.x, y: fromStation.y },
    13
  )
  return (
    <Line
      id={id}
      points={[p1.x, p1.y, p2.x, p2.y]}
      stroke={line.color}
      strokeWidth={4}
      lineCap="square"
      lineJoin="miter"
      shadowColor="rgba(0,0,0,0.2)"
      shadowBlur={5}
    />
  )
}

export { StraightLine }
