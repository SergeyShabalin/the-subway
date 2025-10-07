import { Path } from 'react-konva'
import { useRef, useEffect, useCallback } from 'react'
import { recalcPath } from './utils/recalc-path.ts'
import { useMetro } from '@/store/hooks/use-metro.ts'
import type { Station } from '../../stations/station/types.ts'
import type { Line } from '@/store/slices/metro-slices.ts'

interface CurvedLineProps {
  id: string
  line: Line
  fromStation: Station
  toStation: Station
  segment: any
  curvatureRef: React.MutableRefObject<Record<number, number>>
  dragOffsetsRef: React.MutableRefObject<Record<number, { x: number; y: number }>>
  lineDragOffset?: { x: number; y: number } | null
}

export const CurvedLine = ({
                             id,
                             line,
                             fromStation,
                             toStation,
                             segment,
                             curvatureRef,
                             dragOffsetsRef,
                             lineDragOffset
                           }: CurvedLineProps) => {
  const pathRef = useRef<any>(null)
  const rafRef = useRef<number | null>(null)
  const prevCurvRef = useRef<number | null>(null)
  const { metroNetwork, activeLineId } = useMetro()

  // Вспомогательная: получить "живую" позицию станции (store + dragOffsetsRef + lineDragOffset)
  const getLivePos = useCallback(
    (stationId: number) => {
      const st = metroNetwork.flatMap(l => l.stations).find(s => s.id === stationId)
      if (!st) return { x: 0, y: 0, id: stationId }

      const offs = dragOffsetsRef.current[stationId] ?? { x: 0, y: 0 }

      // Если есть смещение линии и это активная линия, применяем его
      const lineOffset = (lineDragOffset && activeLineId === line.id) ? lineDragOffset : { x: 0, y: 0 }

      return {
        ...st,
        x: st.x + offs.x + lineOffset.x,
        y: st.y + offs.y + lineOffset.y
      }
    },
    [metroNetwork, dragOffsetsRef, lineDragOffset, activeLineId, line.id]
  )

  // Функция, которая пересчитывает path на основе live позиций и текущей кривизны
  const recomputeIfNeeded = useCallback(() => {
    if (!pathRef.current) return

    const currentCurvature = curvatureRef.current[line.id] ?? line.curvatureLines ?? 50

    // Получаем live позиции
    const fromLive = getLivePos(fromStation.id)
    const toLive = getLivePos(toStation.id)

    // Проверяем, изменились ли позиции
    const positionsChanged =
      pathRef.current.attrs.lastFromX !== fromLive.x ||
      pathRef.current.attrs.lastFromY !== fromLive.y ||
      pathRef.current.attrs.lastToX !== toLive.x ||
      pathRef.current.attrs.lastToY !== toLive.y

    // Проверяем, изменилась ли кривизна
    const curvatureChanged = prevCurvRef.current !== currentCurvature

    if (!curvatureChanged && !pathRef.current.attrs.forceRecalc && !positionsChanged) {
      return
    }

    const newData = recalcPath(fromLive, toLive, line, currentCurvature)

    pathRef.current.data(newData)

    // Сохраняем метаданные и последние позиции
    pathRef.current.attrs.originalCoords = {
      fromId: fromLive.id,
      toId: toLive.id,
      lineId: line.id,
      curvature: currentCurvature,
    }

    pathRef.current.attrs.lastFromX = fromLive.x
    pathRef.current.attrs.lastFromY = fromLive.y
    pathRef.current.attrs.lastToX = toLive.x
    pathRef.current.attrs.lastToY = toLive.y

    // Очищаем маркер forceRecalc если был
    delete pathRef.current.attrs.forceRecalc

    pathRef.current.getLayer()?.batchDraw()
    prevCurvRef.current = currentCurvature
  }, [curvatureRef, line, getLivePos, fromStation.id, toStation.id])

  // Инициализация (при маунте) — первый расчёт
  useEffect(() => {
    recomputeIfNeeded()
  }, [recomputeIfNeeded])

  // rAF loop — наблюдаем за изменениями
  useEffect(() => {
    const loop = () => {
      recomputeIfNeeded()
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [recomputeIfNeeded])

  // Если lineDragOffset меняется, форсируем пересчёт
  useEffect(() => {
    if (!pathRef.current) return
    pathRef.current.attrs.forceRecalc = true
    recomputeIfNeeded()
  }, [lineDragOffset, recomputeIfNeeded])

  return (
    <Path
      id={id}
      ref={pathRef}
      stroke={line.color}
      strokeWidth={4}
      lineCap="round"
      lineJoin="round"
      shadowColor="rgba(0,0,0,0.3)"
      shadowBlur={6}
      listening={false}
      perfectDrawEnabled={false}
    />
  )
}