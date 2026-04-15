import { createContext, useContext, useEffect, useState } from "react";
import { LoginResponse } from "./auth.service";

// We need this to prevent prop drilling
// (passing same data down through every level even if middle components dont need it)
// Authentication state needs to be accessible everywhere in admin panel

// Shape of the data we store about logged in admin
interface AdminInfo {
  id: string;
  email: string;
  role: string;
}

// Shape of everything the context provides to app
interface AuthContextType {
  token: string | null;
  admin: AdminInfo | null;
  isAuthenticated: boolean;
  login: (data: LoginResponse) => void;
  logout: () => void;
}

// Create context with a default of null
const AuthContext = createContext<AuthContextType | null>(null);

// Provider component that wraps the app
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );

  const [admin, setAdmin] = useState<AdminInfo | null>(null);

  // When the app loads, restore admin info from local storage if token exists
  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  // Called after a successful login
  function login(data: LoginResponse) {
    setToken(data.token);
    setAdmin(data.admin);
    localStorage.setItem("token", data.token);
    localStorage.setItem("admin", JSON.stringify(data.admin));
  }

  // Called when admin signs out
  function logout() {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        admin,
        // !! converts value to boolean
        // — null becomes false, a real token becomes true
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
