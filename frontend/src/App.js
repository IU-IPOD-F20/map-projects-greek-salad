import React from "react";
import { Layout, Menu, Typography, Button } from "antd";
import { BrowserRouter, Switch, Route, useHistory } from "react-router-dom";

import Teacher from "./Teacher";
import Student from "./Student";
import Login from "./Teacher/Login";
import Quiz from "./Teacher/Quiz";
import "./App.css";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const App = () => {
  const history = useHistory();

  const handleUserChange = (user) => {
    history.push(`/${user}`);
  };

  return (
    <div className="App">
      <Layout>
        <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            onClick={(e) => {
              handleUserChange(e.key);
            }}
          >
            <Menu.Item key="teacher">Teacher</Menu.Item>
            <Menu.Item key="student">Student</Menu.Item>
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
            <Switch>
              <Route path="/teacher">
                <Teacher />
              </Route>
              <Route path="/student">
                <Student />
              </Route>
              <Route path="/quiz/:id">
                <Quiz />
              </Route>
              <Route path="/quiz/">
                <Quiz />
              </Route>
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/" exact>
                <div className="userType">
                  <Title style={{ textAlign: "center" }}>Are you...?</Title>
                  <div className="userTypeWrapper">
                    <Button
                      type="text"
                      onClick={() => {
                        history.push("/login");
                      }}
                    >
                      Teacher
                    </Button>
                    <Button
                      type="text"
                      onClick={() => {
                        history.push("/student");
                      }}
                    >
                      Student
                    </Button>
                  </div>
                </div>
              </Route>
            </Switch>
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
