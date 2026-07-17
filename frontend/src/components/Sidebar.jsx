import { useContext } from "react";
import { FaCalendarDay } from "react-icons/fa";
import { FaCalendarDays } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { useSearchParams } from 'react-router-dom'
import { Context } from "../lib/Context";
import { CgProfile } from "react-icons/cg";

const Sidebar = () => {

    const [searchParams, setSearchParams] = useSearchParams()

    const { userData } = useContext(Context)

    const currentTab = searchParams.get("tab") || "today"

    function Navbar({ icon, text, ...prop }) {
        return (
            <ul {...prop} className={`text-white text-2xl font-semibold py-2 px-4 rounded-lg cursor-pointer
                ${currentTab === text.toLowerCase() ? "bg-blue-300 shadow-2xl" : ""}`}>

                <li className="flex gap-3 items-center">
                    {icon} {text}
                </li>

            </ul>
        )
    }

    return (
        <header className='flex flex-col w-sm h-screen bg-blue-500 p-5'>

            <div className='flex flex-col items-center gap-5 py-5 px-16 mb-7'>
                <h1 className='font-bold text-5xl text-center text-white'>
                    Task<span className='font-light text-white'>Flow</span>
                </h1>

                {userData?.profilePic ? (
                    <img className='h-30 w-30 object-cover rounded-full' src={userData?.profilePic} alt="Profile photo" />
                ) : (
                    <CgProfile className='h-30 w-30 opacity-50' />
                )}
            </div>

            <nav className="flex flex-col gap-3">
                <Navbar
                    icon={<FaCalendarDay color="white" size={25} />}
                    text="Today"
                    onClick={() => setSearchParams({ tab: "today" })}
                />
                <Navbar
                    icon={<FaCalendarDays color="white" size={25} />}
                    text="Upcoming"
                    onClick={() => setSearchParams({ tab: "upcoming" })}
                />
                <Navbar
                    icon={<IoSettingsOutline color="white" size={25} />}
                    text="Settings"
                    onClick={() => setSearchParams({ tab: "settings" })}
                />
            </nav>

            <button onClick={() => {
                localStorage.removeItem("loginToken")
                window.location.reload()
            }}
                className="mt-auto text-white text-2xl font-bold bg-blue-300 py-3 px-4 rounded-lg w-full shadow-md">
                Logout
            </button>

        </header>
    )
}

export default Sidebar