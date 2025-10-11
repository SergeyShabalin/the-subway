// Station.tsx
import { Circle } from 'react-konva'
import { memo, type RefObject, useCallback, useEffect, useRef, useMemo } from 'react'
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

// Оптимизированная функция для расчета направлений линий
const useStationGradient = (station: any) => {
  const { metroNetwork } = useMetro()

  return useMemo(() => {
    // Находим все линии, к которым принадлежит станция
    const stationLines = metroNetwork.filter(line =>
      line.stations.some((s: any) => s.id === station.id)
    )

    // Если станция не пересадочная, возвращаем null
    if (stationLines.length <= 1) return null

    const directionsByColor = new Map<string, { angles: number[]; color: string }>()

    // Ограничиваем поиск только линиями, к которым принадлежит станция
    stationLines.forEach(line => {
      line.segments.forEach((segment: any) => {
        if (segment.fromStationId === station.id || segment.toStationId === station.id) {
          const otherStationId = segment.fromStationId === station.id ? segment.toStationId : segment.fromStationId
          const otherStation = line.stations.find((s: any) => s.id === otherStationId)

          if (otherStation) {
            const dx = otherStation.x - station.x
            const dy = otherStation.y - station.y
            const angle = Math.atan2(dy, dx) * (180 / Math.PI)

            if (!directionsByColor.has(line.color)) {
              directionsByColor.set(line.color, { angles: [], color: line.color })
            }
            directionsByColor.get(line.color)!.angles.push(angle)
          }
        }
      })
    })

    const directions: { angle: number; color: string }[] = []

    directionsByColor.forEach((value, color) => {
      if (value.angles.length > 0) {
        let sumSin = 0
        let sumCos = 0

        value.angles.forEach(angle => {
          const rad = angle * Math.PI / 180
          sumSin += Math.sin(rad)
          sumCos += Math.cos(rad)
        })

        const avgAngle = Math.atan2(sumSin / value.angles.length, sumCos / value.angles.length) * (180 / Math.PI)
        directions.push({ angle: avgAngle, color })
      }
    })

    if (directions.length > 1) {
      const sortedDirections = [...directions].sort((a, b) => a.angle - b.angle)
      const startAngle = sortedDirections[0].angle
      const endAngle = sortedDirections[sortedDirections.length - 1].angle

      return {
        type: 'linear' as const,
        startAngle,
        endAngle,
        colors: sortedDirections.map(d => d.color)
      }
    } else if (stationLines.length > 1) {
      return {
        type: 'radial' as const,
        colors: stationLines.map(line => line.color)
      }
    }

    return null
  }, [station.id, station.x, station.y, metroNetwork])
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
  lineMoveEnabled: boolean
  setLineDragOffset: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>
  activeLineId: number | null
  canMoveCircularLine: boolean
  stationLine?: any
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
                               isActiveCircular,
                               lineMoveEnabled,
                               setLineDragOffset,
                               activeLineId,
                               canMoveCircularLine,
                               stationLine
                             }: StationProps) => {
  const dispatch = useDispatch()
  const { metroNetwork } = useMetro()

  const circleRef = useRef<any>(null)
  const isDraggingLineRef = useRef(false)

  const centerRef = useRef<{ x: number; y: number } | null>(null)
  const angleRef = useRef<number | null>(null)
  const originalAngleRef = useRef<number | null>(null)

  // Находим все линии, к которым принадлежит станция
  const stationLines = useMemo(() => {
    return metroNetwork.filter(line =>
      line.stations.some((s: any) => s.id === station.id)
    )
  }, [metroNetwork, station.id])

  // Определяем, является ли станция пересадочной
  const isTransferStation = stationLines.length > 1

  // Определяем, является ли станция частью активной круговой линии
  const isPartOfActiveCircularLine = useMemo(() => {
    if (!activeLineId) return false
    const activeLine = metroNetwork.find(line => line.id === activeLineId)
    return activeLine?.renderStyle === 'circular' &&
      activeLine?.locking &&
      activeLine.stations.some(s => s.id === station.id)
  }, [activeLineId, metroNetwork, station.id])

  // Используем оптимизированный хук для градиента
  const stationGradient = useStationGradient(station)

  // Применение градиента к кругу
  const applyGradient = useCallback(() => {
    if (!circleRef.current || !stationGradient) return;

    const circle = circleRef.current;

    if (stationGradient.type === 'linear') {
      const { startAngle, endAngle, colors } = stationGradient;

      const startX = Math.cos(startAngle * Math.PI / 180);
      const startY = Math.sin(startAngle * Math.PI / 180);
      const endX = Math.cos(endAngle * Math.PI / 180);
      const endY = Math.sin(endAngle * Math.PI / 180);

      circle.strokeLinearGradientStartPoint({
        x: startX * 14,
        y: startY * 14
      });
      circle.strokeLinearGradientEndPoint({
        x: endX * 14,
        y: endY * 14
      });

      const colorStops: any[] = [];
      const angleRange = endAngle - startAngle;

      // Добавляем плавные переходы между цветами
      colors.forEach((color, index) => {
        const position = index / (colors.length - 1);
        colorStops.push(position, color);

        // Добавляем промежуточные точки для более плавного градиента
        if (index < colors.length - 1) {
          const nextPosition = (index + 0.5) / (colors.length - 1);
          colorStops.push(nextPosition, color);
        }
      });

      circle.strokeLinearGradientColorStops(colorStops);

    } else if (stationGradient.type === 'radial') {
      const { colors } = stationGradient;

      circle.strokeRadialGradientStartPoint({ x: 0, y: 0 });
      circle.strokeRadialGradientStartRadius(0);
      circle.strokeRadialGradientEndPoint({ x: 0, y: 0 });
      circle.strokeRadialGradientEndRadius(14);

      const radialColorStops: any[] = [];
      const segmentCount = colors.length;

      colors.forEach((color, index) => {
        const startPosition = index / segmentCount;
        const endPosition = (index + 1) / segmentCount;

        radialColorStops.push(startPosition, color);
        // Добавляем небольшую зону смешивания цветов
        const blendPosition = startPosition + 0.1;
        if (blendPosition < endPosition) {
          radialColorStops.push(blendPosition, color);
        }
        radialColorStops.push(endPosition, color);
      });

      circle.strokeRadialGradientColorStops(radialColorStops);
    }
  }, [stationGradient]);

  // Применяем градиент при монтировании и при изменении позиции
  useEffect(() => {
    if (isTransferStation) {
      applyGradient();
    }
  }, [applyGradient, isTransferStation, station.x, station.y]);

  // Обновление ВСЕХ станций линии при перемещении всей линии
  const updateAllLineStations = useCallback((deltaX: number, deltaY: number) => {
    const stage = stageRef?.current
    if (!stage || !activeLineId) return

    const line = metroNetwork.find(l => l.id === activeLineId)
    if (!line) return

    line.stations.forEach(st => {
      const stationNode = stage.findOne(`#station-${st.id}`)
      if (stationNode) {
        stationNode.position({
          x: st.x + deltaX,
          y: st.y + deltaY
        })
      }

      const labelNode = stage.findOne(`#label-${st.id}`)
      if (labelNode) {
        labelNode.position({
          x: st.x + (st.labelOffset?.x || 0) + deltaX,
          y: st.y + (st.labelOffset?.y || 0) + deltaY
        })
      }
    })

    const lineNodes = stage.find(node => {
      const id = node.getId?.()
      if (!id || !id.startsWith('line-')) return false
      const parts = id.split('-')
      if (parts.length < 2) return false
      const lineId = parseInt(parts[1], 10)
      return lineId === activeLineId
    })

    lineNodes.forEach(node => {
      if (node.getClassName && node.getClassName() === 'Path') {
        node.attrs.forceRecalc = true
      }
    })

    stage.batchDraw()
  }, [stageRef, activeLineId, metroNetwork])

  // Обновление меток и линий при перемещении станции
  const updateConnectedElements = useCallback((newX: number, newY: number) => {
    const stage = stageRef?.current
    if (!stage) return

    const dx = newX - station.x
    const dy = newY - station.y
    dragOffsetsRef.current[station.id] = { x: dx, y: dy }

    // Обновляем лейбл
    const labelNode = stage.findOne(`#label-${station.id}`)
    if (labelNode) {
      labelNode.position({
        x: newX + (station.labelOffset?.x || 0),
        y: newY + (station.labelOffset?.y || 0)
      })
    }

    // Обновляем линии
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

  // Инициализация центра и угла для круговых линий
  useEffect(() => {
    if (!isPartOfActiveCircularLine) return

    const activeLine = metroNetwork.find(line => line.id === activeLineId)
    if (!activeLine) return

    const stations = activeLine.stations
    const centerX = stations.reduce((sum, s) => sum + s.x, 0) / stations.length
    const centerY = stations.reduce((sum, s) => sum + s.y, 0) / stations.length

    const dx = station.x - centerX
    const dy = station.y - centerY
    const angle = Math.atan2(dy, dx)

    centerRef.current = { x: centerX, y: centerY }
    angleRef.current = angle
    originalAngleRef.current = angle
  }, [station.x, station.y, isPartOfActiveCircularLine, activeLineId, metroNetwork])

  // Обновление позиции при изменении радиуса или поворота для ВСЕХ станций активной круговой линии
  useEffect(() => {
    if (!isPartOfActiveCircularLine || !circleRef.current) return

    const updatePosition = () => {
      const radius = circleRadiusRef.current
      const rotationAngle = rotationAngleRef.current || 0

      if (radius == null || !centerRef.current || !originalAngleRef.current) return

      const { x: centerX, y: centerY } = centerRef.current
      const rotatedAngle = originalAngleRef.current + rotationAngle

      const newX = centerX + radius * Math.cos(rotatedAngle)
      const newY = centerY + radius * Math.sin(rotatedAngle)

      // Обновляем позицию станции
      circleRef.current.position({ x: newX, y: newY })

      // Обновляем связанные элементы
      updateConnectedElements(newX, newY)
    }

    const interval = setInterval(updatePosition, 16)
    return () => clearInterval(interval)
  }, [isPartOfActiveCircularLine, circleRadiusRef.current, rotationAngleRef.current, updateConnectedElements])

  const handleMouseEnterStation = useCallback(() => {
    onMouseEnter(station.id)
  }, [onMouseEnter, station.id])

  const handleMouseLeaveStation = useCallback(() => {
    onMouseLeave()
  }, [onMouseLeave])

  const handleDragStartStation = useCallback(() => {
    if (isActiveCircular && !canMoveCircularLine) return

    if ((lineMoveEnabled || canMoveCircularLine) && activeLineId) {
      isDraggingLineRef.current = true
      updateCursor('grabbing')
      const line = metroNetwork.find(l => l.id === activeLineId)
      if (line) {
        line.stations.forEach(st => {
          delete dragOffsetsRef.current[st.id]
        })
      }
    } else {
      isDraggingLineRef.current = false
      updateCursor('grabbing')
    }
  }, [updateCursor, isActiveCircular, lineMoveEnabled, activeLineId, metroNetwork, canMoveCircularLine, dragOffsetsRef])

  const handleDragEndStation = useCallback(() => {
    updateCursor(isHovered ? 'grab' : 'default')
    isDraggingLineRef.current = false
  }, [updateCursor, isHovered])

  const handleDragMove = useCallback((e: any) => {
    if (isActiveCircular && !canMoveCircularLine) return

    const node = e.target
    const x = node.x()
    const y = node.y()

    if ((lineMoveEnabled || canMoveCircularLine) && activeLineId && isDraggingLineRef.current) {
      const deltaX = x - station.x
      const deltaY = y - station.y

      setLineDragOffset({ x: deltaX, y: deltaY })
      updateAllLineStations(deltaX, deltaY)
    } else {
      updateConnectedElements(x, y)
    }
  }, [isActiveCircular, lineMoveEnabled, activeLineId, station.x, station.y, updateConnectedElements, setLineDragOffset, canMoveCircularLine, updateAllLineStations])

  const handleDragEnd = useCallback((e: any) => {
    if (isActiveCircular && !canMoveCircularLine) return

    const node = e.target
    const x = node.x()
    const y = node.y()

    if ((lineMoveEnabled || canMoveCircularLine) && activeLineId && isDraggingLineRef.current) {
      const line = metroNetwork.find(l => l.id === activeLineId)
      if (line) {
        line.stations.forEach(st => {
          dispatch(updateStationPosition({
            stationId: st.id,
            x: st.x + (x - station.x),
            y: st.y + (y - station.y)
          }))
        })
        setLineDragOffset(null)

        line.stations.forEach(st => {
          delete dragOffsetsRef.current[st.id]
        })
      }
    } else {
      delete dragOffsetsRef.current[station.id]
      dispatch(updateStationPosition({
        stationId: station.id,
        x: x,
        y: y
      }))
    }

    handleDragEndStation()
  }, [dispatch, station, dragOffsetsRef, isActiveCircular, lineMoveEnabled, activeLineId, metroNetwork, handleDragEndStation, setLineDragOffset, canMoveCircularLine])

  const draggable = !isActiveCircular || canMoveCircularLine

  // Определяем цвет для обычных станций
  const getStrokeColor = () => {
    return station.color
  }

  // Функция для определения толщины обводки
  const getStrokeWidth = () => {
    if (isTransferStation) {
      return isHovered ? 8 : 7; // Толще для пересадочных станций
    } else {
      return isHovered ? 3 : 2; // Обычная толщина
    }
  }

  return (
    <Circle
      ref={circleRef}
      id={`station-${station.id}`}
      x={station.x}
      y={station.y}
      radius={13}
      fill={isHovered ? (stationGradient ? 'transparent' : getStrokeColor()) : 'transparent'}
      stroke={getStrokeColor()}
      strokeWidth={getStrokeWidth()}
      shadowColor={isHovered ? getStrokeColor() : 'rgba(0,0,0,0.2)'}
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