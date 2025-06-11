import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Descriptions, Tag, Typography, Collapse, List, Spin, Divider, Button } from 'antd';
import gitlabProjectService from '../../services/gitlabProjectService';
import { toast } from 'react-toastify';

const { Title } = Typography;
const { Panel } = Collapse;

const GitLabMergeRequestDetails = () => {
  const { projectId, mrIid } = useParams();
  const [mr, setMr] = useState(null);
  const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
const handleBack = () => navigate(-1);

  useEffect(() => {
    setLoading(true);
    gitlabProjectService
      .getMergeRequestDetails(projectId, mrIid)
      .then(setMr)
      .catch(() => toast.error('Erreur lors du chargement du MR'))
      .finally(() => setLoading(false));
  }, [projectId, mrIid]);

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
      ← Retour
    </Button>
      <Title level={3}>Merge Request #{mr.iid}</Title>

      <Descriptions bordered column={1} size="middle" className="mb-6">
  <Descriptions.Item label="Titre">
    <Tag color="blue">{mr.title}</Tag>
  </Descriptions.Item>

  <Descriptions.Item label="État">
    <Tag color={
      mr.state === 'merged' ? 'green' :
      mr.state === 'closed' ? 'red' :
      'blue'
    }>
      {mr.state}
    </Tag>
  </Descriptions.Item>

  <Descriptions.Item label="Statut de fusion">
    <Tag color={mr.merge_status === 'can_be_merged' ? 'green' : 'volcano'}>
      {mr.merge_status}
    </Tag>
  </Descriptions.Item>

  <Descriptions.Item label="Branches">
    <Tag color="geekblue">{mr.source_branch}</Tag> → <Tag color="purple">{mr.target_branch}</Tag>
  </Descriptions.Item>

  <Descriptions.Item label="Auteur">
    <Tag icon={<i className="fas fa-user" />} color="cyan">{mr.author}</Tag>
  </Descriptions.Item>

  <Descriptions.Item label="Créé le">
    <Tag color="default">{new Date(mr.created_at).toLocaleString()}</Tag>
  </Descriptions.Item>

  <Descriptions.Item label="Fusionné le">
    <Tag color={mr.merged_at ? 'success' : 'default'}>
      {mr.merged_at ? new Date(mr.merged_at).toLocaleString() : 'Non fusionné'}
    </Tag>
  </Descriptions.Item>

  <Descriptions.Item label="Description">
    {mr.description ? (
      <Typography.Paragraph>{mr.description}</Typography.Paragraph>
    ) : (
      <Tag color="warning">Aucune description</Tag>
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
                  description={`Auteur: ${commit.author_name} · SHA: ${commit.sha}`}
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
