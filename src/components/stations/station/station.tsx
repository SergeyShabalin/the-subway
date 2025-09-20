import { updateStationPosition } from '../../../store/slices/metro-slices.ts'
import { Circle } from 'react-konva'
import { useDispatch } from 'react-redux'
import { memo } from 'react'

const Station = ({dragOffsets, station, hoveredStationId, handleMouseEnter, handleMouseLeave, updateDragOffset, clearDragOffset }: StationProps) => {
  const { id, x, y, color } = station
  const dispatch = useDispatch()

  const offset = dragOffsets[id] || { x: 0, y: 0 }

  const handleDragMove = (e: any) => {
    const node = e.target
    // Вычисляем смещение относительно оригинальной позиции
    const dx = node.x() - x
    const dy = node.y() - y

    updateDragOffset(id, dx, dy)
  }

  const handleDragEnd = (e: any) => {
    const node = e.target
    const finalX = node.x()
    const finalY = node.y()

    dispatch(updateStationPosition({ stationId: id, x: finalX, y: finalY }))
    clearDragOffset(id)

    // Сбрасываем позицию узла к оригинальной, чтобы следующий drag начинался правильно
    node.position({ x, y })
  }

  return (
    <Circle
      key={`station-${id}`}
      x={x + offset.x}
      y={y + offset.y}
      radius={12}
      fill="transparent"
      stroke={color}
      draggable={true}
      onMouseEnter={() => handleMouseEnter(id)}
      onMouseLeave={handleMouseLeave}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      strokeWidth={2}
      shadowColor="rgba(0,0,0,0.2)"
      shadowBlur={5}
      style={{
        cursor: hoveredStationId === id ? 'grab' : 'default',
      }}
    />
  )
}

export {Station}