import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
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
import AdvertisementManagement from "../components/admin/AdvertisementManagement";
import FeedbackPage from "../components/admin/FeedbackPage";
import ProtectedRoutes from "../components/ProtectedRoutes";
import AdBuilder from "../components/AdBuilder";
import AdminDashboard from "../components/admin/AdminDashboard";
import { Forgotpassword } from "../components/ForgotPassword";
import { ResetPassword } from "../components/ResetPassword";

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
        path: "/forgotpassword",
        element: <Forgotpassword />
    },
    {
        path: "/resetpassword/:token",
        element: <ResetPassword />
    },
    {
        path: "/adbuilder",
        element: <AdBuilder />
    },
    {
        path: "/admin",
        element:
            <ProtectedRoutes userRoles={["admin"]}>
                <AdminLayout />
            </ProtectedRoutes>,
        children: [
            {
                index: true,
                element: <Navigate to="/admin/dashboard" replace />
            },
            {
                path: "dashboard",
                element: <AdminDashboard />
            },
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
            },
            {
                path: "advertisements",
                element: <AdvertisementManagement />
            },
            {
                path: "feedbacks",
                element: <FeedbackPage />
            }
        ]
    },
    {
        path: "/advertiser",
        element:
            <ProtectedRoutes userRoles={["advertiser"]}>
                <AdvertiserSidebar />
            </ProtectedRoutes>,
    },
    {
        path: "/viewer",
        element:
            <ProtectedRoutes userRoles={["viewer"]}>
                <ViewerNavbar />
            </ProtectedRoutes>,
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