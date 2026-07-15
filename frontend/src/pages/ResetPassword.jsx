import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-hot-toast"
import axiosInstance from "../lib/AxiosInstance"

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const { token } = useParams()
    const navigate = useNavigate()

    const submitHandler = async (e) => {
        e.preventDefault()

        if (newPassword !== confirmPassword) {
            return toast.error("Passwords do not match!", { position: "top-right" })
        }

        if (newPassword.length < 8) {
            return toast.error("Password must be at least 8 characters", { position: "top-right" })
        }

        try {
            setLoading(true)
            const { data } = await axiosInstance.post(`/api/user/reset-password/${token}`, { newPassword })

            if (data.success) {
                toast.success(data.message, { position: "top-right", duration: 3000 })
                navigate('/login')
            } else {
                toast.error(data.message, { position: "top-right" })
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message, { position: "top-right" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-screen h-screen flex justify-center items-center bg-gray-100">
            <div className="w-full max-w-md bg-amber-50 rounded-2xl py-8 px-10 shadow-2xl">

                <div className='flex flex-col items-center mb-6'>
                    <h1 className='font-bold text-4xl text-center text-blue-500'>
                        Task<span className='font-light text-slate-800'>Flow</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium text-center">
                        Create a new password for your account.
                    </p>
                </div>

                <form onSubmit={submitHandler} className="flex flex-col gap-5">

                    <label className='flex flex-col gap-2 text-sm font-semibold text-gray-700'>
                        New Password
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className='w-full text-base py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg border border-gray-400'
                            placeholder="Enter new password"
                        />
                    </label>

                    <label className='flex flex-col gap-2 text-sm font-semibold text-gray-700'>
                        Confirm Password
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className='w-full text-base py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg border border-gray-400'
                            placeholder="Confirm new password"
                        />
                    </label>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70"
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ResetPassword