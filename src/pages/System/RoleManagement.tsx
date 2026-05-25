import { useState } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Tree,
  message,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import type { DataNode } from 'antd/es/tree'

interface Role {
  id: string
  name: string
  code: string
  description: string
  userCount: number
  status: boolean
  permissions: string[]
}

const mockRoles: Role[] = [
  {
    id: '1',
    name: '超级管理员',
    code: 'admin',
    description: '系统最高权限，可管理所有功能和数据',
    userCount: 1,
    status: true,
    permissions: ['*'],
  },
  {
    id: '2',
    name: '仓库操作员',
    code: 'warehouse_operator',
    description: '负责仓库日常操作，包括入库、出库、盘点等',
    userCount: 15,
    status: true,
    permissions: ['wcs:*', 'ecs:view', 'rcs:view'],
  },
  {
    id: '3',
    name: '设备管理员',
    code: 'device_manager',
    description: '负责设备维护、故障处理和性能监控',
    userCount: 5,
    status: true,
    permissions: ['ecs:*', 'wcs:view'],
  },
  {
    id: '4',
    name: '观察员',
    code: 'viewer',
    description: '只读权限，可查看系统状态和数据报表',
    userCount: 8,
    status: true,
    permissions: ['*:view'],
  },
]

const permissionTreeData: DataNode[] = [
  {
    title: '仪表盘',
    key: 'dashboard',
    children: [
      { title: '查看', key: 'dashboard:view' },
    ],
  },
  {
    title: '系统管理',
    key: 'system',
    children: [
      { title: '用户管理', key: 'system:users', children: [
        { title: '查看', key: 'system:users:view' },
        { title: '编辑', key: 'system:users:edit' },
      ]},
      { title: '角色权限', key: 'system:roles', children: [
        { title: '查看', key: 'system:roles:view' },
        { title: '编辑', key: 'system:roles:edit' },
      ]},
      { title: '菜单管理', key: 'system:menus', children: [
        { title: '查看', key: 'system:menus:view' },
        { title: '编辑', key: 'system:menus:edit' },
      ]},
    ],
  },
  {
    title: '仓库控制 (WCS)',
    key: 'wcs',
    children: [
      { title: '仓库概览', key: 'wcs:overview' },
      { title: '任务管理', key: 'wcs:tasks' },
      { title: '库存管理', key: 'wcs:inventory' },
      { title: '库位管理', key: 'wcs:locations' },
    ],
  },
  {
    title: '设备控制 (ECS)',
    key: 'ecs',
    children: [
      { title: '设备监控', key: 'ecs:monitor' },
      { title: '设备列表', key: 'ecs:list' },
      { title: '故障告警', key: 'ecs:alarms' },
      { title: '维护记录', key: 'ecs:maintenance' },
    ],
  },
  {
    title: '机器人控制 (RCS)',
    key: 'rcs',
    children: [
      { title: '机器人调度', key: 'rcs:dispatch' },
      { title: '任务分配', key: 'rcs:tasks' },
      { title: '路径规划', key: 'rcs:paths' },
      { title: '性能统计', key: 'rcs:stats' },
    ],
  },
]

const RoleManagement = () => {
  const [roles, setRoles] = useState<Role[]>(mockRoles)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [form] = Form.useForm()
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Role) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: 12, color: '#8c8c8c' }}>{record.code}</div>
        </div>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '用户数',
      dataIndex: 'userCount',
      key: 'userCount',
      render: (count: number) => (
        <Tag color="blue">{count} 人</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) => (
        <Tag color={status ? 'success' : 'default'}>
          {status ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: Role) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          {record.code !== 'admin' && (
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            >
              删除
            </Button>
          )}
        </Space>
      ),
    },
  ]

  const handleEdit = (role: Role) => {
    setEditingRole(role)
    form.setFieldsValue(role)
    setSelectedPermissions(role.permissions)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该角色吗？此操作不可恢复。',
      onOk: () => {
        setRoles(roles.filter(role => role.id !== id))
        message.success('删除成功')
      },
    })
  }

  const handleAdd = () => {
    setEditingRole(null)
    form.resetFields()
    setSelectedPermissions([])
    setIsModalOpen(true)
  }

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const roleData = {
        ...values,
        permissions: selectedPermissions,
      }
      
      if (editingRole) {
        setRoles(roles.map(role =>
          role.id === editingRole.id ? { ...role, ...roleData } : role
        ))
        message.success('更新成功')
      } else {
        const newRole: Role = {
          ...roleData,
          id: String(roles.length + 1),
          userCount: 0,
          status: true,
        }
        setRoles([...roles, newRole])
        message.success('创建成功')
      }
      setIsModalOpen(false)
    })
  }

  const onPermissionCheck = (checkedKeys: React.Key[]) => {
    setSelectedPermissions(checkedKeys as string[])
  }

  return (
    <div className="role-management">
      <Card
        title="角色权限管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增角色
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={roles}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingRole ? '编辑角色' : '新增角色'}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item
            name="code"
            label="角色编码"
            rules={[{ required: true, message: '请输入角色编码' }]}
          >
            <Input placeholder="请输入角色编码，如：warehouse_operator" />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea rows={2} placeholder="请输入角色描述" />
          </Form.Item>
          <Form.Item
            label="权限配置"
          >
            <Card size="small" style={{ maxHeight: 300, overflow: 'auto' }}>
              <Tree
                checkable
                treeData={permissionTreeData}
                checkedKeys={selectedPermissions}
                onCheck={onPermissionCheck}
              />
            </Card>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default RoleManagement
