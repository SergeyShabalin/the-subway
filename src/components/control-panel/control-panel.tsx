import { Sidebar } from '../ui'
import { useVisualization } from '@/store/hooks/use-visualization.ts'
import { useMetro } from '@/store/hooks/use-metro.ts'
import { useState, useEffect } from 'react'
import { Curvature } from './lines/curvature/curvature.tsx'
import type { IControlPanelProps } from './types.ts'
import { Range } from '@components/ui/range/range.tsx'
import { RadiusIcon } from '@assets/radius-icon.tsx'
import { Dropdown } from '@components/ui/dropdown/dropdown.tsx'

const ControlPanel = ({
                        curvatureRef,
                        circleRadiusRef,
                        setFreeMoving,
                        freeMoving
                      }: IControlPanelProps) => {
  const { circleRadius: storeCircleRadius } = useVisualization()
  const { metroNetwork, activeLineId, actions: metroActions } = useMetro()
  const [radiusValue, setRadiusValue] = useState(storeCircleRadius)
  const [lineMoveEnabled, setLineMoveEnabled] = useState(false)

  // Получаем активную линию
  const activeLine = activeLineId
    ? metroNetwork.find(line => line.id === activeLineId)
    : null

  // Проверяем, является ли активная линия круговой
  const isActiveLineCircular = activeLine?.renderStyle === 'circular'

  // Инициализация значения радиуса
  useEffect(() => {
    circleRadiusRef.current = storeCircleRadius
    setRadiusValue(storeCircleRadius)
  }, [circleRadiusRef, storeCircleRadius])

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRadius = Number(e.target.value)
    setRadiusValue(newRadius)
    circleRadiusRef.current = newRadius
  }

  const handleLineChange = (selectedValue: string | number) => {
    const id = selectedValue === '' ? null : Number(selectedValue)
    metroActions.setActiveLineId(id)
    setLineMoveEnabled(false)
  }

  const handleLineMoveToggle = () => {
    if (!activeLineId) {
      alert('Сначала выберите линию для перемещения')
      return
    }
    setLineMoveEnabled(!lineMoveEnabled)
  }

  // Функция для выравнивания расстояния между станциями
  const handleEvenlyDistributeStations = () => {
    if (!activeLineId) {
      alert('Сначала выберите линию для выравнивания')
      return
    }

    const activeLine = metroNetwork.find(line => line.id === activeLineId)
    if (!activeLine || activeLine.stations.length < 3) {
      alert('Для выравнивания нужно минимум 3 станции в линии')
      return
    }

    metroActions.evenlyDistributeStations(activeLineId)
  }

  return (
    <div>
      <Sidebar>
        <div
          style={{
            position: 'relative',
            padding: '16px',
            backgroundColor: '#252222',
            borderBottom: '1px solid #ddd',
          }}
        >

          <Dropdown
            label="Выберите линию метро"
            options={metroNetwork
              .map((line) => ({
                value: line.id,
                label: `${line.name} ${line.renderStyle === 'circular' ? '(кольцевая)' : '(линейная)'}`,
                color: line.color
              }))
            }
            value={activeLineId || ''}
            onChange={handleLineChange}
            placeholder="Выберите линию..."
            className="metro-line-dropdown"
            showColor={true}
          />

          <div>
            <label style={{ color: 'white', padding: '10px' }}>
              <input
                type="checkbox"
                checked={freeMoving}
                onChange={() => setFreeMoving(!freeMoving)}
                title={'Режим свободного перемещения'}
              />
              Режим свободного перемещения
            </label>
          </div>

          {/* Перемещение всей линии */}
          {activeLineId && (
            <div style={{ marginBottom: '12px', padding: '8px', backgroundColor: '#333335', borderRadius: '4px' }}>
              <label style={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                <input
                  type="checkbox"
                  checked={lineMoveEnabled}
                  onChange={handleLineMoveToggle}
                  style={{ marginRight: '8px' }}
                />
                Режим перемещения всей линии
              </label>
              {lineMoveEnabled && (
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#ccc' }}>
                  Перетащите линию для перемещения (все станции и сегменты)
                </div>
              )}
            </div>
          )}

          {/* Кривизна линий - ТОЛЬКО для круговых линий */}
          {isActiveLineCircular && (
            <Curvature activeLineId={activeLineId} curvatureRef={curvatureRef} />
          )}

          {/* Кнопка выравнивания расстояния между станциями */}
          {activeLineId && (
            <button
              onClick={handleEvenlyDistributeStations}
              style={{
                marginBottom: '12px',
                width: '100%',
                backgroundColor: '#4a90e2',
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              title="Равномерно распределить станции вдоль линии"
            >
              🎯 Выровнять расстояние между станциями
            </button>
          )}

          {/* Радиус кольцевой ветки - ТОЛЬКО для круговых линий */}
          {isActiveLineCircular && (
            <Range
              onChange={handleRadiusChange}
              value={radiusValue}
              placeholder="Радиус кольцевой ветки"
              icon={<RadiusIcon strokeColor={'#1eda8c'} />}
            />
          )}
        </div>
      </Sidebar>
    </div>
  )
}

export { ControlPanel }