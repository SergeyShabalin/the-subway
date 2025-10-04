import { useState, useRef, useEffect } from 'react'
import styles from './dropdown.module.css'

interface Option {
  value: string | number
  label: string
  color?: string
}

interface CustomDropdownProps {
  options: Option[]
  value?: string | number
  onChange: (value: string | number) => void
  placeholder?: string
  label?: string
  disabled?: boolean
  className?: string
  id?: string
  name?: string
  showColor?: boolean
}

export const Dropdown = ({
                           options,
                           value,
                           onChange,
                           placeholder = 'Выберите...',
                           label,
                           disabled = false,
                           className = '',
                           id,
                           name,
                           showColor = false,
                         }: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
        setHighlightedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])



  // Сброс highlightedIndex при открытии/закрытии
  useEffect(() => {
    if (isOpen) {
      const selectedIndex = options.findIndex(opt => opt.value === value)
      setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0)
    } else {
      setHighlightedIndex(-1)
    }
  }, [isOpen, options, value])

  const handleOptionClick = (option: Option) => {
    onChange(option.value)
    setIsOpen(false)
    setHighlightedIndex(-1)

  }

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(prev => !prev)
    }
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }


  const getButtonStyle = () => {
    const baseStyle = {
      borderLeft: `5px solid ${selectedOption?.color || 'black'}`,
    }


    if (showColor && selectedOption?.color && isHovered && !isOpen) {
      return {
        ...baseStyle,
        borderColor: selectedOption.color,
        boxShadow: `0 0 0 3px ${selectedOption.color}33`
      }
    }


    if (isOpen) {
      return {
        ...baseStyle,
        borderColor: '#3b82f6',
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.2)'
      }
    }

    return baseStyle
  }

  // Функция для получения стилей опций
  const getOptionStyle = (option: Option, isSelected: boolean, isHighlighted: boolean) => {
    if (!showColor || !option.color) return {}

    return {
      backgroundColor: isSelected || isHighlighted
        ? `${option.color}60`
        : `${option.color}15`,
      borderLeft: `5px solid ${option.color}`,
      color: isSelected || isHighlighted ? '#fff' : '#969798'
    }
  }

  return (
    <div className={`${styles.dropdownWrapper} ${className}`}>

      {label && (
        <label className={styles.dropdownLabel} htmlFor={id}>
          {label}
        </label>
      )}

      <div
        ref={containerRef}
        className={`${styles.customDropdown} ${disabled ? styles.disabled : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          ref={buttonRef}
          className={`${styles.dropdownToggle} ${isOpen ? styles.open : ''} ${
            isHovered && selectedOption?.color ? styles.hovered : ''
          }`}
          onClick={handleToggle}

          id={id}
          name={name}
          style={getButtonStyle()}
        >
          <span className={styles.dropdownSelected}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className={styles.dropdownArrow}>▼</span>
        </button>

        {isOpen && (
          <ul
            className={styles.dropdownMenu}
            role="listbox"
            aria-activedescendant={
              highlightedIndex >= 0 ? `option-${highlightedIndex}` : undefined
            }
          >
            {options.map((option, index) => (
              <li
                key={option.value}
                id={`option-${index}`}
                className={`${styles.dropdownItem} ${
                  value === option.value ? styles.selected : ''
                } ${highlightedIndex === index ? styles.highlighted : ''}`}
                onClick={() => handleOptionClick(option)}
                onMouseEnter={() => setHighlightedIndex(index)}

                aria-selected={value === option.value}
                tabIndex={-1}
                style={getOptionStyle(
                  option,
                  value === option.value,
                  highlightedIndex === index
                )}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}