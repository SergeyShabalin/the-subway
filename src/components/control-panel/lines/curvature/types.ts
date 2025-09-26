import type { RefObject } from 'react'

export interface ICurvatureProps {
  activeLineId? :number | null
  curvatureRef?: RefObject<Record<number, number>>
}
