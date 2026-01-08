// MainField.tsx — заменяем по содержимому
import { Layer, Stage as ReactStage } from 'react-konva'
import { useRef, useState, useEffect, useCallback } from 'react'
import { useInteractiveStage } from '../../../source/components/main-field/hooks/use-interactive-stage/use-interactive-stage.ts'
import type { Stage } from 'konva/lib/Stage'

import type { IMainFieldProps } from '@components/main-field/types.ts'
import styles from './main-field.module.css'
import { Lines } from '../lines/lines.tsx'
import { Stations } from '../stations/stations.tsx'
import { StationLabels } from '../station-labels/station-labels.tsx'

const MainField = ({
  freeMoving,
  lineMoveEnabled,
  curvatureRef,
  circleRadiusRef,
  rotationAngleRef,
}: IMainFieldProps & { lineMoveEnabled: boolean }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const stageRef = useRef<Stage>(null)
  const dragOffsetsRef = useRef<Record<number, { x: number; y: number }>>({})
  const [lineDragOffset, setLineDragOffset] = useState<{
    x: number
    y: number
  } | null>(null)

  // размеры stage в логических пикселях (не умножаем на DPR)
  const [stageSize, setStageSize] = useState({ width: 1920, height: 1080 })

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

  // вычисляем реальные размеры контейнера
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const width = Math.max(100, Math.floor(rect.width))
      const height = Math.max(100, Math.floor(rect.height))
      setStageSize({ width, height })
    }

    updateSize()
    // ресайз слушаем
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // Если scale меняется — обновляем отрисовку
  useEffect(() => {
    if (stageRef.current) {
      stageRef.current.batchDraw()
    }
  }, [scale, lineDragOffset])

  // optional: debug button
  const dumpRef = useCallback(() => {
    console.log('stageRef', stageRef.current)
  }, [])

  return (
    <div ref={containerRef} className={styles.container}>
      <ReactStage
        width={stageSize.width}
        height={stageSize.height}
        ref={stageRef}

        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseDown={handleMouseDown}
        draggable={false}
        pixelRatio={window.devicePixelRatio || 1}

      >
        {/* позиция слоя в логических пикселях */}
        <Layer x={position.x} y={position.y} scaleX={scale}
               scaleY={scale}>
          {/*<Lines*/}
          {/*  dragOffsetsRef={dragOffsetsRef}*/}
          {/*  curvatureRef={curvatureRef}*/}
          {/*  lineDragOffset={lineDragOffset}*/}
          {/*/>*/}
          {/*<Stations*/}
          {/*  dragOffsetsRef={dragOffsetsRef}*/}
          {/*  stageRef={stageRef}*/}
          {/*  circleRadiusRef={circleRadiusRef}*/}
          {/*  rotationAngleRef={rotationAngleRef}*/}
          {/*  lineMoveEnabled={lineMoveEnabled}*/}
          {/*  setLineDragOffset={setLineDragOffset}*/}
          {/*  curvatureRef={curvatureRef}*/}
          {/*/>*/}
          {/*<StationLabels*/}
          {/*  dragOffsetsRef={dragOffsetsRef}*/}
          {/*  lineDragOffset={lineDragOffset}*/}
          {/*/>*/}
        </Layer>
      </ReactStage>
    </div>
  )
}

export { MainField }
