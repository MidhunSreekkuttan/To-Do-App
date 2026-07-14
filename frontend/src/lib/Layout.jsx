import { useContext } from 'react'
import Sidebar from '../components/Sidebar'
import { Navigate, Outlet } from "react-router-dom"
import { Context } from './Context'

function Layout() {

    const { isLoggedIn } = useContext(Context)

    return (
        <div className="flex">

            <Sidebar />

            {!isLoggedIn && <Navigate to="/login" replace />}

            <Outlet />

        </div>
    )
}

export default Layout