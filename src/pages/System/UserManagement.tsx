import { useState } from 'react'
import {
  Card,
  Table,
  Button,
  Input,
  Space,
  Tag,
  Avatar,
  Modal,
  Form,
  Select,
  Switch,
  message,
} from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
} from '@ant-design/icons'

const { Option } = Select

interface User {
  id: string
  username: string
  realName: string
  email: string
  phone: string
  role: string
  status: boolean
  lastLogin: string
  avatar?: string
}

const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    realName: '系统管理员',
    email: 'admin@warehouse.com',
    phone: '13800138000',
    role: '超级管理员',
    status: true,
    lastLogin: '2024-01-15 09:30:00',
  },
  {
    id: '2',
    username: 'operator1',
    realName: '张三',
    email: 'zhangsan@warehouse.com',
    phone: '13800138001',
    role: '仓库操作员',
    status: true,
    lastLogin: '2024-01-15 08:45:00',
  },
  {
    id: '3',
    username: 'operator2',
    realName: '李四',
    email: 'lisi@warehouse.com',
    phone: '13800138002',
    role: '设备管理员',
    status: false,
    lastLogin: '2024-01-14 17:20:00',
  },
  {
    id: '4',
    username: 'viewer',
    realName: '王五',
    email: 'wangwu@warehouse.com',
    phone: '13800138003',
    role: '观察员',
    status: true,
    lastLogin: '2024-01-15 07:15:00',
  },
]

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [form] = Form.useForm()
  const [searchText, setSearchText] = useState('')

  const columns = [
    {
      title: '用户',
      dataIndex: 'username',
      key: 'username',
      render: (_: string, record: User) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 500 }}>{record.realName}</div>
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>{record.username}</div>
          </div>
        </Space>
      ),
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        const colors: Record<string, string> = {
          '超级管理员': 'red',
          '仓库操作员': 'blue',
          '设备管理员': 'green',
          '观察员': 'default',
        }
        return <Tag color={colors[role] || 'default'}>{role}</Tag>
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean, record: User) => (
        <Switch
          checked={status}
          onChange={(checked) => handleStatusChange(record.id, checked)}
          checkedChildren="启用"
          unCheckedChildren="禁用"
        />
      ),
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: User) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  const handleStatusChange = (id: string, status: boolean) => {
    setUsers(users.map(user =>
      user.id === id ? { ...user, status } : user
    ))
    message.success(`用户已${status ? '启用' : '禁用'}`)
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    form.setFieldsValue(user)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该用户吗？此操作不可恢复。',
      onOk: () => {
        setUsers(users.filter(user => user.id !== id))
        message.success('删除成功')
      },
    })
  }

  const handleAdd = () => {
    setEditingUser(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingUser) {
        setUsers(users.map(user =>
          user.id === editingUser.id ? { ...user, ...values } : user
        ))
        message.success('更新成功')
      } else {
        const newUser: User = {
          ...values,
          id: String(users.length + 1),
          lastLogin: '-',
        }
        setUsers([...users, newUser])
        message.success('创建成功')
      }
      setIsModalOpen(false)
    })
  }

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchText.toLowerCase()) ||
    user.realName.toLowerCase().includes(searchText.toLowerCase())
  )

  return (
    <div className="user-management">
      <Card
        title="用户管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增用户
          </Button>
        }
      >
        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="搜索用户名或姓名"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
        </div>
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingUser ? '编辑用户' : '新增用户'}
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
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            name="realName"
            label="真实姓名"
            rules={[{ required: true, message: '请输入真实姓名' }]}
          >
            <Input placeholder="请输入真实姓名" />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="手机号"
            rules={[{ required: true, message: '请输入手机号' }]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色">
              <Option value="超级管理员">超级管理员</Option>
              <Option value="仓库操作员">仓库操作员</Option>
              <Option value="设备管理员">设备管理员</Option>
              <Option value="观察员">观察员</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default UserManagement
