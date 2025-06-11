import { Drawer, Form, Input, Select, Button, Row, Col } from 'antd';
import { useEffect, useState } from 'react';
import tokenService from '../../services/tokenService';
import gitlabProjectService from '../../services/gitlabProjectService';
import { toast } from 'react-toastify';

const { Option } = Select;

const AddGitLabProjectDrawer = ({ visible, onClose, onAdd }) => {
  const [form] = Form.useForm();
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      tokenService.getGitlabTokens()
        .then(setTokens)
        .catch(() => toast.error("Erreur lors du chargement des tokens GitLab"));
    }
  }, [visible]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await gitlabProjectService.add({
        project_url: values.project_url,
        token_id: values.token_id
      });

      toast.success("Projet ajouté avec succès !");
      onAdd(response); // Notify parent
      form.resetFields();
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Erreur lors de l'ajout du projet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      title="Ajouter un projet GitLab"
      visible={visible}
      onClose={onClose}
      bodyStyle={{ paddingBottom: 40 }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="token_id"
              label="Token GitLab"
              rules={[{ required: true, message: "Veuillez sélectionner un token" }]}
            >
              <Select placeholder="Sélectionner un token">
                {tokens.map(token => (
                  <Option key={token.id} value={token.id}>{token.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="project_url"
              label="URL du projet GitLab"
              rules={[{ required: true, message: "Veuillez entrer l'URL du projet" }]}
            >
              <Input placeholder="https://gitlab.com/username/project" />
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

export default AddGitLabProjectDrawer;
