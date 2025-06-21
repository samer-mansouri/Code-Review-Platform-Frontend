import { Form, Input, Button, Card, message } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../services/authService";

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        role: "developer", // Default role
      };
      const response = await authService.register(payload);
      message.success("Account created successfully! Please log in.");
      navigate("/");
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.msg ||
        "Registration failed.";
      message.error(errorMsg);
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg p-8 bg-white rounded-md">
        <h1 className="text-2xl font-semibold text-center mb-6">Register</h1>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="First Name"
            name="first_name"
            rules={[{ required: true, message: "Please enter your first name" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="First Name" />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="last_name"
            rules={[{ required: true, message: "Please enter your last name" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Last Name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Invalid email" }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter a password" },
              { min: 6, message: "Password must be at least 6 characters" }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={loading}
            >
              Register
            </Button>
          </Form.Item>
        </Form>

        <p className="text-center mt-4">
          Already have an account? <Link to="/">Log in</Link>
        </p>
      </Card>
    </div>
  );
};

export default RegisterPage;
