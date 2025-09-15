import type { WheelEvent } from 'react'

export type KonvaWheelEvent = {
  evt: WheelEvent<HTMLElement>
  target: any // ← не важно, Konva сам знает, что там
}
