import { Layout as AntdLayout } from "antd";
import { Outlet } from "react-router-dom";
import { Header, Footer } from "../components";
import styles from "./Layout.module.css";

const { Content } = AntdLayout;

function Layout() {
  return (
    <AntdLayout>
      <Header />
      <AntdLayout>
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </AntdLayout>
      <Footer />
    </AntdLayout>
  );
}

export default Layout;
