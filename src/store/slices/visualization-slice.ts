import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { VisualizationSettings } from '../types/visualization';

const initialState: VisualizationSettings = {
  curvatureLines: 17,
  lineWidth: 4,
  stationRadius: 12,
  showLabels: true,
  circleRadius: 535 //  Радиус для кольцевых линий
};

const visualizationSlice = createSlice({
  name: 'visualization',
  initialState,
  reducers: {
    setCurvatureLines: (state, action: PayloadAction<number>) => {
      state.curvatureLines = Math.max(0, action.payload); // защита от отрицательных значений
    },
    setLineWidth: (state, action: PayloadAction<number>) => {
      state.lineWidth = Math.max(1, action.payload);
    },
    setStationRadius: (state, action: PayloadAction<number>) => {
      state.stationRadius = Math.max(5, action.payload);
    },
    setCircleRadius: (state, action: PayloadAction<number>) => {
      state.circleRadius = Math.max(50, action.payload)
    },
    resetToDefaults: () => initialState,
  },
});

export const {
  setCurvatureLines,
  setLineWidth,
  setStationRadius,
  setCircleRadius,
  resetToDefaults,
} = visualizationSlice.actions;

export default visualizationSlice.reducer;
