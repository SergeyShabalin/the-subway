import { Circle } from 'react-konva'
import { memo, type RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateStationPosition } from '../../../store/slices/metro-slices.ts'
import type { Stage } from 'konva/lib/Stage'
import { useMetro } from '../../../store/hooks/use-metro.ts'

// Вспомогательные функции (вынесены, чтобы использовать везде)
export const getPointOnCircleEdge = (
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
  return { x: fromPos.x + nx * radius, y: fromPos.y + ny * radius }
}

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
  const { metroNetwork, activeLineId } = useMetro()
  const [isHovered, setIsHovered] = useState(false)
  const circleRef = useRef<any>(null)

  const stationLine = metroNetwork.find(line =>
    line.stations.some(s => s.id === station.id)
  )

  const isLockedCircular =
    stationLine?.renderStyle === 'circular' &&
    stationLine.locking

  const isActiveCircular = isLockedCircular && stationLine.id === activeLineId

  const centerRef = useRef<{ x: number; y: number } | null>(null)
  const angleRef = useRef<number | null>(null)

  // Инициализация центра и угла
  useEffect(() => {
    if (!isLockedCircular) return

    const stations = stationLine!.stations
    const centerX = stations.reduce((sum, s) => sum + s.x, 0) / stations.length
    const centerY = stations.reduce((sum, s) => sum + s.y, 0) / stations.length

    const dx = station.x - centerX
    const dy = station.y - centerY
    const angle = Math.atan2(dy, dx)

    centerRef.current = { x: centerX, y: centerY }
    angleRef.current = angle
  }, [station.x, station.y, isLockedCircular, stationLine])

  // Функция обновления связанных элементов (метки, линии)
  const updateConnectedElements = useCallback((newX: number, newY: number) => {
    const stage = stageRef.current
    if (!stage) return

    // Обновляем dragOffsetsRef
    const dx = newX - station.x
    const dy = newY - station.y
    dragOffsetsRef.current[station.id] = { x: dx, y: dy }

    // Метка
    const labelNode = stage.findOne(`#label-${station.id}`)
    if (labelNode) {
      labelNode.position({
        x: newX + (station.labelOffset?.x || 0),
        y: newY + (station.labelOffset?.y || 0)
      })
    }

    // Линии
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
        const parts = line.getId().split('-')
        const fromId = parseInt(parts[2], 10)
        const toId = parseInt(parts[3], 10)
        const variant = parts[4]
        const points = line.points()
        const stationRadius = 14
        const offset = 4
        const actualOffset = variant === 'a' ? offset : variant === 'b' ? -offset : 0

        const getLivePos = (stationId: number) => {
          const st = metroNetwork.flatMap(l => l.stations).find(s => s.id === stationId)
          if (!st) return { x: 0, y: 0 }
          const offset = dragOffsetsRef.current[stationId] ?? { x: 0, y: 0 }
          return { x: st.x + offset.x, y: st.y + offset.y }
        }

        const fromPos = fromId === station.id
          ? { x: newX, y: newY }
          : getLivePos(fromId)
        const toPos = toId === station.id
          ? { x: newX, y: newY }
          : getLivePos(toId)

        const dxLine = toPos.x - fromPos.x
        const dyLine = toPos.y - fromPos.y
        const len = Math.sqrt(dxLine * dxLine + dyLine * dyLine) || 1
        const nx = dxLine / len
        const ny = dyLine / len
        const px = -ny
        const py = nx

        const fromEdge = getPointOnCircleEdge(fromPos, toPos, stationRadius)
        const toEdge = getPointOnCircleEdge(toPos, fromPos, stationRadius)

        points[0] = fromEdge.x + px * actualOffset
        points[1] = fromEdge.y + py * actualOffset
        points[2] = toEdge.x + px * actualOffset
        points[3] = toEdge.y + py * actualOffset

        line.points(points)
      } else if (node.getClassName() === 'Path') {
        const orig = node.attrs.originalCoords
        if (!orig) return

        // ВСЕГДА получаем актуальные позиции обеих станций
        const getLivePos = (stationId: number) => {
          const st = metroNetwork.flatMap(l => l.stations).find(s => s.id === stationId)
          if (!st) return { x: 0, y: 0 }
          const offset = dragOffsetsRef.current[stationId] ?? { x: 0, y: 0 }
          return { x: st.x + offset.x, y: st.y + offset.y }
        }

        const fromStation = orig.from.id === station.id
          ? { x: newX, y: newY }
          : getLivePos(orig.from.id)

        const toStation = orig.to.id === station.id
          ? { x: newX, y: newY }
          : getLivePos(orig.to.id)




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

    circleRef.current?.getLayer()?.batchDraw()
  }, [dragOffsetsRef, stageRef, station, metroNetwork])

  // Подписка на circleRadiusRef
  useEffect(() => {
    if (!isActiveCircular || !circleRef.current) return

    const interval = setInterval(() => {
      const radius = circleRadiusRef.current
      if (radius == null || !centerRef.current || !angleRef.current) return

      const { x: centerX, y: centerY } = centerRef.current
      const angle = angleRef.current

      const newX = centerX + radius * Math.cos(angle)
      const newY = centerY + radius * Math.sin(angle)

      // Обновляем позицию через Konva API
      circleRef.current.position({ x: newX, y: newY })

      // Обновляем всё остальное
      updateConnectedElements(newX, newY)
    }, 16)

    return () => clearInterval(interval)
  }, [isActiveCircular, circleRadiusRef, updateConnectedElements])

  // --- Drag-логика ---
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
    if (isActiveCircular) return

    const node = e.target
    const newX = node.x()
    const newY = node.y()

    updateConnectedElements(newX, newY)
  }, [updateConnectedElements, isActiveCircular])

  const handleDragStart = useCallback((e: any) => {
    if (isActiveCircular) return
    updateCursor('grabbing')
  }, [updateCursor, isActiveCircular])

  const handleDragEnd = useCallback((e: any) => {
    if (isActiveCircular) return

    const node = e.target
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
  }, [dispatch, station, dragOffsetsRef, isHovered, updateCursor, isActiveCircular])

  const draggable = !isActiveCircular

  return (
    <Circle
      ref={circleRef}
      x={station.x}
      y={station.y}
      radius={14}
      fill={isHovered ? station.color : 'transparent'}
      stroke={station.color}
      strokeWidth={isHovered ? 3 : 2}
      shadowColor={isHovered ? station.color : 'rgba(0,0,0,0.2)'}
      shadowBlur={isHovered ? 10 : 5}
      shadowOpacity={isHovered ? 0.6 : 0.4}
      draggable={draggable}
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