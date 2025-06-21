import { useEffect, useState } from 'react';
import { Table, Button, Modal, Tag, Spin } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import tokenService from '../../services/tokenService';
import { toast } from 'react-toastify';
import AddTokenDrawer from './AddTokenDrawer';

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
        tokenService.getGithubTokens(),
      ]);
      const formattedGitlab = gitlab.map(t => ({ ...t, source: 'GitLab' }));
      const formattedGithub = github.map(t => ({ ...t, source: 'GitHub' }));
      setTokens([...formattedGitlab, ...formattedGithub]);
    } catch (error) {
      toast.error("Error while loading tokens.");
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
      title: 'Confirm Deletion',
      content: `Are you sure you want to delete the token "${record.name}"?`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          if (record.source === 'GitLab') {
            await tokenService.deleteGitlabToken(record.id);
          } else {
            await tokenService.deleteGithubToken(record.id);
          }
          setTokens(prev => prev.filter(t => t.id !== record.id));
          toast.success("Token deleted successfully.");
        } catch (err) {
          toast.error("Error while deleting the token.");
        }
      }
    });
  };

  const columns = [
    {
      title: 'Name',
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
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-4">GitHub / GitLab Token Management</h2>

      <div className="flex justify-end mb-4">
        <Button type="primary" icon={<PlusOutlined />} onClick={openDrawer}>
          Add Token
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
