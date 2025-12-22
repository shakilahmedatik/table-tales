import { Outlet } from 'react-router'

const DashboardLayout = () => {
  return (
    <>
      <h1>Sidebar</h1>
      <h1>Navbar</h1>
      <Outlet />
    </>
  )
}

export default DashboardLayout
