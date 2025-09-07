import { Circle, Layer, Stage, Text } from 'react-konva'
import { useState, useRef, useCallback, useEffect } from 'react'
import React from 'react'

const FlowExample = () => {
  const stageRef = useRef<any>(null)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [cursor, setCursor] = useState('default')
  const [stationName, setStationName] = useState('')
  const [lastClickPos, setLastClickPos] = useState<{
    x: number
    y: number
  } | null>(null)

  const [circles, setCircles] = useState([
    { id: 1, x: 200, y: 300, color: '#90a05f', label: 'Парк победы' },
    { id: 2, x: 600, y: 300, color: '#a06e5f', label: 'Кутузовская' },
    { id: 3, x: 300, y: 600, color: '#4935c8', label: 'Новокосино' },
    { id: 4, x: 700, y: 600, color: '#c6590c', label: 'Ломоносовская' },
  ])

  useEffect(() => {
    const container = stageRef.current?.container()
    if (container) {
      container.style.cursor = cursor
    }
  }, [cursor])

  const newStationCreate = () => {
    if (!stationName.trim()) {
      alert('Введите название станции!')
      return
    }
    if (!lastClickPos) {
      alert('Сначала кликните на карту, где разместить станцию!')
      return
    }

    const layerX = lastClickPos.x / scale - position.x / scale
    const layerY = lastClickPos.y / scale - position.y / scale

    const newCircle = {
      id: Date.now(),
      x: layerX,
      y: layerY,
      color: '#ffffff',
      label: stationName,
    }

    setCircles((prev) => [...prev, newCircle])
    setStationName('')
    setLastClickPos(null)
  }

  const handleMouseEnter = () => setCursor('grab')
  const handleMouseLeave = () => setCursor('default')
  const handleDragStart = () => setCursor('grabbing')

  const handleDragEnd = (e: any, id: number) => {
    handleDragMove(e, id)
    setCursor('grab')
  }

  const handleStageClick = (e: any) => {
    const stage = e.target.getStage()
    const pointer = stage.getPointerPosition()

    if (pointer) {
      setLastClickPos(pointer)
      console.log('Клик по:', pointer)
    }
  }

  const handleWheel = useCallback(
    (e: any) => {
      e.evt.preventDefault()
      const stage = stageRef.current
      if (!stage) return

      const oldScale = scale
      const delta = e.evt.deltaY > 0 ? -0.1 : 0.1
      const newScale = Math.max(0.1, Math.min(5, oldScale + delta))

      const pointer = stage.getPointerPosition()
      if (!pointer) return

      const mousePointTo = {
        x: (pointer.x - position.x) / oldScale,
        y: (pointer.y - position.y) / oldScale,
      }

      setScale(newScale)

      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      }

      setPosition(newPos)
    },
    [scale, position],
  )

  const handleDragMove = (e: any, id: number) => {
    const node = e.target
    const updatedCircles = circles.map((circle) =>
      circle.id === id ? { ...circle, x: node.x(), y: node.y() } : circle,
    )
    setCircles(updatedCircles)
  }

  const previewPoint = lastClickPos
    ? {
        x: lastClickPos.x / scale - position.x / scale,
        y: lastClickPos.y / scale - position.y / scale,
      }
    : null

  return (
    <>
      <div>
        <input
          type="text"
          placeholder="Название станции"
          value={stationName}
          onChange={(e) => setStationName(e.target.value)}
          style={{ padding: '8px', fontSize: '16px', marginRight: '10px' }}
        />
        <button
          onClick={newStationCreate}
          style={{
            padding: '8px 16px',
            fontSize: '16px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Создать станцию
        </button>
        {lastClickPos && (
          <span style={{ marginLeft: '20px', color: '#666' }}>
            📍 Клик: ({Math.round(lastClickPos.x)}, {Math.round(lastClickPos.y)}
            )
          </span>
        )}
      </div>

      <Stage
        width={1600}
        height={790}
        onWheel={handleWheel}
        ref={stageRef}
        onClick={handleStageClick}
      >
        <Layer x={position.x} y={position.y} scaleX={scale} scaleY={scale}>
          {previewPoint && (
            <Circle
              x={previewPoint.x}
              y={previewPoint.y}
              radius={5}
              fill="gray"
              stroke="black"
              strokeWidth={2}
              shadowColor="#ff0000"
            />
          )}

          {circles.map((circle) => (
            <React.Fragment key={circle.id}>
              <Circle
                x={circle.x}
                y={circle.y}
                radius={40}
                fill="transparent"
                stroke={circle.color}
                strokeWidth={15}
                shadowColor="#FFC107"
                draggable
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onDragStart={handleDragStart}
                onDragMove={(e) => handleDragMove(e, circle.id)}
                onDragEnd={(e) => handleDragEnd(e, circle.id)}
              />
              <Text
                x={circle.x}
                y={circle.y - 60}
                text={circle.label}
                fontSize={33}
                fontFamily="Arial"
                fill="#accfc6"
                align="center"
                width={300}
              />
            </React.Fragment>
          ))}
        </Layer>
      </Stage>
    </>
  )
}

export { FlowExample }
