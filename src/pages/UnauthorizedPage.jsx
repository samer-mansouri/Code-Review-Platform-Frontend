import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <Result
        status="403"
        title="403 - Access Denied"
        subTitle="You do not have the necessary permissions to access this page."
        extra={
          <Button type="primary" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        }
        style={{ background: "white", padding: 24, borderRadius: 8 }}
      />
    </div>
  );
};

export default UnauthorizedPage;
