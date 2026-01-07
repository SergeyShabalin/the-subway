import { createSlice } from '@reduxjs/toolkit'

import type { Line } from '../../components/stations/station/types.ts'
import { metroNetwork } from '@store/data/metro-network.ts'

export interface MetroState {
  metroNetwork: Line[]
  activeLineId: number | null
  selectedStations: number[]
}

const initialState: MetroState = {
  metroNetwork,
  activeLineId: metroNetwork[0]?.id || null,
  selectedStations: [],
}

const metroSlice = createSlice({
  name: 'metro',
  initialState,
  reducers: {},
})

export const {} = metroSlice.actions

export default metroSlice.reducer
