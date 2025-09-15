import { useCallback, useState } from 'react'

import { calculateNewScale } from './helpers/calculate-new-scale.ts'
import { calculateNewPosition } from './helpers/calculate-new-position.ts'
import type {
  IUseZoomingMainFieldOptions,
  TUseInteractiveStageReturn,
} from '../types.ts'

/**
 * Хук для управления интерактивным холстом (зум и перемещение)
 *
 * @param options - Опции хука
 * @param options.stageRef - Ref-объект, связанный с компонентом `<Stage />` из react-konva.
 *                          Должен содержать экземпляр Konva.Stage (getPointerPosition, scaleX и т.д.)
 * @param options.canMove - Флаг, управляющий возможностью перетаскивания холста.
 *                          Если `false` — все события мыши для перемещения игнорируются.
 *                          По умолчанию: `true`
 */

const useInteractiveStage = ({
  stageRef,
  canMove = true,
}: IUseZoomingMainFieldOptions): TUseInteractiveStageReturn => {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 })

  const handleWheel = useCallback(
    (e: any) => {
      e.evt.preventDefault()
      const stage = stageRef.current
      if (!stage) return

      const pointer = stage.getPointerPosition()
      if (!pointer) return

      const newScale = calculateNewScale(scale, e.evt.deltaY)
      const newPos = calculateNewPosition({
        pointer,
        scale,
        newScale,
        position,
      })

      setScale(newScale)
      setPosition(newPos)
    },
    [scale, position, stageRef],
  )

  const handleMouseDown = useCallback(
    (e: any) => {
      if (!canMove) return

      if (e.evt.button !== 0) return
      setIsDragging(true)
      const stage = stageRef.current
      if (!stage) return
      const pos = stage.getPointerPosition()
      setLastPos(pos)
    },
    [canMove, stageRef],
  )

  const handleMouseMove = useCallback(() => {
    if (!canMove || !isDragging) return

    const stage = stageRef.current
    if (!stage) return

    const pointer = stage.getPointerPosition()
    const dx = pointer.x - lastPos.x
    const dy = pointer.y - lastPos.y

    setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }))
    setLastPos(pointer)
  }, [canMove, isDragging, lastPos, stageRef])

  const handleMouseUp = useCallback(() => {
    if (!canMove) return

    setIsDragging(false)
  }, [canMove])

  return {
    scale,
    position,
    isDragging,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  }
}

export { useInteractiveStage }
