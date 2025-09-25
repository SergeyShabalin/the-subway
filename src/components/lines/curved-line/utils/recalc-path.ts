import type { Line } from '../../../../store/slices/metro-slices.ts'
import type { Station } from '../../../stations/station/types'

export const recalcPath = (
  fromStation: Station,
  toStation: Station,
  line: Line,
  curvature?: number
) => {
  const p1 = { x: fromStation.x, y: fromStation.y }
  const p2 = { x: toStation.x, y: toStation.y }

  const midX = (p1.x + p2.x) / 2
  const midY = (p1.y + p2.y) / 2

  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  const length = Math.sqrt(dx * dx + dy * dy)
  if (length === 0) return ''

  const perpX = -dy / length
  const perpY = dx / length

  const actualCurvature = curvature ?? line.curvatureLines ?? 50

  const control = { x: midX + perpX * actualCurvature, y: midY + perpY * actualCurvature }

  const getPointOnCircleTowardsControl = (center: { x: number; y: number }, ctrl: { x: number; y: number }, radius: number) => {
    const dx = ctrl.x - center.x
    const dy = ctrl.y - center.y
    const len = Math.sqrt(dx * dx + dy * dy)
    if (len === 0) return center
    return { x: center.x + (dx / len) * radius, y: center.y + (dy / len) * radius }
  }

  const start = getPointOnCircleTowardsControl(p1, control, 15)
  const end = getPointOnCircleTowardsControl(p2, control, 15)

  return `M ${start.x},${start.y} Q ${control.x},${control.y} ${end.x},${end.y}`
}