import { Drawer, Form, Button, Col, Row, Input as AntInput } from 'antd';
import usersService from '../../services/usersService';
import { useState } from 'react';
import { toast } from 'react-toastify';

const AddUserDrawer = ({ visible, onClose, onAddDemand }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);

    // Inject the role as developer
    const payload = { ...values, role: 'developer' };

    usersService.create(payload)
      .then((response) => {
        onAddDemand(response);
        toast.success("Développeur ajouté avec succès", {
          position: "top-right",
          autoClose: 2000,
        });
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout:", error);
        toast.error("Erreur lors de la création du Développeur");
      })
      .finally(() => {
        setLoading(false);
        form.resetFields();
        onClose();
      });
  };

  return (
    <Drawer
      title="Ajouter un Développeur"
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
            <Form.Item
              name="password"
              label="Mot de passe"
              rules={[{ required: true, message: "Veuillez entrer le mot de passe" }]}
            >
              <AntInput.Password placeholder="Entrez le mot de passe" />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }} disabled={loading}>
            Annuler
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Ajouter
          </Button>
        </div>
      </Form>
    </Drawer>
  );
};

export default AddUserDrawer;
