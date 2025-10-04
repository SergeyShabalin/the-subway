import { useSelector, useDispatch } from 'react-redux'

import {
  alignLineToCircle,
  setActiveLineId,
  updateStationPosition,
  updateLineCurvature, evenlyDistributeStations
} from '../slices/metro-slices.ts'
import type { AppDispatch, RootState } from '@/store'

export const useMetro = () => {
  const dispatch = useDispatch<AppDispatch>()

  const activeLineId = useSelector(
    (state: RootState) => state.metro.activeLineId,
  )
  const selectedStations = useSelector(
    (state: RootState) => state.metro.selectedStations,
  )
  const metroNetwork = useSelector(
    (state: RootState) => state.metro.metroNetwork,
  )

  return {
    activeLineId,
    selectedStations,
    metroNetwork,
    actions: {
      updateStationPosition: (stationId: number, x: number, y: number) =>
        dispatch(updateStationPosition({ stationId, x, y })),
      evenlyDistributeStations: (lineId: number) =>
        dispatch(evenlyDistributeStations(lineId)),
      alignLineToCircle: (lineId: number, radius: number) =>
        dispatch(alignLineToCircle({ lineId, radius })),
      setActiveLineId: (id: number | null) => dispatch(setActiveLineId(id)),
      updateLineCurvature: (lineId: number, curvature: number) =>
        dispatch(updateLineCurvature({ lineId, curvature })),

    },
  }
}
