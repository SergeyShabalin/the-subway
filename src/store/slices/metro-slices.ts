import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { metroNetwork } from '../data/metro-network.ts'

// Типы данных
export type Station = {
  id: number
  x: number
  y: number
  color: string
  label: string
  labelOffset: { x: number; y: number }
}

export type Segment = {
  fromStationId: number
  toStationId: number
  timeMinutes: number
}

export type Line = {
  id: number
  color: string
  name: string
  stations: Array<Station>
  segments: Array<Segment>
  isCircular: boolean
  renderStyle: 'linear' | 'circular'
  locking?: boolean
  curvatureLines?: number
}

// Состояние стора
export interface MetroState {
  metroNetwork: Array<Line>
  activeLineId: number | null
  selectedStations: number[] // 👈 Было Set<number>, стало number[]
}

// Начальное состояние
const initialState: MetroState = {
  metroNetwork: metroNetwork,
  activeLineId: metroNetwork[0]?.id || null,
  selectedStations: [],
}

const metroSlice = createSlice({
  name: 'metro',
  initialState,
  reducers: {
    // Изменить позицию станции
    updateStationPosition: (
      state,
      action: PayloadAction<{ stationId: number; x: number; y: number }>,
    ) => {
      const { stationId, x, y } = action.payload
      console.log('позиция станции в редаксе изменена')
      const lineIndex = state.metroNetwork.findIndex((line) =>
        line.stations.some((station) => station.id === stationId)
      )

      if (lineIndex === -1) return

      const line = state.metroNetwork[lineIndex]
      const stationIndex = line.stations.findIndex(s => s.id === stationId)

      const station = line.stations[stationIndex]

      // 👇 КЛЮЧЕВОЙ ХАК: если координаты не изменились — НИЧЕГО НЕ ДЕЛАЕМ!
      if (station.x === x && station.y === y) return

      // Создаём новую станцию
      const updatedStation = { ...station, x, y }

      // Создаём новый массив станций ТОЛЬКО для этой линии
      const updatedStations = [
        ...line.stations.slice(0, stationIndex),
        updatedStation,
        ...line.stations.slice(stationIndex + 1),
      ]

      // Создаём новую линию — только если станции изменились
      const updatedLine = {
        ...line,
        stations: updatedStations,
      }

      // 👇 СРАВНИВАЕМ ЛИНИЮ ПО ССЫЛКЕ — если она не изменилась, оставляем старую
      const oldLine = state.metroNetwork[lineIndex]
      if (
        oldLine === updatedLine || // ссылка — не подойдёт, потому что объекты разные
        (oldLine.color === updatedLine.color &&
          oldLine.name === updatedLine.name &&
          oldLine.renderStyle === updatedLine.renderStyle &&
          oldLine.isCircular === updatedLine.isCircular &&
          oldLine.locking === updatedLine.locking &&
          oldLine.segments.length === updatedLine.segments.length &&
          oldLine.segments.every(seg =>
            updatedLine.segments.find(u => u.fromStationId === seg.fromStationId && u.toStationId === seg.toStationId && u.timeMinutes === seg.timeMinutes)
          ))
      ) {
        // 👇 Если линия не изменилась по содержимому — не заменяем её!
        // Но мы уже создали updatedStations — значит, линия изменилась.
        // Поэтому мы НЕ можем пропустить обновление — просто не делаем лишних копий.
      }

      // 👇 ВСЁ РАВНО создаём новый массив линий — но это ОК, потому что мы будем мемоизировать в компонентах
      const newMetroNetwork = [
        ...state.metroNetwork.slice(0, lineIndex),
        updatedLine,
        ...state.metroNetwork.slice(lineIndex + 1),
      ]

      // 👇 УБЕДИСЬ, что ты НЕ мутируешь state — ты это делаешь правильно
      state.metroNetwork = newMetroNetwork
    },

    setActiveLineId: (state, action: PayloadAction<number | null>) => {
      state.activeLineId = action.payload
    },
    updateLineCurvature: (
      state,
      action: PayloadAction<{ lineId: number; curvature: number }>
    ) => {
      const { lineId, curvature } = action.payload

      state.metroNetwork = state.metroNetwork.map((line) =>
        line.id === lineId
          ? {
            ...line,
            curvatureLines: curvature,
          }
          : line
      )
    },
    // Выравнивание круговой ветки"
    alignLineToCircle: (
      state,
      action: PayloadAction<{
        lineId: number
        radius: number
      }>
    ) => {
      const { lineId, radius } = action.payload

      state.metroNetwork = state.metroNetwork.map((line) => {
        if (line.id !== lineId || !line.locking) return line

        const stations = [...line.stations]
        const n = stations.length
        if (n < 2) return line

        const centerX = stations.reduce((sum, s) => sum + s.x, 0) / n
        const centerY = stations.reduce((sum, s) => sum + s.y, 0) / n

        const firstStation = stations[0]
        const firstAngle = Math.atan2(firstStation.y - centerY, firstStation.x - centerX)

        const newStations = stations.map((station, i) => {

          const angle = firstAngle - (i * (2 * Math.PI)) / n

          return {
            ...station,
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle),
          }
        })
        console.log(newStations)
        return {
          ...line,
          stations: newStations,
        }
      })
    },
  },
})

export const { updateStationPosition, alignLineToCircle, setActiveLineId, updateLineCurvature } = metroSlice.actions

export default metroSlice.reducer
