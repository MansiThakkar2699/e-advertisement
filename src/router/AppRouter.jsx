import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Login from "../components/Login";
import Signup from "../components/Signup";
import AdminLayout from "../layouts/AdminLayout";
import AdvertiserLayout from "../layouts/AdvertiserLayout";
import ViewerLayout from "../layouts/ViewerLayout";
import Home from "../components/viewer/Home";
import UserManagement from "../components/admin/UserManagement";
import NotFound from "../pages/NotFound";
import CampaignManagement from "../components/admin/CampaignManagement";
import CampaignPage from "../components/advertiser/CampaignPage";
import CategoryManagement from "../components/admin/CategoryManagement";
import AdvertisementManagement from "../components/admin/AdvertisementManagement";
import AdvertisementPage from "../components/advertiser/AdvertisementPage";
import FeedbackPage from "../components/admin/FeedbackPage";
import FeedbackComponent from "../components/advertiser/FeedbackComponent";
import ProtectedRoutes from "../components/ProtectedRoutes";
import AdminDashboard from "../components/admin/AdminDashboard";
import AdvertiserDashboard from "../components/advertiser/AdvertiserDashboard";
import { Forgotpassword } from "../components/ForgotPassword";
import { ResetPassword } from "../components/ResetPassword";
import Ads from "../components/viewer/Ads";
import Categories from "../components/viewer/Categories";
import Offers from "../components/viewer/Offers";
import Surveys from "../components/viewer/Surveys";
import About from "../components/viewer/About";
import Contact from "../components/viewer/Contact";

const router = createBrowserRouter([
    {
        path: "/login",
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
                <AdvertiserLayout />
            </ProtectedRoutes>,
        children: [
            {
                index: true,
                element: <Navigate to="/advertiser/dashboard" replace />
            },
            {
                path: "dashboard",
                element: <AdvertiserDashboard />
            },
            {
                path: "feedbacks",
                element: <FeedbackComponent />
            },
            {
                path: "campaigns",
                element: <CampaignPage />
            },
            {
                path: "advertisements",
                element: <AdvertisementPage />
            }
        ]
    },
    {
        path: "/",
        element: <ViewerLayout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "ads",
                element: <Ads />
            },
            {
                path: "categories",
                element: <Categories />
            },
            {
                path: "offers",
                element: <Offers />
            },
            {
                path: "about",
                element: <About />
            },
            {
                path: "contact",
                element: <Contact />
            },
            {
                element: <ProtectedRoutes userRoles={["viewer"]} />,
                children: [
                    {
                        path: "surveys",
                        element: <Surveys />
                    }
                ]
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