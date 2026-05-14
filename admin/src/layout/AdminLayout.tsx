import { Outlet } from "react-router-dom";
import styles from "./AdminLayout.module.css";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const AdminLayout = () => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.right}>
        <Topbar />
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
