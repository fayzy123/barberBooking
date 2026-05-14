import { Outlet } from "react-router-dom";
import styles from "./AdminLayout.module.css";
import Sidebar from "./Sidebar";

const AdminLayout = () => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.right}>
        <div>Topbar</div>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
