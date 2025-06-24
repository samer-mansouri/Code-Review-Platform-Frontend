import { Form, Input, Button, Card } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import authService from "../services/authService";
import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const onFinish = (values) => {
    setLoading(true);
    authService
      .login(values.email, values.password)
      .then((response) => {
        const { user } = response;

        localStorage.setItem("access", response.access_token);
        localStorage.setItem("refresh", response.refresh_token);
        localStorage.setItem("first_name", user.first_name);
        localStorage.setItem("last_name", user.last_name);
        localStorage.setItem("email", user.email);
        localStorage.setItem("id", user.id);
        localStorage.setItem("role", user.role);
        localStorage.setItem("profile_picture", user.profile_picture || "");

        setUser({
          first_name: user.first_name,
          last_name: user.last_name,
          profile_picture: user.profile_picture || "",
        });

        if (user.role === "developer") {
          navigate("/tokens");
        } else if (user.role === "admin") {
          navigate("/stats");
        } else {
          navigate("/unauthorized");
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <Card className="w-full max-w-md shadow-lg p-8 bg-white rounded-md">
        <h1 className="text-2xl font-semibold text-center mb-6">Login</h1>
        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="Email address"
            name="email"
            rules={[
              { type: "email", message: "Invalid email address!" },
              { required: true, message: "Please enter your email address!" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter your password!" },
              { min: 6, message: "Password must be at least 6 characters" },
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
              Log In
            </Button>
          </Form.Item>

          <div className="text-right">
            <Link to="/request-reset">Forgot your password?</Link>
          </div>
        </Form>

        <p className="text-center mt-4">
          Don't have an account? <Link to="/register">Create an account</Link>
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;
