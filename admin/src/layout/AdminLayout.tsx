import { Outlet } from "react-router-dom";
import styles from "./AdminLayout.module.css";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { TopbarProvider, useTopbar } from "./TopBarContext";

const LayoutInner = () => {
  const { config } = useTopbar();
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.right}>
        <Topbar
          title={config.title}
          subtitle={config.subtitle}
          actions={config.actions}
          backButton={config.backButton}
        />
        <Outlet />
      </div>
    </div>
  );
};

const AdminLayout = () => (
  <TopbarProvider>
    <LayoutInner />
  </TopbarProvider>
);

export default AdminLayout;
