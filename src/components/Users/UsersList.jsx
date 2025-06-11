import { useEffect, useState } from 'react';
import { Table, Input, Button, Spin, Space, Modal, Tag } from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined
} from '@ant-design/icons';
import usersService from '../../services/usersService';
import AddUserDrawer from './AddUserDrawer';
import UpdateUserDrawer from './UpdateUserDrawer';
import { useNavigate } from 'react-router-dom';

const { confirm } = Modal;

const UsersList = () => {
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [updateDrawerVisible, setUpdateDrawerVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchData = () => {
  setLoading(true);
  usersService.getAll()
    .then(response => {
      console.log(response);
      setData(response); // response is the users array
    })
    .catch(error => {
      console.log(error);
    })
    .finally(() => {
      setLoading(false);
    });
};


  useEffect(() => {
    fetchData();
  }, []);

  const showDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  const showUpdateDrawer = (user) => {
    setSelectedUser(user);
    setUpdateDrawerVisible(true);
  };
  const closeUpdateDrawer = () => {
    setSelectedUser(null);
    setUpdateDrawerVisible(false);
  };

  const handleUpdatedUser = (updatedUser) => {
    const updatedData = data.map(user =>
      user.id === updatedUser.id ? updatedUser : user
    );
    setData(updatedData);
  };

  const handleDelete = (record) => {
    confirm({
      title: 'Are you sure you want to delete this user?',
      content: `User: ${record.first_name} ${record.last_name}`,
      icon: <DeleteOutlined style={{ color: 'red' }} />,
      onOk() {
        usersService.delete(record.id)
          .then(() => {
            const updatedData = data.filter(user => user.id !== record.id);
            setData(updatedData);
          })
          .catch(error => {
            console.log('Error deleting user:', error);
          });
      },
      onCancel() {
        console.log('Cancelled delete');
      },
    });
  };

  const handleNewEntry = (newEntry) => {
    setData([newEntry, ...data]);
  };

  const columns = [
    {
      title: 'First Name',
      dataIndex: 'first_name',
      key: 'first_name',
      sorter: (a, b) => a.first_name.localeCompare(b.first_name),
    },
    {
      title: 'Last Name',
      dataIndex: 'last_name',
      key: 'last_name',
      sorter: (a, b) => a.last_name.localeCompare(b.last_name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'red' : 'blue'}>{role.toUpperCase()}</Tag>
      ),
      sorter: (a, b) => a.role.localeCompare(b.role),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="default"
            icon={<UserOutlined />}
            onClick={() => navigate(`/users/${record.id}`)}
          >
            Details
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showUpdateDrawer(record)}
          >
            Update
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const filteredData = data.filter(item =>
    Object.keys(item).some(key =>
      item[key]?.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white opacity-75 z-10">
          <Spin size="large" />
        </div>
      )}

      <h1 className="text-lg font-semibold mb-4">Users List</h1>

      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search users..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
          prefix={<SearchOutlined />}
        />
        <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
          Add new user
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        bordered
      />

      <AddUserDrawer
        visible={drawerVisible}
        onClose={closeDrawer}
        onAddDemand={handleNewEntry}
      />

      <UpdateUserDrawer
        visible={updateDrawerVisible}
        onClose={closeUpdateDrawer}
        userData={selectedUser}
        onUpdateDemand={handleUpdatedUser}
      />
    </div>
  );
};

export default UsersList;
