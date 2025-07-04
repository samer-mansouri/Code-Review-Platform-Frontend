import { Form, Input, Button, Card } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import authService from "../services/authService";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values) => {
    setLoading(true);
    authService
      .login(values.email, values.password)
      .then((response) => {
        const { user } = response;

        // Stockage en localStorage
        localStorage.setItem("access", response.access_token);
        localStorage.setItem("refresh", response.refresh_token);
        localStorage.setItem("first_name", user.first_name);
        localStorage.setItem("last_name", user.last_name);
        localStorage.setItem("email", user.email);
        localStorage.setItem("id", user.id);
        localStorage.setItem("role", user.role);

        // Redirection selon le rôle
        if (user.role === "developer") {
          navigate("/tokens");
        } else if (user.role === "admin") {
          navigate("/stats");
        } else {
          navigate("/unauthorized");
        }
      })
      .catch((error) => {
        console.error("Erreur de connexion :", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <Card className="w-full max-w-md shadow-lg p-8 bg-white rounded-md">
        <h1 className="text-2xl font-semibold text-center mb-6">Connexion</h1>
        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="Adresse email"
            name="email"
            rules={[
              { type: "email", message: "Adresse email invalide !" },
              { required: true, message: "Veuillez entrer votre adresse email !" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            label="Mot de passe"
            name="password"
            rules={[
              { required: true, message: "Veuillez entrer votre mot de passe !" },
              { min: 6, message: "Le mot de passe doit contenir au moins 6 caractères" },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mot de passe" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={loading}
            >
              Se connecter
            </Button>
          </Form.Item>
        </Form>

        <p className="text-center mt-4">
          Vous n'avez pas de compte ? <Link to="/register">Créer un compte</Link>
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;
