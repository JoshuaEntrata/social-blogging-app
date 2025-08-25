import { Layout as AntdLayout } from "antd";
import { Outlet } from "react-router-dom";
import { Header, Footer } from "../components";
import styles from "../styles/pages/Layout.module.css";

const { Content } = AntdLayout;

function Layout() {
  return (
    <AntdLayout className={styles.layout}>
      <Header />
      <AntdLayout>
        <Content className={styles.content}>
          <Outlet className={styles.outlet} />
        </Content>
      </AntdLayout>
      <Footer />
    </AntdLayout>
  );
}

export default Layout;
