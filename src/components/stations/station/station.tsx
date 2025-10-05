import { Circle } from 'react-konva'
import { memo, type RefObject, useCallback, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { updateStationPosition } from '@/store/slices/metro-slices.ts'
import type { Stage } from 'konva/lib/Stage'
import { useMetro } from '@/store/hooks/use-metro.ts'

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
  dragOffsetsRef: RefObject<Record<number, { x: number; y: number }>>
  stageRef: RefObject<Stage> | null
  circleRadiusRef: RefObject<number>
  rotationAngleRef?: RefObject<number>
  isHovered: boolean
  onMouseEnter: (id: number) => void
  onMouseLeave: () => void
  updateCursor: (cursor: string) => void
  isActiveCircular: boolean
}

export const Station = memo(({
                               station,
                               dragOffsetsRef,
                               stageRef,
                               circleRadiusRef,
                               rotationAngleRef = { current: 0 },
                               isHovered,
                               onMouseEnter,
                               onMouseLeave,
                               updateCursor,
                               isActiveCircular
                             }: StationProps) => {
  const dispatch = useDispatch()
  const { metroNetwork } = useMetro()

  const circleRef = useRef<any>(null)

  const stationLine = metroNetwork.find(line =>
    line.stations.some(s => s.id === station.id)
  )

  const isLockedCircular =
    stationLine?.renderStyle === 'circular' &&
    stationLine.locking

  const centerRef = useRef<{ x: number; y: number } | null>(null)
  const angleRef = useRef<number | null>(null)
  const originalAngleRef = useRef<number | null>(null)

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
    originalAngleRef.current = angle // Сохраняем исходный угол
  }, [station.x, station.y, isLockedCircular, stationLine])

  // Обновление меток и линий при перемещении станции
  const updateConnectedElements = useCallback((newX: number, newY: number) => {
    const stage = stageRef?.current
    if (!stage) return

    // обновляем смещения
    const dx = newX - station.x
    const dy = newY - station.y
    dragOffsetsRef.current[station.id] = { x: dx, y: dy }

    // обновляем лейбл
    const labelNode = stage.findOne(`#label-${station.id}`)
    if (labelNode) {
      labelNode.position({
        x: newX + (station.labelOffset?.x || 0),
        y: newY + (station.labelOffset?.y || 0)
      })
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
      if (node.getClassName && node.getClassName() === 'Line') {
        // прямые линии
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
          const offs = dragOffsetsRef.current[stationId] ?? { x: 0, y: 0 }
          return { x: st.x + offs.x, y: st.y + offs.y }
        }

        const fromPos = fromId === station.id ? { x: newX, y: newY } : getLivePos(fromId)
        const toPos   = toId   === station.id ? { x: newX, y: newY } : getLivePos(toId)

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
      } else if (node.getClassName && node.getClassName() === 'Path') {
        // кривые линии
        const orig = node.attrs.originalCoords
        if (!orig) return

        const { fromId, toId, lineId, curvature } = orig

        const getLivePos = (id: number) => {
          const st = metroNetwork.flatMap(l => l.stations).find(s => s.id === id)
          if (!st) return { x: 0, y: 0 }
          const offs = dragOffsetsRef.current[id] ?? { x: 0, y: 0 }
          return { x: st.x + offs.x, y: st.y + offs.y }
        }

        const fromStation = fromId === station.id ? { x: newX, y: newY } : getLivePos(fromId)
        const toStation   = toId   === station.id ? { x: newX, y: newY } : getLivePos(toId)

        const midX = (fromStation.x + toStation.x) / 2
        const midY = (fromStation.y + toStation.y) / 2
        const dxLine = toStation.x - fromStation.x
        const dyLine = toStation.y - fromStation.y
        const length = Math.sqrt(dxLine * dxLine + dyLine * dyLine)
        if (length === 0) return

        const perpX = -dyLine / length
        const perpY = dxLine / length

        const control = {
          x: midX + perpX * (curvature ?? 50),
          y: midY + perpY * (curvature ?? 50)
        }

        const start = getPointOnCircleEdge(fromStation, control, 14)
        const end   = getPointOnCircleEdge(toStation, control, 14)

        node.data(`M ${start.x},${start.y} Q ${control.x},${control.y} ${end.x},${end.y}`)
      }
    })

    circleRef.current?.getLayer()?.batchDraw()
  }, [dragOffsetsRef, stageRef, station, metroNetwork])

  // Следим за изменением радиуса И поворота для круговой линии
  useEffect(() => {
    if (!isActiveCircular || !circleRef.current) return

    const interval = setInterval(() => {
      const radius = circleRadiusRef.current
      const rotationAngle = rotationAngleRef.current || 0

      if (radius == null || !centerRef.current || !originalAngleRef.current) return

      const { x: centerX, y: centerY } = centerRef.current

      // Применяем поворот к исходному углу
      const rotatedAngle = originalAngleRef.current + rotationAngle

      const newX = centerX + radius * Math.cos(rotatedAngle)
      const newY = centerY + radius * Math.sin(rotatedAngle)

      circleRef.current.position({ x: newX, y: newY })
      updateConnectedElements(newX, newY)
    }, 16)

    return () => clearInterval(interval)
  }, [isActiveCircular, circleRadiusRef, rotationAngleRef, updateConnectedElements])

  const handleMouseEnterStation = useCallback(() => {
    onMouseEnter(station.id)
  }, [onMouseEnter, station.id])

  const handleMouseLeaveStation = useCallback(() => {
    onMouseLeave()
  }, [onMouseLeave])

  const handleDragStartStation = useCallback(() => {
    if (isActiveCircular) return
    updateCursor('grabbing')
  }, [updateCursor, isActiveCircular])

  const handleDragEndStation = useCallback(() => {
    updateCursor(isHovered ? 'grab' : 'default')
  }, [updateCursor, isHovered])

  const handleDragMove = useCallback((e: any) => {
    if (isActiveCircular) return
    const node = e.target
    updateConnectedElements(node.x(), node.y())
  }, [updateConnectedElements, isActiveCircular])

  const handleDragEnd = useCallback((e: any) => {
    if (isActiveCircular) return
    const node = e.target
    delete dragOffsetsRef.current[station.id]
    handleDragEndStation()
    dispatch(updateStationPosition({
      stationId: station.id,
      x: node.x(),
      y: node.y()
    }))
  }, [dispatch, station, dragOffsetsRef, isActiveCircular])

  const draggable = !isActiveCircular

  return (
    <Circle
      ref={circleRef}
      x={station.x}
      y={station.y}
      radius={13}
      fill={isHovered ? station.color : 'transparent'}
      stroke={station.color}
      strokeWidth={isHovered ? 3 : 2}
      shadowColor={isHovered ? station.color : 'rgba(0,0,0,0.2)'}
      shadowBlur={isHovered ? 10 : 5}
      shadowOpacity={isHovered ? 0.6 : 0.4}
      draggable={draggable}
      onMouseEnter={handleMouseEnterStation}
      onMouseLeave={handleMouseLeaveStation}
      onDragStart={handleDragStartStation}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      perfectDrawEnabled={false}
      listening={true}
      shadowEnabled={true}
      hitStrokeWidth={20}
    />
  )
})