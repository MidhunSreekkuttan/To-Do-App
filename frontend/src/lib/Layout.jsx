import { useContext } from 'react'
import Sidebar from '../components/Sidebar'
import { Navigate, Outlet } from "react-router-dom"
import { Context } from './Context'

function Layout() {

    const { isLoggedIn } = useContext(Context)

    if (!isLoggedIn) return <Navigate to="/login" replace />

    return (
        <div className="flex">

            <Sidebar />

            <Outlet />

        </div>
    )
}

export default Layout