import { useRef, useEffect } from 'react'
import styles from './Modal.module.css'

const Modal = ({ isOpen, onClose, children, closeOnEsc = true }) => {
  const modalRef = useRef(null)

  // Закрытие при клике вне модалки
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  // Закрытие по Esc (опционально)
  useEffect(() => {
    const handleEsc = (event) => {
      if (closeOnEsc && event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      return () => document.removeEventListener('keydown', handleEsc)
    }
  }, [isOpen, onClose, closeOnEsc])

  if (!isOpen) return null

  return (
    <div className={styles.overlay}>
      <div ref={modalRef} className={styles.content}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  )
}

export { Modal }
