import Container from './Container'

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/15 bg-white/30">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="text-lg font-semibold text-slate-900">Feliz</div>
          <p className="mt-3 text-sm text-slate-700">
            Luxury Chinese-knot bracelets & keychains — handcrafted with cultural meaning and modern restraint. Bring ur joy with Feliz.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-900">Care</div>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>Hand-tied silk cords</li>
            <li>Keep dry & store flat</li>
            <li>Wipe metal accents softly</li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-900">Studio</div>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>Made-to-order customization</li>
            <li>Worldwide shipping</li>
            <li>Gift-ready packaging</li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-900">Newsletter</div>
          <p className="mt-3 text-sm text-slate-700">Quiet drops, artisan stories, and cultural notes.</p>
          <div className="mt-4 flex gap-2">
            <input
              className="lux-ring w-full rounded-2xl border border-white/30 bg-white/35 px-4 py-3 text-sm"
              placeholder="Email address"
            />
            <button className="rounded-2xl bg-sky-600 px-4 text-sm font-semibold text-white">Join</button>
          </div>
        </div>
      </Container>
      <div className="border-t border-white/10 py-6 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} Feliz. All rights reserved.
      </div>
    </footer>
  )
}
