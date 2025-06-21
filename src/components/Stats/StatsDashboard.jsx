import React, { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Typography, Spin, message } from "antd";
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid
} from "recharts";
import statsService from "../../services/statsService";

const { Title } = Typography;
const COLORS = ["#1890ff", "#f5222d", "#52c41a", "#faad14"];

const StatsDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [ghRatio, setGhRatio] = useState(null);
  const [glRatio, setGlRatio] = useState(null);
  const [ghMonthly, setGhMonthly] = useState([]);
  const [glMonthly, setGlMonthly] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          overviewData,
          ghRatioData,
          glRatioData,
          ghMonthlyData,
          glMonthlyData,
        ] = await Promise.all([
          statsService.getOverview(),
          statsService.getGitHubMergeRatio(),
          statsService.getGitLabMergeRatio(),
          statsService.getGitHubPRsMonthly(),
          statsService.getGitLabMRsMonthly(),
        ]);

        setOverview(overviewData);
        setGhRatio(ghRatioData);
        setGlRatio(glRatioData);
        setGhMonthly(ghMonthlyData);
        setGlMonthly(glMonthlyData);
      } catch (err) {
        console.error("Error loading statistics:", err);
        message.error("Failed to load statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatPieData = (source, type = "github") => {
    if (!source) return [];

    const base = [
      { name: "Merged", value: source.merged ?? 0 },
      { name: "Closed", value: source.closed ?? 0 },
      { name: "Open", value: source.open ?? 0 },
    ];

    if (type === "gitlab" && source.conflict !== undefined) {
      base.push({ name: "Conflict", value: source.conflict ?? 0 });
    }

    return base.filter(d => d.value > 0);
  };

  if (loading || !overview || !ghRatio || !glRatio) return <Spin size="large" />;

  return (
    <>
      <Title level={2} style={{ marginBottom: 24 }}>Statistics</Title>

      <Row gutter={16}>
        <Col span={6}><Card><Statistic title="GitHub Repositories" value={overview.github.repo_count} /></Card></Col>
        <Col span={6}><Card><Statistic title="GitHub PRs" value={overview.github.pull_request_count} /></Card></Col>
        <Col span={6}><Card><Statistic title="GitLab Projects" value={overview.gitlab.project_count} /></Card></Col>
        <Col span={6}><Card><Statistic title="GitLab MRs" value={overview.gitlab.merge_request_count} /></Card></Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 32 }}>
        <Col span={12}>
          <Card title="GitHub PR Distribution" bodyStyle={{ display: 'flex', justifyContent: 'center' }}>
            <PieChart width={400} height={320}>
              <Pie
                data={formatPieData(ghRatio)}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {formatPieData(ghRatio).map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
              <Legend layout="horizontal" verticalAlign="bottom" />
            </PieChart>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="GitLab MR Distribution" bodyStyle={{ display: 'flex', justifyContent: 'center' }}>
            <PieChart width={350} height={300}>
              <Pie
                data={formatPieData(glRatio, "gitlab")}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {formatPieData(glRatio, "gitlab").map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </Card>
        </Col>
      </Row>

      {/* Uncomment the section below if you want to enable monthly line charts */}
      {/* 
      <Row gutter={16} style={{ marginTop: 32 }}>
        <Col span={12}>
          <Card title="GitHub PRs per Month">
            <LineChart width={500} height={300} data={ghMonthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#1890ff" />
            </LineChart>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="GitLab MRs per Month">
            <LineChart width={500} height={300} data={glMonthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#52c41a" />
            </LineChart>
          </Card>
        </Col>
      </Row> 
      */}
    </>
  );
};

export default StatsDashboard;
