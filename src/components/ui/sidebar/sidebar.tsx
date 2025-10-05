import styles from './sidebar.module.css'
import { useState } from 'react'
import { ArrowIcon } from '@assets/arrow-icon.tsx'

const Sidebar = ({ children }) => {
  const [isActive, setIsActive] = useState<boolean>(true)

  const openCloseSidebar = () => {
    setIsActive(!isActive)
  }

  return (
    <>
      <div
        className={`${styles.switch} ${isActive ? styles.switchActive : ''}`}
        onClick={openCloseSidebar}
      >
        <ArrowIcon strokeColor={'gray'} />
      </div>

      <div
        className={`${styles.wrapper} ${isActive ? styles.wrapperActive : ''}`}
      >
       <div style={{paddingTop: '20px'}}>{children}</div>
      </div>
    </>
  )
}

export { Sidebar }
