import { useContext, useEffect, useState } from 'react';
import { Avatar, Breadcrumb, Dropdown, Layout, Menu } from 'antd';
// import logo from '../assets/logo-white.png';
// import profilePic from '../assets/profile-pic.webp';
import MenuComponent from '../components/Menu/MenuComponent';
import { menuItems } from '../routes/routes';
import { useLocation, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import avatar from '../assets/avatar.png';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { UserContext } from "../contexts/UserContext";

const { Header, Sider, Content, Footer } = Layout;

const MainLayout = ({ children }) => {
  const logout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const [breadCrumb, setBreadCrumb] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useContext(UserContext);
  const fullName = user?.first_name && user?.last_name
    ? `${user.first_name} ${user.last_name}`
    : "User";

  const profilePicture = user?.profile_picture || avatar;

  const extractBreadCrumb = (menuItems) => {
    const path = window.location.pathname;
    const pathArray = path.split('/').filter((p) => p);
    const breadCrumb = [];

    const findBreadcrumb = (items, pathSegments, currentIndex) => {
      if (currentIndex >= pathSegments.length) return true;

      const segment = pathSegments[currentIndex];
      for (const item of items) {
        if (item.children) {
          if (item.children.some((child) => child.path === `/${segment}`)) {
            breadCrumb.push(item);
            const childItem = item.children.find(
              (child) => child.path === `/${segment}`
            );
            if (childItem) {
              breadCrumb.push(childItem);
              if (findBreadcrumb(item.children, pathSegments, currentIndex + 1)) {
                return true;
              }
            }
          }
        }
      }
      return false;
    };

    findBreadcrumb(menuItems, pathArray, 0);
    return breadCrumb;
  };

  useEffect(() => {
    const breadCrumb = extractBreadCrumb(menuItems);
    setBreadCrumb(breadCrumb);
  }, [location]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <a href="#" className="text-lg flex items-center space-x-2">
          <span className="text-white capitalize">CODE REVIEW PLATFORM</span>
        </a>
        <div className="flex ml-auto items-center space-x-2">
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  key="profile"
                  icon={<UserOutlined />}
                  onClick={() => navigate("/profile")}
                >
                  Profile
                </Menu.Item>
                <Menu.Item
                  key="logout"
                  icon={<LogoutOutlined />}
                  onClick={logout}
                >
                  Logout
                </Menu.Item>
              </Menu>
            }
            trigger={['click']}
          >
            <div className="flex items-center space-x-2 cursor-pointer">
              <Avatar src={profilePicture} className="ml-auto" />
              <div className="text-white text-sm">
                <div className="text-white text-sm">{fullName}</div>
              </div>
            </div>
          </Dropdown>
        </div>
      </Header>

      <div className="w-full bg-white" style={{ height: '1px' }} />

      <Layout>
        <Sider>
          <MenuComponent />
        </Sider>

        <Layout style={{ padding: '24px 24px' }}>
          <Breadcrumb className="mt-2 mb-2">
            {breadCrumb.map((item, index) => (
              <Breadcrumb.Item key={index}>{item.label}</Breadcrumb.Item>
            ))}
          </Breadcrumb>

          <Content className="bg-white rounded-sm">
            <div
              style={{
                marginLeft: 24,
                minHeight: 240,
                paddingRight: 24,
                paddingTop: 16,
              }}
            >
              {/* {children} */}
              <Outlet />
            </div>
          </Content>

          {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2024 Created by Ant UED</Footer> */}
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
