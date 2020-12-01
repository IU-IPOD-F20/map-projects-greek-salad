import React from "react";
import { Table, Button, Space } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useHistory, Link } from "react-router-dom";

const Teacher = () => {
  const history = useHistory();
  const [quizes, onChangeQuizes] = React.useState([
    { key: 1, quizName: "Quiz 1", id: 343 },
  ]);

  const columns = [
    {
      title: "Quiz",
      dataIndex: "quizName",
      key: "quizName",
      width: "90%",
      render: (text, record, index) => (
        <Link to={`/quiz/${record.id}`}>{record.quizName}</Link>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record, index) => {
        return (
          <Space size="middle">
            <Button>Start</Button>
            <Button>Modify</Button>
            <Button
              danger
              onClick={() => {
                console.log(index);
                onChangeQuizes([
                  ...quizes.slice(0, index),
                  ...quizes.slice(index + 1, quizes.length),
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
    <div className="teacher">
      <Button
        icon={<PlusCircleOutlined />}
        onClick={() => history.push("/quiz/")}
        style={{ marginBottom: "1rem" }}
      >
        Add new quiz
      </Button>
      <Table dataSource={quizes} columns={columns} pagination={false} />
    </div>
  );
};

export default Teacher;
