import {
  Card,
  Descriptions,
  Tag,
  Typography,
  Spin,
  Button,
  Drawer,
  Form,
  Input,
  message,
  Upload,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import userDataService from "../../services/userDataService";
import { UserContext } from "../../contexts/UserContext";
import avatar from '../../assets/avatar.png';


const { Title } = Typography;

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [passwordDrawerOpen, setPasswordDrawerOpen] = useState(false);

  const [form] = Form.useForm();
  const [pwdForm] = Form.useForm();

  const { setUser } = useContext(UserContext);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = () => {
    userDataService
      .getProfile()
      .then((res) => setProfile(res.user || res))
      .catch((err) => console.error("Failed to load profile", err))
      .finally(() => setLoading(false));
  };

  const handleProfileUpdate = async () => {
    try {
      const values = await form.validateFields();
      const res = await userDataService.updateProfile(values);

      localStorage.setItem("first_name", res.user.first_name);
      localStorage.setItem("last_name", res.user.last_name);
      setUser({
        first_name: res.user.first_name,
        last_name: res.user.last_name,
        profile_picture: res.user.profile_picture || "",
      });

      message.success("Profile updated successfully");
      setEditDrawerOpen(false);
      fetchProfile();
    } catch (error) {
      message.error(error.toString());
    }
  };

  const handlePasswordChange = async () => {
    try {
      const values = await pwdForm.validateFields();
      await userDataService.changePassword(values);
      message.success("Password updated successfully");
      setPasswordDrawerOpen(false);
      pwdForm.resetFields();
    } catch (error) {
      message.error(error.toString());
    }
  };

  const handleProfilePictureUpload = async ({ file }) => {
    try {
      await userDataService.updateProfilePicture(file);
      message.success("Profile picture updated successfully");
      fetchProfile();
    } catch (err) {
      message.error(err.toString());
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <Title level={3} className="mb-4">
        <UserOutlined /> My Profile
      </Title>

      <Card bordered size="small">
        {profile.profile_picture && (
          <div className="mb-4 flex justify-center">
            <img
              src={profile.profile_picture || avatar}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border shadow"
            />
          </div>
        )}

        <Descriptions column={1} size="middle">
          <Descriptions.Item label="First Name">
            {profile.first_name}
          </Descriptions.Item>
          <Descriptions.Item label="Last Name">
            {profile.last_name}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            <MailOutlined style={{ marginRight: 8 }} />
            {profile.email}
          </Descriptions.Item>
          <Descriptions.Item label="Role">
            <Tag color={profile.role === "admin" ? "geekblue" : "green"}>
              {profile.role.toUpperCase()}
            </Tag>
          </Descriptions.Item>
        </Descriptions>

        <div className="mt-4 flex gap-2 flex-wrap">
          <Upload
            showUploadList={false}
            customRequest={({ file, onSuccess }) => {
              handleProfilePictureUpload({ file });
              setTimeout(() => onSuccess("ok"), 0);
            }}
          >
            <Button icon={<UploadOutlined />}>Change Profile Picture</Button>
          </Upload>

          <Button type="primary" onClick={() => setEditDrawerOpen(true)}>
            Edit Profile
          </Button>

          <Button onClick={() => setPasswordDrawerOpen(true)}>
            Change Password
          </Button>
        </div>
      </Card>

      {/* Profile Edit Drawer */}
      <Drawer
        title="Edit Profile"
        placement="right"
        open={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        width={360}
      >
        <Form layout="vertical" form={form} initialValues={profile}>
          <Form.Item
            label="First Name"
            name="first_name"
            rules={[
              { required: true, message: "Please enter your first name" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="last_name"
            rules={[
              { required: true, message: "Please enter your last name" },
            ]}
          >
            <Input />
          </Form.Item>

          <Button type="primary" onClick={handleProfileUpdate} block>
            Save Changes
          </Button>
        </Form>
      </Drawer>

      {/* Password Change Drawer */}
      <Drawer
        title="Change Password"
        placement="right"
        open={passwordDrawerOpen}
        onClose={() => setPasswordDrawerOpen(false)}
        width={360}
      >
        <Form layout="vertical" form={pwdForm}>
          <Form.Item
            label="Old Password"
            name="old_password"
            rules={[
              { required: true, message: "Please enter your old password" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="new_password"
            rules={[
              { required: true, message: "Please enter your new password" },
              { min: 6, message: "Minimum 6 characters" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Button type="primary" onClick={handlePasswordChange} block>
            Update Password
          </Button>
        </Form>
      </Drawer>
    </div>
  );
};

export default UserProfile;
