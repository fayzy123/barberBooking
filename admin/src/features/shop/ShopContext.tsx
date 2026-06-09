import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import api from "../../shared/utils/api";

interface ShopContextType {
  shopName: string;
  setShopName: (name: string) => void;
}

const ShopContext = createContext<ShopContextType | null>(null);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [shopName, setShopName] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;
    api.get("/shop").then((res) => {
      setShopName(res.data.name);
    });
  }, [token]);

  return (
    <ShopContext.Provider value={{ shopName, setShopName }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShopContext() {
  const context = useContext(ShopContext);
  if (!context)
    throw new Error("useShopContext must be used within ShopProvider");
  return context;
}
