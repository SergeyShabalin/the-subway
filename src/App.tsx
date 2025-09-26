import './global.css'
import { ControlPanel, MainField } from './components'
import { useRef, useState } from 'react'

const App = () => {
  const [freeMoving, setFreeMoving] = useState<boolean>(false)
  const curvatureRef = useRef<Record<number, number>>({})
  const circleRadiusRef = useRef<number>(300) // ✅ Новый ref для радиуса кольцевой линии

  return (
    <div className="content">
      <label style={{ color: 'white', padding: '10px' }}>
        <input
          type="checkbox"
          checked={freeMoving}
          onChange={() => setFreeMoving(!freeMoving)}
          title={'Режим свободного перемещения'}
        />
        Режим свободного перемещения
      </label>
      <ControlPanel curvatureRef={curvatureRef} circleRadiusRef={circleRadiusRef} />
      <MainField freeMooving={freeMoving} curvatureRef={curvatureRef} circleRadiusRef={circleRadiusRef} />
    </div>
  )
}

export { App }
