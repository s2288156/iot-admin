import { useState } from 'react'
import { Card, Row, Col, Statistic, Table, Tag, Progress, Button, Space, Badge } from 'antd'
import {
  RobotOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'
import './style.css'

// 机器人数据
const robots = [
  { id: 'R-001', name: '机器人A1', status: 'working', battery: 85, efficiency: 92, taskCount: 156, location: 'A区-01' },
  { id: 'R-002', name: '机器人A2', status: 'working', battery: 72, efficiency: 88, taskCount: 142, location: 'A区-03' },
  { id: 'R-003', name: '机器人B1', status: 'charging', battery: 25, efficiency: 0, taskCount: 0, location: '充电站' },
  { id: 'R-004', name: '机器人B2', status: 'idle', battery: 95, efficiency: 0, taskCount: 0, location: 'B区-02' },
  { id: 'R-005', name: '机器人C1', status: 'working', battery: 60, efficiency: 85, taskCount: 128, location: 'C区-01' },
  { id: 'R-006', name: '机器人C2', status: 'error', battery: 45, efficiency: 0, taskCount: 0, location: '维修区' },
]

// 任务统计
const taskStats = [
  { hour: '08:00', completed: 45, pending: 12 },
  { hour: '09:00', completed: 52, pending: 8 },
  { hour: '10:00', completed: 48, pending: 15 },
  { hour: '11:00', completed: 61, pending: 10 },
  { hour: '12:00', completed: 38, pending: 18 },
  { hour: '13:00', completed: 42, pending: 14 },
  { hour: '14:00', completed: 55, pending: 11 },
]

// 效率趋势
const efficiencyTrend = [
  { day: '周一', efficiency: 88 },
  { day: '周二', efficiency: 92 },
  { day: '周三', efficiency: 85 },
  { day: '周四', efficiency: 90 },
  { day: '周五', efficiency: 93 },
  { day: '周六', efficiency: 87 },
  { day: '周日', efficiency: 89 },
]

// 任务队列
const taskQueue = [
  { id: 'TK-001', type: '搬运', priority: 1, robot: 'R-001', status: '执行中', progress: 65 },
  { id: 'TK-002', type: '分拣', priority: 2, robot: 'R-002', status: '执行中', progress: 30 },
  { id: 'TK-003', type: '搬运', priority: 1, robot: '-', status: '待分配', progress: 0 },
  { id: 'TK-004', type: '盘点', priority: 3, robot: '-', status: '待分配', progress: 0 },
  { id: 'TK-005', type: '搬运', priority: 2, robot: 'R-005', status: '执行中', progress: 80 },
]

const getStatusConfig = (status: string) => {
  const configs: Record<string, { color: string; text: string }> = {
    working: { color: '#52c41a', text: '工作中' },
    charging: { color: '#faad14', text: '充电中' },
    idle: { color: '#1890ff', text: '空闲' },
    error: { color: '#f5222d', text: '故障' },
  }
  return configs[status] || { color: '#8c8c8c', text: '未知' }
}

const RCSDashboard = () => {
  const [selectedRobot, setSelectedRobot] = useState<string | null>(null)

  const robotColumns = [
    {
      title: '机器人',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: typeof robots[0]) => (
        <Space>
          <RobotOutlined style={{ fontSize: 20, color: getStatusConfig(record.status).color }} />
          <div>
            <div style={{ fontWeight: 500 }}>{name}</div>
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>{record.id}</div>
          </div>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = getStatusConfig(status)
        return <Badge status={status === 'working' ? 'success' : status === 'error' ? 'error' : status === 'charging' ? 'warning' : 'default'} text={<span style={{ color: config.color }}>{config.text}</span>} />
      },
    },
    {
      title: '电量',
      dataIndex: 'battery',
      key: 'battery',
      render: (battery: number) => (
        <Progress
          percent={battery}
          size="small"
          status={battery < 20 ? 'exception' : battery < 50 ? 'normal' : 'success'}
          format={(percent) => `${percent}%`}
        />
      ),
    },
    {
      title: '效率',
      dataIndex: 'efficiency',
      key: 'efficiency',
      render: (efficiency: number) => (
        <span style={{ color: efficiency > 90 ? '#52c41a' : efficiency > 70 ? '#1890ff' : '#faad14', fontWeight: 600 }}>
          {efficiency}%
        </span>
      ),
    },
    {
      title: '当前位置',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '今日任务',
      dataIndex: 'taskCount',
      key: 'taskCount',
      render: (count: number) => <Tag color="blue">{count} 个</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: typeof robots[0]) => (
        <Space>
          <Button type="text" size="small" onClick={() => setSelectedRobot(record.id)}>
            详情
          </Button>
          {record.status === 'error' && (
            <Button type="primary" danger size="small">
              重启
            </Button>
          )}
        </Space>
      ),
    },
  ]

  const taskColumns = [
    {
      title: '任务编号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: number) => (
        <Tag color={priority === 1 ? 'red' : priority === 2 ? 'orange' : 'blue'}>
          P{priority}
        </Tag>
      ),
    },
    {
      title: '分配机器人',
      dataIndex: 'robot',
      key: 'robot',
      render: (robot: string) => robot === '-' ? <span style={{ color: '#8c8c8c' }}>待分配</span> : robot,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === '执行中' ? 'processing' : 'default'}>{status}</Tag>
      ),
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => (
        <Progress percent={progress} size="small" />
      ),
    },
  ]

  const workingCount = robots.filter(r => r.status === 'working').length
  const idleCount = robots.filter(r => r.status === 'idle').length
  const errorCount = robots.filter(r => r.status === 'error').length

  return (
    <div className="rcs-dashboard">
      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className="stat-row">
        <Col xs={12} sm={6} lg={6}>
          <Card className="stat-card total">
            <Statistic
              title="机器人总数"
              value={robots.length}
              prefix={<RobotOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={6}>
          <Card className="stat-card working">
            <Statistic
              title="工作中"
              value={workingCount}
              styles={{ content: { color: '#52c41a' } }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={6}>
          <Card className="stat-card idle">
            <Statistic
              title="空闲"
              value={idleCount}
              styles={{ content: { color: '#1890ff' } }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={6}>
          <Card className="stat-card error">
            <Statistic
              title="故障"
              value={errorCount}
              styles={{ content: { color: '#f5222d' } }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} className="chart-row">
        <Col xs={24} lg={12}>
          <Card title="任务完成情况" className="chart-card">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={taskStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" name="已完成" fill="#52c41a" />
                <Bar dataKey="pending" name="待处理" fill="#faad14" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="效率趋势" className="chart-card">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={efficiencyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="efficiency"
                  name="效率(%)"
                  stroke="#1890ff"
                  strokeWidth={2}
                  dot={{ fill: '#1890ff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* 机器人列表 */}
      <Card title="机器人状态" className="robot-list-card">
        <Table
          columns={robotColumns}
          dataSource={robots}
          pagination={false}
          size="small"
        />
      </Card>

      {/* 任务队列 */}
      <Card title="任务队列" className="task-queue-card">
        <Table
          columns={taskColumns}
          dataSource={taskQueue}
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  )
}

export default RCSDashboard
