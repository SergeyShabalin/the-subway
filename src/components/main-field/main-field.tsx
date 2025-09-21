import { Layer, Stage as ReactStage } from 'react-konva'
import { useRef } from 'react'
import { useInteractiveStage } from './hooks/use-interactive-stage.ts'
import type { Stage } from 'konva/lib/Stage'
import { Stations } from '../stations/stations.tsx'
import { Lines } from '../lines/lines.tsx'
import { StationLabels } from '../station-labels/station-labels.tsx'

const MainField = ({ freeMooving }: { freeMooving: boolean }) => {
  const stageRef = useRef<Stage>(null)
  const dragOffsetsRef = useRef<Record<number, { x: number; y: number }>>({})

  const {
    scale,
    position,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useInteractiveStage({ stageRef, canMove: freeMooving })

  return (
    <div style={{ border: '1px solid gray', width: '1910px', height: '1070px' }}>
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
          <Lines dragOffsetsRef={dragOffsetsRef} stageRef={stageRef} />
          <Stations dragOffsetsRef={dragOffsetsRef} stageRef={stageRef} />
          <StationLabels dragOffsetsRef={dragOffsetsRef} stageRef={stageRef} />
        </Layer>
      </ReactStage>
    </div>
  )
}

export { MainField }

