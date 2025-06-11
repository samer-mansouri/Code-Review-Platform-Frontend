import { GithubOutlined, GitlabOutlined, UserOutlined } from '@ant-design/icons';
import { DatabaseOutlined } from '@ant-design/icons';
import { ApiOutlined } from '@ant-design/icons';
export const menuItems = [
    {
        key: 'users',
        label: 'Users',
        path : '/users',
        icon: UserOutlined,
    },
    {
        key: 'tokens',
        label: 'Tokens',
        path : '/tokens',
        icon: ApiOutlined,
    },
    {
        key: 'gitlab',
        label: 'GitLab',
        path : '/gitlab',
        icon: GitlabOutlined,
    },
    {
        key: 'github',
        label: 'GitHub',
        path : '/github',
        icon: GithubOutlined,
    }
    // {
    //     key: 'dl_models',
    //     label: 'DL Models',
    //     icon: DatabaseOutlined,
    //     children: [
    //         {
    //             key: 'segmentation',
    //             label: 'Segmentation',
    //             path : '/models',
    //         },
    //         {
    //             key: 'image_captioning',
    //             label: 'Image captioning',
    //             path : '/image',
    //         }
    //     ]
    // },
];