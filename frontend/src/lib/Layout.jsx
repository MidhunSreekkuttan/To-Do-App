import { useContext, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { Navigate, Outlet, useSearchParams } from "react-router-dom"
import { Context } from './Context'
import { FaBars } from "react-icons/fa"
import { CgProfile } from "react-icons/cg"

function Layout() {

    const { isLoggedIn, userData } = useContext(Context)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [, setSearchParams] = useSearchParams()

    if (!isLoggedIn) return <Navigate to="/login" replace />

    return (
        <div className="flex h-dvh w-full overflow-hidden bg-gray-50">
            {/* Sidebar with mobile toggle state */}
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden cursor-pointer"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <div className="flex-1 w-full h-full flex flex-col overflow-hidden">

                {/* --- GLOBAL MOBILE TOP BAR --- */}
                <div className="md:hidden flex justify-between items-center px-4 pt-5 pb-2 shrink-0 bg-blue-500">

                    {/* Hamburger Menu */}
                    <button
                        className="p-1 text-white hover:text-blue-600 transition-colors cursor-pointer"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <FaBars size={22} />
                    </button>

                    {/* App Title */}
                    <h1 className="text-xl font-bold text-white tracking-wide">
                        Task<span className="font-light">Flow</span>
                    </h1>

                    {/* User Avatar (Tapping it goes to Settings) */}
                    <div
                        className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-sm bg-gray-200 cursor-pointer"
                        onClick={() => setSearchParams({ tab: "settings" })}
                    >
                        {userData?.profilePic ? (
                            <img src={userData.profilePic} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <CgProfile className="w-full h-full text-gray-400 bg-white" />
                        )}
                    </div>
                </div>

                {/* Pass state to Home so it can trigger the sidebar */}
                <Outlet context={{ setIsSidebarOpen }} />
            </div>
        </div>
    )
}

export default Layout