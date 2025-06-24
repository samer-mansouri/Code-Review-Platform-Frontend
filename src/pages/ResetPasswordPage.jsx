import { Form, Input, Button, Card, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import authService from "../services/authService";

const ResetPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const onFinish = async ({ password }) => {
    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      message.success("Password updated. Please log in.");
      navigate("/login");
    } catch (error) {
      message.error("Reset failed. Link may be expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <Card className="w-full max-w-md shadow-lg p-8 bg-white rounded-md">
        <h1 className="text-2xl font-semibold text-center mb-6">Reset Password</h1>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="New Password"
            name="password"
            rules={[
              { required: true, message: "Please enter a new password!" },
              { min: 6, message: "Password must be at least 6 characters." },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="New Password" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={loading}
            >
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
