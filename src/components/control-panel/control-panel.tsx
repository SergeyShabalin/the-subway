import { Sidebar } from '../ui'
import { useVisualization } from '../../store/hooks/use-visualization.ts'
import { useMetro } from '../../store/hooks/use-metro.ts'

const ControlPanel = () => {
  const {
    circleRadius,
    actions: visActions,
  } = useVisualization()
  const { metroNetwork, activeLineId, actions: metroActions } = useMetro()


  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRadius = parseFloat(e.target.value)
    visActions.setCircleRadius(newRadius)

    if (activeLineId !== null) {
      metroActions.alignLineToCircle(activeLineId, newRadius)
    }
  }

  // 🔹 Обработчик выравнивания (по кнопке)
  const handleAlignCircle = () => {
    if (!activeLineId) return
    const line = metroNetwork.find((l) => l.id === activeLineId)
    if (!line?.locking) return

    // Используем текущий радиус из store
    const currentRadius = circleRadius
    metroActions.alignLineToCircle(activeLineId, currentRadius)
  }

  const handleLineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value ? parseInt(e.target.value) : null
    metroActions.setActiveLineId(id) // 👈 ТЕПЕРЬ МЕНЯЕМ activeLineId В REDUX!
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
            onChange={handleLineChange} // 👈 ТЕПЕРЬ ОБНОВЛЯЕМ activeLineId В STORE
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

          <button
            onClick={handleAlignCircle}
            style={{
              margin: '20px',
              padding: '6px 16px',
            }}
          >
            Выровнять круг
          </button>
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
                  value={
                    metroNetwork.find((l) => l.id === activeLineId)
                      ?.curvatureLines || 50
                  }
                  onChange={(e) => {
                    const newCurvature = Number(e.target.value)
                    console.log(newCurvature)
                    metroActions.updateLineCurvature(activeLineId, newCurvature)
                  }}
                  style={{ width: '200px', margin: '0 10px' }}
                />
                <span style={{ fontSize: '14px', color: '#555' }}>
                  {Math.round(
                    metroNetwork.find((l) => l.id === activeLineId)
                      ?.curvatureLines || 50,
                  )}
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