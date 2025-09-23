import { Circle } from 'react-konva'
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
    const lineNodes = stage.find(node => {
      const id = node.getId?.()
      if (!id || !id.startsWith('line-')) return false
      const parts = id.split('-')
      if (parts.length < 4) return false
      const fromId = parseInt(parts[2], 10)
      const toId = parseInt(parts[3], 10)
      return fromId === station.id || toId === station.id
    })

    lineNodes.forEach(node => {
      if (node.getClassName() === 'Line') {
        const line = node as any
        const fromId = parseInt(line.getId().split('-')[2])
        const toId = parseInt(line.getId().split('-')[3])
        const points = line.points()
        const r = 12

        const fromPos = fromId === station.id ? { x: station.x + dx, y: station.y + dy } : getLivePos(fromId)
        const toPos = toId === station.id ? { x: station.x + dx, y: station.y + dy } : getLivePos(toId)

        if (fromId === station.id) {
          // тянем A, конец вращается вокруг B
          const dxLine = fromPos.x - toPos.x
          const dyLine = fromPos.y - toPos.y
          const len = Math.sqrt(dxLine*dxLine + dyLine*dyLine) || 1
          const unitX = dxLine / len
          const unitY = dyLine / len

          points[0] = fromPos.x
          points[1] = fromPos.y
          points[2] = toPos.x + unitX * r
          points[3] = toPos.y + unitY * r
        }

        if (toId === station.id) {
          // тянем B, начало вращается вокруг A
          const dxLine = toPos.x - fromPos.x
          const dyLine = toPos.y - fromPos.y
          const len = Math.sqrt(dxLine*dxLine + dyLine*dyLine) || 1
          const unitX = dxLine / len
          const unitY = dyLine / len

          points[0] = fromPos.x + unitX * r
          points[1] = fromPos.y + unitY * r
          points[2] = toPos.x
          points[3] = toPos.y
        }

        line.points(points)
        line.getLayer()?.batchDraw()
      }

      // Path логика оставлена без изменений
      else if (node.getClassName() === 'Path') {
        const orig = node.attrs.originalCoords
        if (!orig) return

        const fromStation = orig.from.id === station.id
          ? { x: station.x + dx, y: station.y + dy }
          : orig.from
        const toStation = orig.to.id === station.id
          ? { x: station.x + dx, y: station.y + dy }
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

        const getPointOnCircleTowardsControl = (
          center: { x: number; y: number },
          ctrl: { x: number; y: number },
          radius: number
        ) => {
          const dxC = ctrl.x - center.x
          const dyC = ctrl.y - center.y
          const len = Math.sqrt(dxC * dxC + dyC * dyC)
          if (len === 0) return center
          return {
            x: center.x + (dxC / len) * radius,
            y: center.y + (dyC / len) * radius
          }
        }

        const start = getPointOnCircleTowardsControl(fromStation, control, 13)
        const end = getPointOnCircleTowardsControl(toStation, control, 13)
        node.data(`M ${start.x},${start.y} Q ${control.x},${control.y} ${end.x},${end.y}`)
      }

      node.getLayer()?.batchDraw()
    })
  }, [dragOffsetsRef, stageRef, station, metroNetwork])

  const handleDragEnd = useCallback((e: any) => {
    delete dragOffsetsRef.current[station.id]

    dispatch(updateStationPosition({
      stationId: station.id,
      x: e.target.x(),
      y: e.target.y()
    }))
  }, [dispatch, station, dragOffsetsRef])

  return (
    <Circle
      x={station.x + (dragOffsetsRef.current[station.id]?.x || 0)}
      y={station.y + (dragOffsetsRef.current[station.id]?.y || 0)}
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
