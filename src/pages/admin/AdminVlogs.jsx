import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { adminDeleteDoc, adminListVlogExps, adminListVlogVideos, adminUpsertDoc } from '../../lib/adminApi'
import LoadingSpinner from '../../components/LoadingSpinner'
import Modal from '../../components/Modal'
import Button from '../../components/Button'

function emptyVideo() {
  return { id: '', title: '', url: '', note: '', sort_order: 100 }
}

function emptyExp() {
  return { id: '', date: '', title: '', mood: '', image: '', text: '', sort_order: 100 }
}

function useTabState() {
  const [tab, setTab] = useState('videos')
  return { tab, setTab }
}

export default function AdminVlogs() {
  const { tab, setTab } = useTabState()

  const [videos, setVideos] = useState([])
  const [exps, setExps] = useState([])
  const [loading, setLoading] = useState(true)

  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [mode, setMode] = useState('videos')
  const [draftVideo, setDraftVideo] = useState(emptyVideo())
  const [draftExp, setDraftExp] = useState(emptyExp())

  const isEdit = useMemo(() => {
    return mode === 'videos' ? !!draftVideo.id : !!draftExp.id
  }, [mode, draftVideo, draftExp])

  async function load() {
    setLoading(true)
    try {
      const [vd, ed] = await Promise.all([adminListVlogVideos(), adminListVlogExps()])
      setVideos(vd ?? [])
      setExps(ed ?? [])
    } catch (e) {
      toast.error(e?.message || 'Failed to load vlogs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function openCreate(nextMode) {
    setMode(nextMode)
    if (nextMode === 'videos') setDraftVideo(emptyVideo())
    else setDraftExp(emptyExp())
    setOpen(true)
  }

  function openEdit(nextMode, row) {
    setMode(nextMode)
    if (nextMode === 'videos') setDraftVideo({ ...row })
    else setDraftExp({ ...row, date: row.date ?? '' })
    setOpen(true)
  }

  async function remove(nextMode, id) {
    const ok = confirm('Delete this post?')
    if (!ok) return

    const t = toast.loading('Deleting…')
    try {
      const table = nextMode === 'videos' ? 'vlog_video_posts' : 'vlog_experience_posts'
      await adminDeleteDoc(table, id)
      toast.success('Deleted', { id: t })
      await load()
    } catch (e) {
      toast.error(e?.message || 'Delete failed', { id: t })
    }
  }

  async function save() {
    setSaving(true)

    const t = toast.loading(isEdit ? 'Saving…' : 'Creating…')
    try {
      if (mode === 'videos') {
        const id = draftVideo.id || ((typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') ? crypto.randomUUID() : Math.random().toString(36).slice(2))
        const payload = {
          id,
          title: draftVideo.title?.trim(),
          url: draftVideo.url?.trim(),
          note: draftVideo.note || null,
          sort_order: Number(draftVideo.sort_order) || 0,
        }
        if (!payload.title || !payload.url) throw new Error('Title and URL are required')

        if (isEdit) {
          await adminUpsertDoc('vlog_video_posts', id, payload)
        } else {
          await adminUpsertDoc('vlog_video_posts', id, payload)
        }
      } else {
        const id = draftExp.id || ((typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') ? crypto.randomUUID() : Math.random().toString(36).slice(2))
        const payload = {
          id,
          date: draftExp.date || null,
          title: draftExp.title?.trim(),
          mood: draftExp.mood || null,
          image: draftExp.image || null,
          text: draftExp.text || null,
          sort_order: Number(draftExp.sort_order) || 0,
        }
        if (!payload.title) throw new Error('Title is required')

        if (isEdit) {
          await adminUpsertDoc('vlog_experience_posts', id, payload)
        } else {
          await adminUpsertDoc('vlog_experience_posts', id, payload)
        }
      }

      toast.success(isEdit ? 'Saved' : 'Created', { id: t })
      setOpen(false)
      await load()
    } catch (e) {
      toast.error(e?.message || 'Save failed', { id: t })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner label="Loading vlogs" />

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-900">Vlogs</div>
          <div className="mt-1 text-sm text-slate-700">Manage video posts and experience posts.</div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => openCreate('videos')}>
            New video
          </Button>
          <Button onClick={() => openCreate('experiences')}>New experience</Button>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          className={`rounded-2xl px-4 py-2 text-sm font-semibold ${tab === 'videos' ? 'bg-white/50 text-slate-900' : 'bg-white/15 text-slate-700 hover:bg-white/25'
            }`}
          onClick={() => setTab('videos')}
        >
          Videos ({videos.length})
        </button>
        <button
          type="button"
          className={`rounded-2xl px-4 py-2 text-sm font-semibold ${tab === 'experiences' ? 'bg-white/50 text-slate-900' : 'bg-white/15 text-slate-700 hover:bg-white/25'
            }`}
          onClick={() => setTab('experiences')}
        >
          Experiences ({exps.length})
        </button>
      </div>

      <div className="mt-6 grid gap-4">
        {tab === 'videos' &&
          videos.map((v) => (
            <div key={v.id} className="lux-glass rounded-3xl p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="text-base font-semibold text-slate-900">{v.title}</div>
                  <div className="mt-1 text-xs text-slate-600 break-all">{v.url}</div>
                  {v.note && <div className="mt-2 text-sm text-slate-700">{v.note}</div>}
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => openEdit('videos', v)}>
                    Edit
                  </Button>
                  <Button variant="ghost" onClick={() => remove('videos', v.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}

        {tab === 'experiences' &&
          exps.map((p) => (
            <div key={p.id} className="lux-glass rounded-3xl p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="text-base font-semibold text-slate-900">{p.title}</div>
                  <div className="mt-1 text-xs text-slate-600">
                    {p.date ? String(p.date) : 'No date'} {p.mood ? `• ${p.mood}` : ''}
                  </div>
                  {p.text && <div className="mt-2 text-sm text-slate-700 line-clamp-3">{p.text}</div>}
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => openEdit('experiences', p)}>
                    Edit
                  </Button>
                  <Button variant="ghost" onClick={() => remove('experiences', p.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}

        {tab === 'videos' && videos.length === 0 && <div className="text-sm text-slate-600">No videos yet.</div>}
        {tab === 'experiences' && exps.length === 0 && <div className="text-sm text-slate-600">No experiences yet.</div>}
      </div>

      <Modal open={open} title={mode === 'videos' ? (isEdit ? 'Edit video' : 'New video') : isEdit ? 'Edit experience' : 'New experience'} onClose={() => !saving && setOpen(false)}>
        <div className="grid gap-4">
          {mode === 'videos' ? (
            <>
              <label className="grid gap-2">
                <span className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">TITLE</span>
                <input
                  className="lux-ring rounded-2xl border border-white/25 bg-white/40 px-4 py-3 text-sm"
                  value={draftVideo.title}
                  onChange={(e) => setDraftVideo((d) => ({ ...d, title: e.target.value }))}
                />
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">
                  VIDEO URL (YOUTUBE OR DIRECT FILE)
                </span>
                <input
                  className="lux-ring rounded-2xl border border-white/25 bg-white/40 px-4 py-3 text-sm"
                  value={draftVideo.url}
                  onChange={(e) => setDraftVideo((d) => ({ ...d, url: e.target.value }))}
                  placeholder="YouTube embed URL or https://.../your-video.mp4"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">NOTE</span>
                <input
                  className="lux-ring rounded-2xl border border-white/25 bg-white/40 px-4 py-3 text-sm"
                  value={draftVideo.note}
                  onChange={(e) => setDraftVideo((d) => ({ ...d, note: e.target.value }))}
                />
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">SORT ORDER</span>
                <input
                  className="lux-ring rounded-2xl border border-white/25 bg-white/40 px-4 py-3 text-sm"
                  type="number"
                  value={draftVideo.sort_order}
                  onChange={(e) => setDraftVideo((d) => ({ ...d, sort_order: e.target.value }))}
                />
              </label>
            </>
          ) : (
            <>
              <label className="grid gap-2">
                <span className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">TITLE</span>
                <input
                  className="lux-ring rounded-2xl border border-white/25 bg-white/40 px-4 py-3 text-sm"
                  value={draftExp.title}
                  onChange={(e) => setDraftExp((d) => ({ ...d, title: e.target.value }))}
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">DATE</span>
                  <input
                    className="lux-ring rounded-2xl border border-white/25 bg-white/40 px-4 py-3 text-sm"
                    type="date"
                    value={draftExp.date ?? ''}
                    onChange={(e) => setDraftExp((d) => ({ ...d, date: e.target.value }))}
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">MOOD</span>
                  <input
                    className="lux-ring rounded-2xl border border-white/25 bg-white/40 px-4 py-3 text-sm"
                    value={draftExp.mood}
                    onChange={(e) => setDraftExp((d) => ({ ...d, mood: e.target.value }))}
                  />
                </label>
              </div>
              <div className="grid gap-2">
                <span className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">IMAGE URL</span>
                <div className="grid gap-3">
                  <input
                    className="lux-ring rounded-2xl border border-white/25 bg-white/40 px-4 py-3 text-sm"
                    value={draftExp.image}
                    onChange={(e) => setDraftExp((d) => ({ ...d, image: e.target.value }))}
                    placeholder="https://…"
                  />
                  <div className="flex flex-col gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      className="text-xs text-slate-600"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        const t = toast.loading('Reading image…')
                        try {
                          const { uploadPublicImage } = await import('../../lib/storage')
                          const b64 = await uploadPublicImage({ file })
                          setDraftExp((d) => ({ ...d, image: b64 }))
                          toast.success('Ready (storing in database)', { id: t })
                        } catch (err) {
                          toast.error('Failed to read image', { id: t })
                        } finally {
                          e.target.value = ''
                        }
                      }}
                    />
                    <div className="text-[10px] leading-relaxed text-slate-500">
                      Photos are stored directly in the database. Please use small/optimized images (under 1MB).
                    </div>
                  </div>
                </div>
              </div>
              <label className="grid gap-2">
                <span className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">TEXT</span>
                <textarea
                  className="lux-ring min-h-28 rounded-2xl border border-white/25 bg-white/40 px-4 py-3 text-sm"
                  value={draftExp.text}
                  onChange={(e) => setDraftExp((d) => ({ ...d, text: e.target.value }))}
                />
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">SORT ORDER</span>
                <input
                  className="lux-ring rounded-2xl border border-white/25 bg-white/40 px-4 py-3 text-sm"
                  type="number"
                  value={draftExp.sort_order}
                  onChange={(e) => setDraftExp((d) => ({ ...d, sort_order: e.target.value }))}
                />
              </label>
            </>
          )}

          <div className="mt-2 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
