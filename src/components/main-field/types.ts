
import type { RefObject } from 'react'


export interface IUseZoomingMainFieldOptions {
  stageRef: RefObject<any>
  canMove?: boolean
}

export type TUseInteractiveStageReturn = {
  scale: number
  position: { x: number; y: number }
  isDragging: boolean
  handleWheel: (e: any) => void
  handleMouseDown: (e: any) => void
  handleMouseMove: () => void
  handleMouseUp: () => void
}
