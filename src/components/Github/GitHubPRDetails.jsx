import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Descriptions,
  Tag,
  Typography,
  Collapse,
  List,
  Spin,
  Divider,
  Button,
} from "antd";
import { toast } from "react-toastify";
import githubRepoService from "../../services/githubRepoService";

const { Title } = Typography;
const { Panel } = Collapse;

const GitHubPRDetails = () => {
  const { repoId, prNumber } = useParams();
  const [pr, setPr] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleBack = () => navigate(-1);

  useEffect(() => {
    setLoading(true);
    githubRepoService
      .getPullRequestDetails(repoId, prNumber)
      .then(setPr)
      .catch(() => toast.error("Erreur lors du chargement du PR"))
      .finally(() => setLoading(false));
  }, [repoId, prNumber]);

  if (loading || !pr) {
    return (
      <div className="flex justify-center items-center h-80">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Button onClick={handleBack} type="link" style={{ marginBottom: 16 }}>
        ← Retour
      </Button>

      <Title level={3}>Pull Request #{pr.number}</Title>

      <Descriptions bordered column={1} size="middle" className="mb-6">
        <Descriptions.Item label="Titre">
          <Tag color="blue">{pr.title}</Tag>
        </Descriptions.Item>

        <Descriptions.Item label="État">
          <Tag
            color={
              pr.state === "merged"
                ? "green"
                : pr.state === "closed"
                ? "red"
                : "blue"
            }
          >
            {pr.state}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Branches">
          <Tag color="geekblue">{pr.head_ref}</Tag> →{" "}
          <Tag color="purple">{pr.base_ref}</Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Auteur">
          <Tag color="cyan">{pr.user_login}</Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Créé le">
          <Tag color="default">
            {new Date(pr.created_at).toLocaleString()}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Fusionné le">
          <Tag color={pr.merged_at ? "success" : "default"}>
            {pr.merged_at
              ? new Date(pr.merged_at).toLocaleString()
              : "Non fusionné"}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Description">
          {pr.body ? (
            <Typography.Paragraph>{pr.body}</Typography.Paragraph>
          ) : (
            <Tag color="warning">Aucune description</Tag>
          )}
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <Collapse defaultActiveKey={["commits"]}>
        <Panel header={`Commits (${pr.commits?.length || 0})`} key="commits">
          <List
            dataSource={pr.commits}
            renderItem={(commit) => (
              <List.Item>
                <List.Item.Meta
                  title={<b>{commit.message}</b>}
                  description={`Auteur: ${commit.author_name} · SHA: ${commit.sha}`}
                />
              </List.Item>
            )}
          />
        </Panel>

        <Panel header={`Fichiers Modifiés (${pr.files?.length || 0})`} key="files">
          <Collapse accordion>
            {pr.files?.map((file, index) => (
              <Panel
                header={`${file.filename}`}
                key={index}
                style={{ background: "#fafafa", borderRadius: 4 }}
              >
                <div
                  style={{
                    backgroundColor: "#1e1e1e",
                    color: "#f8f8f2",
                    padding: "12px",
                    borderRadius: "6px",
                    fontFamily: "monospace",
                    fontSize: "0.85rem",
                    overflowX: "auto",
                    maxHeight: 400,
                  }}
                >
                  <code>
                    <pre style={{ margin: 0 }}>{file.patch || "Pas de diff disponible."}</pre>
                  </code>
                </div>
              </Panel>
            ))}
          </Collapse>
        </Panel>

        <Panel header={`Commentaires de revue (${pr.reviews?.length || 0})`} key="reviews">
          <List
            dataSource={pr.reviews}
            renderItem={(review) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <b>
                      {review.user?.login} - {review.state}
                    </b>
                  }
                  description={review.body || "Pas de commentaire"}
                />
              </List.Item>
            )}
          />
        </Panel>
      </Collapse>
    </div>
  );
};

export default GitHubPRDetails;
