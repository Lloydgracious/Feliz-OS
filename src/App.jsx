import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import SiteLayout from './layouts/SiteLayout'

import Home from './pages/Home'
import Shop from './pages/Shop'
import Customize from './pages/Customize'
import Checkout from './pages/Checkout'
import Blog from './pages/Blog'
import About from './pages/About'
import Support from './pages/Support'
import Receipt from './pages/Receipt'

import AdminGate from './pages/admin/AdminGate'
import AdminLayout from './pages/admin/AdminLayout'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminVlogs from './pages/admin/AdminVlogs'
import AdminHome from './pages/admin/AdminHome'
import AdminShop from './pages/admin/AdminShop'
import AdminOrders from './pages/admin/AdminOrders'
import AdminAbout from './pages/admin/AdminAbout'
import AdminCheckoutSettings from './pages/admin/AdminCheckoutSettings'
import AdminCustomize from './pages/admin/AdminCustomize'
import AdminSupport from './pages/admin/AdminSupport'
import AdminQuickView from './pages/admin/AdminQuickView'

const router = createBrowserRouter([
  {
    element: <SiteLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/shop', element: <Shop /> },
      { path: '/customize', element: <Customize /> },
      { path: '/checkout', element: <Checkout /> },
      { path: '/blog', element: <Blog /> },
      { path: '/about', element: <About /> },
      { path: '/support', element: <Support /> },
      { path: '/receipt', element: <Receipt /> },
    ],
  },
  { path: '/admin/login', element: <AdminLogin /> },
  {
    path: '/admin',
    element: <AdminGate />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'home', element: <AdminHome /> },
          { path: 'shop', element: <AdminShop /> },
          { path: 'customize', element: <AdminCustomize /> },
          { path: 'support', element: <AdminSupport /> },
          { path: 'quick-view', element: <AdminQuickView /> },
          { path: 'products', element: <AdminProducts /> },
          { path: 'vlogs', element: <AdminVlogs /> },
          { path: 'orders', element: <AdminOrders /> },
          { path: 'about', element: <AdminAbout /> },
          { path: 'checkout', element: <AdminCheckoutSettings /> },
        ],
      },
    ],
  },
])

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 2200,
          style: {
            background: 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(14px)',
            border: '1px solid rgba(255,255,255,0.35)',
            color: '#0b1220',
          },
        }}
      />
    </>
  )
}
