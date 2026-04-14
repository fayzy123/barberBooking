import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./features/auth/Login";

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/", element: <div> Admin Layout</div> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
