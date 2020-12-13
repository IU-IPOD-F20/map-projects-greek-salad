import React from "react";
import { Table, Button, Space } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useHistory, Link } from "react-router-dom";

const Teacher = () => {
  const history = useHistory();
  const [quizes, onChangeQuizes] = React.useState([
    // { key: 1, quizName: "Quiz 1", id: 343 },
  ]);

  React.useEffect(() => {
    const firstLoad = async () => {
      const res = await fetch(process.env.REACT_APP_BACKEND + "/quiz", {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const body = await res.json();
      if (res.status === 400 || res.status === 401) {
        history.push("/login");
      } else {
        onChangeQuizes(body);
      }
    };
    firstLoad();
  }, []);

  const columns = [
    {
      title: "Quiz",
      dataIndex: "quiz_id",
      key: "quiz_id",
      width: "90%",
      render: (text, record, index) => (
        <Link to={`/quiz/${record.quiz_id}`}>{record.quiz_id}</Link>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record, index) => {
        return (
          <Space size="middle">
            <Button
              onClick={() => history.push(`/quiz/${record.quiz_id}?start`)}
            >
              Start
            </Button>
            <Button onClick={() => history.push(`/quiz/${record.quiz_id}`)}>
              Modify
            </Button>
            <Button
              onClick={async () => {
                const res = await fetch(
                  process.env.REACT_APP_BACKEND + `/csv/${record.quiz_id}`,
                  {
                    method: "GET",
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  }
                );
                const body = await res;
                console.log(body);
              }}
            >
              Download CSV
            </Button>
            <Button
              danger
              onClick={() => {
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
