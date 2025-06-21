import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Descriptions, Tag, Typography, Collapse, List, Spin, Divider, Button } from 'antd';
import gitlabProjectService from '../../services/gitlabProjectService';
import { toast } from 'react-toastify';
import axios from 'axios';

const { Title } = Typography;
const { Panel } = Collapse;

const GitLabMergeRequestDetails = () => {
  const { projectId, mrIid } = useParams();
  const [mr, setMr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [hasAiReview, setHasAiReview] = useState(false);
  const navigate = useNavigate();

  const REVIEW_API_URL = import.meta.env.VITE_REVIEW_API_URL;

  const handleBack = () => navigate(-1);

  useEffect(() => {
    setLoading(true);
    gitlabProjectService
      .getMergeRequestDetails(projectId, mrIid)
      .then(setMr)
      .catch(() => toast.error('Error loading the merge request.'))
      .finally(() => setLoading(false));
  }, [projectId, mrIid]);

  useEffect(() => {
    if (mr && mr.id) {
      axios
        .get(`${REVIEW_API_URL}/reviews`, {
          params: { source: "gitlab", id: mr.id }
        })
        .then((res) => {
          if (res.data && res.data.reviews) {
            setHasAiReview(true);
          }
        })
        .catch(() => setHasAiReview(false));
    }
  }, [mr]);

  const handleReview = async () => {
    if (!mr || !mr.id) {
      toast.error("Unable to start review: missing ID.");
      return;
    }

    setReviewLoading(true);
    try {
      const response = await axios.post(`${REVIEW_API_URL}/review`, {
        source: "gitlab",
        id: mr.id
      });

      const data = response.data;

      if (data.status === "already_reviewed") {
        toast.info("This merge request has already been reviewed.");
      } else {
        toast.success("AI review completed.");
      }

      setHasAiReview(true);
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Error during the review.";
      toast.error(errorMessage);
      console.error("Review error:", error);
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading || !mr) {
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

      <Title level={3}>Merge Request #{mr.iid}</Title>

      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          onClick={handleReview}
          loading={reviewLoading}
        >
          🔍 Review with AI
        </Button>

        {hasAiReview && (
          <Button
            type="default"
            onClick={() => navigate(`/gitlab/reviews/${mr.id}`)}
            style={{ marginLeft: 12 }}
          >
            📄 View AI Review
          </Button>
        )}
      </div>

      <Descriptions bordered column={1} size="middle" className="mb-6">
        <Descriptions.Item label="Title">
          <Tag color="blue">{mr.title}</Tag>
        </Descriptions.Item>

        <Descriptions.Item label="State">
          <Tag color={
            mr.state === 'merged' ? 'green' :
            mr.state === 'closed' ? 'red' :
            'blue'
          }>
            {mr.state}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Merge Status">
          <Tag color={mr.merge_status === 'can_be_merged' ? 'green' : 'volcano'}>
            {mr.merge_status}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Branches">
          <Tag color="geekblue">{mr.source_branch}</Tag> → <Tag color="purple">{mr.target_branch}</Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Author">
          <Tag color="cyan">{mr.author}</Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Created At">
          <Tag color="default">{new Date(mr.created_at).toLocaleString()}</Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Merged At">
          <Tag color={mr.merged_at ? 'success' : 'default'}>
            {mr.merged_at ? new Date(mr.merged_at).toLocaleString() : 'Not merged'}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Description">
          {mr.description ? (
            <Typography.Paragraph>{mr.description}</Typography.Paragraph>
          ) : (
            <Tag color="warning">No description</Tag>
          )}
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <Collapse defaultActiveKey={['commits']}>
        <Panel header={`Commits (${mr.commits.length})`} key="commits">
          <List
            dataSource={mr.commits}
            renderItem={(commit) => (
              <List.Item>
                <List.Item.Meta
                  title={<b>{commit.title || commit.message}</b>}
                  description={`Author: ${commit.author_name} · SHA: ${commit.sha}`}
                />
              </List.Item>
            )}
          />
        </Panel>

        <Panel header={`Diffs (${mr.diffs.length})`} key="diffs">
          <Collapse accordion>
            {mr.diffs.map((diff, index) => (
              <Panel
                header={`${diff.old_path} → ${diff.new_path}`}
                key={index}
                style={{ background: '#fafafa', borderRadius: 4 }}
              >
                <div
                  style={{
                    backgroundColor: '#1e1e1e',
                    color: '#f8f8f2',
                    padding: '12px',
                    borderRadius: '6px',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    overflowX: 'auto',
                    maxHeight: 400,
                  }}
                >
                  <code>
                    <pre style={{ margin: 0 }}>{diff.diff}</pre>
                  </code>
                </div>
              </Panel>
            ))}
          </Collapse>
        </Panel>
      </Collapse>
    </div>
  );
};

export default GitLabMergeRequestDetails;
