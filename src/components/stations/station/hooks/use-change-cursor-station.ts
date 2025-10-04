import { type RefObject, useCallback, useState } from 'react'
import type { Stage } from 'konva/lib/Stage'

export const useStationCursor = (stageRef: RefObject<Stage> | null) => {
  const [hoveredStationId, setHoveredStationId] = useState<number | null>(null)

  const updateCursor = useCallback((cursorType: string) => {
    if (!stageRef?.current) return
    const stage = stageRef.current
    if (stage && stage.container()) {
      stage.container().style.cursor = cursorType
    }
  }, [stageRef])

  const handleMouseEnter = useCallback((id: number) => {
    setHoveredStationId(id)
    updateCursor('grab')
  }, [updateCursor])

  const handleMouseLeave = useCallback(() => {
    setHoveredStationId(null)
    updateCursor('default')
  }, [updateCursor])

  return {
    hoveredStationId,
    handleMouseEnter,
    handleMouseLeave,
    updateCursor
  }
}