import { Tabs } from "antd";
import { TagBox } from "../components";
import { Feed } from ".";
import Sider from "antd/es/layout/Sider";

import styles from "../styles/pages/Home.module.css";
import dummyTags from "../components/dummyTags.json";
import dummyArticles from "../components/dummyArticles.json";

function Home() {
  const items = [
    {
      key: "1",
      label: "My Feed",
      children: <Feed articles={dummyArticles} />,
    },
    {
      key: "2",
      label: "Global Feed",
      children: <Feed articles={dummyArticles} />,
    },
  ];

  return (
    <>
      <Tabs
        defaultActiveKey="1"
        items={items}
        className={styles.tagContainer}
        onChange={(key) => {
          console.log(key);
        }}
      />
      <Sider>
        <TagBox tags={dummyTags} />
      </Sider>
    </>
  );
}

export default Home;
