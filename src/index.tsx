import ReactDOM from 'react-dom/client'
import { App } from './App'
import { Provider } from 'react-redux'
import { store } from './store'
import { Subw } from '@/subw.tsx'

const rootEl = document.getElementById('root')
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl)
  root.render(
    <Provider store={store}>
      <App />
{/*<Subw/>*/}
    </Provider>,
  )
}
