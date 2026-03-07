import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../components/Login";
import Signup from "../components/Signup";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { AdvertiserSidebar } from "../components/advertiser/AdvertiserSidebar";
import { AllUserList } from "../components/admin/AllUserList";
import { ViewerNavbar } from "../components/viewer/ViewerNavbar";
import { AdvertisementList } from "../components/viewer/AdvertisementList";
import { UseEffectDemo } from "../components/viewer/UseEffectDemo";
import { GetApiDemo } from "../components/viewer/GetApiDemo";

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
        path: "/advertiser",
        element: <AdvertiserSidebar />
    },
    {
        path: "/viewer",
        element: <ViewerNavbar />,
        children: [
            {
                path: "advertisement",
                element: <AdvertisementList />
            },
            {
                path: "useEffect",
                element: <UseEffectDemo />
            },
            {
                path: "getapidemo",
                element: <GetApiDemo />
            }
        ]
    }
])

const AppRouter = () => {
    return <RouterProvider router={router}></RouterProvider>
}
export default AppRouter