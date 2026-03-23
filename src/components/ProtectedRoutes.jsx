import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"

const ProtectedRoutes = ({ children, userRoles }) => {

    const [token, settoken] = useState()
    const [role, setroles] = useState()
    const [loading, setloading] = useState(true)

    useEffect(() => {
        settoken(localStorage.getItem("token"))
        setroles(localStorage.getItem("role"))
        setloading(false)
    }, [])
    if (loading) {
        return <h1>Loading...</h1>
    }

    if (!token) {
        return <Navigate to="/" />
    }
    if (!userRoles.includes(role)) {
        return <Navigate to="/" />
    }
    return children
}
export default ProtectedRoutes;