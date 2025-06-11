import { useEffect, useState } from 'react';
import { Table, Button, Modal, Tag, Space, Spin } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import tokenService from '../../services/tokenService';
import { toast } from 'react-toastify';
import AddTokenDrawer from './AddTokenDrawer'; // Assurez-vous que ce fichier existe

const { confirm } = Modal;

const TokenManager = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const fetchTokens = async () => {
    setLoading(true);
    try {
      const [gitlab, github] = await Promise.all([
        tokenService.getGitlabTokens(),
        tokenService.getGithubTokens()
      ]);
      const formattedGitlab = gitlab.map(t => ({ ...t, source: 'GitLab' }));
      const formattedGithub = github.map(t => ({ ...t, source: 'GitHub' }));
      setTokens([...formattedGitlab, ...formattedGithub]);
    } catch (error) {
      toast.error("Erreur lors du chargement des tokens.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  const openDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  const handleAddToken = (newToken) => {
    setTokens(prev => [newToken, ...prev]);
  };

  const handleDelete = (record) => {
    confirm({
      title: 'Confirmer la suppression',
      content: `Supprimer le token "${record.name}" ?`,
      okText: 'Supprimer',
      okType: 'danger',
      cancelText: 'Annuler',
      onOk: async () => {
        try {
          if (record.source === 'GitLab') {
            await tokenService.deleteGitlabToken(record.id);
          } else {
            await tokenService.deleteGithubToken(record.id);
          }
          setTokens(prev => prev.filter(t => t.id !== record.id));
          toast.success("Token supprimé.");
        } catch (err) {
          toast.error("Erreur lors de la suppression.");
        }
      }
    });
  };

  const columns = [
    {
      title: 'Nom',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
      render: source => (
        <Tag color={source === 'GitLab' ? 'geekblue' : 'green'}>{source}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="primary"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record)}
        >
          Supprimer
        </Button>
      ),
    }
  ];

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Gestion des Tokens GitHub / GitLab</h2>

      <div className="flex justify-end mb-4">
        <Button type="primary" icon={<PlusOutlined />} onClick={openDrawer}>
          Ajouter un token
        </Button>
      </div>

      {loading ? (
        <div className="text-center mt-8">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={tokens}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      )}

      <AddTokenDrawer
        visible={drawerVisible}
        onClose={closeDrawer}
        onAdd={handleAddToken}
      />
    </div>
  );
};

export default TokenManager;
