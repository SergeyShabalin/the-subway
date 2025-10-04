import type { Stage } from 'konva/lib/Stage'
import type { RefObject } from 'react'

export interface IStationsProps {
  dragOffsetsRef: RefObject<Record<number, { x: number; y: number }>>
  stageRef: RefObject<Stage> | null
  circleRadiusRef: RefObject<number>
}
