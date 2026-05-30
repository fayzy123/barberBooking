import { createContext, useContext, useState } from "react";

interface TopbarConfig {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  backButton?: React.ReactNode;
}

interface TopbarContextType {
  config: TopbarConfig;
  setTopbar: (config: TopbarConfig) => void;
}

const TopbarContext = createContext<TopbarContextType | null>(null);

export function TopbarProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<TopbarConfig>({ title: "" });

  return (
    <TopbarContext.Provider value={{ config, setTopbar: setConfig }}>
      {children}
    </TopbarContext.Provider>
  );
}

export function useTopbar() {
  const context = useContext(TopbarContext);
  if (!context) {
    throw new Error("useTopbar must be used within a TopbarProvider");
  }
  return context;
}
