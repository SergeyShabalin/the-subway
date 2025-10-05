import { Sidebar } from '../ui'
import { useVisualization } from '@/store/hooks/use-visualization.ts'
import { useMetro } from '@/store/hooks/use-metro.ts'
import { useState, useEffect, useRef } from 'react'
import { Curvature } from './lines/curvature/curvature.tsx'
import type { IControlPanelProps } from './types.ts'
import { Range } from '@components/ui/range/range.tsx'
import { RadiusIcon } from '@assets/radius-icon.tsx'
import { Dropdown } from '@components/ui/dropdown/dropdown.tsx'
import { RotationIcon } from '@assets/rotation-icon.tsx'

const ControlPanel = ({
                        curvatureRef,
                        circleRadiusRef,
                        setFreeMoving,
                        freeMoving,
                        rotationAngleRef
                      }: IControlPanelProps) => {
  const { circleRadius: storeCircleRadius } = useVisualization()
  const { metroNetwork, activeLineId, actions: metroActions } = useMetro()

  // Используем ref для отслеживания, был ли уже инициализирован радиус
  const isRadiusInitializedRef = useRef(false)
  const [radiusValue, setRadiusValue] = useState(300) // Начальное значение по умолчанию
  const [rotationAngle, setRotationAngle] = useState(0)
  const [lineMoveEnabled, setLineMoveEnabled] = useState(false)

  // Получаем активную линию
  const activeLine = activeLineId
    ? metroNetwork.find(line => line.id === activeLineId)
    : null

  // Проверяем, является ли активная линия круговой
  const isActiveLineCircular = activeLine?.renderStyle === 'circular'

  // Инициализация значения радиуса только при первом выборе круговой линии
  useEffect(() => {
    if (isActiveLineCircular && !isRadiusInitializedRef.current) {
      // Устанавливаем значение из store только если еще не инициализировали
      // circleRadiusRef.current = storeCircleRadius
      // setRadiusValue(storeCircleRadius)
      isRadiusInitializedRef.current = true
    }
  }, [isActiveLineCircular, storeCircleRadius, circleRadiusRef])

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRadius = Number(e.target.value)
    setRadiusValue(newRadius)
    circleRadiusRef.current = newRadius
  }

  // Обработчик поворота кольцевой линии - через ref (как радиус)
  const handleRotationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAngle = Number(e.target.value)
    setRotationAngle(newAngle)
    rotationAngleRef.current = newAngle * (Math.PI / 180)
  }

  // Сброс поворота
  const handleResetRotation = () => {
    setRotationAngle(0)
    rotationAngleRef.current = 0
  }

  const handleLineChange = (selectedValue: string | number) => {
    const id = selectedValue === '' ? null : Number(selectedValue)
    metroActions.setActiveLineId(id)
    setLineMoveEnabled(false)

    // Сбрасываем угол поворота при смене линии
    setRotationAngle(0)
    rotationAngleRef.current = 0

    // НЕ сбрасываем флаг инициализации радиуса при смене линии
    // чтобы сохранить текущее значение радиуса
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
            top: '20px',
            padding: '10px',
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
          {/*{activeLineId && (*/}
          {/*  <div style={{ marginBottom: '12px', padding: '8px', backgroundColor: '#333335', borderRadius: '4px' }}>*/}
          {/*    <label style={{ display: 'flex', alignItems: 'center', color: 'white' }}>*/}
          {/*      <input*/}
          {/*        type="checkbox"*/}
          {/*        checked={lineMoveEnabled}*/}
          {/*        onChange={handleLineMoveToggle}*/}
          {/*        style={{ marginRight: '8px' }}*/}
          {/*      />*/}
          {/*      Режим перемещения всей линии*/}
          {/*    </label>*/}
          {/*    {lineMoveEnabled && (*/}
          {/*      <div style={{ marginTop: '8px', fontSize: '12px', color: '#ccc' }}>*/}
          {/*        Перетащите линию для перемещения (все станции и сегменты)*/}
          {/*      </div>*/}
          {/*    )}*/}
          {/*  </div>*/}
          {/*)}*/}
          {/* Радиус кольцевой ветки - ТОЛЬКО для круговых линий */}
          {isActiveLineCircular && (
            <Range
              onChange={handleRadiusChange}
              value={radiusValue}
              placeholder="Радиус кольцевой ветки"
              icon={<RadiusIcon strokeColor={'#1eda8c'} />}
              min={5}
              max={2000}
              step={5}
            />
          )}
          {/* Кривизна линий - ТОЛЬКО для круговых линий */}
          {isActiveLineCircular && (
            <Curvature activeLineId={activeLineId} curvatureRef={curvatureRef} />
          )}

          {/* Поворот кольцевой линии - ТОЛЬКО для круговых линий */}
          {isActiveLineCircular && (
            <div style={{ marginBottom: '12px' }}>
              <Range
                onChange={handleRotationChange}
                value={rotationAngle}
                min={-180}
                max={180}
                step={1}
                placeholder={`Поворот: ${rotationAngle}°`}
                icon={<RotationIcon strokeColor={'#ff6b6b'} />}
              />
              <button
                onClick={handleResetRotation}
                style={{
                  marginTop: '4px',
                  width: '100%',
                  backgroundColor: '#666',
                  color: 'white',
                  border: 'none',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Сбросить поворот
              </button>
            </div>
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


        </div>
      </Sidebar>
    </div>
  )
}

export { ControlPanel }