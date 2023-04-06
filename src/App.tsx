import { useState } from 'react'
import AppShell from './components/shell/components/app-shell/app-shell'
import Fretboard from './components/fretboard/components/fretboard/fretboard'
import './App.css'
import { Provider } from 'react-redux'
import { store } from './store'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Provider store={store}>
      <AppShell>
        <Fretboard></Fretboard>  
      </AppShell>

    </Provider>
  )
}

export default App
