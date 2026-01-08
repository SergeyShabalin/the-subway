import { Layer, Stage as ReactStage } from 'react-konva'
import { useRef, useState, useEffect } from 'react'
import type { Stage } from 'konva/lib/Stage'
import styles from './main-field.module.css'
import { useInteractiveStage } from '@components/main-field/hooks/use-interactive-stage/use-interactive-stage.ts'
import { StationLabels } from '@components/station-labels/station-labels.tsx'
import { Stations } from '@components/stations/stations.tsx'

const MainField = ({ freeMoving }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const stageRef = useRef<Stage>(null)
  const dragOffsetsRef = useRef<Record<number, { x: number; y: number }>>({})
  const [lineDragOffset, setLineDragOffset] = useState<{
    x: number
    y: number
  } | null>(null)

  const [stageSize, setStageSize] = useState({ width: 0, height: 0 }) // Начинаем с 0

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

  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      // Округляем до целых и делаем четными
      const width = Math.max(100, Math.floor(rect.width))
      const height = Math.max(100, Math.floor(rect.height))

      // Делаем четными числами для избежания артефактов
      setStageSize({
        width: width % 2 === 0 ? width : width - 1,
        height: height % 2 === 0 ? height : height - 1,
      })
    }

    // Задержка для гарантии, что DOM полностью загружен
    setTimeout(updateSize, 0)
    window.addEventListener('resize', updateSize)

    return () => window.removeEventListener('resize', updateSize)
  }, [])


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
        style={{ display: 'block' }} // Добавляем стиль
        pixelRatio={window.devicePixelRatio || 1}
      >
        <Layer
          x={Math.round(position.x)}
          y={Math.round(position.y)}
          scaleX={scale}
          scaleY={scale}
          imageSmoothingEnabled={false}
        >
          <StationLabels
            dragOffsetsRef={dragOffsetsRef}
            lineDragOffset={lineDragOffset}
          />
          <Stations   dragOffsetsRef={dragOffsetsRef}
                      stageRef={stageRef}
                      setLineDragOffset={setLineDragOffset}/>
        </Layer>
      </ReactStage>
    </div>
  )
}

export { MainField }
