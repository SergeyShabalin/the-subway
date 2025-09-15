/** Расчитывает позицию для зумминга */
import type { CalculateNewPositionArgs, NewPosition } from './types.ts'

export const calculateNewPosition = ({
  pointer,
  scale,
  newScale,
  position,
}: CalculateNewPositionArgs): NewPosition => {
  const mousePointTo = {
    x: (pointer.x - position.x) / scale,
    y: (pointer.y - position.y) / scale,
  }

  return {
    x: pointer.x - mousePointTo.x * newScale,
    y: pointer.y - mousePointTo.y * newScale,
  }
}
