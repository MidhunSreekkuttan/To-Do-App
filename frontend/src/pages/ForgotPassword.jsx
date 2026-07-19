import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { LabelField } from "../lib/bottons"
import axiosInstance from "../lib/AxiosInstance"

const ForgotPassword = () => {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const emailRef = useRef(null)

    const navigate = useNavigate()

    const submitHandler = async (e) => {
        e.preventDefault()

        if (!email) {
            return toast.error("Please enter your email", { position: "top-right" })
        }

        try {
            setLoading(true)
            const { data } = await axiosInstance.post('api/user/forgot-password', { email })

            if (data.success) {
                toast.success(data.message || "Password reset link sent to your email!", {
                    position: "top-right",
                    duration: 4000
                })

            } else {
                toast.error(data.message || "Failed to process request", {
                    position: "top-right",
                    duration: 3000,
                    style: { background: '#333', color: '#fff' }
                })
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || error.message, { position: "top-right" })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        emailRef.current?.focus()
    }, [])

    return (
        <div className="w-screen h-dvh flex justify-center items-center bg-gray-100">
            <div className="w-full max-w-md bg-amber-50 rounded-2xl py-8 px-10 mx-5 md:mx-0 shadow-2xl">

                {/* TaskFlow Branding */}
                <div className='flex flex-col items-center mb-6'>
                    <h1 className='font-bold text-4xl text-center text-blue-500'>
                        Task<span className='font-light text-slate-800'>Flow</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium text-center">
                        Enter your email address and we'll send you a OTP to reset your password.
                    </p>
                </div>

                <form onSubmit={submitHandler} className="flex flex-col gap-5">

                    <LabelField
                        ref={emailRef}
                        text="Email Address"
                        textColor="text-gray-700"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your registered email"
                        type="email"
                        textSize="text-sm"
                        otherCss="focus:ring-blue-500 border border-gray-400"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 
                            transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="flex flex-row-reverse gap-3 justify-center items-center">
                                <div
                                    className='w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin'
                                    role="status"
                                    aria-label="loading"
                                />
                                <p className="font-semibold text-white">Sending...</p>
                            </div>
                        ) : (
                            "Send OTP"
                        )}
                    </button>

                    <div className="flex justify-center mt-2 text-sm text-gray-600">
                        Remember your password?
                        <button
                            type="button"
                            className="ml-1 font-semibold text-blue-600 hover:text-blue-800 cursor-pointer transition-colors"
                            onClick={() => navigate('/login')}
                        >
                            Back to Login
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default ForgotPassword