import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../components/Login";
import Signup from "../components/Signup";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { AllUserList } from "../components/admin/AllUserList";
import { ViewerNavbar } from "../components/viewer/ViewerNavbar";
import { AdvertisementList } from "../components/viewer/AdvertisementList";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />
    },
    {
        path: "/signup",
        element: <Signup />
    },
    {
        path: "/admin",
        element: <AdminSidebar />,
        children: [
            {
                path: "users",
                element: <AllUserList />
            }
        ]
    },
    {
        path: "/viewer",
        element: <ViewerNavbar />,
        children: [
            {
                path: "advertisement",
                element: <AdvertisementList />
            }
        ]
    }
])

const AppRouter = () => {
    return <RouterProvider router={router}></RouterProvider>
}
export default AppRouter