import { useEffect, useState } from "react";
import {
  Table,
  Input,
  Button,
  Tag,
  Spin,
  Popconfirm,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  SyncOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import githubRepoService from "../../services/githubRepoService";
import AddGitHubRepoDrawer from "./AddGitHubRepoDrawer";

const GitHubReposList = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState({});
  const [searchText, setSearchText] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false);

  const navigate = useNavigate();

  const fetchRepos = async () => {
    setLoading(true);
    try {
      const data = await githubRepoService.getAllRepos();
      setRepos(data);
    } catch (err) {
      toast.error("Error loading GitHub repositories.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  const handleNewRepo = (newRepo) => {
    setRepos((prev) => [newRepo, ...prev]);
  };

  const handleSync = async (repoId, type) => {
    setSyncing((prev) => ({ ...prev, [`${type}-${repoId}`]: true }));
    try {
      if (type === "commits") {
        await githubRepoService.syncCommits(repoId);
      } else {
        await githubRepoService.syncPullRequests(repoId);
      }
      toast.success(`Successfully synced ${type}!`);
    } catch (err) {
      toast.error(`Failed to sync ${type}.`);
      console.error(err);
    } finally {
      setSyncing((prev) => ({ ...prev, [`${type}-${repoId}`]: false }));
    }
  };

  const handleDelete = async (repoId) => {
    try {
      await githubRepoService.delete(repoId);
      setRepos((prev) => prev.filter((repo) => repo._id !== repoId));
      toast.success("Repository deleted successfully!");
    } catch (err) {
      toast.error("Error deleting the repository.");
      console.error(err);
    }
  };

  const filteredRepos = repos.filter((repo) =>
    Object.values(repo).some((value) =>
      String(value).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <a
          className="text-blue-600 hover:underline"
          onClick={() => navigate(`/github/repos/${record.id}`)}
        >
          {text}
        </a>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Owner",
      dataIndex: "owner_login",
      key: "owner_login",
    },
    {
      title: "URL",
      dataIndex: "html_url",
      key: "html_url",
      render: (url) => (
        <a href={url} target="_blank" rel="noopener noreferrer">
          {url}
        </a>
      ),
    },
    {
      title: "Private",
      dataIndex: "private",
      key: "private",
      render: (value) => (
        <Tag color={value ? "red" : "green"}>{value ? "Yes" : "No"}</Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => new Date(date).toLocaleString(),
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    },
    {
      title: "Token ID",
      dataIndex: "token_id",
      key: "token_id",
      render: (id) => <Tag>{id}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            icon={<SyncOutlined />}
            loading={syncing[`prs-${record.id}`]}
            onClick={() => handleSync(record.id, "prs")}
          >
            Sync PRs
          </Button>

          <Button
            icon={<EyeOutlined />}
            onClick={() => navigate(`/github/repos/${record.id}`)}
          >
            View
          </Button>

          <Popconfirm
            title="Are you sure you want to delete this repository?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white opacity-75 z-10">
          <Spin size="large" />
        </div>
      )}

      <h1 className="text-lg font-semibold mb-4">GitHub Repositories</h1>

      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search a repository..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
          prefix={<SearchOutlined />}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setDrawerVisible(true)}
        >
          Add Repository
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredRepos}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        bordered
      />

      <AddGitHubRepoDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onAdd={handleNewRepo}
      />
    </div>
  );
};

export default GitHubReposList;
