import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  Button,
  Space,
  Table,
  Modal,
  Form,
  Input,
  Progress,
  Typography,
  Spin,
} from "antd";
import {
  ConsoleSqlOutlined,
  PlusCircleOutlined,
  SketchSquareFilled,
} from "@ant-design/icons";
import QuestionModal from "./QuestionModal";

/**
 * 1) Static page (init)
 * 2) Generate code (generateCode)
 * 3) N question (question)
 * 4) Your result (result)
 */

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const { Title, Text } = Typography;

function makeid(length) {
  var result = "";
  var characters = "0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

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

const Quiz = () => {
  const location = useLocation();
  const history = useHistory();
  const [currentStage, onChangeStage] = React.useState(
    !!location.search ? "generateCode" : "init"
  );
  const [currentQuestion, onQuestion] = React.useState(0);
  const [waitUntil, onWaitQuestion] = React.useState(null);

  const [quizId] = React.useState(
    !!location.pathname.split("/")[2]
      ? Number(location.pathname.split("/")[2])
      : -1
  );

  const [modalVisible, onModalVisible] = React.useState(false);
  const [question, onChangeQuestion] = React.useState({});

  const [quizData, setQuizData] = React.useState([]);

  React.useEffect(() => {
    const getQuizData = async () => {
      const res = await fetch(
        process.env.REACT_APP_BACKEND + `/quiz/${quizId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const body = await res.json();
      console.log(body);

      setQuizData(
        body.questions.map((i) => ({
          name: i.question,
          answer: Object.keys(i.answers)[0],
          time: 10,
          cost: Object.values(i.answers)[0],
        }))
      );
      return body;
    };

    if (quizId !== -1) {
      console.log(getQuizData());
      // setQuizData([]);
    }
  }, []);

  React.useEffect(() => {
    console.log(`Current stage: ${currentStage}`);

    const stateManager = async () => {};

    stateManager();
  }, [currentStage]);

  React.useEffect(() => {
    const update = async () => {
      console.log(currentStage);
      if (currentStage === "question" || currentStage === "questionWait") {
        const timeDiv = 1000;

        await sleep(timeDiv);

        if (
          waitUntil + timeDiv >=
          Number(quizData[currentQuestion].time) * 1000
        ) {
          if (currentQuestion + 1 >= quizData.length) {
            onChangeStage("result");
          } else {
            onQuestion(currentQuestion + 1);
            onWaitQuestion(0);
          }
        } else {
          onWaitQuestion(waitUntil + timeDiv);
        }
      }
    };

    update();
  }, [waitUntil]);

  const columns = [
    {
      title: "Question",
      dataIndex: "name",
      width: "90%",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record, index) => {
        return (
          <Space size="middle">
            <Button
              onClick={() => {
                onChangeQuestion(record);
                onModalVisible(true);
              }}
            >
              Update
            </Button>
            <Button
              danger
              onClick={() => {
                setQuizData([
                  ...quizData.slice(0, index),
                  ...quizData.slice(index + 1, quizData.length),
                ]);
              }}
            >
              Delete
            </Button>
          </Space>
        );
      },
    },
  ];

  const questionColumns = [
    { title: "Student", dataIndex: "login", key: "login" },
    { title: "Answer", dataIndex: "answer", key: "answer" },
  ];

  const allResultsColumns = [
    { title: "Student", dataIndex: "login", key: "login" },
    { title: "Question # 1", dataIndex: "q1", key: "q1" },
    { title: "Question # 2", dataIndex: "q2", key: "q2" },
  ];

  const renderStage = (stage) => {
    switch (stage) {
      case "init":
        return (
          <>
            <Space align="start">
              <Button
                icon={<PlusCircleOutlined />}
                onClick={() => {
                  onModalVisible(true);
                  onChangeQuestion({});
                }}
                style={{ marginBottom: "1rem" }}
              >
                Add new question
              </Button>
              <Button
                onClick={() => {
                  onChangeStage("question");
                  onWaitQuestion(0);
                }}
              >
                Start quiz
              </Button>
              <Button
                onClick={async () => {
                  const res = await fetch(
                    process.env.REACT_APP_BACKEND + "/quiz",
                    {
                      method: "PUT",
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                          "token"
                        )}`,
                      },
                      body: JSON.stringify({
                        quiz_id: makeid(6),
                        questions: [
                          ...quizData.map((i) => {
                            return {
                              question: i.name,
                              answers: { [i.answer]: i.cost },
                            };
                          }),
                        ],
                      }),
                    }
                  );
                  const body = await res.json();
                }}
              >
                Save
              </Button>
            </Space>
            <Table
              columns={columns}
              dataSource={quizData}
              pagination={false}
            ></Table>

            <QuestionModal
              visible={modalVisible}
              onCreate={(e) => {
                onModalVisible(false);
                console.log(e);
                setQuizData([...quizData, e]);
              }}
              onCancel={() => {
                onModalVisible(false);
              }}
              initialValues={question}
            />
          </>
        );
      case "generateCode":
        return (
          <div className="enterCode">
            <Title>Quiz</Title>
            <Text>
              Your code is: <Title level={6}>{makeid(6)}</Title>
            </Text>
            <Button
              onClick={() => {
                onChangeStage("question");
                onWaitQuestion(0);
              }}
            >
              Start quiz
            </Button>
          </div>
        );
      case "question":
        return (
          <div className="question">
            <Title>{quizData[currentQuestion].name}</Title>
            <Title level={3}>Already answered</Title>
            <Table
              columns={questionColumns}
              dataSource={[{ login: "Student 1", answer: "answer", key: 1 }]}
              pagination={false}
              style={{ width: "100%" }}
            />
            <Progress
              percent={
                (waitUntil / (1000 * Number(quizData[currentQuestion].time))) *
                100
              }
              showInfo={false}
              status="active"
            />
          </div>
        );
      case "result":
        return (
          <div className="result">
            <Title>Students' results</Title>
            <Table
              dataSource={[
                { login: "Student 1", q1: "Answer 1", q2: "Answer 2" },
              ]}
              columns={allResultsColumns}
            />
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

  return <div className="quiz">{renderStage(currentStage)}</div>;
};

export default Quiz;
