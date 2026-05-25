import { Layout, Badge, Avatar, Dropdown, Space } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'

const { Header: AntHeader } = Layout

interface HeaderProps {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

const userMenuItems: MenuProps['items'] = [
  {
    key: 'profile',
    icon: <UserOutlined />,
    label: '个人中心',
  },
  {
    key: 'settings',
    icon: <SettingOutlined />,
    label: '系统设置',
  },
  {
    type: 'divider',
  },
  {
    key: 'logout',
    icon: <LogoutOutlined />,
    label: '退出登录',
  },
]

const Header = ({ collapsed, setCollapsed }: HeaderProps) => {
  return (
    <AntHeader className="site-header">
      <div className="header-left">
        <span
          className="trigger"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </span>
      </div>
      <div className="header-right">
        <Badge count={5} size="small">
          <BellOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
        </Badge>
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Space style={{ cursor: 'pointer' }}>
            <Avatar icon={<UserOutlined />} />
            <span>管理员</span>
          </Space>
        </Dropdown>
      </div>
    </AntHeader>
  )
}

export default Header
