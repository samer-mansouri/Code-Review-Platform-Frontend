import { Drawer, Form, Button, Col, Row, Input as AntInput, Select } from 'antd';
import usersService from '../../services/usersService';
import { useState } from 'react';
import { toast } from 'react-toastify';

const { Option } = Select;

const AddUserDrawer = ({ visible, onClose, onAddUser }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    usersService.create(values)
      .then((response) => {
        onAddUser(response);
        toast.success("Utilisateur ajouté avec succès", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout:", error);
        toast.error("Erreur lors de la création de l'utilisateur");
      })
      .finally(() => {
        setLoading(false);
        form.resetFields();
        onClose();
      });
  };

  return (
    <Drawer
      title="Ajouter un utilisateur"
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
          <Col span={24}>
            <Form.Item
              name="role"
              label="Rôle"
              initialValue="user"
              rules={[{ required: true, message: "Veuillez sélectionner un rôle" }]}
            >
              <Select>
                <Option value="user">Utilisateur</Option>
                <Option value="admin">Administrateur</Option>
              </Select>
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
