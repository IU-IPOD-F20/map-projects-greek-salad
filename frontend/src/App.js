import React from "react";
import { Layout, Menu, Typography, Button } from "antd";
import "./App.css";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const App = () => {
  return (
    <div className="App">
      <Layout>
        <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
            <Menu.Item key="1">Teacher</Menu.Item>
            <Menu.Item key="2">Student</Menu.Item>
          </Menu>
        </Header>
        <Content
          className="site-layout"
          style={{
            padding: "0 50px",
            marginTop: 64,
            minHeight: "calc(100vh - 130px)",
          }}
        >
          <div
            className="site-layout-background"
            style={{
              padding: 24,
              marginTop: 32,
              height: "100%",
              minHeight: "calc(100vh - 130px)",
            }}
          >
            {
              <div className="userType">
                <Title style={{ textAlign: "center" }}>Are you...?</Title>
                <div className="userTypeWrapper">
                  <Button type="text">Teacher</Button>
                  <Button type="text">Student</Button>
                </div>
              </div>
            }
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Greek salad ©2020 Created by Salavat Dinmukhametov, Amir Subaev and
          Lera Vertash
        </Footer>
      </Layout>
    </div>
  );
};

export default App;
