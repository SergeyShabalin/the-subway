export type Station = {
  id: number
  x: number
  y: number
  color: string
  label: string
  labelOffset: { x: number; y: number }
  branchIds: number[] // Добавляем branchIds для определения принадлежности к веткам
}