import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Button, Space, Table, Modal, Form, Input, Progress } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

const Quiz = () => {
  const location = useLocation();
  const history = useHistory();
  const [form] = Form.useForm();

  const [quizId] = React.useState(
    location.pathname.split("/").length > 2
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
                onModalVisible(true);
              }}
            >
              Update
            </Button>
            <Button danger>Delete</Button>
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
        }}
        style={{ marginBottom: "1rem" }}
      >
        Add new question
      </Button>
      <Table columns={columns} dataSource={quizData} pagination={false}></Table>
      <Modal
        title=""
        visible={modalVisible}
        onOk={() => {
          onModalVisible(false);
        }}
        onCancel={() => {
          onModalVisible(false);
        }}
      >
        <Form form={form}>
          <Form.Item label="Question">
            <Input placeholder="input placeholder" />
          </Form.Item>
          <Form.Item label="Answer">
            <Input placeholder="input placeholder" />
          </Form.Item>
          <Form.Item label="Time">
            <Input placeholder="input placeholder" />
          </Form.Item>
          <Form.Item label="Cost">
            <Input placeholder="input placeholder" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Quiz;
