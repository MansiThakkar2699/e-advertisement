import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../components/Login";
import Signup from "../components/Signup";
import AdminLayout from "../layouts/AdminLayout";
import { AdvertiserSidebar } from "../components/advertiser/AdvertiserSidebar";
import { ViewerNavbar } from "../components/viewer/ViewerNavbar";
import { AdvertisementList } from "../components/viewer/AdvertisementList";
import { UseEffectDemo } from "../components/viewer/UseEffectDemo";
import { GetApiDemo } from "../components/viewer/GetApiDemo";
import Home from "../components/viewer/Home";
import UserManagement from "../components/admin/UserManagement";
import NotFound from "../pages/NotFound";
import CampaignManagement from "../components/admin/CampaignManagement";
import CategoryManagement from "../components/admin/CategoryManagement";

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
        element: <AdminLayout />,
        children: [
            {
                path: "users",
                element: <UserManagement />
            },
            {
                path: "categories",
                element: <CategoryManagement />
            },
            {
                path: "campaigns",
                element: <CampaignManagement />
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
            },
            {
                path: "home",
                element: <Home />
            }
        ]
    },
    {
        path: "*",
        element: <NotFound />
    }
])

const AppRouter = () => {
    return <RouterProvider router={router}></RouterProvider>
}
export default AppRouter