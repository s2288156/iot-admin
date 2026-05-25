import { useLocation, useNavigate } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import {
  DashboardOutlined,
  TeamOutlined,
  SafetyOutlined,
  MenuOutlined,
  DatabaseOutlined,
  ToolOutlined,
  RobotOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'

const { Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number]

interface SidebarProps {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

const menuItems: MenuItem[] = [
  {
    key: '/',
    icon: <DashboardOutlined />,
    label: '仪表盘',
  },
  {
    key: 'system',
    icon: <SafetyOutlined />,
    label: '系统管理',
    children: [
      { key: '/system/users', label: '用户管理' },
      { key: '/system/roles', label: '角色权限' },
      { key: '/system/menus', label: '菜单管理' },
    ],
  },
  {
    key: 'wcs',
    icon: <DatabaseOutlined />,
    label: '仓库控制 (WCS)',
    children: [
      { key: '/wcs', label: '仓库概览' },
      { key: '/wcs/tasks', label: '任务管理' },
      { key: '/wcs/inventory', label: '库存管理' },
      { key: '/wcs/locations', label: '库位管理' },
    ],
  },
  {
    key: 'ecs',
    icon: <ToolOutlined />,
    label: '设备控制 (ECS)',
    children: [
      { key: '/ecs', label: '设备监控' },
      { key: '/ecs/list', label: '设备列表' },
      { key: '/ecs/alarms', label: '故障告警' },
      { key: '/ecs/maintenance', label: '维护记录' },
    ],
  },
  {
    key: 'rcs',
    icon: <RobotOutlined />,
    label: '机器人控制 (RCS)',
    children: [
      { key: '/rcs', label: '机器人调度' },
      { key: '/rcs/tasks', label: '任务分配' },
      { key: '/rcs/paths', label: '路径规划' },
      { key: '/rcs/stats', label: '性能统计' },
    ],
  },
]

const Sidebar = ({ collapsed, setCollapsed }: SidebarProps) => {
  const location = useLocation()
  const navigate = useNavigate()

  const selectedKeys = [location.pathname]
  const openKeys = location.pathname.split('/')[1]

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key)
  }

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={200}
      className="sidebar"
      theme="light"
    >
      <div className="sidebar-logo">
        <h1>{collapsed ? 'WA' : 'React Admin'}</h1>
      </div>
      <Menu
        mode="inline"
        selectedKeys={selectedKeys}
        defaultOpenKeys={openKeys ? [openKeys] : []}
        items={menuItems}
        onClick={handleMenuClick}
        style={{ borderRight: 0 }}
      />
    </Sider>
  )
}

export default Sidebar
