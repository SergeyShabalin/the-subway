import { Circle } from 'react-konva'
import {
  memo,
  type RefObject,
  useCallback,
  useRef,
  type Dispatch,
  type SetStateAction,
} from 'react'
import { useDispatch } from 'react-redux'
// import { updateStationPosition } from '@/store/slices/metro-slices.ts'
import type { Stage } from 'konva/lib/Stage'
import { useMetro } from '@/store/hooks/use-metro.ts'
import { updateStationPosition } from '../../../../src/store/slices/metro-slices.ts'
// import { useStationGradient } from '@components/stations/station/hooks/use-station-gradient.ts'

export const getPointOnCircleEdge = (
  fromPos: { x: number; y: number },
  toPos: { x: number; y: number },
  radius: number,
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
  visualStation: any
  dragOffsetsRef: RefObject<Record<string, { x: number; y: number }>>
  stageRef: RefObject<Stage> | null
  isHovered: boolean
  onMouseEnter: (id: string) => void
  onMouseLeave: () => void
  updateCursor: (cursor: string) => void
  lineIds: number[]
  setLineDragOffset: Dispatch<SetStateAction<{ x: number; y: number } | null>>
}

export const Station = memo(
  ({
    visualStation,
    dragOffsetsRef,
    stageRef,
    isHovered,
    onMouseEnter,
    onMouseLeave,
    updateCursor,
    lineIds,
    setLineDragOffset,
  }: StationProps) => {
    const dispatch = useDispatch()
    const { metroNetwork } = useMetro()

    const circleRef = useRef<any>(null)
    const isDraggingLineRef = useRef(false)

    // Находим логические станции для этой визуальной точки
    const logicalIds = useRef<string[]>(
      metroNetwork.connections.visualToLogical[visualStation.id] || [],
    )

    // Определяем, является ли станция пересадочной
    const isTransferStation =
      lineIds.length > 1 || visualStation.displayMode === 'multiple'

    // Используем оптимизированный хук для градиента
    // const stationGradient = useStationGradient(visualStation)
     const stationGradient = ''

    // Получаем цвет линии (берем первую линию)
    const getStrokeColor = useCallback(() => {
      if (lineIds.length === 0) return '#cccccc'
      const line = metroNetwork.lines[lineIds[0]]
      return line?.color || '#cccccc'
    }, [lineIds, metroNetwork.lines])

    // Функция для определения толщины обводки
    const getStrokeWidth = () => {
      if (isTransferStation) {
        return isHovered ? 8 : 7
      } else {
        return isHovered ? 3 : 2
      }
    }

    // Обновление метки при перемещении станции
    const updateLabelPosition = useCallback(
      (newX: number, newY: number) => {
        const stage = stageRef?.current
        if (!stage) return

        // Обновляем лейбл
        const labelNode = stage.findOne(`#label-${visualStation.id}`)
        if (labelNode) {
          labelNode.position({
            x: newX + (visualStation.labelOffset?.x || 0),
            y: newY + (visualStation.labelOffset?.y || 0),
          })
        }
      },
      [stageRef, visualStation.id, visualStation.labelOffset],
    )

    // Обновление линий при перемещении станции (только визуальное)
    const updateConnectedLines = useCallback(
      (newX: number, newY: number, isDragEnd: boolean = false) => {
        const stage = stageRef?.current
        if (!stage) return

        // Для каждой логической станции в этой визуальной точке
        logicalIds.current.forEach((logicalId) => {
          // Находим сегменты, связанные с этой логической станцией
          const segmentIds =
            metroNetwork.connections.logicalToSegments[logicalId] || []

          segmentIds.forEach((segmentId) => {
            const segment = metroNetwork.logic.segments[segmentId]
            if (!segment) return

            const lineNodes = stage.find((node) => {
              const id = node.getId?.()
              if (!id || !id.startsWith('line-')) return false
              return id.includes(segmentId)
            })

            lineNodes.forEach((node) => {
              if (node.getClassName && node.getClassName() === 'Line') {
                // Обновляем линию (упрощенно, без сложных вычислений)
                node.attrs.forceRecalc = true
              }
            })
          })
        })

        if (!isDragEnd) {
          circleRef.current?.getLayer()?.batchDraw()
        }
      },
      [stageRef, metroNetwork],
    )

    // Обработчики событий мыши
    const handleMouseEnterStation = useCallback(() => {
      onMouseEnter(visualStation.id)
    }, [onMouseEnter, visualStation.id])

    const handleMouseLeaveStation = useCallback(() => {
      onMouseLeave()
    }, [onMouseLeave])

    // Обработчики перетаскивания
    const handleDragStartStation = useCallback(() => {
      updateCursor('grabbing')
      isDraggingLineRef.current = false

      // Очищаем смещения для этой визуальной точки
      logicalIds.current.forEach((logicalId) => {
        delete dragOffsetsRef.current[logicalId]
      })
    }, [updateCursor, dragOffsetsRef])

    const handleDragMove = useCallback(
      (e: any) => {
        const node = e.target
        const x = node.x()
        const y = node.y()

        // Обновляем только визуальные элементы (без сохранения в состояние)
        updateLabelPosition(x, y)
        updateConnectedLines(x, y, false)

        // Сохраняем смещение для этой визуальной точки
        const offsetX = x - visualStation.x
        const offsetY = y - visualStation.y

        logicalIds.current.forEach((logicalId) => {
          dragOffsetsRef.current[logicalId] = { x: offsetX, y: offsetY }
        })
      },
      [
        visualStation.x,
        visualStation.y,
        updateLabelPosition,
        updateConnectedLines,
        dragOffsetsRef,
      ],
    )

    const handleDragEnd = useCallback(
      (e: any) => {
        const node = e.target
        const x = node.x()
        const y = node.y()

        // Обновляем линии (финальное обновление)
        updateConnectedLines(x, y, true)

        // Обновляем позицию в хранилище для всех связанных логических станций
        logicalIds.current.forEach((logicalId) => {
          dispatch(
            updateStationPosition({
              stationId: logicalId,
              x: x,
              y: y,
            }),
          )
        })

        // Очищаем смещения
        logicalIds.current.forEach((logicalId) => {
          delete dragOffsetsRef.current[logicalId]
        })

        // Обновляем визуальную позицию (если это нужно)
        visualStation.x = x
        visualStation.y = y

        updateCursor(isHovered ? 'grab' : 'default')
      },
      [
        dispatch,
        visualStation,
        updateConnectedLines,
        dragOffsetsRef,
        updateCursor,
        isHovered,
      ],
    )

    return (
      <Circle
        ref={circleRef}
        id={`station-${visualStation.id}`}
        x={visualStation.x}
        y={visualStation.y}
        radius={13}
        fill={
          isHovered
            ? stationGradient
              ? 'transparent'
              : getStrokeColor()
            : 'transparent'
        }
        stroke={getStrokeColor()}
        strokeWidth={getStrokeWidth()}
        shadowColor={isHovered ? getStrokeColor() : 'rgba(0,0,0,0.2)'}
        shadowBlur={isHovered ? 10 : 5}
        shadowOpacity={isHovered ? 0.6 : 0.4}
        draggable={true}
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
  },
)
