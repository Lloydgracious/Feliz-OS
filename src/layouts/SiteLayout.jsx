import { Outlet, ScrollRestoration } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CartDrawer from '../components/CartDrawer'

export default function SiteLayout() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 lux-pattern opacity-50" />
      <Navbar />
      <main className="relative">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <ScrollRestoration />
    </div>
  )
}
