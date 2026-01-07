import React, { useState } from 'react'
import styles from './Input.module.css'
import type { InputProps } from '@components/ui/input/types.ts'

const Input: React.FC<InputProps> = ({
                                       placeholder,
                                       type = 'text',
                                       value = '',
                                       onChange,
                                       required = false,
                                       className = '',
                                       name,
                                       autoComplete='off'
                                     }) => {
  const [isFocused, setIsFocused] = useState(false)
  const hasValue = value.length > 0

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)

  const containerClass = `${styles.waveGroup} ${className} ${
    isFocused ? styles.focused : ''
  } ${hasValue ? styles.hasValue : ''}`

  // Разбиваем placeholder на слова по пробелам
  const words = placeholder.split(' ')

  return (
    <div className={containerClass}>
      <input
        required={required}
        type={type}
        className={styles.input}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        name={name}
        placeholder=" "
        autoComplete={autoComplete}
      />
      <span className={styles.bar}></span>
      <label className={styles.label}>
        {words.map((word, wordIndex) => (
          <React.Fragment key={wordIndex}>
            {/* Разбиваем каждое слово на символы */}
            {Array.from(word).map((char, charIndex) => {
              // Вычисляем общий индекс для анимации
              const totalIndex = words.slice(0, wordIndex).join('').length + charIndex + wordIndex

              return (
                <span
                  key={`${wordIndex}-${charIndex}`}
                  className={styles.labelChar}
                  style={
                    {
                      '--index': totalIndex,
                    } as React.CSSProperties
                  }
                >
                  {char}
                </span>
              )
            })}
            {/* Добавляем пробел между словами, кроме последнего */}
            {wordIndex < words.length - 1 && (
              <span
                className={styles.labelChar}
                style={
                  {
                    '--index': words.slice(0, wordIndex + 1).join('').length + wordIndex,
                  } as React.CSSProperties
                }
              >
                &nbsp;
              </span>
            )}
          </React.Fragment>
        ))}
      </label>
    </div>
  )
}

export { Input }