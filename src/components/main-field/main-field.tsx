import { Circle, Layer, Stage as ReactStage } from 'react-konva'
import { useRef } from 'react'

import { useInteractiveStage } from './hooks/use-interactive-stage.ts'
import type { Stage } from 'konva/lib/Stage'

const MainField = () => {
  const stageRef = useRef<Stage>(null)

  const {
    scale,
    position,
    isDragging,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useInteractiveStage({ stageRef, canMove: true })

  return (
    <div style={{ border: 'solid 1px gray', width: '1500px', height: '850px' }}>
      <ReactStage
        width={1400}
        height={790}
        ref={stageRef}
        onWheel={handleWheel}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseDown={handleMouseDown}
        draggable={false}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <Layer x={position.x} y={position.y} scaleX={scale} scaleY={scale}>
          <Circle
            x={333}
            y={222}
            radius={30}
            fill="transparent"
            stroke={'#415dcf'}
          />
        </Layer>
      </ReactStage>
    </div>
  )
}

export { MainField }
