import { Toaster } from "react-hot-toast"
import Home from './pages/Home'
import { Navigate, Route, Routes } from "react-router-dom"
import Layout from "./lib/Layout"
import Login from "./pages/Login"
import { useContext } from "react"
import { Context } from "./lib/Context"

const App = () => {

  const { isLoading, userData } = useContext(Context)

  if (isLoading) return <div>Loading...</div>

  return (
    <>

      <Toaster />

      <Routes>

        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Layout />}>

          <Route index element={
            userData && <Navigate to={`/${userData._id}`} replace />
          } />

          <Route path=":userId" element={<Home />} />

        </Route>
      </Routes>

    </>
  )
}

export default App