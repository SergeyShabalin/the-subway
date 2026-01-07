import './global.css'

import { useState } from 'react'
import { ThemeToggle } from '@/components'
import { MainField } from '@components/main-field/main-field.tsx'

const App = () => {
  const [freeMoving, setFreeMoving] = useState<boolean>(false)

  return (
    <>
      <ThemeToggle />
      <MainField freeMoving={freeMoving} />
    </>
  )
}

export { App }
