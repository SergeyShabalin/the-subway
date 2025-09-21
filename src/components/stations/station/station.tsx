import { Circle } from 'react-konva'
import { memo, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { updateStationPosition } from '../../../store/slices/metro-slices.ts'
import type { Stage } from 'konva/lib/Stage'

interface StationProps {
  station: any
  dragOffsetsRef: React.MutableRefObject<Record<number, { x: number; y: number }>>
  stageRef: React.RefObject<Stage>
  hoveredStationId: number | null
  handleMouseEnter: (id: number) => void
  handleMouseLeave: () => void
}

export const Station = memo(({
                               station,
                               dragOffsetsRef,
                               stageRef,
                               hoveredStationId,
                               handleMouseEnter,
                               handleMouseLeave
                             }: StationProps) => {
  const dispatch = useDispatch()

  const handleDragMove = useCallback((e: any) => {
    const dx = e.target.x() - station.x
    const dy = e.target.y() - station.y
    dragOffsetsRef.current[station.id] = { x: dx, y: dy }

    const stage = stageRef.current
    if (!stage) return

    // обновляем метку
    const labelNode = stage.findOne(`#label-${station.id}`)
    if (labelNode) {
      labelNode.position({
        x: station.x + dx + (station.labelOffset?.x || 0),
        y: station.y + dy + (station.labelOffset?.y || 0)
      })
      labelNode.getLayer()?.batchDraw()
    }

    // обновляем линии
    const lineNodes = stage.find(node =>
      node.getId()?.startsWith('line-') &&
      node.getId()?.includes(`-${station.id}-`)
    )

    lineNodes.forEach(node => {
      if (node.getClassName() === 'Line') {
        const line = node as any
        const points = line.points()
        const fromId = parseInt(line.getId().split('-')[2])
        const toId = parseInt(line.getId().split('-')[3])
        if (fromId === station.id) {
          points[0] = station.x + dx
          points[1] = station.y + dy
        }
        if (toId === station.id) {
          points[2] = station.x + dx
          points[3] = station.y + dy
        }
        line.points(points)
      } else if (node.getClassName() === 'Path') {
        const orig = node.attrs.originalCoords
        if (!orig) return
        const fromStation = orig.from.id === station.id ? { x: station.x + dx, y: station.y + dy } : orig.from
        const toStation = orig.to.id === station.id ? { x: station.x + dx, y: station.y + dy } : orig.to
        const midX = (fromStation.x + toStation.x) / 2
        const midY = (fromStation.y + toStation.y) / 2
        const dxLine = toStation.x - fromStation.x
        const dyLine = toStation.y - fromStation.y
        const length = Math.sqrt(dxLine * dxLine + dyLine * dyLine)
        if (length === 0) return
        const perpX = -dyLine / length
        const perpY = dxLine / length
        const control = {
          x: midX + perpX * (orig.curvature ?? 50),
          y: midY + perpY * (orig.curvature ?? 50)
        }
        const getPointOnCircleTowardsControl = (center: { x: number; y: number }, ctrl: { x: number; y: number }, radius: number) => {
          const dx = ctrl.x - center.x
          const dy = ctrl.y - center.y
          const len = Math.sqrt(dx * dx + dy * dy)
          if (len === 0) return center
          return { x: center.x + (dx / len) * radius, y: center.y + (dy / len) * radius }
        }
        const start = getPointOnCircleTowardsControl(fromStation, control, 13)
        const end = getPointOnCircleTowardsControl(toStation, control, 13)
        node.data(`M ${start.x},${start.y} Q ${control.x},${control.y} ${end.x},${end.y}`)
      }
      node.getLayer()?.batchDraw()
    })
  }, [dragOffsetsRef, stageRef, station])

  const handleDragEnd = useCallback((e: any) => {
    dispatch(updateStationPosition({
      stationId: station.id,
      x: e.target.x(),
      y: e.target.y()
    }))
    delete dragOffsetsRef.current[station.id]
  }, [dispatch, station, dragOffsetsRef])

  const offset = dragOffsetsRef.current[station.id] || { x: 0, y: 0 }

  return (
    <Circle
      x={station.x + offset.x}
      y={station.y + offset.y}
      radius={12}
      fill="transparent"
      stroke={station.color}
      strokeWidth={2}
      draggable
      shadowColor="rgba(0,0,0,0.2)"
      shadowBlur={5}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => handleMouseEnter(station.id)}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: hoveredStationId === station.id ? 'grab' : 'default' }}
    />
  )
})
