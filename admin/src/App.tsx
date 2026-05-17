import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./features/auth/AuthContext";
import Login from "./features/auth/Login";
import PrivateRoute from "./features/auth/PrivateRoute";
import AdminLayout from "./layout/AdminLayout";
import { useTopbar } from "./layout/TopBarContext";
import { useEffect } from "react";

const BookingsPlaceholder = () => {
  const { setTopbar } = useTopbar();

  useEffect(() => {
    setTopbar({ title: "Bookings", subtitle: "Today's Appointments" });
  }, []);

  return <div>Bookings Page</div>;
};

const StaffPlaceholder = () => {
  const { setTopbar } = useTopbar();

  useEffect(() => {
    setTopbar({ title: "Staff", subtitle: "Manage your team" });
  }, []);

  return <div>Staff Page</div>;
};

const ShopPlaceholder = () => {
  const { setTopbar } = useTopbar();

  useEffect(() => {
    setTopbar({ title: "Shop Setting", subtitle: "Fayzy's Cuts" });
  }, []);

  return <div>Shop Page</div>;
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
          { index: true, element: <BookingsPlaceholder /> },
          { path: "bookings", element: <BookingsPlaceholder /> },
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
