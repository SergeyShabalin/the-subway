import { useSelector, useDispatch } from 'react-redux'
import type { AppDispatch, RootState } from '../index'
import {
  setCurvatureLines,
  setLineWidth,
  setStationRadius,
  setCircleRadius,
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
  const circleRadius = useSelector( // 👈 НОВЫЙ СТАТУС!
    (state: RootState) => state.visualization.circleRadius
  )

  // Обёртываем действия в удобные функции
  const actions = {
    setCurvatureLines: (value: number) => dispatch(setCurvatureLines(value)),
    setLineWidth: (value: number) => dispatch(setLineWidth(value)),
    setStationRadius: (value: number) => dispatch(setStationRadius(value)),
    resetToDefaults: () => dispatch(resetToDefaults()),
    setCircleRadius: (value: number) => dispatch(setCircleRadius(value)),
  }

  return {
    curvatureLines,
    lineWidth,
    stationRadius,
    showLabels,
    actions,
    circleRadius,
  }
}