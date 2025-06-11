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
      .catch(() => toast.error("Erreur lors du chargement des MRs"))
      .finally(() => setLoading(false));
  }, [projectId]);

  const columns = [
    {
      title: "Titre",
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
      title: "État",
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
      title: "Statut fusion",
      dataIndex: "merge_status",
      key: "merge_status",
      render: (status) => (
        <Tag color={status === "can_be_merged" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Créé le",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => new Date(date).toLocaleString(),
    },
  ];

  return (
    <div>
      <Button onClick={handleBack} type="link" style={{ marginBottom: 16 }}>
        ← Retour aux projets GitLab
      </Button>

      <Title level={3}>Liste des Merge Requests</Title>

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
