import { Sidebar } from '../ui'
import { useVisualization } from '../../store/hooks/use-visualization.ts'
import { useMetro } from '../../store/hooks/use-metro.ts'
import { useState, useCallback, useEffect } from 'react'

const ControlPanel = ({ curvatureRef, stageRef }) => {
  const {
    circleRadius,
    actions: visActions,
  } = useVisualization()
  const { metroNetwork, activeLineId, actions: metroActions } = useMetro()

  const [curvatureValue, setCurvatureValue] = useState(0)

  // Инициализация значения кривизны при смене активной линии
  useEffect(() => {
    if (activeLineId !== null) {
      const currentCurvature = curvatureRef.current[activeLineId] ?? 50
      setCurvatureValue(currentCurvature)
    }
  }, [activeLineId, curvatureRef])

  const changeCurvatureRef = useCallback((curvature: number) => {
    if (activeLineId === null) return

    // ✅ Быстрое обновление ref без перерендера
    curvatureRef.current = {
      ...curvatureRef.current,
      [activeLineId]: curvature
    }

    // ✅ Немедленное обновление всех линий через Stage API
    updateAllLinesCurvature(activeLineId, curvature)
  }, [activeLineId, curvatureRef])

  // Функция для немедленного обновления всех линий
  const updateAllLinesCurvature = useCallback((lineId: number, curvature: number) => {
    // Находим все Path элементы для этой линии
    const linePaths = document.querySelectorAll(`[id^="line-${lineId}-"]`)

    linePaths.forEach(pathElement => {
      const path = (pathElement as any).getNode?.()
      if (path && path.attrs.originalCoords) {
        const { from, to, line } = path.attrs.originalCoords

        // Пересчитываем путь с новой кривизной
        const newData = recalcPath(from, to, line, curvature)
        path.data(newData)
      }
    })

    // Принудительное обновление слоя
    const layer = document.querySelector('konva-layer')?.getNode?.()
    layer?.batchDraw()
  }, [])

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRadius = parseFloat(e.target.value)
    visActions.setCircleRadius(newRadius)

    if (activeLineId !== null) {
      metroActions.alignLineToCircle(activeLineId, newRadius)
    }
  }

  const handleLineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value ? parseInt(e.target.value) : null
    metroActions.setActiveLineId(id)
  }

  return (
    <div>
      <Sidebar>
        <div
          style={{
            padding: '16px',
            backgroundColor: '#252222',
            borderBottom: '1px solid #ddd',
          }}
        >
          <label style={{ marginRight: '12px', fontWeight: 'bold' }}>
            Радиус кольцевой линии:
          </label>
          <input
            type="range"
            min="50"
            max="1000"
            step="5"
            value={circleRadius}
            onChange={handleRadiusChange}
            style={{ width: '200px', margin: '0 10px' }}
          />
          <span style={{ fontSize: '14px', color: '#555' }}>
            {Math.round(circleRadius)} px
          </span>
          <select
            value={activeLineId || ''}
            onChange={handleLineChange}
            style={{ marginLeft: '20px', padding: '4px', fontSize: '14px' }}
          >
            <option value="">Выберите линию...</option>
            {metroNetwork
              .filter((l) => l.locking)
              .map((line) => (
                <option key={line.id} value={line.id}>
                  {line.name} (кольцевая)
                </option>
              ))}
          </select>

          <div
            style={{ display: 'flex', alignItems: 'center', marginTop: '12px' }}
          >
            {activeLineId && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: '12px',
                }}
              >
                <label style={{ marginRight: '12px', fontWeight: 'bold' }}>
                  Кривизна линии:
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={curvatureValue}
                  onChange={(e) => {
                    const newCurvature = Number(e.target.value)
                    setCurvatureValue(newCurvature)
                    changeCurvatureRef(newCurvature)
                  }}
                  style={{ width: '200px', margin: '0 10px' }}
                />
                <span style={{ fontSize: '14px', color: '#555' }}>
                  {curvatureValue}
                </span>
              </div>
            )}
          </div>
        </div>
      </Sidebar>
    </div>
  )
}

export { ControlPanel }