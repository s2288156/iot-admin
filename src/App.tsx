import { Routes, Route } from 'react-router-dom'
import BaseLayout from './components/Layout/BaseLayout'
import Dashboard from './pages/Dashboard'
import UserManagement from './pages/System/UserManagement'
import RoleManagement from './pages/System/RoleManagement'
import MenuManagement from './pages/System/MenuManagement'
import WCSOverview from './pages/WCS/Overview'
import ECSDashboard from './pages/ECS/Dashboard'
import RCSDashboard from './pages/RCS/Dashboard'

function App() {
  return (
    <Routes>
      <Route path="/" element={<BaseLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="system">
          <Route path="users" element={<UserManagement />} />
          <Route path="roles" element={<RoleManagement />} />
          <Route path="menus" element={<MenuManagement />} />
        </Route>
        <Route path="wcs" element={<WCSOverview />} />
        <Route path="ecs" element={<ECSDashboard />} />
        <Route path="rcs" element={<RCSDashboard />} />
      </Route>
    </Routes>
  )
}

export default App
