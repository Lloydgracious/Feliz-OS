import { useEffect, useMemo, useRef, useState } from 'react'
import { Download, ImageDown, FileDown, TriangleAlert } from 'lucide-react'
import Container from '../components/Container'
import PageTransition from '../components/PageTransition'
import SectionHeading from '../components/SectionHeading'
import Button from '../components/Button'
import { formatMMK } from '../lib/utils'
import { exportNodeToPdf, exportNodeToPng } from '../lib/receiptExport'

const STORAGE_KEY = 'feliz:lastReceipt'

function downloadText(filename, text) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function Receipt() {
  const [receipt, setReceipt] = useState(null)
  const printRef = useRef(null)

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    try {
      setReceipt(JSON.parse(raw))
    } catch {
      // ignore
    }
  }, [])

  const total = useMemo(() => {
    if (!receipt) return 0
    return (receipt.items ?? []).reduce((sum, i) => sum + i.price * i.quantity, 0)
  }, [receipt])

  return (
    <PageTransition>
      <Container className="py-14">
        <SectionHeading
          eyebrow="Receipt"
          title="Your last order receipt"
          subtitle="Your receipt for this order."
        />

        {!receipt ? (
          <div className="mt-10 lux-glass rounded-[36px] p-8 text-sm text-slate-700">
            No receipt found on this device yet.
          </div>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div ref={printRef} className="lux-glass rounded-[36px] p-6 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Feliz Receipt</div>
                  <div className="mt-1 text-xs text-slate-600">Order ID: {receipt.id}</div>
                  <div className="mt-1 text-xs text-slate-600">Date: {new Date(receipt.createdAt).toLocaleString()}</div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="secondary"
                    onClick={async () => {
                      if (!printRef.current) return
                      await exportNodeToPng(printRef.current, `feliz-receipt-${receipt.id}.png`)
                    }}
                    type="button"
                  >
                    <ImageDown className="h-4 w-4" /> PNG
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={async () => {
                      if (!printRef.current) return
                      await exportNodeToPdf(printRef.current, `feliz-receipt-${receipt.id}.pdf`)
                    }}
                    type="button"
                  >
                    <FileDown className="h-4 w-4" /> PDF
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      const lines = [
                        `Feliz Receipt`,
                        `Order ID: ${receipt.id}`,
                        `Date: ${new Date(receipt.createdAt).toLocaleString()}`,
                        `Name: ${receipt.customer?.name || ''}`,
                        `Phone: ${receipt.customer?.phone || ''}`,
                        `Address: ${receipt.customer?.address || ''}`,
                        '',
                        'Items:',
                        ...(receipt.items ?? []).map((i) => `- ${i.name} x${i.quantity} = ${formatMMK(i.price * i.quantity)}`),
                        '',
                        `Total: ${formatMMK(total)}`,
                        '',
                        'Keep this receipt for your records.',
                      ]
                      downloadText(`feliz-receipt-${receipt.id}.txt`, lines.join('\n'))
                    }}
                    type="button"
                  >
                    <Download className="h-4 w-4" /> TXT
                  </Button>
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-white/15 bg-white/15 px-5 py-4 text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <TriangleAlert className="mt-0.5 h-5 w-5" />
                  <div>
                    <div className="font-semibold">Notes</div>
                    <div className="mt-1 text-xs opacity-80">
                      Your receipt details are shown below.
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">ORDER SUMMARY</div>
                <div className="mt-4 space-y-3">
                  {(receipt.items ?? []).map((i) => (
                    <div key={i.id} className="rounded-3xl border border-white/15 bg-white/15 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-sm font-semibold text-slate-900">{i.name}</div>
                          {i.meta && <div className="mt-1 text-xs text-slate-600">{i.meta}</div>}
                          <div className="mt-2 text-xs text-slate-600">Qty: {i.quantity}</div>
                        </div>
                        <div className="text-sm font-semibold text-slate-900">{formatMMK(i.price * i.quantity)}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 border-t border-white/15 pt-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-700">Total</div>
                    <div className="text-base font-semibold text-slate-900">{formatMMK(total)}</div>
                  </div>
                </div>
              </div>
            </div>

            <aside className="lux-glass rounded-[36px] p-6 sm:p-8">
              <div className="text-sm font-semibold text-slate-900">Payment slip</div>
              <div className="mt-4 overflow-hidden rounded-3xl border border-white/15 bg-white/10">
                {receipt.proofDataUrl ? (
                  <img src={receipt.proofDataUrl} alt="Transfer screenshot" className="w-full object-cover" />
                ) : (
                  <div className="grid aspect-video place-items-center text-sm text-slate-700">No image stored</div>
                )}
              </div>
              <div className="mt-3 text-xs text-slate-600">
                Stored locally for the last order only.
              </div>
            </aside>
          </div>
        )}
      </Container>
    </PageTransition>
  )
}

export { STORAGE_KEY }
