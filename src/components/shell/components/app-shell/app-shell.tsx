import { ReactNode, useState } from 'react'
import MainMenu from '../main-menu/main-menu'

function AppShell(props: { children: ReactNode }) {
  const [count, setCount] = useState(0)

  return (
    <main>
      <MainMenu></MainMenu>
      {props.children}
    </main>
  )
}

export default AppShell
