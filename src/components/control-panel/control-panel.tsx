import { Sidebar } from '../ui'
import { useVisualization } from '../../store/hooks/use-visualization.ts'
import { useMetro } from '../../store/hooks/use-metro.ts'
import { useState, useEffect } from 'react'
import { Curvature } from './lines/curvature/curvature.tsx'
import { CircleRadius } from './lines/circle-radius/circle-radius.tsx'
import type { IControlPanelProps } from './types.ts'

const ControlPanel = ({ curvatureRef, circleRadiusRef }: IControlPanelProps) => {
  const {
    circleRadius: storeCircleRadius,
    actions: visActions,
  } = useVisualization()

  const { metroNetwork, activeLineId, actions: metroActions } = useMetro()
  const [radiusValue, setRadiusValue] = useState(storeCircleRadius)

  // Инициализация значения радиуса
  useEffect(() => {
    circleRadiusRef.current = storeCircleRadius
    setRadiusValue(storeCircleRadius)
  }, [circleRadiusRef, storeCircleRadius])

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRadius = Number(e.target.value)
    setRadiusValue(newRadius)
    circleRadiusRef.current = newRadius
    // УБИРАЕМ metroActions.alignLineToCircle - будем работать через Stage API
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
          <select
            value={activeLineId || ''}
            onChange={handleLineChange}
            style={{ marginBottom: '12px', padding: '4px', fontSize: '14px' }}
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

          <Curvature activeLineId={activeLineId} curvatureRef={curvatureRef} />

          {activeLineId && (
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '12px' }}>
                <span style={{ marginRight: '12px', fontWeight: 'bold' }}>
                  Радиус кольцевой линии:
                </span>
              <input
                type="range"
                min="5"
                max="1000"
                step="20"
                value={radiusValue}
                onChange={handleRadiusChange}
                style={{ width: '200px', margin: '0 10px' }}
              />
              <span style={{ fontSize: '14px', color: '#555' }}>
                  {Math.round(radiusValue)} px
                </span>
            </div>
          )}
        </div>
      </Sidebar>
    </div>
  )
}

export { ControlPanel }