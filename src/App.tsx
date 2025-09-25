import './global.css'
import { ControlPanel, MainField } from './components'
import { useState } from 'react'

const App = () => {
  const [freeMoving, setFreeMoving] = useState<boolean>(false)

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
      <ControlPanel />
      <MainField freeMooving={freeMoving} />
    </div>
  )
}

export { App }
