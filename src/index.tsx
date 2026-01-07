import ReactDOM from 'react-dom/client'

import { Provider } from 'react-redux'

import { App } from '../source/app.tsx'
import { store } from '../source/store'
import { ThemeProvider } from '../source/providers/theme-provider'

const rootEl = document.getElementById('root')
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl)
  root.render(
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>,
  )
}
