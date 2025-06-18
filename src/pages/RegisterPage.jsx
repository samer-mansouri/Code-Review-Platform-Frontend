import { Form, Input, Button, Card, Select, message } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../services/authService";

const { Option } = Select;

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await authService.register(values);
      message.success("Compte créé avec succès ! Connectez-vous.");
      navigate("/");
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.msg ||
        "Échec de l'inscription.";
      message.error(errorMsg);
      console.error("Erreur d'inscription :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg p-8 bg-white rounded-md">
        <h1 className="text-2xl font-semibold text-center mb-6">Inscription</h1>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Prénom"
            name="first_name"
            rules={[{ required: true, message: "Veuillez entrer votre prénom" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Prénom" />
          </Form.Item>

          <Form.Item
            label="Nom"
            name="last_name"
            rules={[{ required: true, message: "Veuillez entrer votre nom" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nom" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Veuillez entrer votre email" },
              { type: "email", message: "Email invalide" }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            label="Mot de passe"
            name="password"
            rules={[
              { required: true, message: "Veuillez entrer un mot de passe" },
              { min: 6, message: "Le mot de passe doit contenir au moins 6 caractères" }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mot de passe" />
          </Form.Item>

          <Form.Item
            label="Rôle"
            name="role"
            rules={[{ required: true, message: "Veuillez sélectionner un rôle" }]}
          >
            <Select placeholder="Sélectionnez un rôle">
              <Option value="developer">Développeur</Option>
              <Option value="admin">Administrateur</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={loading}
            >
              S'inscrire
            </Button>
          </Form.Item>
        </Form>
        <p className="text-center mt-4">
          Vous avez déjà un compte ? <Link to="/">Connectez-vous</Link>
        </p>
      </Card>
    </div>
  );
};

export default RegisterPage;
