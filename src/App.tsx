import AppShell from './components/shell/components/app-shell/app-shell'
import Fretboard from './components/fretboard/components/fretboard/fretboard'
import './App.css'
import { Provider } from 'react-redux'
import store from './store/index'

function App() {
  return (
    <Provider store={store}>
      <AppShell>
        <Fretboard />
      </AppShell>
    </Provider>
  )
}

export default App
