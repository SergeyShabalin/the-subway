// MainField.tsx — финальная версия

import { Layer, Stage as ReactStage } from 'react-konva'
import { useRef, useState } from 'react'
import { useInteractiveStage } from './hooks/use-interactive-stage.ts'
import type { Stage } from 'konva/lib/Stage'
import { Stations } from '../stations/stations.tsx'
import { Lines } from '../lines/lines.tsx'
import { StationLabels } from '../station-labels/station-labels.tsx'

const MainField = ({ freeMooving }: { freeMooving: boolean }) => {
  const stageRef = useRef<Stage>(null)

  const {
    scale,
    position,
    isDragging,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useInteractiveStage({ stageRef, canMove: freeMooving })

  const [dragOffsets, setDragOffsets] = useState<Record<number, { x: number; y: number }>>({})

  const updateDragOffset = (stationId: number, dx: number, dy: number) => {
    setDragOffsets(prev => ({
      ...prev,
      [stationId]: { x: dx, y: dy },
    }))
  }
  console.log('dragOffsets', dragOffsets)

  const clearDragOffset = (stationId: number) => {
    setDragOffsets(prev => {
      const newOffsets = { ...prev }
      delete newOffsets[stationId]
      return newOffsets
    })
  }

  return (
    <div style={{ border: 'solid 1px gray', width: '1910px', height: '1070px', display: 'flex', flexDirection: 'column' }}>
      <ReactStage
        width={1920}
        height={1080}
        ref={stageRef}
        onWheel={handleWheel}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseDown={handleMouseDown}
        draggable={false}
      >
        <Layer x={position.x} y={position.y} scaleX={scale} scaleY={scale}>
          {/* 👇 ЛИНИИ — ДВИГАЮТСЯ В РЕАЛЬНОМ ВРЕМЕНИ СО СТАНЦИЕЙ */}
          <Lines dragOffsets={dragOffsets} />

          {/* 👇 СТАНЦИИ — ПЕРЕДАЮТ СМЕЩЕНИЕ И УПРАВЛЯЮТ DRAG */}
          <Stations
            dragOffsets={dragOffsets}
            updateDragOffset={updateDragOffset}
            clearDragOffset={clearDragOffset}
          />

          {/* 👇 МЕТКИ — ДВИГАЮТСЯ В РЕАЛЬНОМ ВРЕМЕНИ СО СТАНЦИЕЙ */}
          <StationLabels dragOffsets={dragOffsets} />
        </Layer>
      </ReactStage>
    </div>
  )
}

export { MainField }