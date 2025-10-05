
import type { RefObject } from 'react'

export interface IMainFieldProps {
  freeMoving: boolean
  curvatureRef:  RefObject<Record<number, number>>
  circleRadiusRef: RefObject<number>
  rotationAngleRef?: RefObject<number>
}

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
