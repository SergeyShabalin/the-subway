export interface VisualStation {
  id: string
  x: number
  y: number
  labelOffset: { x: number; y: number }
  connections: string[] // ссылки на логические станции
  displayMode: 'single' | 'multiple'
}

export interface LogicalStation {
  id: string
  name: string
  visualId: string // связь с визуальной станцией
}

export type RenderStyle = 'linear' | 'circular' | 'diameter'

export interface MetroLine {
  id: number
  name: string
  color: string
  isCircular: boolean
  renderStyle: RenderStyle
  locking?: boolean
  curvatureLines?: number
  visualStationIds: string[] // ссылки на визуальные станции (для отрисовки)
  logicalStationIds: string[] // ссылки на логические станции (для маршрутизации)
}

export interface MetroSegment {
  id: string
  fromStationId: string // ссылка на логическую станцию
  toStationId: string // ссылка на логическую станцию
  timeMinutes: number
}

export interface MetroVisuals {
  stations: Record<string, VisualStation>
}

export interface MetroLogic {
  stations: Record<string, LogicalStation>
  segments: Record<string, MetroSegment>
}

export interface MetroConnections {
  visualToLogical: Record<string, string[]> // визуальная → массив логических
  logicalToSegments: Record<string, string[]> // логическая → массив сегментов
  stationLines: Record<string, number[]> // визуальная → массив lineId
}

export interface IMetroNetwork {
  visuals: MetroVisuals // данные для отрисовки
  logic: MetroLogic // данные для маршрутизации
  connections: MetroConnections // быстрые связи для обновления
  lines: Record<number, MetroLine> // линии с двумя наборами станций
}

