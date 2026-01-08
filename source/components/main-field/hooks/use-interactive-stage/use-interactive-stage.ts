import { useCallback, useState } from 'react'

  import type {
  IUseZoomingMainFieldOptions,
  TUseInteractiveStageReturn,
} from '../../../../../src/components/main-field/types.ts'
import {calculateNewScale} from "@components/main-field/hooks/use-interactive-stage/helpers/calculate-new-scale.ts";
import {
    calculateNewPosition
} from "@components/main-field/hooks/use-interactive-stage/helpers/calculate-new-position.ts";

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
  // Округляем начальную позицию!
  const [scale, setScale] = useState(0.5)
  const [position, setPosition] = useState({
    x: Math.round(500),
    y: Math.round(100),
  })
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

      // Округляем новую позицию
      setScale(newScale)
      setPosition({
        x: Math.round(newPos.x),
        y: Math.round(newPos.y),
      })
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
      // Округляем позицию мыши
      setLastPos({ x: Math.round(pos.x), y: Math.round(pos.y) })
    },
    [canMove, stageRef],
  )

  const handleMouseMove = useCallback(() => {
    if (!canMove || !isDragging) return

    const stage = stageRef.current
    if (!stage) return

    const pointer = stage.getPointerPosition()
    // Округляем дельту
    const dx = Math.round(pointer.x - lastPos.x)
    const dy = Math.round(pointer.y - lastPos.y)

    setPosition((prev) => ({
      x: Math.round(prev.x + dx),
      y: Math.round(prev.y + dy),
    }))
    // Округляем новую позицию мыши
    setLastPos({ x: Math.round(pointer.x), y: Math.round(pointer.y) })
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
