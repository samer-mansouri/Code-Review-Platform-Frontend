import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Tag, Spin, Typography, Button } from "antd";
import { toast } from "react-toastify";
import githubRepoService from "../../services/githubRepoService";

const { Title } = Typography;

const GitHubRepoDetails = () => {
  const { repoId } = useParams();
  const [prs, setPrs] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleBack = () => navigate(-1);

  useEffect(() => {
    setLoading(true);
    githubRepoService
      .getPullRequests(repoId)
      .then(setPrs)
      .catch(() => toast.error("Error loading pull requests."))
      .finally(() => setLoading(false));
  }, [repoId]);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <a
          onClick={() =>
            navigate(`/github/repos/${repoId}/pr/${record.number}`)
          }
          className="text-blue-600 hover:underline"
        >
          {text}
        </a>
      ),
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      render: (state) => (
        <Tag
          color={
            state === "open"
              ? "blue"
              : state === "closed"
              ? "volcano"
              : state === "merged"
              ? "green"
              : "default"
          }
        >
          {state}
        </Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Author",
      dataIndex: "user_login",
      key: "user_login",
      render: (login) => <Tag color="geekblue">{login}</Tag>,
    },
  ];

  return (
    <div>
      <Button onClick={handleBack} type="link" style={{ marginBottom: 16 }}>
        ← Back to GitHub Repositories
      </Button>

      <Title level={3}>Pull Request List</Title>

      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          columns={columns}
          dataSource={prs}
          rowKey="number"
          pagination={{ pageSize: 8 }}
          bordered
        />
      )}
    </div>
  );
};

export default GitHubRepoDetails;
