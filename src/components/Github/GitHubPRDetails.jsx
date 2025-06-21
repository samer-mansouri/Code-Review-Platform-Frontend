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
  Alert,
} from "antd";
import { toast } from "react-toastify";
import axios from "axios";
import githubRepoService from "../../services/githubRepoService";

const { Title } = Typography;
const { Panel } = Collapse;

const GitHubPRDetails = () => {
  const { repoId, prNumber } = useParams();
  const [pr, setPr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [hasAiReview, setHasAiReview] = useState(false);
  const navigate = useNavigate();

  const REVIEW_API_URL = import.meta.env.VITE_REVIEW_API_URL;

  const handleBack = () => navigate(-1);

  useEffect(() => {
    setLoading(true);
    githubRepoService
      .getPullRequestDetails(repoId, prNumber)
      .then(setPr)
      .catch(() => toast.error("Error loading the PR"))
      .finally(() => setLoading(false));
  }, [repoId, prNumber]);

  useEffect(() => {
    if (pr && pr.id) {
      axios
        .get(`${REVIEW_API_URL}/reviews`, {
          params: { source: "github", id: pr.id },
        })
        .then((res) => {
          if (res.data && res.data.reviews) {
            setHasAiReview(true);
          }
        })
        .catch(() => setHasAiReview(false));
    }
  }, [pr]);

  const handleReview = async () => {
    if (!pr || !pr.id) {
      toast.error("Cannot start review, ID is missing.");
      return;
    }

    setReviewLoading(true);
    try {
      const response = await axios.post(`${REVIEW_API_URL}/review`, {
        source: "github",
        id: pr.id,
      });

      const data = response.data;

      if (data.status === "already_reviewed") {
        toast.info("This PR has already been reviewed by the AI.");
      } else {
        toast.success("AI review completed.");
      }

      setHasAiReview(true);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Error during the review";
      toast.error(errorMessage);
      console.error("Review error:", error);
    } finally {
      setReviewLoading(false);
    }
  };

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
        ← Back
      </Button>

      <Title level={3}>Pull Request #{pr.number}</Title>

      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleReview} loading={reviewLoading}>
          🔍 Review with AI
        </Button>

        {hasAiReview && (
          <Button
            type="default"
            onClick={() => navigate(`/github/reviews/${pr.id}`)}
            style={{ marginLeft: 12 }}
          >
            📄 View AI Details
          </Button>
        )}
      </div>

      <Descriptions bordered column={1} size="middle" className="mb-6">
        <Descriptions.Item label="Title">
          <Tag color="blue">{pr.title}</Tag>
        </Descriptions.Item>

        <Descriptions.Item label="State">
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

        <Descriptions.Item label="Author">
          <Tag color="cyan">{pr.user_login}</Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Created At">
          <Tag color="default">
            {new Date(pr.created_at).toLocaleString()}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Merged At">
          <Tag color={pr.merged_at ? "success" : "default"}>
            {pr.merged_at
              ? new Date(pr.merged_at).toLocaleString()
              : "Not merged"}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Description">
          {pr.body ? (
            <Typography.Paragraph>{pr.body}</Typography.Paragraph>
          ) : (
            <Tag color="warning">No description</Tag>
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
                  description={`Author: ${commit.author_name} · SHA: ${commit.sha}`}
                />
              </List.Item>
            )}
          />
        </Panel>

        <Panel header={`Changed Files (${pr.files?.length || 0})`} key="files">
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
                    <pre style={{ margin: 0 }}>
                      {file.patch || "No diff available."}
                    </pre>
                  </code>
                </div>
              </Panel>
            ))}
          </Collapse>
        </Panel>

        <Panel header={`Review Comments (${pr.reviews?.length || 0})`} key="reviews">
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
                  description={review.body || "No comment"}
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
