import { Drawer, Form, Input, Select, Button, Row, Col } from 'antd';
import { useState } from 'react';
import tokenService from '../../services/tokenService';
import { toast } from 'react-toastify';

const { Option } = Select;

const AddTokenDrawer = ({ visible, onClose, onAdd }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { name, token, source } = values;

      let result;
      if (source === 'gitlab') {
        result = await tokenService.addGitlabToken({ name, token });
      } else {
        result = await tokenService.addGithubToken({ name, token });
      }

      onAdd({
        id: result.id,
        name,
        token,
        source: source === 'gitlab' ? 'GitLab' : 'GitHub',
      });

      toast.success('Token ajouté avec succès');
      form.resetFields();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Erreur lors de l’ajout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      title="Ajouter un token"
      onClose={onClose}
      visible={visible}
      bodyStyle={{ paddingBottom: 40 }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="source"
              label="Source"
              rules={[{ required: true, message: 'Veuillez choisir une source' }]}
            >
              <Select placeholder="Choisir une source">
                <Option value="gitlab">GitLab</Option>
                <Option value="github">GitHub</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="name"
              label="Nom du token"
              rules={[{ required: true, message: 'Veuillez entrer un nom' }]}
            >
              <Input placeholder="Nom du token" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="token"
              label="Token"
              rules={[{ required: true, message: 'Veuillez entrer le token' }]}
            >
              <Input.Password placeholder="Token" />
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

export default AddTokenDrawer;
