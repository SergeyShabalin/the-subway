import { createSlice } from '@reduxjs/toolkit'


import { metroNetwork } from '@store/data/metro-network.ts'
import type { IMetroNetwork } from '@store/data/types.ts'
export interface MetroState {
  metroNetwork: IMetroNetwork
  activeLineId: number | null
  selectedStations: number[]
}

const initialState: MetroState = {
  metroNetwork,
  selectedStations: [],
}

const metroSlice = createSlice({
  name: 'metro',
  initialState,
  reducers: {},
})

export const {} = metroSlice.actions

export default metroSlice.reducer
