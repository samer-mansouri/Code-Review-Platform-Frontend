import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <Result
        status="403"
        title="403 - Accès refusé"
        subTitle="Vous n'avez pas les autorisations nécessaires pour accéder à cette page."
        extra={
          <Button type="primary" onClick={() => navigate(-1)}>
            Retour
          </Button>
        }
        style={{ background: "white", padding: 24, borderRadius: 8 }}
      />
    </div>
  );
};

export default UnauthorizedPage;
