import { useEffect, useState } from "react"
import { Navigate, Outlet } from "react-router-dom"

const ProtectedRoutes = ({ children, userRoles }) => {

    // const token = localStorage.getItem("token");
    // const role = localStorage.getItem("role");

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
    return children ? children : <Outlet />;
}
export default ProtectedRoutes;