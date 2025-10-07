// MainField.tsx
import { Layer, Stage as ReactStage } from 'react-konva'
import { useRef, useState, useEffect } from 'react'
import { useInteractiveStage } from './hooks/use-interactive-stage.ts'
import type { Stage } from 'konva/lib/Stage'
import { Stations, Lines, StationLabels } from '@/components'
import type { IMainFieldProps } from '@components/main-field/types.ts'
import styles from './main-field.module.css'

const MainField = ({
                     freeMoving,
                     lineMoveEnabled,
                     curvatureRef,
                     circleRadiusRef,
                     rotationAngleRef
                   }: IMainFieldProps & { lineMoveEnabled: boolean }) => {
  const stageRef = useRef<Stage>(null)
  const dragOffsetsRef = useRef<Record<number, { x: number; y: number }>>({})
  const [lineDragOffset, setLineDragOffset] = useState<{ x: number; y: number } | null>(null)

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

  // Принудительное обновление при изменении смещения линии
  useEffect(() => {
    if (stageRef.current) {
      stageRef.current.batchDraw()
    }
  }, [lineDragOffset])

  return (
    <div className={styles.container} >
      <button onClick={()=>{console.log('stageref', stageRef)}}>stageref</button>
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
          <Lines
            dragOffsetsRef={dragOffsetsRef}
            curvatureRef={curvatureRef}
            lineDragOffset={lineDragOffset}
          />
          <Stations
            dragOffsetsRef={dragOffsetsRef}
            stageRef={stageRef}
            circleRadiusRef={circleRadiusRef}
            rotationAngleRef={rotationAngleRef}
            lineMoveEnabled={lineMoveEnabled}
            setLineDragOffset={setLineDragOffset}
          />
          <StationLabels
            dragOffsetsRef={dragOffsetsRef}
            lineDragOffset={lineDragOffset}
          />
        </Layer>
      </ReactStage>
    </div>
  )
}

export { MainField }