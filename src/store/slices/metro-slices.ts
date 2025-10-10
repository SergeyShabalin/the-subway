// metro-slices.ts
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { metroNetwork } from '../data/metro-network.ts'
import type { Station, Segment, Line } from '../../components/stations/station/types.ts'

// Удаляем дублирующиеся типы, используем импортированные

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

// Вспомогательная функция для расчета направлений линий
const calculateLineDirections = (station: Station, metroNetwork: Line[]) => {
  const directionsByColor = new Map<string, { angles: number[]; color: string }>();

  // Находим все сегменты, подключенные к этой станции
  metroNetwork.forEach(line => {
    line.segments.forEach(segment => {
      if (segment.fromStationId === station.id || segment.toStationId === station.id) {
        const otherStationId = segment.fromStationId === station.id ? segment.toStationId : segment.fromStationId;
        const otherStation = line.stations.find(s => s.id === otherStationId);

        if (otherStation) {
          // Рассчитываем угол направления линии
          const dx = otherStation.x - station.x;
          const dy = otherStation.y - station.y;
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);

          if (!directionsByColor.has(line.color)) {
            directionsByColor.set(line.color, { angles: [], color: line.color });
          }
          directionsByColor.get(line.color)!.angles.push(angle);
        }
      }
    });
  });

  // Вычисляем средний угол для каждого цвета
  const directions: { angle: number; color: string }[] = [];

  directionsByColor.forEach((value, color) => {
    if (value.angles.length > 0) {
      let sumSin = 0;
      let sumCos = 0;

      value.angles.forEach(angle => {
        const rad = angle * Math.PI / 180;
        sumSin += Math.sin(rad);
        sumCos += Math.cos(rad);
      });

      const avgAngle = Math.atan2(sumSin / value.angles.length, sumCos / value.angles.length) * (180 / Math.PI);

      directions.push({
        angle: avgAngle,
        color: color
      });
    }
  });

  return directions;
}

const metroSlice = createSlice({
  name: 'metro',
  initialState,
  reducers: {
    updateStationPosition: (
      state,
      action: PayloadAction<{ stationId: number; x: number; y: number }>,
    ) => {
      const { stationId, x, y } = action.payload

      // Находим линию и станцию
      const lineIndex = state.metroNetwork.findIndex((line) =>
        line.stations.some((st) => st.id === stationId),
      )
      if (lineIndex === -1) return

      const line = state.metroNetwork[lineIndex]
      const stationIndex = line.stations.findIndex((s) => s.id === stationId)
      if (stationIndex === -1) return

      // Создаём полностью новый объект станции
      const updatedStation: Station = {
        ...line.stations[stationIndex],
        x,
        y,
      }

      // Новый массив станций
      const updatedStations = [
        ...line.stations.slice(0, stationIndex),
        updatedStation,
        ...line.stations.slice(stationIndex + 1),
      ]

      // Новая линия
      const updatedLine: Line = {
        ...line,
        stations: updatedStations,
      }

      // Новый массив линий
      state.metroNetwork = [
        ...state.metroNetwork.slice(0, lineIndex),
        updatedLine,
        ...state.metroNetwork.slice(lineIndex + 1),
      ]
    },

    setActiveLineId: (state, action: PayloadAction<number | null>) => {
      state.activeLineId = action.payload
    },

    updateLineCurvature: (
      state,
      action: PayloadAction<{ lineId: number; curvature: number }>,
    ) => {
      const { lineId, curvature } = action.payload
      state.metroNetwork = state.metroNetwork.map((line) =>
        line.id === lineId ? { ...line, curvatureLines: curvature } : line,
      )
    },

    alignLineToCircle: (
      state,
      action: PayloadAction<{ lineId: number; radius: number }>,
    ) => {
      const { lineId, radius } = action.payload
      state.metroNetwork = state.metroNetwork.map((line) => {
        if (line.id !== lineId || !line.locking) return line
        const n = line.stations.length
        if (n < 2) return line

        const centerX = line.stations.reduce((sum, s) => sum + s.x, 0) / n
        const centerY = line.stations.reduce((sum, s) => sum + s.y, 0) / n
        const firstAngle = Math.atan2(
          line.stations[0].y - centerY,
          line.stations[0].x - centerX,
        )

        const newStations = line.stations.map((s, i) => ({
          ...s,
          x: centerX + radius * Math.cos(firstAngle - (i * 2 * Math.PI) / n),
          y: centerY + radius * Math.sin(firstAngle - (i * 2 * Math.PI) / n),
        }))

        return { ...line, stations: newStations }
      })
    },

    evenlyDistributeStations: (state, action: PayloadAction<number>) => {
      const lineId = action.payload
      const lineIndex = state.metroNetwork.findIndex(l => l.id === lineId)

      if (lineIndex === -1) return

      const line = state.metroNetwork[lineIndex]
      const stations = line.stations

      if (stations.length < 3) return

      if (line.renderStyle === 'circular' && line.locking) {
        // Для круговой линии - равномерное распределение по окружности
        const minX = Math.min(...stations.map(s => s.x))
        const maxX = Math.max(...stations.map(s => s.x))
        const minY = Math.min(...stations.map(s => s.y))
        const maxY = Math.max(...stations.map(s => s.y))

        const centerX = (minX + maxX) / 2
        const centerY = (minY + maxY) / 2

        const avgRadius = stations.reduce((sum, station) => {
          const dx = station.x - centerX
          const dy = station.y - centerY
          return sum + Math.sqrt(dx * dx + dy * dy)
        }, 0) / stations.length

        const angleStep = (2 * Math.PI) / stations.length

        const newStations = stations.map((station, index) => ({
          ...station,
          x: centerX + avgRadius * Math.cos(index * angleStep),
          y: centerY + avgRadius * Math.sin(index * angleStep)
        }))

        state.metroNetwork[lineIndex] = {
          ...line,
          stations: newStations
        }
      } else {
        // Для линейной линии - равномерное распределение вдоль прямой
        const firstStation = stations[0]
        const lastStation = stations[stations.length - 1]

        const dx = (lastStation.x - firstStation.x) / (stations.length - 1)
        const dy = (lastStation.y - firstStation.y) / (stations.length - 1)

        const newStations = stations.map((station, index) => ({
          ...station,
          x: firstStation.x + dx * index,
          y: firstStation.y + dy * index
        }))

        state.metroNetwork[lineIndex] = {
          ...line,
          stations: newStations
        }
      }
    },

    // Новый action для обновления градиентов станций
    updateStationGradients: (state) => {
      // Эта функция будет вызываться для пересчета градиентов при изменениях
      // Фактическое применение градиентов будет в компоненте Station
      state.metroNetwork = [...state.metroNetwork] // Форсируем обновление
    }
  },
})

export const {
  updateStationPosition,
  setActiveLineId,
  updateLineCurvature,
  alignLineToCircle,
  evenlyDistributeStations,
  updateStationGradients
} = metroSlice.actions

export default metroSlice.reducer