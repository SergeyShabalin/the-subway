import { Layer, Stage as ReactStage } from 'react-konva'
import { useRef } from 'react'
import { useInteractiveStage } from './hooks/use-interactive-stage.ts'
import type { Stage } from 'konva/lib/Stage'
import { Stations, Lines, StationLabels } from '@/components'
import type { IMainFieldProps } from '@components/main-field/types.ts'
import styles from './main-field.module.css'

const MainField = ({
  freeMoving,
  curvatureRef,
  circleRadiusRef,
}: IMainFieldProps) => {
  const stageRef = useRef<Stage>(null)
  const dragOffsetsRef = useRef<Record<number, { x: number; y: number }>>({})

  const {
    scale,
    position,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useInteractiveStage({
    stageRef,
    canMove: freeMoving,
  })

  return (
    <div className={styles.container} >
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
          <Lines dragOffsetsRef={dragOffsetsRef} curvatureRef={curvatureRef} />
          <Stations
            dragOffsetsRef={dragOffsetsRef}
            stageRef={stageRef}
            circleRadiusRef={circleRadiusRef}
          />
          <StationLabels dragOffsetsRef={dragOffsetsRef} />
        </Layer>
      </ReactStage>
    </div>
  )
}

export { MainField }
