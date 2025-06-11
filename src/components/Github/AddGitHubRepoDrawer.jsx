import { Drawer, Form, Input, Select, Button, Row, Col } from 'antd';
import { useEffect, useState } from 'react';
import githubRepoService from '../../services/githubRepoService';
import { toast } from 'react-toastify';
import tokenService from '../../services/tokenService';

const { Option } = Select;

const AddGitHubRepoDrawer = ({ visible, onClose, onAdd }) => {
  const [form] = Form.useForm();
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      tokenService.getGithubTokens()
        .then(setTokens)
        .catch(() => toast.error("Erreur lors du chargement des tokens GitHub"));
    }
  }, [visible]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await githubRepoService.add({
        repo_url: values.repo_url,
        token_id: values.token_id,
      });

      toast.success("Dépôt ajouté avec succès !");
      onAdd(response);
      form.resetFields();
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Erreur lors de l'ajout du dépôt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      title="Ajouter un dépôt GitHub"
      visible={visible}
      onClose={onClose}
      bodyStyle={{ paddingBottom: 40 }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="token_id"
              label="Token GitHub"
              rules={[{ required: true, message: "Veuillez sélectionner un token" }]}
            >
              <Select placeholder="Sélectionner un token">
                {tokens.map((token) => (
                  <Option key={token.id} value={token.id}>
                    {token.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="repo_url"
              label="URL du dépôt GitHub"
              rules={[{ required: true, message: "Veuillez entrer l'URL du dépôt" }]}
            >
              <Input placeholder="https://github.com/username/repo-name" />
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

export default AddGitHubRepoDrawer;
