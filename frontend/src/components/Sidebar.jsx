import { useContext } from "react";
import { FaCalendarDay } from "react-icons/fa";
import { FaCalendarDays } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { useSearchParams } from 'react-router-dom'
import { Context } from "../lib/Context";
import { CgProfile } from "react-icons/cg";

const Sidebar = ({ isOpen, setIsOpen }) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const { userData } = useContext(Context)
    const currentTab = searchParams.get("tab") || "today"

    function Navbar({ icon, text, ...prop }) {
        return (
            <ul {...prop} className={`text-white text-lg md:text-xl font-semibold py-3 px-4 rounded-lg cursor-pointer transition-colors
                ${currentTab === text.toLowerCase() ? "bg-blue-600 shadow-lg" : "hover:bg-blue-400"}`}>
                <li className="flex gap-3 items-center">
                    {icon} {text}
                </li>
            </ul>
        )
    }

    const handleNavClick = (tab) => {
        setSearchParams({ tab });
        setIsOpen(false); // Close sidebar on mobile after clicking
    }

    return (
        <aside className={`fixed z-40 inset-y-0 left-0 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} 
            md:relative md:translate-x-0 transition duration-300 ease-in-out flex flex-col w-64 md:w-80 h-dvh
             bg-blue-500 p-5 shadow-2xl md:shadow-none overflow-y-auto`}>

            <div className='flex flex-col items-center gap-4 py-2 mb-8 shrink-0'>
                <h1 className='font-bold text-4xl text-center text-white'>
                    Task<span className='font-light text-white'>Flow</span>
                </h1>

                {userData?.profilePic ? (
                    <img className='h-24 w-24 md:h-28 md:w-28 object-cover rounded-full border-2 border-blue-300' src={userData?.profilePic} alt="Profile photo" />
                ) : (
                    <CgProfile className='h-24 w-24 md:h-28 md:w-28 text-white opacity-80' />
                )}
            </div>

            <nav className="flex flex-col gap-2 flex-1 shrink-0 mb-4">
                <Navbar
                    icon={<FaCalendarDay color="white" size={22} />}
                    text="Today"
                    onClick={() => handleNavClick("today")}
                />
                <Navbar
                    icon={<FaCalendarDays color="white" size={22} />}
                    text="Upcoming"
                    onClick={() => handleNavClick("upcoming")}
                />
                <Navbar
                    icon={<IoSettingsOutline color="white" size={22} />}
                    text="Settings"
                    onClick={() => handleNavClick("settings")}
                />
            </nav>

            <button onClick={() => {
                localStorage.removeItem("loginToken")
                window.location.reload()
            }}
                className="mt-auto text-blue-600 text-lg font-bold bg-white py-3 px-4 rounded-lg w-full shadow-md hover:bg-gray-100 transition-colors shrink-0">
                Logout
            </button>
        </aside>
    )
}

export default Sidebar