import { Toaster } from "react-hot-toast"
import Home from './pages/Home'
import { Route, Routes } from "react-router-dom"
import Layout from "./lib/Layout"
import Login from "./pages/Login"

const App = () => {
  return (
    <>

      <Toaster />

      <Routes>

        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Layout />}>

          <Route path=":userId" element={<Home />} />

        </Route>
      </Routes>

    </>
  )
}

export default App