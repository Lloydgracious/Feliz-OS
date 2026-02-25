import { motion } from 'framer-motion'
import Container from '../components/Container'
import PageTransition from '../components/PageTransition'
import SectionHeading from '../components/SectionHeading'
import { useVlogExperiencePosts, useVlogVideoPosts } from '../lib/useStoreData'
import LoadingSpinner from '../components/LoadingSpinner'

import { useState } from 'react'
import Modal from '../components/Modal'

function isYouTubeUrl(url) {
  if (!url) return false
  const u = String(url)
  return u.includes('youtube.com') || u.includes('youtu.be')
}

function getYouTubeEmbedUrl(url) {
  if (!url) return ''
  const u = String(url)
  // Handle already embedded links
  if (u.includes('/embed/')) return u

  let videoId = ''
  if (u.includes('v=')) {
    videoId = u.split('v=')[1]?.split('&')[0]
  } else if (u.includes('youtu.be/')) {
    videoId = u.split('youtu.be/')[1]?.split('?')[0]
  }

  return videoId ? `https://www.youtube.com/embed/${videoId}` : u
}

export default function Blog() {
  const [activePost, setActivePost] = useState(null)

  const { data: videoPosts, loading: loadingVideos } = useVlogVideoPosts()
  const { data: experiencePosts, loading: loadingExperiences } = useVlogExperiencePosts()

  return (
    <PageTransition>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(900px_450px_at_15%_20%,rgba(124,199,255,0.40),transparent_60%),linear-gradient(180deg,rgba(255,255,255,0.85),rgba(255,255,255,0.2))]" />
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1602526219090-7df8e2a9f0a0?auto=format&fit=crop&w=1800&q=60)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/35 to-white/10" />
        </div>

        <Container className="relative py-14">
          <div className="lux-glass rounded-[36px] p-8 sm:p-10">
            <div className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">VLOG</div>
            <h1 className="mt-2 text-4xl text-slate-900 sm:text-5xl">Videos & fun studio experiences</h1>
            <p className="mt-4 max-w-2xl text-sm text-slate-700">
              A creator-style feed for Feliz: short story posts + embedded videos.
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-14">
        <SectionHeading
          eyebrow="Videos"
          title="Watch & learn"
          subtitle="A curated set of tutorials and studio clips."
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {loadingVideos ? (
            <div className="lux-glass rounded-3xl p-10 lg:col-span-2">
              <LoadingSpinner label="Loading videos" />
            </div>
          ) : (
            (videoPosts ?? []).map((v, idx) => (
              <motion.div
                key={v.id}
                className="lux-glass rounded-3xl p-4"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
              >
                <div className="text-sm font-semibold text-slate-900">{v.title}</div>
                <div className="mt-1 text-sm text-slate-700">{v.note}</div>
                <div className="mt-3 overflow-hidden rounded-2xl border border-white/15 bg-white/10">
                  {isYouTubeUrl(v.url) ? (
                    <iframe
                      className="aspect-video w-full"
                      src={getYouTubeEmbedUrl(v.url)}
                      title={v.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video className="aspect-video w-full" src={v.url} title={v.title} controls />
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>

        <div className="mt-16">
          <SectionHeading
            eyebrow="Storytime"
            title="Small moments from the studio"
            subtitle="Small moments from the studio."
          />

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {loadingExperiences ? (
              <div className="lux-glass rounded-3xl p-10 md:col-span-2">
                <LoadingSpinner label="Loading posts" />
              </div>
            ) : (
              (experiencePosts ?? []).map((p, idx) => (
                <motion.article
                  key={p.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setActivePost(p)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setActivePost(p)
                  }}
                  className="lux-glass group cursor-pointer rounded-3xl p-4 transition hover:bg-white/20"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                >
                  <div className="overflow-hidden rounded-2xl">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="h-52 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="rounded-full border border-white/25 bg-white/25 px-3 py-1 text-[11px] font-semibold text-slate-800">
                      {p.mood}
                    </div>
                    <div className="text-xs text-slate-600">{p.date}</div>
                  </div>

                  <div className="mt-3 text-xl text-slate-900">{p.title}</div>
                  <p className="mt-2 text-sm text-slate-700">{p.text}</p>
                </motion.article>
              ))
            )}
          </div>
        </div>
      </Container>

      <Modal open={!!activePost} title={activePost?.title ?? 'Story'} onClose={() => setActivePost(null)}>
        {activePost && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="overflow-hidden rounded-3xl border border-white/15 bg-white/10">
              <img src={activePost.image} alt={activePost.title} className="h-72 w-full object-cover" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="rounded-full border border-white/25 bg-white/25 px-3 py-1 text-[11px] font-semibold text-slate-800">
                  {activePost.mood}
                </div>
                <div className="text-xs text-slate-600">{activePost.date}</div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-700">{activePost.text}</p>
            </div>
          </div>
        )}
      </Modal>
    </PageTransition>
  )
}
