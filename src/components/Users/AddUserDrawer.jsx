import { Drawer, Form, Button, Col, Row, Input as AntInput } from 'antd';
import usersService from '../../services/usersService';
import { useState } from 'react';
import { toast } from 'react-toastify';

const AddUserDrawer = ({ visible, onClose, onAddDemand }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);

    // Force the role to 'developer'
    const payload = { ...values, role: 'developer' };

    usersService.create(payload)
      .then((response) => {
        onAddDemand(response);
        toast.success("Developer added successfully", {
          position: "top-right",
          autoClose: 2000,
        });
      })
      .catch((error) => {
        console.error("Error while adding:", error);
        toast.error("Error while creating the developer");
      })
      .finally(() => {
        setLoading(false);
        form.resetFields();
        onClose();
      });
  };

  return (
    <Drawer
      title="Add Developer"
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
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please enter the password" }]}
            >
              <AntInput.Password placeholder="Enter password" />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }} disabled={loading}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Add
          </Button>
        </div>
      </Form>
    </Drawer>
  );
};

export default AddUserDrawer;
