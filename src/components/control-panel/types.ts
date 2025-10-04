import type { Dispatch, RefObject, SetStateAction } from 'react'

export interface IControlPanelProps {
  curvatureRef?: RefObject<Record<number, number>>
  circleRadiusRef?: RefObject<number>
  setFreeMoving: Dispatch<SetStateAction<boolean>>;
  freeMoving: boolean;
}
