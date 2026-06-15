import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./features/auth/AuthContext";
import Login from "./features/auth/Login";
import PrivateRoute from "./features/auth/PrivateRoute";
import BookingsPage from "./features/bookings/BookingsPage";
import AdminLayout from "./layout/AdminLayout";
import BookingsDetailPage from "./features/bookings/BookingsDetailPage";
import CreateBookingPage from "./features/bookings/CreateBookingPage";
import { ShopProvider } from "./features/shop/ShopContext";
import ShopPage from "./features/shop/ShopPage";
import StaffPage from "./features/staff/StaffPage";
import StaffDetailPage from "./features/staff/components/StaffDetailPage";

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: <PrivateRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <BookingsPage /> },
          { path: "bookings", element: <BookingsPage /> },
          { path: "bookings/new", element: <CreateBookingPage /> },
          { path: "bookings/:id", element: <BookingsDetailPage /> },
          { path: "staff", element: <StaffPage /> },
          { path: "staff/:id", element: <StaffDetailPage /> },
          { path: "shop", element: <ShopPage /> },
        ],
      },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <ShopProvider>
        <RouterProvider router={router} />
      </ShopProvider>
    </AuthProvider>
  );
}
