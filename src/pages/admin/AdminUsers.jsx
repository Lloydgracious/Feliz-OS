import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import LoadingSpinner from '../../components/LoadingSpinner'
import Button from '../../components/Button'
import { adminListProfiles, adminSetProfileRole } from '../../lib/adminApi'

export default function AdminUsers() {
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState(null)
  const [users, setUsers] = useState([])

  async function load() {
    setLoading(true)
    try {
      const data = await adminListProfiles()
      setUsers(data ?? [])
    } catch (e) {
      toast.error(e?.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function setRole(userId, nextRole) {
    setSavingId(userId)
    const t = toast.loading('Saving…')
    try {
      await adminSetProfileRole(userId, nextRole)
      toast.success('Updated', { id: t })
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: nextRole } : u)))
    } catch (e) {
      toast.error(e?.message || 'Update failed', { id: t })
    } finally {
      setSavingId(null)
    }
  }

  if (loading) return <LoadingSpinner label="Loading users" />

  return (
    <div className="space-y-6">
      
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-slate-900">Users</div>
          <div className="mt-1 text-sm text-slate-700">
            Promote authenticated users to admin. A user must sign up / log in once to appear here.
          </div>
        </div>
        <Button onClick={load}>Refresh</Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-white/15">
        <div className="grid grid-cols-[1.2fr_0.7fr_0.8fr] gap-3 bg-white/25 px-4 py-3 text-xs font-semibold tracking-[0.2em] text-sky-700/80">
          <div>EMAIL</div>
          <div>ROLE</div>
          <div className="text-right">ACTIONS</div>
        </div>
        <div className="divide-y divide-white/10">
          {users.map((u) => {
            const isBusy = savingId === u.id
            return (
              <div key={u.id} className="grid grid-cols-[1.2fr_0.7fr_0.8fr] gap-3 px-4 py-4 text-sm">
                <div className="text-slate-900 font-semibold">{u.email || u.id}</div>
                <div className="text-slate-800">{u.role}</div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="rounded-2xl border border-white/20 bg-white/30 px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-white/45 disabled:opacity-60"
                    disabled={isBusy || u.role === 'admin'}
                    onClick={() => setRole(u.id, 'admin')}
                  >
                    Make admin
                  </button>
                  <button
                    type="button"
                    className="rounded-2xl border border-white/20 bg-white/15 px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-white/30 disabled:opacity-60"
                    disabled={isBusy || u.role !== 'admin'}
                    onClick={() => setRole(u.id, 'user')}
                  >
                    Remove admin
                  </button>
                </div>
              </div>
            )
          })}
          {users.length === 0 && <div className="p-6 text-sm text-slate-700">No users yet.</div>}
        </div>
      </div>
    </div>
  )
}
