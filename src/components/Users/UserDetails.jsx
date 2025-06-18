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
        console.error("Erreur lors du chargement du Développeur:", err);
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
            Retour
          </Button>
          <span>
            Détails du Développeur - {user.first_name} {user.last_name}
          </span>
        </div>
      }
      style={{ margin: "0 auto" }}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Prénom">{user.first_name}</Descriptions.Item>
        <Descriptions.Item label="Nom">{user.last_name}</Descriptions.Item>
        <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
        <Descriptions.Item label="Rôle">
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
          <Descriptions.Item label="Créé le">
            {new Date(user.created_at).toLocaleString()}
          </Descriptions.Item>
        )}
        {user.updated_at && (
          <Descriptions.Item label="Mis à jour le">
            {new Date(user.updated_at).toLocaleString()}
          </Descriptions.Item>
        )}
      </Descriptions>
    </Card>
  );
}

export default UserDetails;
