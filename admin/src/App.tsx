import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./features/auth/AuthContext";
import Login from "./features/auth/Login";
import PrivateRoute from "./features/auth/PrivateRoute";

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: <PrivateRoute />,
    children: [{ index: true, element: <div>Admin Layout</div> }],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
