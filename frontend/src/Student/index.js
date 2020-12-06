import React, { memo } from "react";
import { Typography, Form, Input, Button, Spin, Progress, Table } from "antd";

import "./style.css";

/**
 * 1) Enter code (enterCode)
 * 2) Wait until start (startWait)
 * 3) N question (question)
 * 4) Wait until next question (questionWait)
 * 5) Your result (result)
 */

const { Title } = Typography;

const quiz = [
  {
    id: 1,
    name: "Why do you never see elephants hiding in trees?",
    answer: "Because they're very good at it.",
    time: "10",
    cost: 1,
  },
  {
    id: 2,
    name: "Why do flamingos always lift one leg while standing?",
    answer: "Because if they lifted both legs they'd fall over.",
    time: "10",
    cost: 1,
  },
];

const columns = [
  {
    title: "Question",
    dataIndex: "question",
    key: "question",
  },
  {
    title: "Answer",
    dataIndex: "answer",
    key: "answer",
  },
  {
    title: "Your answer",
    dataIndex: "user",
    key: "user",
  },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const Student = () => {
  const [currentStage, onChangeStage] = React.useState("enterCode");
  const [currentQuestion, onQuestion] = React.useState(0);
  const [waitUntil, onWaitQuestion] = React.useState(null);
  const [userAnswers, onUserAnswer] = React.useState([]);

  React.useEffect(() => {
    console.log(`Current stage: ${currentStage}`);

    const stateManager = async () => {
      switch (currentStage) {
        case "startWait":
          await new Promise((res) => setTimeout(res, 1000));
          onUserAnswer([
            ...userAnswers,
            {
              question: quiz[0].name,
              answer: quiz[0].answer,
              user: "",
            },
          ]);
          onChangeStage("question");
          onWaitQuestion(0);
          break;
        default:
          break;
      }
    };

    stateManager();
  }, [currentStage]);

  React.useEffect(() => {
    const update = async () => {
      console.log(currentStage);
      if (currentStage === "question" || currentStage === "questionWait") {
        const timeDiv = 1000;

        await sleep(timeDiv);

        if (waitUntil + timeDiv >= Number(quiz[currentQuestion].time) * 1000) {
          if (currentQuestion + 1 >= quiz.length) {
            onChangeStage("result");
          } else {
            if (currentStage === "questionWait") onChangeStage("question");
            onQuestion(currentQuestion + 1);
            onUserAnswer([
              ...userAnswers,
              {
                question: quiz[currentQuestion + 1].name,
                answer: quiz[currentQuestion + 1].answer,
                user: "",
              },
            ]);
            onWaitQuestion(0);
          }
        } else {
          onWaitQuestion(waitUntil + timeDiv);
        }
      }
    };

    update();
  }, [waitUntil]);

  const onFinish = async (e) => {
    const responce = await fetch(process.env.REACT_APP_BACKEND, {
      method: "PUT",
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ quiz_id: e.code, username: e.login }),
    });
    console.log(responce);

    onChangeStage("startWait");
  };
  const onFinishFailed = () => {};

  const onSubmitAnswer = (e) => {
    let last = userAnswers[userAnswers.length - 1];
    last.user = e.answer;
    onUserAnswer([...userAnswers.slice(0, userAnswers.length - 1), last]);
    onChangeStage("questionWait");
  };

  const renderStage = (stage) => {
    switch (stage) {
      case "enterCode":
        return (
          <div className="enterCode">
            <Title>Quiz</Title>
            <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
              <Form.Item
                label="Code"
                name="code"
                rules={[
                  {
                    required: true,
                    message: "Please input room code!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Login"
                name="login"
                rules={[
                  {
                    required: true,
                    message: "Please input your login!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item>
                <Button type="submit" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        );
      case "startWait":
        return (
          <div className="startWait">
            <Title>Waiting other students</Title>
            <Spin size="large" />
          </div>
        );
      case "question":
        return (
          <div className="question">
            <Title>{quiz[currentQuestion].name}</Title>
            <Form onFinish={onSubmitAnswer}>
              <Form.Item name="answer">
                <Input />
              </Form.Item>
              <Form.Item>
                <Button type="submit" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
            <Progress
              percent={
                (waitUntil / (1000 * Number(quiz[currentQuestion].time))) * 100
              }
              showInfo={false}
              status="active"
            />
          </div>
        );
      case "questionWait":
        return (
          <div className="questionWait">
            <Title>Waiting other students</Title>
            <Progress
              percent={
                (waitUntil / (1000 * Number(quiz[currentQuestion].time))) * 100
              }
              showInfo={false}
              status="active"
            />
          </div>
        );
      case "result":
        return (
          <div className="result">
            <Title>Your results</Title>
            <Table dataSource={userAnswers} columns={columns} />
          </div>
        );
      default:
        return (
          <div className="wrong">
            <Title>Something wrong. Please, reload page</Title>
          </div>
        );
    }
  };

  return <div className="student">{renderStage(currentStage)}</div>;
};

export default Student;
