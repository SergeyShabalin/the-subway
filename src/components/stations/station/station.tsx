import { Circle } from 'react-konva'
import { memo, useCallback, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { updateStationPosition } from '../../../store/slices/metro-slices.ts'
import type { Stage } from 'konva/lib/Stage'
import { useMetro } from '../../../store/hooks/use-metro.ts'

interface StationProps {
  station: any
  dragOffsetsRef: React.MutableRefObject<
    Record<number, { x: number; y: number }>
  >
  stageRef: React.RefObject<Stage>
  hoveredStationId: number | null
  handleMouseEnter: (id: number) => void
  handleMouseLeave: () => void
}

export const Station = memo(
  ({
    station,
    dragOffsetsRef,
    stageRef,
    hoveredStationId,
    handleMouseEnter,
    handleMouseLeave,
  }: StationProps) => {
    const dispatch = useDispatch()
    const { metroNetwork } = useMetro()
    const lastUpdateTimeRef = useRef(0)

    const getLivePos = (stationId: number) => {
      const st = metroNetwork
        .flatMap((l) => l.stations)
        .find((s) => s.id === stationId)
      if (!st) return { x: 0, y: 0 }
      const offset = dragOffsetsRef.current[stationId] ?? { x: 0, y: 0 }
      return { x: st.x + offset.x, y: st.y + offset.y }
    }

    const getPointOnCircleEdge = (
      fromPos: { x: number; y: number },
      toPos: { x: number; y: number },
      radius: number,
    ) => {
      const dx = toPos.x - fromPos.x
      const dy = toPos.y - fromPos.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance === 0) return fromPos

      const factor = radius / distance
      return {
        x: fromPos.x + dx * factor,
        y: fromPos.y + dy * factor,
      }
    }

    const handleDragMove = useCallback(
      (e: any) => {
        const now = Date.now()
        if (now - lastUpdateTimeRef.current < 16) {
          return
        }
        lastUpdateTimeRef.current = now

        const dx = e.target.x() - station.x
        const dy = e.target.y() - station.y
        dragOffsetsRef.current[station.id] = { x: dx, y: dy }

        const stage = stageRef.current
        if (!stage) return

        // Обновляем метку
        const labelNode = stage.findOne(`#label-${station.id}`)
        if (labelNode) {
          labelNode.position({
            x: station.x + dx + (station.labelOffset?.x || 0),
            y: station.y + dy + (station.labelOffset?.y || 0),
          })
        }

        // ИСПРАВЛЕННЫЙ ПОИСК ЛИНИЙ - ищем все линии, связанные со станцией
        const lineNodes = stage.find((node) => {
          const id = node.getId?.()
          if (!id || !id.startsWith('line-')) return false

          const parts = id.split('-')
          if (parts.length < 4) return false

          const fromId = parseInt(parts[2], 10)
          const toId = parseInt(parts[3], 10)

          // Проверяем, связана ли линия с текущей станцией
          return fromId === station.id || toId === station.id
        })

        console.log(
          `Найдено линий для станции ${station.id}:`,
          lineNodes.length,
        )

        lineNodes.forEach((node) => {
          if (node.getClassName() === 'Line') {
            const line = node as any
            const parts = line.getId().split('-')
            const fromId = parseInt(parts[2], 10)
            const toId = parseInt(parts[3], 10)
            const variant = parts[4]

            console.log(
              `Обновляем линию от ${fromId} к ${toId}, вариант: ${variant}`,
            )

            const points = line.points()
            const stationRadius = 12+1
            const offset = variant === 'a' ? 4 : variant === 'b' ? -4 : 0

            // Получаем актуальные позиции обеих станций
            const fromPos =
              fromId === station.id
                ? { x: station.x + dx, y: station.y + dy }
                : getLivePos(fromId)
            const toPos =
              toId === station.id
                ? { x: station.x + dx, y: station.y + dy }
                : getLivePos(toId)

            console.log(
              `Позиции: from (${fromPos.x}, ${fromPos.y}) to (${toPos.x}, ${toPos.y})`,
            )

            // Вычисляем направление линии
            const dxLine = toPos.x - fromPos.x
            const dyLine = toPos.y - fromPos.y
            const len = Math.sqrt(dxLine * dxLine + dyLine * dyLine) || 1

            // Перпендикуляр для смещения параллельных линий
            const px = -dyLine / len
            const py = dxLine / len

            // Точки на границах окружностей
            const fromEdge = getPointOnCircleEdge(fromPos, toPos, stationRadius)
            const toEdge = getPointOnCircleEdge(toPos, fromPos, stationRadius)

            // Применяем смещение для параллельных линий
            points[0] = fromEdge.x + px * offset
            points[1] = fromEdge.y + py * offset
            points[2] = toEdge.x + px * offset
            points[3] = toEdge.y + py * offset

            line.points(points)
            console.log(`Новые точки линии: [${points.join(', ')}]`)
          } else if (node.getClassName() === 'Path') {
            const orig = node.attrs.originalCoords
            if (!orig) return

            const fromStation =
              orig.from.id === station.id
                ? { x: station.x + dx, y: station.y + dy }
                : orig.from
            const toStation =
              orig.to.id === station.id
                ? { x: station.x + dx, y: station.y + dy }
                : orig.to

            const midX = (fromStation.x + toStation.x) / 2
            const midY = (fromStation.y + toStation.y) / 2
            const dxLine = toStation.x - fromStation.x
            const dyLine = toStation.y - fromStation.y
            const length = Math.sqrt(dxLine * dxLine + dyLine * dyLine) || 1

            const perpX = -dyLine / length
            const perpY = dxLine / length
            const control = {
              x: midX + perpX * (orig.curvature ?? 50),
              y: midY + perpY * (orig.curvature ?? 50),
            }

            const start = getPointOnCircleEdge(fromStation, control, 12)
            const end = getPointOnCircleEdge(toStation, control, 12)

            node.data(
              `M ${start.x},${start.y} Q ${control.x},${control.y} ${end.x},${end.y}`,
            )
          }
        })

        stage.batchDraw()
      },
      [dragOffsetsRef, stageRef, station, metroNetwork],
    )

    const handleDragEnd = useCallback(
      (e: any) => {
        delete dragOffsetsRef.current[station.id]
        dispatch(
          updateStationPosition({
            stationId: station.id,
            x: e.target.x(),
            y: e.target.y(),
          }),
        )
      },
      [dispatch, station, dragOffsetsRef],
    )

    return (
      <Circle
        x={station.x + (dragOffsetsRef.current[station.id]?.x || 0)}
        y={station.y + (dragOffsetsRef.current[station.id]?.y || 0)}
        radius={12}
        fill="transparent"
        stroke={station.color}
        strokeWidth={2}
        draggable
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onMouseEnter={() => handleMouseEnter(station.id)}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: hoveredStationId === station.id ? 'grab' : 'default' }}
      />
    )
  },
)
