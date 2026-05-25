import { Row, Col, Card, Statistic, Table, Tag } from 'antd'
import {
  RiseOutlined,
  FallOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  DatabaseOutlined,
  ToolOutlined,
  RobotOutlined,
  AlertOutlined,
} from '@ant-design/icons'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import './style.css'

const trendData = [
  { name: '周一', value: 120 },
  { name: '周二', value: 132 },
  { name: '周三', value: 101 },
  { name: '周四', value: 134 },
  { name: '周五', value: 90 },
  { name: '周六', value: 230 },
  { name: '周日', value: 210 },
]

const deviceStatusData = [
  { name: '运行中', value: 45, color: '#52c41a' },
  { name: '待机', value: 12, color: '#1890ff' },
  { name: '维护中', value: 5, color: '#faad14' },
  { name: '故障', value: 2, color: '#f5222d' },
]

const alarmColumns = [
  {
    title: '告警类型',
    dataIndex: 'type',
    key: 'type',
    render: (text: string) => {
      const colors: Record<string, string> = {
        '设备故障': 'red',
        '任务超时': 'orange',
        '库存预警': 'blue',
      }
      return <Tag color={colors[text] || 'default'}>{text}</Tag>
    },
  },
  {
    title: '描述',
    dataIndex: 'desc',
    key: 'desc',
  },
  {
    title: '时间',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => (
      <Tag color={status === '未处理' ? 'red' : 'green'}>{status}</Tag>
    ),
  },
]

const alarmData = [
  { key: '1', type: '设备故障', desc: '输送带A3电机异常', time: '2024-01-15 09:30', status: '未处理' },
  { key: '2', type: '任务超时', desc: '出库任务T20240115001超时', time: '2024-01-15 08:45', status: '处理中' },
  { key: '3', type: '库存预警', desc: 'SKU-10086库存低于安全线', time: '2024-01-15 08:20', status: '已处理' },
  { key: '4', type: '设备故障', desc: '机器人R05通信中断', time: '2024-01-15 07:55', status: '未处理' },
  { key: '5', type: '任务超时', desc: '入库任务T20240115002超时', time: '2024-01-15 07:30', status: '处理中' },
]

const Dashboard = () => {
  return (
    <div className="dashboard">
      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className="stat-row">
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="今日任务"
              value={128}
              prefix={<DatabaseOutlined />}
              suffix={<span className="trend-up"><RiseOutlined /> 12%</span>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="设备在线率"
              value={92.5}
              precision={1}
              prefix={<ToolOutlined />}
              suffix="%"
              styles={{ content: { color: '#52c41a' } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="库存总量"
              value={15234}
              prefix={<DatabaseOutlined />}
              suffix={<span className="trend-down"><FallOutlined /> 3%</span>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="待处理告警"
              value={5}
              prefix={<AlertOutlined />}
              styles={{ content: { color: '#f5222d' } }}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} className="chart-row">
        <Col xs={24} lg={16}>
          <Card title="任务趋势（近7天）" className="chart-card">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#1890ff"
                  strokeWidth={2}
                  dot={{ fill: '#1890ff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="设备状态分布" className="chart-card">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deviceStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="legend-container">
              {deviceStatusData.map((item) => (
                <div key={item.name} className="legend-item">
                  <span className="legend-dot" style={{ background: item.color }} />
                  <span>{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 告警列表 */}
      <Card title="最近告警" className="alarm-card">
        <Table
          columns={alarmColumns}
          dataSource={alarmData}
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  )
}

export default Dashboard
