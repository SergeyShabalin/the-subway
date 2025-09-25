import { Circle, Line } from 'react-konva'
import { memo, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { updateStationPosition } from '../../../store/slices/metro-slices.ts'
import type { Stage } from 'konva/lib/Stage'
import { useMetro } from '../../../store/hooks/use-metro.ts'

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
  const { metroNetwork } = useMetro()

  const getLivePos = (stationId: number) => {
    const st = metroNetwork.flatMap(l => l.stations).find(s => s.id === stationId)
    if (!st) return { x: 0, y: 0 }
    const offset = dragOffsetsRef.current[stationId] ?? { x: 0, y: 0 }
    return { x: st.x + offset.x, y: st.y + offset.y }
  }

  const getPointOnCircleEdge = (
    fromPos: { x: number; y: number },
    toPos: { x: number; y: number },
    radius: number
  ) => {
    const dx = toPos.x - fromPos.x
    const dy = toPos.y - fromPos.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance === 0) return fromPos

    const nx = dx / distance
    const ny = dy / distance

    return {
      x: fromPos.x + nx * radius,
      y: fromPos.y + ny * radius
    }
  }

  const handleDragMove = useCallback((e: any) => {
    const node = e.target;
    const newX = node.x();
    const newY = node.y();

    // Принудительно обновляем позицию для мгновенного отклика
    node.setPosition({ x: newX, y: newY });

    const dx = newX - station.x
    const dy = newY - station.y
    dragOffsetsRef.current[station.id] = { x: dx, y: dy }

    const stage = stageRef.current
    if (!stage) return

    // Обновляем метку
    const labelNode = stage.findOne(`#label-${station.id}`)
    if (labelNode) {
      labelNode.setPosition({
        x: newX + (station.labelOffset?.x || 0),
        y: newY + (station.labelOffset?.y || 0)
      })
    }

    // Обновляем все линии, к которым привязана станция
    const lineNodes = stage.find(node => {
      const id = node.getId?.()
      if (!id || !id.startsWith('line-')) return false
      const parts = id.split('-')
      if (parts.length < 4) return false
      const fromId = parseInt(parts[2], 10)
      const toId   = parseInt(parts[3], 10)
      return fromId === station.id || toId === station.id
    })

    lineNodes.forEach(node => {
      if (node.getClassName() === 'Line') {
        const line = node as any
        const parts = line.getId().split('-')
        const fromId = parseInt(parts[2], 10)
        const toId   = parseInt(parts[3], 10)
        const variant = parts[4]
        const points = line.points()
        const stationRadius = 12
        const offset = 4
        const actualOffset = variant === 'a' ? offset : variant === 'b' ? -offset : 0

        const fromPos = fromId === station.id ?
          { x: newX, y: newY } : getLivePos(fromId)
        const toPos = toId === station.id ?
          { x: newX, y: newY } : getLivePos(toId)

        const dxLine = toPos.x - fromPos.x
        const dyLine = toPos.y - fromPos.y
        const len = Math.sqrt(dxLine * dxLine + dyLine * dyLine) || 1
        const nx = dxLine / len
        const ny = dyLine / len

        const px = -ny
        const py = nx

        const fromEdge = getPointOnCircleEdge(fromPos, toPos, stationRadius)
        const toEdge = getPointOnCircleEdge(toPos, fromPos, stationRadius)

        const fromOffset = { x: px * actualOffset, y: py * actualOffset }
        const toOffset = { x: px * actualOffset, y: py * actualOffset }

        points[0] = fromEdge.x + fromOffset.x
        points[1] = fromEdge.y + fromOffset.y
        points[2] = toEdge.x + toOffset.x
        points[3] = toEdge.y + toOffset.y

        line.points(points)
      }
      else if (node.getClassName() === 'Path') {
        const orig = node.attrs.originalCoords
        if (!orig) return

        const fromStation = orig.from.id === station.id
          ? { x: newX, y: newY }
          : orig.from
        const toStation = orig.to.id === station.id
          ? { x: newX, y: newY }
          : orig.to

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

        const start = getPointOnCircleEdge(fromStation, control, 12)
        const end = getPointOnCircleEdge(toStation, control, 12)

        node.data(`M ${start.x},${start.y} Q ${control.x},${control.y} ${end.x},${end.y}`)
      }
    })

    // Принудительно обновляем слой
    node.getLayer()?.batchDraw()
  }, [dragOffsetsRef, stageRef, station, metroNetwork])

  const handleDragEnd = useCallback((e: any) => {
    const node = e.target;
    delete dragOffsetsRef.current[station.id]

    dispatch(updateStationPosition({
      stationId: station.id,
      x: node.x(),
      y: node.y()
    }))
  }, [dispatch, station, dragOffsetsRef])

  const currentOffset = dragOffsetsRef.current[station.id] || { x: 0, y: 0 }

  return (
    <Circle
      x={station.x + currentOffset.x}
      y={station.y + currentOffset.y}
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
      // Важные оптимизации для плавности перетаскивания
      perfectDrawEnabled={false}
      listening={true}
      shadowEnabled={false} // Отключаем тень при перетаскивании для производительности
    />
  )
})