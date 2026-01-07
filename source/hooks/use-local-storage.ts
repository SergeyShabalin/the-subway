import { type Dispatch, type SetStateAction, useEffect, useState } from 'react'

const useLocalStorage = <T>(
  key: string,
  defaultData: T,
): [T, Dispatch<SetStateAction<T>>] => {
  const [state, setState] = useState(() => {
    try {
      const localData = localStorage.getItem(key)
      return localData ? JSON.parse(localData) : defaultData
    } catch {
      return defaultData
    }
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])

  return [state, setState]
}

export { useLocalStorage }
