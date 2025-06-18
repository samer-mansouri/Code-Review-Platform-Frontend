import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { menuItems } from '../../routes/routes';

const MenuComponent = () => {
  const role = localStorage.getItem('role');

  const filterMenuByRole = (items) => {
    if (!role) return []; // fallback guard
    return items
      .filter((item) => !item.roles || item.roles.includes(role))
      .map((item) => ({
        ...item,
        children: item.children ? filterMenuByRole(item.children) : undefined,
      }));
  };

  const renderMenuItems = (items) =>
    items.map((item) =>
      item.children ? (
        <Menu.SubMenu key={item.key} title={item.label} icon={item.icon && <item.icon />}>
          {renderMenuItems(item.children)}
        </Menu.SubMenu>
      ) : (
        <Menu.Item key={item.key} icon={item.icon && <item.icon />}>
          <Link to={item.path}>{item.label}</Link>
        </Menu.Item>
      )
    );

  const filteredItems = filterMenuByRole(menuItems);

  return (
    <Menu
      mode="inline"
      theme="light"
      defaultSelectedKeys={[]}
      defaultOpenKeys={[]}
      style={{
        height: '100%',
        borderRight: 0,
        paddingTop: 20,
      }}
    >
      {renderMenuItems(filteredItems)}
    </Menu>
  );
};

export default MenuComponent;
