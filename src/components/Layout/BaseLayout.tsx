import { useState } from 'react'
import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import './style.css'

const { Content } = Layout

const BaseLayout = () => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Layout className="base-layout">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout className="site-layout">
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content className="site-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default BaseLayout
