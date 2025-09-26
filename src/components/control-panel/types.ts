import type { RefObject } from 'react'

export interface IControlPanelProps {
  curvatureRef?: RefObject<Record<number, number>>
  circleRadiusRef?: RefObject<number>
}
