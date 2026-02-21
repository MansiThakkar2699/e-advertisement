import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import AppRouter from './router/AppRouter'
// import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AppRouter></AppRouter>
    </>
  )
}

export default App
