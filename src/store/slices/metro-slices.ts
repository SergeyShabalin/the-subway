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

      // Обновляем станцию во ВСЕХ линиях, где она присутствует
      state.metroNetwork = state.metroNetwork.map((line) => {
        const stationIndex = line.stations.findIndex((s) => s.id === stationId)
        if (stationIndex === -1) return line

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
        return {
          ...line,
          stations: updatedStations,
        }
      })
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

      const stationPositions = new Map<number, { x: number; y: number }>()

      if (line.renderStyle === 'circular' && line.locking) {
        const centerX = stations.reduce((sum, s) => sum + s.x, 0) / stations.length
        const centerY = stations.reduce((sum, s) => sum + s.y, 0) / stations.length

        const avgRadius = stations.reduce((sum, station) => {
          const dx = station.x - centerX
          const dy = station.y - centerY
          return sum + Math.sqrt(dx * dx + dy * dy)
        }, 0) / stations.length

        // Вычисляем углы всех станций и сортируем их
        const stationsWithAngles = stations.map(station => {
          const dx = station.x - centerX
          const dy = station.y - centerY
          let angle = Math.atan2(dy, dx)
          if (angle < 0) angle += 2 * Math.PI
          return { station, angle }
        })

        // Сортируем станции по углу (против часовой стрелки)
        stationsWithAngles.sort((a, b) => a.angle - b.angle)

        // Вычисляем угловые расстояния между соседними станциями
        const angularDistances = []
        for (let i = 0; i < stationsWithAngles.length; i++) {
          const currentAngle = stationsWithAngles[i].angle
          const nextAngle = stationsWithAngles[(i + 1) % stationsWithAngles.length].angle
          let distance = nextAngle - currentAngle
          if (distance < 0) distance += 2 * Math.PI
          angularDistances.push(distance)
        }

        // Находим максимальный промежуток - это будет "разрыв" в кольце
        const maxGapIndex = angularDistances.indexOf(Math.max(...angularDistances))

        // Начинаем распределение после максимального промежутка
        const startIndex = (maxGapIndex + 1) % stationsWithAngles.length

        const reorderedStations = [
          ...stationsWithAngles.slice(startIndex),
          ...stationsWithAngles.slice(0, startIndex)
        ].map(item => item.station)

        const angleStep = (2 * Math.PI) / stations.length
        const startAngle = reorderedStations[0] ?
          Math.atan2(reorderedStations[0].y - centerY, reorderedStations[0].x - centerX) : 0

        reorderedStations.forEach((station, index) => {
          const angle = startAngle + index * angleStep
          stationPositions.set(station.id, {
            x: centerX + avgRadius * Math.cos(angle),
            y: centerY + avgRadius * Math.sin(angle)
          })
        })

      } else {
        // Для линейной линии
        const firstStation = stations[0]
        const lastStation = stations[stations.length - 1]

        const dx = (lastStation.x - firstStation.x) / (stations.length - 1)
        const dy = (lastStation.y - firstStation.y) / (stations.length - 1)

        stations.forEach((station, index) => {
          stationPositions.set(station.id, {
            x: firstStation.x + dx * index,
            y: firstStation.y + dy * index
          })
        })
      }

      // Обновляем все линии
      state.metroNetwork = state.metroNetwork.map((networkLine) => {
        const updatedStations = networkLine.stations.map(station => {
          const newPosition = stationPositions.get(station.id)
          return newPosition ? { ...station, ...newPosition } : station
        })

        return {
          ...networkLine,
          stations: updatedStations
        }
      })
    },

    // Новый action для обновления градиентов станций
    updateStationGradients: (state) => {
      // Эта функция будет вызываться для пересчета градиентов при изменениях
      // Фактическое применение градиентов будет в компоненте Station
      state.metroNetwork = [...state.metroNetwork] // Форсируем обновление
    },

    addStation: (state, action: PayloadAction<{
      name: string;
      branchId: number;
      x: number;
      y: number;
      color: string;
      labelOffset: { x: number; y: number };
      newStationId?: number;
      insertAfterStationId?: number; // Для указания позиции вставки
    }>) => {
      const { name, branchId, x, y, color, labelOffset, newStationId, insertAfterStationId } = action.payload;

      console.log('Adding station to branch:', branchId, action.payload);

      const lineIndex = state.metroNetwork.findIndex(line => line.id === branchId);

      if (lineIndex === -1) {
        console.error('Line not found:', branchId);
        return;
      }

      const line = state.metroNetwork[lineIndex];

      // Генерируем ID безопасным способом
      const stationId = newStationId || Math.max(0, ...state.metroNetwork.flatMap(line =>
        line.stations.map(s => s.id)
      )) + 1;

      const newStation: Station = {
        id: stationId,
        x,
        y,
        color: color || line.color,
        label: name,
        labelOffset,
        branchIds: [branchId]
      };

      // Добавляем станцию в нужную позицию
      if (insertAfterStationId) {
        // Вставляем после указанной станции
        const insertIndex = line.stations.findIndex(s => s.id === insertAfterStationId);
        if (insertIndex !== -1) {
          line.stations.splice(insertIndex + 1, 0, newStation);
        } else {
          // Если станция не найдена, добавляем в конец
          line.stations.push(newStation);
        }
      } else {
        // Добавляем в конец
        line.stations.push(newStation);
      }

      // Полностью пересоздаем сегменты для корректной работы
      line.segments = [];

      const stations = line.stations;
      const stationCount = stations.length;

      if (stationCount > 1) {
        // Для обычных линий создаем сегменты между последовательными станциями
        for (let i = 0; i < stationCount - 1; i++) {
          const segmentId = `${stations[i].id}_${stations[i + 1].id}`;
          line.segments.push({
            id: segmentId,
            fromStationId: stations[i].id,
            toStationId: stations[i + 1].id,
            timeMinutes: line.id === 4 ? 4 : 2 // БКЛ имеет 4 минуты, остальные 2
          });
        }

        // Для кольцевых линий добавляем замыкающий сегмент
        if (line.isCircular && stationCount >= 2) {
          const closingSegmentId = `${stations[stationCount - 1].id}_${stations[0].id}`;

          // Проверяем нет ли уже такого сегмента
          const closingSegmentExists = line.segments.some(seg =>
            seg.id === closingSegmentId ||
            (seg.fromStationId === stations[stationCount - 1].id && seg.toStationId === stations[0].id)
          );

          if (!closingSegmentExists) {
            line.segments.push({
              id: closingSegmentId,
              fromStationId: stations[stationCount - 1].id,
              toStationId: stations[0].id,
              timeMinutes: line.id === 4 ? 4 : 2
            });
          }
        }
      }

      console.log('Station added successfully. Total stations in line:', stationCount);
      console.log('Total segments in line:', line.segments.length);
    }

  },



})

export const {
  updateStationPosition,
  setActiveLineId,
  updateLineCurvature,
  alignLineToCircle,
  evenlyDistributeStations,
  updateStationGradients,
  addStation,
} = metroSlice.actions

export default metroSlice.reducer