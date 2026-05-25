import { useState } from 'react'
import { Card, Row, Col, Statistic, Table, Tag, Progress, Button, Space } from 'antd'
import {
  DatabaseOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import './style.css'

// 仓库地图数据
const warehouseMap = Array.from({ length: 10 }, (_, row) =>
  Array.from({ length: 15 }, (_, col) => ({
    row,
    col,
    status: Math.random() > 0.7 ? 'occupied' : Math.random() > 0.9 ? 'reserved' : 'empty',
  }))
)

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
    render: (type: string) => {
      const colors: Record<string, string> = {
        '入库': 'blue',
        '出库': 'green',
        '移库': 'orange',
      }
      return <Tag color={colors[type]}>{type}</Tag>
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      const config: Record<string, { color: string; icon: React.ReactNode }> = {
        '执行中': { color: 'processing', icon: <ClockCircleOutlined /> },
        '已完成': { color: 'success', icon: <CheckCircleOutlined /> },
        '异常': { color: 'error', icon: <ExclamationCircleOutlined /> },
      }
      const { color, icon } = config[status] || { color: 'default', icon: null }
      return (
        <Tag icon={icon} color={color}>
          {status}
        </Tag>
      )
    },
  },
  {
    title: '库位',
    dataIndex: 'location',
    key: 'location',
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
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
  },
]

const taskData = [
  { key: '1', id: 'T20240115001', type: '入库', status: '执行中', location: 'A-01-02', priority: 1, createdAt: '09:30:00' },
  { key: '2', id: 'T20240115002', type: '出库', status: '执行中', location: 'B-03-05', priority: 2, createdAt: '09:25:00' },
  { key: '3', id: 'T20240115003', type: '移库', status: '已完成', location: 'C-02-01', priority: 3, createdAt: '09:20:00' },
  { key: '4', id: 'T20240115004', type: '入库', status: '异常', location: 'A-04-03', priority: 1, createdAt: '09:15:00' },
  { key: '5', id: 'T20240115005', type: '出库', status: '执行中', location: 'B-01-01', priority: 2, createdAt: '09:10:00' },
]

const WCSOverview = () => {
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)

  const getCellColor = (status: string) => {
    switch (status) {
      case 'occupied':
        return '#52c41a'
      case 'reserved':
        return '#faad14'
      default:
        return '#f0f0f0'
    }
  }

  return (
    <div className="wcs-overview">
      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className="stat-row">
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="总库位数"
              value={1500}
              prefix={<DatabaseOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="已占用"
              value={876}
              styles={{ content: { color: '#52c41a' } }}
              suffix="/ 1500"
            />
            <Progress percent={58.4} size="small" status="active" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="今日入库"
              value={128}
              styles={{ content: { color: '#1890ff' } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="今日出库"
              value={96}
              styles={{ content: { color: '#faad14' } }}
            />
          </Card>
        </Col>
      </Row>

      {/* 仓库地图 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="仓库实时地图" className="map-card">
            <div className="warehouse-map">
              {warehouseMap.map((row, rowIndex) => (
                <div key={rowIndex} className="map-row">
                  {row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`map-cell ${selectedCell?.row === rowIndex && selectedCell?.col === colIndex ? 'selected' : ''}`}
                      style={{ backgroundColor: getCellColor(cell.status) }}
                      onClick={() => setSelectedCell({ row: rowIndex, col: colIndex })}
                      title={`${String.fromCharCode(65 + rowIndex)}-${String(colIndex + 1).padStart(2, '0')}`}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="map-legend">
              <div className="legend-item">
                <span className="legend-dot" style={{ background: '#52c41a' }} />
                <span>已占用</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ background: '#faad14' }} />
                <span>预留</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ background: '#f0f0f0' }} />
                <span>空闲</span>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="库位详情" className="detail-card">
            {selectedCell ? (
              <div>
                <p><strong>库位编号：</strong>{String.fromCharCode(65 + selectedCell.row)}-{String(selectedCell.col + 1).padStart(2, '0')}</p>
                <p><strong>状态：</strong>
                  <Tag color={warehouseMap[selectedCell.row][selectedCell.col].status === 'occupied' ? 'success' : warehouseMap[selectedCell.row][selectedCell.col].status === 'reserved' ? 'warning' : 'default'}>
                    {warehouseMap[selectedCell.row][selectedCell.col].status === 'occupied' ? '已占用' : warehouseMap[selectedCell.row][selectedCell.col].status === 'reserved' ? '预留' : '空闲'}
                  </Tag>
                </p>
                <p><strong>SKU：</strong>{warehouseMap[selectedCell.row][selectedCell.col].status === 'occupied' ? 'SKU-10086' : '-'}</p>
                <p><strong>数量：</strong>{warehouseMap[selectedCell.row][selectedCell.col].status === 'occupied' ? '50' : '-'}</p>
                <Space style={{ marginTop: 16 }}>
                  <Button type="primary" size="small">查看详情</Button>
                  <Button size="small">库存调整</Button>
                </Space>
              </div>
            ) : (
              <div className="empty-state">点击地图查看库位详情</div>
            )}
          </Card>
        </Col>
      </Row>

      {/* 任务列表 */}
      <Card title="实时任务" className="task-card">
        <Table
          columns={taskColumns}
          dataSource={taskData}
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  )
}

export default WCSOverview
