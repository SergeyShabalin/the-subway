import { useSelector, useDispatch } from 'react-redux'
import type { AppDispatch, RootState } from '@/store'
import {
  setCurvatureLines,
  setLineWidth,
  setStationRadius,
  resetToDefaults,
} from '../slices/visualization-slice'

export const useVisualization = () => {
  const dispatch = useDispatch<AppDispatch>()

  const curvatureLines = useSelector(
    (state: RootState) => state.visualization.curvatureLines
  )
  const lineWidth = useSelector(
    (state: RootState) => state.visualization.lineWidth
  )
  const stationRadius = useSelector(
    (state: RootState) => state.visualization.stationRadius
  )
  const showLabels = useSelector(
    (state: RootState) => state.visualization.showLabels
  )
  // УДАЛЕНО: circleRadius больше не используется из store

  const actions = {
    setCurvatureLines: (value: number) => dispatch(setCurvatureLines(value)),
    setLineWidth: (value: number) => dispatch(setLineWidth(value)),
    setStationRadius: (value: number) => dispatch(setStationRadius(value)),
    resetToDefaults: () => dispatch(resetToDefaults()),
  }

  return {
    curvatureLines,
    lineWidth,
    stationRadius,
    showLabels,
    actions,

  }
}