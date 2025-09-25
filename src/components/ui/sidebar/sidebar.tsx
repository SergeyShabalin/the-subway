import styles from './sidebar.module.css'
import { useState } from 'react'

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
        настройки
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
