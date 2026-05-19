import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./features/auth/AuthContext";
import Login from "./features/auth/Login";
import PrivateRoute from "./features/auth/PrivateRoute";
import AdminLayout from "./layout/AdminLayout";
import { useTopbar } from "./layout/TopBarContext";
import { useEffect } from "react";
import BookingsPage from "./features/bookings/BookingsPage";
import BookingsDetailPage from "./features/bookings/BookingsDetailPage";

const StaffPlaceholder = () => {
  const { setTopbar } = useTopbar();

  useEffect(() => {
    setTopbar({ title: "Staff", subtitle: "Manage your team" });
  }, []);

  return <div>Staff Page: Check back for when this feature is rolled out!</div>;
};

const ShopPlaceholder = () => {
  const { setTopbar } = useTopbar();

  useEffect(() => {
    setTopbar({ title: "Shop Setting", subtitle: "Fayzy's Cuts" });
  }, []);

  return <div>Shop Management Page Coming Soon!</div>;
};

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
          { path: "bookings/new", element: <BookingsDetailPage /> },
          { path: "bookings/:id", element: <BookingsDetailPage /> },
          { path: "staff", element: <StaffPlaceholder /> },
          { path: "shop", element: <ShopPlaceholder /> },
        ],
      },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
