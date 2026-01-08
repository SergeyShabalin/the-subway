import type { RefObject } from 'react'

export interface IStationLabelsProps {
  dragOffsetsRef: RefObject<Record<number, { x: number; y: number }>>
}

export interface StationLabelsProps extends IStationLabelsProps {
  lineDragOffset?: { x: number; y: number } | null
}
