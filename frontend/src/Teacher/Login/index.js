import React from "react";
import { Form, Input, Button, Checkbox, Typography, message } from "antd";
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

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const { Title } = Typography;

const Login = () => {
  const history = useHistory();

  const [isLogin, onLogin] = React.useState(true);
  const [form] = Form.useForm();

  const onFinishLogin = async (values) => {
    const response = await fetch(
      process.env.REACT_APP_BACKEND + "/auth/token/login",
      {
        method: "POST",
        // body: `username=${values.email}&password=${values.password}`,
        headers: {
          accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "username=" + values.email + "&password=" + values.password,
      }
    );
    const body = await response.json();
    if (response.status === 200) {
      localStorage.setItem("token", body.access_token);
      history.push("/teacher");
    } else {
      message.error("provide valid login and password");
    }
  };

  const onFinishSignup = async (values) => {
    const response = await fetch(
      process.env.REACT_APP_BACKEND + "/auth/register",
      {
        method: "POST",
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          is_active: true,
          is_superuser: true,
        }),
      }
    );
    const data = await response.json();

    if (response.status !== 201) {
      message.error(data.detail);
    } else {
      onLogin(true);
    }
    // history.push("/login");
  };

  return (
    <div className="login">
      {isLogin ? (
        <>
          <Title style={{ textAlign: "center" }}>Login</Title>
          <Form
            {...layout}
            name="basic"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinishLogin}
            style={{
              display: "flex",
              flexDirection: "column",
              width: "40vw",
              margin: "0 auto",
            }}
          >
            <Form.Item
              label="Username"
              name="email"
              rules={[
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
                {
                  required: true,
                  message: "Please input your E-mail!",
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

            <Form.Item {...tailLayout}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginRight: "1rem" }}
              >
                Submit
              </Button>
              Or{" "}
              <a
                href=""
                onClick={(e) => {
                  e.preventDefault();

                  onLogin(false);
                }}
              >
                register now!
              </a>
            </Form.Item>
          </Form>
        </>
      ) : (
        <>
          <Title style={{ textAlign: "center" }}>Signup</Title>
          <Form
            {...formItemLayout}
            form={form}
            name="register"
            onFinish={onFinishSignup}
            initialValues={{
              residence: ["zhejiang", "hangzhou", "xihu"],
              prefix: "86",
            }}
            scrollToFirstError
            style={{
              display: "flex",
              flexDirection: "column",
              width: "40vw",
              margin: "0 auto",
            }}
          >
            <Form.Item
              name="email"
              label="E-mail"
              rules={[
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
                {
                  required: true,
                  message: "Please input your E-mail!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="confirm"
              label="Confirm Password"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      "The two passwords that you entered do not match!"
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject("Should accept agreement"),
                },
              ]}
              {...tailFormItemLayout}
            >
              <Checkbox>
                I have read the{" "}
                <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
                  agreement
                </a>
              </Checkbox>
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">
                Register
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
    </div>
  );
};

export default Login;
