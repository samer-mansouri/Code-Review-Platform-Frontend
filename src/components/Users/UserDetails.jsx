import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Descriptions, Spin, Tag, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import usersService from "../../services/usersService";

function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    usersService
      .get(id)
      .then((res) => {
        setUser(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error while loading developer:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading || !user) {
    return <Spin size="large" />;
  }

  return (
    <Card
      title={
        <div className="flex items-center gap-3">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <span>
            Developer Details - {user.first_name} {user.last_name}
          </span>
        </div>
      }
      style={{ margin: "0 auto" }}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="First Name">{user.first_name}</Descriptions.Item>
        <Descriptions.Item label="Last Name">{user.last_name}</Descriptions.Item>
        <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
        <Descriptions.Item label="Role">
          <Tag
            color={
              user.role === "admin"
                ? "red"
                : user.role === "developer"
                ? "blue"
                : "green"
            }
          >
            {user.role.toUpperCase()}
          </Tag>
        </Descriptions.Item>
        {user.created_at && (
          <Descriptions.Item label="Created At">
            {new Date(user.created_at).toLocaleString()}
          </Descriptions.Item>
        )}
        {user.updated_at && (
          <Descriptions.Item label="Updated At">
            {new Date(user.updated_at).toLocaleString()}
          </Descriptions.Item>
        )}
      </Descriptions>
    </Card>
  );
}

export default UserDetails;
