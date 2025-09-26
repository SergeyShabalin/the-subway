import { Circle, Line } from 'react-konva'
import { memo, type RefObject, useCallback, useRef, useState } from 'react'
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
  circleRadiusRef: RefObject<number>
}

export const Station = memo(({
                               station,
                               dragOffsetsRef,
                               stageRef,
                               hoveredStationId,
                               handleMouseEnter,
                               handleMouseLeave,
                               circleRadiusRef
                             }: StationProps) => {
  const dispatch = useDispatch()
  const { metroNetwork } = useMetro()
  const [isHovered, setIsHovered] = useState(false)

  const radiusRef = useRef<any>(null)


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

  const updateCursor = useCallback((cursorType: string) => {
    const stage = stageRef.current
    if (stage && stage.container()) {
      stage.container().style.cursor = cursorType
    }
  }, [stageRef])

  const handleMouseEnterStation = useCallback((e: any) => {
    setIsHovered(true)
    handleMouseEnter(station.id)
    updateCursor('grab')
  }, [handleMouseEnter, station.id, updateCursor])

  const handleMouseLeaveStation = useCallback((e: any) => {
    setIsHovered(false)
    handleMouseLeave()
    updateCursor('default')
  }, [handleMouseLeave, updateCursor])

  const handleDragMove = useCallback((e: any) => {
    const node = e.target;
    const newX = node.x();
    const newY = node.y();

    node.setPosition({ x: newX, y: newY });

    const dx = newX - station.x
    const dy = newY - station.y
    dragOffsetsRef.current[station.id] = { x: dx, y: dy }

    const stage = stageRef.current
    if (!stage) return

    const labelNode = stage.findOne(`#label-${station.id}`)
    if (labelNode) {
      labelNode.setPosition({
        x: newX + (station.labelOffset?.x || 0),
        y: newY + (station.labelOffset?.y || 0)
      })
    }

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
        const stationRadius = 15
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

        const start = getPointOnCircleEdge(fromStation, control, 14)
        const end = getPointOnCircleEdge(toStation, control, 14)

        node.data(`M ${start.x},${start.y} Q ${control.x},${control.y} ${end.x},${end.y}`)
      }
    })

    node.getLayer()?.batchDraw()
  }, [dragOffsetsRef, stageRef, station, metroNetwork])

  const handleDragStart = useCallback((e: any) => {
    updateCursor('grabbing')
  }, [updateCursor])

  const handleDragEnd = useCallback((e: any) => {
    const node = e.target;
    delete dragOffsetsRef.current[station.id]

    if (isHovered) {
      updateCursor('grab')
    } else {
      updateCursor('default')
    }

    dispatch(updateStationPosition({
      stationId: station.id,
      x: node.x(),
      y: node.y()
    }))
  }, [dispatch, station, dragOffsetsRef, isHovered, updateCursor])

  const currentOffset = dragOffsetsRef.current[station.id] || { x: 0, y: 0 }

  const getStationStyles = () => {
    return {
      fill: isHovered ? `${station.color}` : 'transparent',
      stroke: station.color,
      strokeWidth: isHovered ? 3 : 2,
      shadowColor: isHovered ? station.color : 'rgba(0,0,0,0.2)',
      shadowBlur: isHovered ? 10 : 5,
      shadowOpacity: isHovered ? 0.6 : 0.4,
    }
  }

  return (
    <Circle
      x={station.x + currentOffset.x}
      y={station.y + currentOffset.y}
      radius={14}
      {...getStationStyles()}
      draggable
      onMouseEnter={handleMouseEnterStation}
      onMouseLeave={handleMouseLeaveStation}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      perfectDrawEnabled={false}
      listening={true}
      shadowEnabled={true}
      hitStrokeWidth={20}
    />
  )
})