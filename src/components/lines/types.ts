import type { RefObject } from 'react'

export interface ILinesProps {
  dragOffsetsRef: RefObject<Record<number, { x: number; y: number }>>
  curvatureRef: RefObject<Record<number, number>>
}
