import { Toaster } from "react-hot-toast"
import Sidebar from "./components/Sidebar"
import Home from "./components/Home"

const App = () => {
  return (
    <>
      <Toaster />

      <div className="flex">

        <Sidebar />

        <Home />

      </div>

    </>
  )
}

export default App