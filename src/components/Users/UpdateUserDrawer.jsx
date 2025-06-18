import { Drawer, Form, Button, Col, Row, Input as AntInput } from 'antd';
import usersService from '../../services/usersService';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const UpdateUserDrawer = ({ visible, onClose, userData, onUpdateDemand }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      form.setFieldsValue({
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
      });
    }
  }, [userData, form]);

  const onFinish = (values) => {
    setLoading(true);

    const payload = {
      ...values,
      role: 'developer', // Force developer role
    };

    if (!payload.password) {
      delete payload.password;
    }

    usersService.update(userData.id, payload)
      .then((response) => {
        onUpdateDemand(response);
        toast.success("Développeur mis à jour avec succès");
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour:", error);
        toast.error("Erreur lors de la mise à jour du Développeur");
      })
      .finally(() => {
        setLoading(false);
        onClose();
      });
  };

  return (
    <Drawer
      title="Mettre à jour le Développeur"
      onClose={onClose}
      visible={visible}
      bodyStyle={{ paddingBottom: 40 }}
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name="first_name"
              label="Prénom"
              rules={[{ required: true, message: "Veuillez entrer le prénom" }]}
            >
              <AntInput placeholder="Entrez le prénom" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="last_name"
              label="Nom"
              rules={[{ required: true, message: "Veuillez entrer le nom" }]}
            >
              <AntInput placeholder="Entrez le nom" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Veuillez entrer l'email" },
                { type: "email", message: "Email invalide" },
              ]}
            >
              <AntInput placeholder="Entrez l'email" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="password" label="Mot de passe (optionnel)">
              <AntInput.Password placeholder="Laissez vide pour ne pas changer" />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }} disabled={loading}>
            Annuler
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Mettre à jour
          </Button>
        </div>
      </Form>
    </Drawer>
  );
};

export default UpdateUserDrawer;
