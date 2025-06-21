import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Collapse, Typography, Tag, List, Spin, Alert, Button } from 'antd';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FileTextOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const severityColors = {
  critical: 'red',
  warning: 'orange',
  suggestion: 'blue',
  minor: 'default',
};

const AiReviewDetails = () => {
  const { source, prId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const REVIEW_API_URL = import.meta.env.VITE_REVIEW_API_URL;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${REVIEW_API_URL}/reviews`, {
          params: { source, id: prId },
        });
        setReviews(res.data.reviews || []);
      } catch (err) {
        setError('Failed to load AI review details.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [REVIEW_API_URL, source, prId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert message={error} type="error" showIcon />;
  }

  if (!reviews.length) {
    return (
      <Alert
        message="No AI review found for this request."
        type="info"
        showIcon
      />
    );
  }

  return (
    <div>
      <Button onClick={() => navigate(-1)} type="link" style={{ marginBottom: 16 }}>
        ← Back
      </Button>

      <Title level={3}>AI Review Analysis</Title>
      <Collapse accordion>
        {reviews.map((item, idx) => {
          const file = item?.file || `file_${idx}`;
          const review = item?.review;

          let parsed = null;

          try {
            parsed = typeof review === 'string' ? JSON.parse(review) : review;
          } catch {
            // fallback to markdown rendering
          }

          return (
            <Panel
              header={
                <span>
                  <FileTextOutlined /> <Text code>{parsed?.file || file}</Text>
                </span>
              }
              key={idx}
            >
              {parsed?.issues?.length ? (
                <List
                  itemLayout="vertical"
                  dataSource={parsed.issues}
                  renderItem={(issue, index) => (
                    <List.Item key={index}>
                      <Text strong>
                        <Tag color={severityColors[issue.severity] || 'default'}>
                          {issue.severity.toUpperCase()}
                        </Tag>{' '}
                        {issue.type}
                      </Text>
                      <Paragraph>
                        <Text strong>Message:</Text> {issue.message}
                      </Paragraph>
                      {issue.line_reference && (
                        <Paragraph>
                          <Text strong>Lines:</Text> {issue.line_reference}
                        </Paragraph>
                      )}
                      {issue.suggested_fix && (
                        <Paragraph>
                          <Text strong>Suggested Fix:</Text> {issue.suggested_fix}
                        </Paragraph>
                      )}
                    </List.Item>
                  )}
                />
              ) : parsed ? (
                <Paragraph>No remarks detected by AI for this file.</Paragraph>
              ) : (
                <ReactMarkdown
                  children={review}
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      return (
                        <pre
                          style={{
                            background: '#1e1e1e',
                            color: '#f8f8f2',
                            padding: '12px',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            overflowX: 'auto',
                            marginTop: '8px',
                          }}
                        >
                          <code {...props}>{children}</code>
                        </pre>
                      );
                    },
                    h3: ({ children }) => <Title level={4}>{children}</Title>,
                    h4: ({ children }) => <Title level={5}>{children}</Title>,
                    li: ({ children }) => (
                      <li style={{ marginBottom: '4px' }}>{children}</li>
                    ),
                  }}
                />
              )}

              {parsed?.summary && (
                <Paragraph className="mt-4">
                  <Text strong>Summary:</Text>{' '}
                  {Object.entries(parsed.summary).map(([key, val]) => (
                    <Tag key={key} color={severityColors[key] || 'default'}>
                      {key.toUpperCase()}: {val}
                    </Tag>
                  ))}
                </Paragraph>
              )}
            </Panel>
          );
        })}
      </Collapse>
    </div>
  );
};

export default AiReviewDetails;
