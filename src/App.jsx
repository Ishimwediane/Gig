import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signin from "./Components/Signin"
import Signup from "./Components/Signup"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="/signin" element={<Signin />} /> 
          <Route path="/signup" element={<Signup />} /> 
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App