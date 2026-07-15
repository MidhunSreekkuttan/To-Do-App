import { createContext, useEffect, useState } from "react";
import axiosInstance from "./AxiosInstance";

export const Context = createContext()

const ContextProvider = ({ children }) => {

    const [isLoggedIn, setIsLoggedin] = useState(() => {
        return !!localStorage.getItem('loginToken')
    })
    const [userData, setUserData] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const getUserData = async () => {
        const token = localStorage.getItem("loginToken")
        if (!token) {
            setUserData("")
            setIsLoggedin(false)
            return
        }

        try {

            setIsLoading(true)

            const { data } = await axiosInstance.get("/api/user/getUserData", {
                headers: {
                    "Authorization": token
                }
            })

            if (data.success) {
                setUserData(data?.user)
            } else {
                setUserData("")
            }

        } catch (error) {
            console.log(error);
            setUserData("")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getUserData()
    }, [])

    const values = {
        isLoggedIn, setIsLoggedin,
        userData,
        isLoading
    }

    return (
        <Context.Provider value={values}>
            {children}
        </Context.Provider>
    )
}

export default ContextProvider