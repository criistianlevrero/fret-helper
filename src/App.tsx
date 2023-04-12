import { useState } from 'react'
import AppShell from './components/shell/components/app-shell/app-shell'
import Fretboard from './components/fretboard/components/fretboard/fretboard'
import './App.css'
import { Provider } from 'react-redux'
import store from './store/index'
import TodosView from './components/todos/components/TodosView'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Provider store={store}>
      <AppShell>
        <Fretboard />
        <div className='divider'></div>
        <TodosView />
      </AppShell>

    </Provider>
  )
}

export default App
