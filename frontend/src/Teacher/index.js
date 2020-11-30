import React from "react";
import { Table, Button, Space } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useHistory, Link } from "react-router-dom";

const Teacher = () => {
  const history = useHistory();

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
      render: (text, record) => {
        return (
          <Space size="middle">
            <Button>Start</Button>
            <Button>Modify</Button>
            <Button danger>Delete</Button>
          </Space>
        );
      },
    },
  ];

  const dataSource = [{ key: 1, quizName: "Quiz 1", id: 343 }];

  return (
    <div className="teacher">
      <Button
        icon={<PlusCircleOutlined />}
        onClick={() => history.push("/quiz/")}
        style={{ marginBottom: "1rem" }}
      >
        Add new quiz
      </Button>
      <Table dataSource={dataSource} columns={columns} pagination={false} />
    </div>
  );
};

export default Teacher;
