import { useState } from 'react'
import {
  Card,
  Tree,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Radio,
  message,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MenuOutlined,
  DashboardOutlined,
  SafetyOutlined,
  DatabaseOutlined,
  ToolOutlined,
  RobotOutlined,
} from '@ant-design/icons'
import type { DataNode } from 'antd/es/tree'

const { Option } = Select

interface MenuItem {
  id: string
  title: string
  key: string
  icon?: string
  path?: string
  type: 'directory' | 'menu'
  parentId?: string
  sort: number
  status: boolean
  children?: MenuItem[]
}

const iconMap: Record<string, React.ReactNode> = {
  DashboardOutlined: <DashboardOutlined />,
  SafetyOutlined: <SafetyOutlined />,
  DatabaseOutlined: <DatabaseOutlined />,
  ToolOutlined: <ToolOutlined />,
  RobotOutlined: <RobotOutlined />,
  MenuOutlined: <MenuOutlined />,
}

const mockMenus: MenuItem[] = [
  {
    id: '1',
    title: '仪表盘',
    key: 'dashboard',
    icon: 'DashboardOutlined',
    path: '/',
    type: 'menu',
    sort: 1,
    status: true,
  },
  {
    id: '2',
    title: '系统管理',
    key: 'system',
    icon: 'SafetyOutlined',
    type: 'directory',
    sort: 2,
    status: true,
    children: [
      {
        id: '2-1',
        title: '用户管理',
        key: 'system-users',
        path: '/system/users',
        type: 'menu',
        parentId: '2',
        sort: 1,
        status: true,
      },
      {
        id: '2-2',
        title: '角色权限',
        key: 'system-roles',
        path: '/system/roles',
        type: 'menu',
        parentId: '2',
        sort: 2,
        status: true,
      },
      {
        id: '2-3',
        title: '菜单管理',
        key: 'system-menus',
        path: '/system/menus',
        type: 'menu',
        parentId: '2',
        sort: 3,
        status: true,
      },
    ],
  },
  {
    id: '3',
    title: '仓库控制',
    key: 'wcs',
    icon: 'DatabaseOutlined',
    type: 'directory',
    sort: 3,
    status: true,
    children: [
      {
        id: '3-1',
        title: '仓库概览',
        key: 'wcs-overview',
        path: '/wcs',
        type: 'menu',
        parentId: '3',
        sort: 1,
        status: true,
      },
    ],
  },
]

const MenuManagement = () => {
  const [menus, setMenus] = useState<MenuItem[]>(mockMenus)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null)
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null)
  const [form] = Form.useForm()

  const convertToTreeData = (items: MenuItem[]): DataNode[] => {
    return items.map(item => ({
      title: (
        <Space>
          {item.icon && iconMap[item.icon]}
          <span>{item.title}</span>
          <span style={{ color: '#8c8c8c', fontSize: 12 }}>
            {item.path || '(目录)'}
          </span>
        </Space>
      ),
      key: item.id,
      children: item.children ? convertToTreeData(item.children) : undefined,
    }))
  }

  const handleAdd = (parentId?: string) => {
    setEditingMenu(null)
    form.resetFields()
    if (parentId) {
      form.setFieldsValue({ parentId, type: 'menu' })
    }
    setIsModalOpen(true)
  }

  const handleEdit = (menu: MenuItem) => {
    setEditingMenu(menu)
    form.setFieldsValue(menu)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该菜单吗？子菜单也会被一并删除。',
      onOk: () => {
        const deleteMenu = (items: MenuItem[]): MenuItem[] => {
          return items.filter(item => {
            if (item.id === id) return false
            if (item.children) {
              item.children = deleteMenu(item.children)
            }
            return true
          })
        }
        setMenus(deleteMenu(menus))
        message.success('删除成功')
      },
    })
  }

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingMenu) {
        const updateMenu = (items: MenuItem[]): MenuItem[] => {
          return items.map(item => {
            if (item.id === editingMenu.id) {
              return { ...item, ...values }
            }
            if (item.children) {
              return { ...item, children: updateMenu(item.children) }
            }
            return item
          })
        }
        setMenus(updateMenu(menus))
        message.success('更新成功')
      } else {
        const newMenu: MenuItem = {
          ...values,
          id: String(Date.now()),
          key: values.title,
          sort: 1,
          status: true,
        }
        
        if (values.parentId) {
          const addToParent = (items: MenuItem[]): MenuItem[] => {
            return items.map(item => {
              if (item.id === values.parentId) {
                return {
                  ...item,
                  children: [...(item.children || []), newMenu],
                }
              }
              if (item.children) {
                return { ...item, children: addToParent(item.children) }
              }
              return item
            })
          }
          setMenus(addToParent(menus))
        } else {
          setMenus([...menus, newMenu])
        }
        message.success('创建成功')
      }
      setIsModalOpen(false)
    })
  }

  const treeData = convertToTreeData(menus)

  return (
    <div className="menu-management">
      <Card
        title="菜单管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAdd()}>
            新增菜单
          </Button>
        }
      >
        <div style={{ marginBottom: 16 }}>
          <Button
            size="small"
            onClick={() => selectedMenu && handleAdd(selectedMenu)}
            disabled={!selectedMenu}
          >
            添加子菜单
          </Button>
          <Button
            size="small"
            style={{ marginLeft: 8 }}
            onClick={() => selectedMenu && handleEdit(findMenuById(menus, selectedMenu)!)}
            disabled={!selectedMenu}
          >
            编辑
          </Button>
          <Button
            size="small"
            danger
            style={{ marginLeft: 8 }}
            onClick={() => selectedMenu && handleDelete(selectedMenu)}
            disabled={!selectedMenu}
          >
            删除
          </Button>
        </div>
        <Tree
          treeData={treeData}
          selectedKeys={selectedMenu ? [selectedMenu] : []}
          onSelect={(keys) => setSelectedMenu(keys[0] as string)}
          defaultExpandAll
        />
      </Card>

      <Modal
        title={editingMenu ? '编辑菜单' : '新增菜单'}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="title"
            label="菜单名称"
            rules={[{ required: true, message: '请输入菜单名称' }]}
          >
            <Input placeholder="请输入菜单名称" />
          </Form.Item>
          <Form.Item
            name="type"
            label="菜单类型"
            rules={[{ required: true }]}
          >
            <Radio.Group>
              <Radio value="directory">目录</Radio>
              <Radio value="menu">菜单</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="icon"
            label="图标"
          >
            <Select placeholder="请选择图标" allowClear>
              <Option value="DashboardOutlined">仪表盘</Option>
              <Option value="SafetyOutlined">安全</Option>
              <Option value="DatabaseOutlined">数据库</Option>
              <Option value="ToolOutlined">工具</Option>
              <Option value="RobotOutlined">机器人</Option>
              <Option value="MenuOutlined">菜单</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="path"
            label="路由路径"
          >
            <Input placeholder="请输入路由路径，如：/system/users" />
          </Form.Item>
          <Form.Item
            name="sort"
            label="排序"
            initialValue={1}
          >
            <Input type="number" placeholder="请输入排序号" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

const findMenuById = (menus: MenuItem[], id: string): MenuItem | null => {
  for (const menu of menus) {
    if (menu.id === id) return menu
    if (menu.children) {
      const found = findMenuById(menu.children, id)
      if (found) return found
    }
  }
  return null
}

export default MenuManagement
