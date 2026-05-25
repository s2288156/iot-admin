import { Card, Row, Col, Statistic, Badge, Progress, Table, Tag, Button, Space } from 'antd'
import {
  ToolOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  PoweroffOutlined,
} from '@ant-design/icons'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import './style.css'

// 设备状态数据
const deviceStatus = {
  total: 64,
  running: 45,
  standby: 12,
  maintenance: 5,
  fault: 2,
}

// 设备列表
const devices = [
  { id: 'C-001', name: '输送带A1', type: '输送设备', status: 'running', efficiency: 95, runtime: '12h 30m' },
  { id: 'C-002', name: '输送带A2', type: '输送设备', status: 'running', efficiency: 92, runtime: '12h 25m' },
  { id: 'C-003', name: '输送带A3', type: '输送设备', status: 'fault', efficiency: 0, runtime: '2h 15m' },
  { id: 'S-001', name: '堆垛机S1', type: '堆垛设备', status: 'running', efficiency: 88, runtime: '10h 45m' },
  { id: 'S-002', name: '堆垛机S2', type: '堆垛设备', status: 'maintenance', efficiency: 0, runtime: '0h 00m' },
  { id: 'L-001', name: '升降机L1', type: '升降设备', status: 'standby', efficiency: 0, runtime: '4h 20m' },
  { id: 'L-002', name: '升降机L2', type: '升降设备', status: 'running', efficiency: 90, runtime: '11h 10m' },
  { id: 'D-001', name: '分拣机D1', type: '分拣设备', status: 'running', efficiency: 93, runtime: '12h 00m' },
]

// 效率趋势数据
const efficiencyData = [
  { time: '00:00', efficiency: 85 },
  { time: '04:00', efficiency: 82 },
  { time: '08:00', efficiency: 90 },
  { time: '12:00', efficiency: 93 },
  { time: '16:00', efficiency: 91 },
  { time: '20:00', efficiency: 88 },
  { time: '24:00', efficiency: 86 },
]

// 告警列表
const alarms = [
  { id: 1, device: '输送带A3', level: 'high', message: '电机温度过高', time: '09:30:00' },
  { id: 2, device: '堆垛机S2', level: 'medium', message: '需要定期维护', time: '08:45:00' },
  { id: 3, device: '升降机L1', level: 'low', message: '传感器信号弱', time: '07:20:00' },
]

const getStatusConfig = (status: string) => {
  const configs: Record<string, { color: string; text: string; icon: React.ReactNode }> = {
    running: { color: '#52c41a', text: '运行中', icon: <CheckCircleOutlined /> },
    standby: { color: '#1890ff', text: '待机', icon: <PoweroffOutlined /> },
    maintenance: { color: '#faad14', text: '维护中', icon: <ToolOutlined /> },
    fault: { color: '#f5222d', text: '故障', icon: <CloseCircleOutlined /> },
  }
  return configs[status] || configs.standby
}

const ECSDashboard = () => {
  const deviceColumns = [
    {
      title: '设备编号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag>{type}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = getStatusConfig(status)
        return (
          <Badge
            status={status === 'running' ? 'success' : status === 'fault' ? 'error' : status === 'maintenance' ? 'warning' : 'default'}
            text={<span style={{ color: config.color }}>{config.text}</span>}
          />
        )
      },
    },
    {
      title: '效率',
      dataIndex: 'efficiency',
      key: 'efficiency',
      render: (efficiency: number) => (
        <Progress
          percent={efficiency}
          size="small"
          status={efficiency > 90 ? 'success' : efficiency > 70 ? 'normal' : 'exception'}
        />
      ),
    },
    {
      title: '运行时长',
      dataIndex: 'runtime',
      key: 'runtime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: typeof devices[0]) => (
        <Space>
          <Button type="text" size="small">详情</Button>
          {record.status === 'fault' && (
            <Button type="primary" danger size="small">处理</Button>
          )}
        </Space>
      ),
    },
  ]

  const alarmColumns = [
    {
      title: '设备',
      dataIndex: 'device',
      key: 'device',
    },
    {
      title: '等级',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => {
        const colors: Record<string, string> = {
          high: 'red',
          medium: 'orange',
          low: 'blue',
        }
        return <Tag color={colors[level]}>{level === 'high' ? '高' : level === 'medium' ? '中' : '低'}</Tag>
      },
    },
    {
      title: '告警信息',
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Button type="link" size="small">处理</Button>
      ),
    },
  ]

  return (
    <div className="ecs-dashboard">
      {/* 状态概览 */}
      <Row gutter={[16, 16]} className="status-row">
        <Col xs={12} sm={8} lg={4}>
          <Card className="status-card total">
            <Statistic
              title="设备总数"
              value={deviceStatus.total}
              prefix={<ToolOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={5}>
          <Card className="status-card running">
            <Statistic
              title="运行中"
              value={deviceStatus.running}
              styles={{ content: { color: '#52c41a' } }}
              prefix={<CheckCircleOutlined />}
            />
            <Progress percent={Math.round((deviceStatus.running / deviceStatus.total) * 100)} size="small" strokeColor="#52c41a" />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={5}>
          <Card className="status-card standby">
            <Statistic
              title="待机"
              value={deviceStatus.standby}
              styles={{ content: { color: '#1890ff' } }}
              prefix={<PoweroffOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={5}>
          <Card className="status-card maintenance">
            <Statistic
              title="维护中"
              value={deviceStatus.maintenance}
              styles={{ content: { color: '#faad14' } }}
              prefix={<ToolOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={5}>
          <Card className="status-card fault">
            <Statistic
              title="故障"
              value={deviceStatus.fault}
              styles={{ content: { color: '#f5222d' } }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 设备状态卡片 */}
      <Row gutter={[16, 16]} className="device-cards-row">
        {devices.slice(0, 4).map(device => {
          const config = getStatusConfig(device.status)
          return (
            <Col xs={24} sm={12} lg={6} key={device.id}>
              <Card className={`device-card ${device.status}`}>
                <div className="device-header">
                  <span className="device-icon" style={{ color: config.color }}>
                    {config.icon}
                  </span>
                  <Tag color={config.color}>{config.text}</Tag>
                </div>
                <div className="device-name">{device.name}</div>
                <div className="device-id">{device.id}</div>
                <div className="device-stats">
                  <div className="stat">
                    <div className="stat-label">效率</div>
                    <div className="stat-value" style={{ color: config.color }}>
                      {device.efficiency}%
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-label">运行时长</div>
                    <div className="stat-value">{device.runtime}</div>
                  </div>
                </div>
              </Card>
            </Col>
          )
        })}
      </Row>

      {/* 效率趋势和设备列表 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="设备效率趋势" className="chart-card">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={efficiencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="efficiency"
                  stroke="#1890ff"
                  fill="#1890ff"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="实时告警" className="alarm-card">
            <Table
              columns={alarmColumns}
              dataSource={alarms}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* 设备列表 */}
      <Card title="设备列表" className="device-list-card">
        <Table
          columns={deviceColumns}
          dataSource={devices}
          pagination={{ pageSize: 10 }}
          size="small"
        />
      </Card>
    </div>
  )
}

export default ECSDashboard
