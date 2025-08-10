import { Tabs } from "antd";
import Sider from "antd/es/layout/Sider";
import { TagBox } from "../components";

import { Feed } from ".";

import styles from "./Home.module.css";
import dummyTags from "../components/dummyTags.json";

const myArticles = [{ id: 1, content: "Something content" }];

const articles = [
  { id: 1, content: "Something content" },
  { id: 2, content: "Rick and Morty" },
  { id: 3, content: "AI Engineering" },
];

function Home() {
  const items = [
    {
      key: "1",
      label: "My Feed",
      children: <Feed articles={myArticles} />,
    },
    {
      key: "2",
      label: "Global Feed",
      children: <Feed articles={articles} />,
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
