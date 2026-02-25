import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingBag,
  Package,
  Truck,
  Settings,
  Layout,
  MessageSquare,
  CreditCard,
  Palette,
  TrendingUp,
  Users,
  Clock
} from 'lucide-react'
import { adminListOrders, adminListProducts } from '../../lib/adminApi'
import { formatMMK } from '../../lib/utils'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    pending: 0,
    totalSales: 0,
    recentOrders: [],
    productCount: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [orders, products] = await Promise.all([
          adminListOrders(),
          adminListProducts()
        ])

        const pending = orders.filter(o => o.status === 'pending_payment' || o.status === 'paid').length
        const totalSales = orders.filter(o => o.status === 'completed' || o.status === 'shipped')
          .reduce((acc, curr) => acc + (curr.total || 0), 0)

        setStats({
          pending,
          totalSales,
          recentOrders: orders.slice(0, 5),
          productCount: products.length
        })
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <LoadingSpinner label="Loading Command Center" />

  const navItems = [
    { to: '/admin/orders', label: 'Orders', icon: ShoppingBag, color: 'sky', desc: 'Manage sales & status' },
    { to: '/admin/products', label: 'Products', icon: Package, color: 'blue', desc: 'Inventory & pricing' },
    { to: '/admin/home', label: 'Home Page', icon: Layout, color: 'indigo', desc: 'Hero & announcements' },
    { to: '/admin/customize', label: 'Designer', icon: Palette, color: 'violet', desc: 'Knots & color ways' },
    { to: '/admin/about', label: 'About Page', icon: Users, color: 'purple', desc: 'Brand story & gallery' },
    { to: '/admin/support', label: 'Support', icon: MessageSquare, color: 'fuchsia', desc: 'FAQ & contact info' },
    { to: '/admin/checkout', label: 'Payments', icon: CreditCard, color: 'rose', desc: 'Bank details & rules' },
    { to: '/admin/shop', label: 'Shop Settings', icon: Settings, color: 'slate', desc: 'Titles & banners' },
  ]

  return (
    <div className="space-y-10">
      {/* Executive Summary */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Pending Actions"
          value={stats.pending}
          icon={Clock}
          trend="Requires attention"
          bgColor="bg-sky-500"
        />
        <StatCard
          label="Total Revenue"
          value={formatMMK(stats.totalSales)}
          icon={TrendingUp}
          trend="Completed sales"
          bgColor="bg-blue-600"
        />
        <StatCard
          label="Active Products"
          value={stats.productCount}
          icon={Package}
          trend="In your catalog"
          bgColor="bg-indigo-600"
        />
        <StatCard
          label="Recent Traffic"
          value="Live"
          icon={Truck}
          trend="Fulfillment active"
          bgColor="bg-slate-800"
        />
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        {/* Main Navigation Grid */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-1.5 w-6 rounded-full bg-sky-600" />
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">COMMAND CENTER</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="group lux-glass relative overflow-hidden rounded-[32px] p-6 transition-all hover:bg-white/30 hover:shadow-xl hover:shadow-sky-900/5 active:scale-[0.98]"
              >
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-${item.color}-500/10 text-${item.color}-600 transition-colors group-hover:bg-${item.color}-500 group-hover:text-white`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <div className="text-base font-bold text-slate-900">{item.label}</div>
                <div className="mt-1 text-sm text-slate-600 leading-relaxed">{item.desc}</div>

                {/* Subtle arrow on hover */}
                <div className="absolute right-6 top-6 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="h-8 w-8 rounded-full bg-white/50 flex items-center justify-center">
                    <Truck className="h-4 w-4 text-slate-800" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Secondary Sidebar Content */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-1.5 w-6 rounded-full bg-slate-400" />
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">RECENT ACTIVITY</h2>
          </div>

          <div className="lux-glass rounded-[36px] p-6">
            <div className="space-y-6">
              {stats.recentOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-900 truncate">{o.customer_name}</div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{o.order_code}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-900">{formatMMK(o.total)}</div>
                    <div className={`mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${o.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {o.status.split('_').join(' ').toUpperCase()}
                    </div>
                  </div>
                </div>
              ))}
              {stats.recentOrders.length === 0 && (
                <div className="text-center py-10">
                  <ShoppingBag className="mx-auto h-12 w-12 text-slate-200" />
                  <div className="mt-3 text-sm text-slate-500">Wait for your first sale!</div>
                </div>
              )}
            </div>

            <Link to="/admin/orders" className="mt-8 block w-full rounded-2xl bg-slate-900 py-4 text-center text-sm font-bold text-white transition hover:bg-slate-800">
              View All Orders
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon: Icon, trend, bgColor }) {
  return (
    <div className="lux-glass group relative overflow-hidden rounded-[36px] p-8 transition hover:shadow-2xl">
      <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full ${bgColor} opacity-[0.03] transition-transform group-hover:scale-150`} />
      <div className="flex items-center justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${bgColor} text-white shadow-lg`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div className="mt-6">
        <div className="text-3xl font-black text-slate-900 tracking-tight">{value}</div>
        <div className="mt-1 text-sm font-bold text-slate-500 flex items-center gap-2">
          {label}
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{trend}</span>
        </div>
      </div>
    </div>
  )
}
