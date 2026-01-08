import { ZOOM_CONFIG } from '@components/main-field/const.ts'

/**
 * Вычисляет новый масштаб на основе текущего и направления прокрутки
 */

export const calculateNewScale = (
  currentScale: number,
  deltaY: number,
): number => {
  const delta = deltaY > 0 ? -ZOOM_CONFIG.STEP : ZOOM_CONFIG.STEP
  return Math.max(
    ZOOM_CONFIG.MIN_SCALE,
    Math.min(ZOOM_CONFIG.MAX_SCALE, currentScale + delta),
  )
}
