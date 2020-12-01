import React from "react";
import { Form, Input, Button, Checkbox, Typography } from "antd";
import { useHistory } from "react-router-dom";

import "./style.css";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const { Title } = Typography;

const Login = () => {
  const history = useHistory();

  const [isLogin, onLogin] = React.useState(true);

  const onFinish = (values) => {
    console.log("Success:", values);
    history.push("/teacher");
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="login">
      {isLogin ? (
        <Title style={{ textAlign: "center" }}>Login</Title>
      ) : (
        <Title style={{ textAlign: "center" }}>Signup</Title>
      )}
      <Form
        {...layout}
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "40vw",
          margin: "0 auto",
        }}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailLayout} name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
