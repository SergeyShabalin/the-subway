import { Layer, Stage as ReactStage } from 'react-konva'
import { useRef, useState, useEffect } from 'react'

import type { Stage } from 'konva/lib/Stage'

import styles from './main-field.module.css'
import { useInteractiveStage } from '@components/main-field/hooks/use-interactive-stage.ts'
import { StationLabels } from '@components/station-labels/station-labels.tsx'

const MainField = ({ freeMoving }) => {
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

  return (
    <div ref={containerRef} className={styles.container}>
      <ReactStage
        width={stageSize.width}
        height={stageSize.height}
        ref={stageRef}
        onWheel={handleWheel}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseDown={handleMouseDown}
        draggable={false}
        pixelRatio={window.devicePixelRatio || 1}
      >
        <Layer
          x={position.x}
          y={position.y}
          scaleX={scale}
          scaleY={scale}
        >
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
