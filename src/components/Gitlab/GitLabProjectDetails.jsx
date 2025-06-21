import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Tag, Spin, Typography, Button } from "antd";
import gitlabProjectService from "../../services/gitlabProjectService";
import { toast } from "react-toastify";

const { Title } = Typography;

const GitLabProjectDetails = () => {
  const { projectId } = useParams();
  const [mrs, setMrs] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleBack = () => navigate(-1);

  useEffect(() => {
    setLoading(true);
    gitlabProjectService
      .getMergeRequests(projectId)
      .then(setMrs)
      .catch(() => toast.error("Error while loading merge requests."))
      .finally(() => setLoading(false));
  }, [projectId]);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <a
          onClick={() =>
            navigate(`/gitlab/projects/${projectId}/mr/${record.iid}`)
          }
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
            state === "merged"
              ? "green"
              : state === "opened"
              ? "blue"
              : "volcano"
          }
        >
          {state}
        </Tag>
      ),
    },
    {
      title: "Merge Status",
      dataIndex: "merge_status",
      key: "merge_status",
      render: (status) => (
        <Tag color={status === "can_be_merged" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => new Date(date).toLocaleString(),
    },
  ];

  return (
    <div>
      <Button onClick={handleBack} type="link" style={{ marginBottom: 16 }}>
        ← Back to GitLab Projects
      </Button>

      <Title level={3}>Merge Request List</Title>

      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          columns={columns}
          dataSource={mrs}
          rowKey="iid"
          pagination={{ pageSize: 8 }}
          bordered
        />
      )}
    </div>
  );
};

export default GitLabProjectDetails;
