import Container from '../components/Container'
import PageTransition from '../components/PageTransition'

export default function PlaceholderPage({ title, subtitle }) {
  return (
    <PageTransition>
      <Container className="py-16">
        <div className="lux-glass rounded-3xl p-10">
          <h1 className="text-4xl text-slate-900">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-700">{subtitle}</p>
        </div>
      </Container>
    </PageTransition>
  )
}
