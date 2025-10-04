import { Path } from 'react-konva'
import { useRef, useEffect, useCallback } from 'react'
import { recalcPath } from './utils/recalc-path.ts'
import { useMetro } from '@/store/hooks/use-metro.ts' // путь по вашему проекту
import type { Station } from '../../stations/station/types.ts'
import type { Line } from '@/store/slices/metro-slices.ts'

interface CurvedLineProps {
  id: string
  line: Line
  fromStation: Station // содержит id, x, y
  toStation: Station
  curvatureRef: React.MutableRefObject<Record<number, number>>
  dragOffsetsRef: React.MutableRefObject<Record<number, { x: number; y: number }>>
}

export const CurvedLine = ({
                             id,
                             line,
                             fromStation,
                             toStation,
                             curvatureRef,
                             dragOffsetsRef,
                           }: CurvedLineProps) => {
  const pathRef = useRef<any>(null)
  const rafRef = useRef<number | null>(null)
  const prevCurvRef = useRef<number | null>(null)
  const { metroNetwork } = useMetro()

  // Вспомогательная: получить "живую" позицию станции (store + dragOffsetsRef)
  const getLivePos = useCallback(
    (stationId: number) => {
      const st = metroNetwork.flatMap(l => l.stations).find(s => s.id === stationId)
      if (!st) return { x: 0, y: 0, id: stationId }
      const offs = dragOffsetsRef.current[stationId] ?? { x: 0, y: 0 }
      return { ...st, x: st.x + offs.x, y: st.y + offs.y }
    },
    [metroNetwork, dragOffsetsRef]
  )

  // Функция, которая пересчитывает path на основе live позиций и текущей кривизны
  const recomputeIfNeeded = useCallback(() => {
    if (!pathRef.current) return

    const currentCurvature = curvatureRef.current[line.id] ?? line.curvatureLines ?? 50
    if (prevCurvRef.current === currentCurvature && !pathRef.current.attrs.forceRecalc) {
      // ничего не изменилось — можно выйти
      return
    }

    // Получаем live позиции по id (не используем snapshot из props, т.к. он может быть stale)
    const fromLive = getLivePos(fromStation.id)
    const toLive = getLivePos(toStation.id)

    const newData = recalcPath(fromLive, toLive, line, currentCurvature)

    pathRef.current.data(newData)
    // Сохраняем метаданные (id + текущая кривизна)
    pathRef.current.attrs.originalCoords = {
      fromId: fromLive.id,
      toId: toLive.id,
      lineId: line.id,
      curvature: currentCurvature,
    }

    // очищаем маркер forceRecalc если был
    delete pathRef.current.attrs.forceRecalc

    pathRef.current.getLayer()?.batchDraw()
    prevCurvRef.current = currentCurvature
  }, [curvatureRef, line, getLivePos, fromStation.id, toStation.id])

  // Инициализация (при маунте) — первый расчёт
  useEffect(() => {
    recomputeIfNeeded()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // rAF loop — наблюдаем за изменением curvatureRef[line.id] и за возможной меткой forceRecalc
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

  // Если props.fromStation / toStation меняются (например при полной перерисовке Lines),
  // пометим node для пересчёта и запустим recompute сразу
  useEffect(() => {
    if (!pathRef.current) return
    // ставим метку чтобы rAF пересчитал немедленно
    pathRef.current.attrs.forceRecalc = true
    recomputeIfNeeded()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromStation.x, fromStation.y, toStation.x, toStation.y, line.id])

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
    />
  )
}
