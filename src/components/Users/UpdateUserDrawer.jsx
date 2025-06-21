import { Drawer, Form, Button, Col, Row, Input as AntInput } from 'antd';
import usersService from '../../services/usersService';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const UpdateUserDrawer = ({ visible, onClose, userData, onUpdateDemand }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      form.setFieldsValue({
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
      });
    }
  }, [userData, form]);

  const onFinish = (values) => {
    setLoading(true);

    const payload = {
      ...values,
      role: 'developer', // Force developer role
    };

    if (!payload.password) {
      delete payload.password;
    }

    usersService.update(userData.id, payload)
      .then((response) => {
        onUpdateDemand(response);
        toast.success("Developer updated successfully");
      })
      .catch((error) => {
        console.error("Error while updating:", error);
        toast.error("Error while updating the developer");
      })
      .finally(() => {
        setLoading(false);
        onClose();
      });
  };

  return (
    <Drawer
      title="Update Developer"
      onClose={onClose}
      visible={visible}
      bodyStyle={{ paddingBottom: 40 }}
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name="first_name"
              label="First Name"
              rules={[{ required: true, message: "Please enter the first name" }]}
            >
              <AntInput placeholder="Enter first name" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="last_name"
              label="Last Name"
              rules={[{ required: true, message: "Please enter the last name" }]}
            >
              <AntInput placeholder="Enter last name" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter the email" },
                { type: "email", message: "Invalid email" },
              ]}
            >
              <AntInput placeholder="Enter email" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="password" label="Password (optional)">
              <AntInput.Password placeholder="Leave empty to keep current password" />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }} disabled={loading}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update
          </Button>
        </div>
      </Form>
    </Drawer>
  );
};

export default UpdateUserDrawer;
