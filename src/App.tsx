import { useState } from 'react'
import AppShell from './components/shell/components/app-shell/app-shell'
import Fretboard from './components/fretboard/components/fretboard/fretboard'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <AppShell>
      <Fretboard></Fretboard>  
    </AppShell>
  )
}

export default App
