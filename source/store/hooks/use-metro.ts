import { useSelector, useDispatch } from 'react-redux'

import type { AppDispatch, RootState } from '@/store'

export const useMetro = () => {
  const dispatch = useDispatch<AppDispatch>()

  const metroNetwork = useSelector(
    (state: RootState) => state.metro.metroNetwork,
  )
  console.log('metroNetwork', metroNetwork)
  return {
    metroNetwork,
    actions: {},
  }
}
