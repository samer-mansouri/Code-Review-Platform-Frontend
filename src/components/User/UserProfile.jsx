import { useEffect, useState } from "react";
import { Card, Descriptions, Tag, Typography, Spin, Button, Drawer, Form, Input, message } from "antd";
import { UserOutlined, MailOutlined } from "@ant-design/icons";
import userDataService from "../../services/userDataService";

const { Title } = Typography;

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [passwordDrawerOpen, setPasswordDrawerOpen] = useState(false);

  const [form] = Form.useForm();
  const [pwdForm] = Form.useForm();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = () => {
    userDataService
      .getProfile()
      .then((res) => setProfile(res.user || res))
      .catch((err) => console.error("Échec du chargement du profil", err))
      .finally(() => setLoading(false));
  };

  const handleProfileUpdate = async () => {
    try {
      const values = await form.validateFields();
      await userDataService.updateProfile(values).then((res) => {
        localStorage.setItem("first_name", res.user.first_name);
        localStorage.setItem("last_name", res.user.last_name);
      });

      message.success("Profil mis à jour avec succès");
      setEditDrawerOpen(false);
      fetchProfile();
    } catch (error) {
      message.error(error.toString());
    }
  };

  const handlePasswordChange = async () => {
    try {
      const values = await pwdForm.validateFields();
      await userDataService.changePassword(values);
      message.success("Mot de passe mis à jour avec succès");
      setPasswordDrawerOpen(false);
      pwdForm.resetFields();
    } catch (error) {
      message.error(error.toString());
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <Title level={3} className="mb-4">
        <UserOutlined /> Mon Profil
      </Title>

      <Card bordered size="small">
        <Descriptions column={1} size="middle">
          <Descriptions.Item label="Prénom">
            {profile.first_name}
          </Descriptions.Item>
          <Descriptions.Item label="Nom">
            {profile.last_name}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            <MailOutlined style={{ marginRight: 8 }} />
            {profile.email}
          </Descriptions.Item>
          <Descriptions.Item label="Rôle">
            <Tag color={profile.role === "admin" ? "geekblue" : "green"}>
              {profile.role.toUpperCase()}
            </Tag>
          </Descriptions.Item>
        </Descriptions>

        <div className="mt-4 flex gap-2">
          <Button type="primary" onClick={() => setEditDrawerOpen(true)}>
            Modifier le profil
          </Button>
          <Button onClick={() => setPasswordDrawerOpen(true)}>
            Changer le mot de passe
          </Button>
        </div>
      </Card>

      {/* Drawer modification profil */}
      <Drawer
        title="Modifier le profil"
        placement="right"
        open={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        width={360}
      >
        <Form layout="vertical" form={form} initialValues={profile}>
          <Form.Item
            label="Prénom"
            name="first_name"
            rules={[{ required: true, message: "Veuillez entrer votre prénom" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Nom"
            name="last_name"
            rules={[{ required: true, message: "Veuillez entrer votre nom" }]}
          >
            <Input />
          </Form.Item>

          <Button type="primary" onClick={handleProfileUpdate} block>
            Enregistrer les modifications
          </Button>
        </Form>
      </Drawer>

      {/* Drawer changement mot de passe */}
      <Drawer
        title="Changer le mot de passe"
        placement="right"
        open={passwordDrawerOpen}
        onClose={() => setPasswordDrawerOpen(false)}
        width={360}
      >
        <Form layout="vertical" form={pwdForm}>
          <Form.Item
            label="Ancien mot de passe"
            name="old_password"
            rules={[{ required: true, message: "Veuillez entrer votre ancien mot de passe" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Nouveau mot de passe"
            name="new_password"
            rules={[
              { required: true, message: "Veuillez entrer votre nouveau mot de passe" },
              { min: 6, message: "Minimum 6 caractères" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Button type="primary" onClick={handlePasswordChange} block>
            Mettre à jour le mot de passe
          </Button>
        </Form>
      </Drawer>
    </div>
  );
};

export default UserProfile;
