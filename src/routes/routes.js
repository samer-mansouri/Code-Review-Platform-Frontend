import {
  DashboardOutlined,
  GithubOutlined,
  GitlabOutlined,
  UserOutlined,
  ApiOutlined,
} from '@ant-design/icons';

export const menuItems = [
  {
    key: 'stats',
    label: 'Statistiques',
    path: '/stats',
    icon: DashboardOutlined,
    roles: ['admin'],
  },
  {
    key: 'users',
    label: 'Développeurs',
    path: '/users',
    icon: UserOutlined,
    roles: ['admin'],
  },
  {
    key: 'tokens',
    label: 'Tokens',
    path: '/tokens',
    icon: ApiOutlined,
    roles: ['developer'],
  },
  {
    key: 'gitlab',
    label: 'GitLab',
    path: '/gitlab',
    icon: GitlabOutlined,
    roles: ['developer'],
  },
  {
    key: 'github',
    label: 'GitHub',
    path: '/github',
    icon: GithubOutlined,
    roles: ['developer'],
  },
];
