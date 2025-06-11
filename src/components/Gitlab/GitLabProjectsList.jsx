import { useEffect, useState } from 'react';
import { Table, Input, Tag, Spin, Button } from 'antd';
import { SearchOutlined, PlusOutlined, SyncOutlined, EyeOutlined } from '@ant-design/icons';
import gitlabProjectService from '../../services/gitlabProjectService';
import AddGitLabProjectDrawer from './AddGitLabProjectDrawer';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const GitLabProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState({});
  const [searchText, setSearchText] = useState('');
  const [drawerVisible, setDrawerVisible] = useState(false);

  const navigate = useNavigate();

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await gitlabProjectService.getAllProjects();
      setProjects(response);
    } catch (err) {
      toast.error("Erreur lors du chargement des projets GitLab.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  const handleNewProject = (newProject) => {
    setProjects(prev => [newProject, ...prev]);
  };

  const handleSync = async (projectId) => {
    setSyncing(prev => ({ ...prev, [projectId]: true }));
    try {
      await gitlabProjectService.sync(projectId);
      toast.success("Synchronisation terminée !");
    } catch (err) {
      toast.error("Échec de la synchronisation.");
      console.error(err);
    } finally {
      setSyncing(prev => ({ ...prev, [projectId]: false }));
    }
  };

  const filteredProjects = projects.filter(project =>
    Object.values(project).some(value =>
      String(value).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const columns = [
    {
      title: 'Nom',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <a onClick={() => navigate(`/gitlab/projects/${record.id}`)} className="text-blue-600 hover:underline">
          {text}
        </a>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Namespace',
      dataIndex: 'path_with_namespace',
      key: 'path_with_namespace',
    },
    {
      title: 'Web URL',
      dataIndex: 'web_url',
      key: 'web_url',
      render: (url) => (
        <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
      ),
    },
    {
      title: 'Créé le',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => new Date(date).toLocaleString(),
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    },
    {
      title: 'Token ID',
      dataIndex: 'token_id',
      key: 'token_id',
      render: (id) => <Tag>{id}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            icon={<SyncOutlined />}
            loading={syncing[record.id]}
            onClick={() => handleSync(record.id)}
          >
            Sync
          </Button>
          <Button
            icon={<EyeOutlined />}
            onClick={() => navigate(`/gitlab/projects/${record.id}`)}
          >
            Voir
          </Button>
        </div>
      ),
    }
  ];

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white opacity-75 z-10">
          <Spin size="large" />
        </div>
      )}

      <h1 className="text-lg font-semibold mb-4">Projets GitLab</h1>

      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Rechercher un projet..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
          prefix={<SearchOutlined />}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={openDrawer}>
          Ajouter un projet
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredProjects}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        bordered
      />

      <AddGitLabProjectDrawer
        visible={drawerVisible}
        onClose={closeDrawer}
        onAdd={handleNewProject}
      />
    </div>
  );
};

export default GitLabProjectsList;
