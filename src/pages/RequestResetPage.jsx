import { Form, Input, Button, Card, message } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useState } from "react";
import authService from "../services/authService";

const RequestResetPage = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await authService.requestPasswordReset(values.email);
      message.success("If this email exists, a reset link was sent.");
    } catch (err) {
      message.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <Card className="w-full max-w-md shadow-lg p-8 bg-white rounded-md">
        <h1 className="text-2xl font-semibold text-center mb-6">Forgot Password</h1>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email address"
            name="email"
            rules={[
              { type: "email", message: "Invalid email!" },
              { required: true, message: "Please enter your email!" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Enter your email" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={loading}
            >
              Send Reset Link
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default RequestResetPage;
