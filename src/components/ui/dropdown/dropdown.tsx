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
  highlightEnabled?: boolean // Новый пропс для управления подсветкой
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
                           highlightEnabled = false, // По умолчанию отключена
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
    if (isOpen && highlightEnabled) {
      const selectedIndex = options.findIndex(opt => opt.value === value)
      setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0)
    } else {
      setHighlightedIndex(-1)
    }
  }, [isOpen, options, value, highlightEnabled])

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
      backgroundColor: isSelected || (highlightEnabled && isHighlighted)
        ? `${option.color}60`
        : `${option.color}15`,
      borderLeft: `5px solid ${option.color}`,
      color: isSelected || (highlightEnabled && isHighlighted) ? '#fff' : '#969798'
    }
  }

  // Обработчик для навигации с клавиатуры (только если подсветка включена)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!highlightEnabled || !isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev =>
          prev < options.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev =>
          prev > 0 ? prev - 1 : options.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0) {
          handleOptionClick(options[highlightedIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        setHighlightedIndex(-1)
        break
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
          onKeyDown={handleKeyDown}
          id={id}
          name={name}
          style={getButtonStyle()}
          tabIndex={0}
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
              highlightEnabled && highlightedIndex >= 0 ? `option-${highlightedIndex}` : undefined
            }
          >
            {options.map((option, index) => (
              <li
                key={option.value}
                id={`option-${index}`}
                className={`${styles.dropdownItem} ${
                  value === option.value ? styles.selected : ''
                } ${
                  highlightEnabled && highlightedIndex === index ? styles.highlighted : ''
                }`}
                onClick={() => handleOptionClick(option)}
                onMouseEnter={() => highlightEnabled && setHighlightedIndex(index)}
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