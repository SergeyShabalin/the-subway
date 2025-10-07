// App.tsx
import './global.css'
import { ControlPanel, MainField } from '@/components'
import { useRef, useState } from 'react'

const App = () => {
  const [freeMoving, setFreeMoving] = useState<boolean>(false)
  const [lineMoveEnabled, setLineMoveEnabled] = useState<boolean>(false)
  const curvatureRef = useRef<Record<number, number>>({})
  const circleRadiusRef = useRef<number>(300)
  const rotationAngleRef = useRef<number>(0)

  return (
    <div className="content">
      <ControlPanel
        curvatureRef={curvatureRef}
        circleRadiusRef={circleRadiusRef}
        rotationAngleRef={rotationAngleRef}
        setFreeMoving={setFreeMoving}
        freeMoving={freeMoving}
        setLineMoveEnabled={setLineMoveEnabled}
        lineMoveEnabled={lineMoveEnabled}
      />
      <MainField
        freeMoving={freeMoving}
        lineMoveEnabled={lineMoveEnabled}
        curvatureRef={curvatureRef}
        circleRadiusRef={circleRadiusRef}
        rotationAngleRef={rotationAngleRef}
      />
    </div>
  )
}

export { App }