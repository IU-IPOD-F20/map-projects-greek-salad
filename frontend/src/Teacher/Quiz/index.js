import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Button, Space, Table, Modal, Form, Input, Progress } from "antd";
import { PlusCircleOutlined, SketchSquareFilled } from "@ant-design/icons";
import QuestionModal from "./QuestionModal";

const Quiz = () => {
  const location = useLocation();
  const history = useHistory();

  const [quizId] = React.useState(
    !!location.pathname.split("/")[2]
      ? Number(location.pathname.split("/")[2])
      : -1
  );

  const [modalVisible, onModalVisible] = React.useState(false);
  const [question, onChangeQuestion] = React.useState({});

  const [quizData, setQuizData] = React.useState([]);

  React.useEffect(() => {
    if (quizId !== -1) {
      setQuizData([
        {
          id: 1,
          name: "Why do you never see elephants hiding in trees?",
          answer: "Because they're very good at it.",
          time: "10",
          cost: 1,
        },
      ]);
    }
  }, []);

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

  return (
    <div className="quiz">
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
      <Table columns={columns} dataSource={quizData} pagination={false}></Table>

      <QuestionModal
        visible={modalVisible}
        onCreate={() => onModalVisible(false)}
        onCancel={() => {
          onModalVisible(false);
        }}
        initialValues={question}
      />
    </div>
  );
};

export default Quiz;
