import { createContext, useEffect, useState } from "react";
import axiosInstance from "./AxiosInstance";
import { useQuery } from '@tanstack/react-query'

export const Context = createContext()

const ContextProvider = ({ children }) => {

    const [isLoggedIn, setIsLoggedin] = useState(() => {
        return !!localStorage.getItem('loginToken')
    })

    const token = localStorage.getItem("loginToken")

    const { data: userData, isLoading, error } = useQuery({
        queryKey: ["userData"],
        queryFn: async () => {

            const { data } = await axiosInstance.get("/api/user/getUserData", {
                headers: {
                    "Authorization": token
                }
            })

            if (!data.success) {
                throw new Error(data.message)
            }

            return data.user
        },

        enabled: isLoggedIn && !!token,
        retry: false

    })

    useEffect(() => {
        if (error) {
            console.log(error.message);
            localStorage.removeItem("loginToken")
            setIsLoggedin(false);
        }
    }, [error])

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