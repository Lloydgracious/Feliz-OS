const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()
const { FieldValue } = admin.firestore

function docRef(collection, id) {
  return db.collection(collection).doc(id)
}

async function upsertWithTimestamps(collection, id, data) {
  await docRef(collection, id).set(
    {
      ...data,
      id,
      updated_at: FieldValue.serverTimestamp(),
      created_at: FieldValue.serverTimestamp(),
    },
    { merge: true },
  )
}

async function upsertSetting(key, value) {
  await docRef('site_settings', key).set(
    {
      key,
      value,
      updated_at: FieldValue.serverTimestamp(),
      created_at: FieldValue.serverTimestamp(),
    },
    { merge: true },
  )
}

async function main() {
  const projectId = serviceAccount.project_id || process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT
  console.log(`Seeding Firestore for project: ${projectId || '(unknown project)'}…`)

  // Home settings
  await Promise.all([
    upsertSetting('home_hero_badge', 'FELIZ • HANDMADE'),
    upsertSetting('home_hero_title', 'Handmade knots, made with love'),
    upsertSetting('home_hero_subtitle', 'Bracelets, keychains, and custom colors — crafted in our studio.'),
    upsertSetting(
      'home_hero_image',
      'https://images.unsplash.com/photo-1520975958225-2c532c9d6f44?auto=format&fit=crop&w=1600&q=60',
    ),
    upsertSetting('home_collection_eyebrow', 'Collection'),
    upsertSetting('home_collection_title', 'Best sellers'),
    upsertSetting('home_collection_subtitle', 'A few favorites to get you started.'),
  ])

  // Shop settings
  await Promise.all([
    upsertSetting('shop_eyebrow', 'Shop'),
    upsertSetting('shop_title', 'Browse the collection'),
    upsertSetting('shop_subtitle', 'Pick your colors and knot style.'),
    upsertSetting('shop_banner', 'Custom orders available — message us with your idea.'),
  ])

  // Products
  const products = [
    {
      id: 'p-ice-knot-bracelet',
      type: 'Bracelet',
      category: 'Knots',
      name: 'Ice Knot Bracelet',
      knot: 'Square knot',
      colors: ['ice', 'white', 'silver'],
      price: 12000,
      image:
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=60',
      description: 'A clean, icy palette with a classic knot. Comfortable for everyday wear.',
      show_on_home: true,
      sort_order: 10,
    },
    {
      id: 'p-sky-keychain',
      type: 'Keychain',
      category: 'Accessories',
      name: 'Sky Keychain',
      knot: 'Spiral',
      colors: ['sky', 'navy', 'white'],
      price: 8000,
      image:
        'https://images.unsplash.com/photo-1617791160536-598cf32026fb?auto=format&fit=crop&w=1600&q=60',
      description: 'A small everyday charm with sky tones and a spiral knot.',
      show_on_home: true,
      sort_order: 20,
    },
    {
      id: 'p-sunset-bracelet',
      type: 'Bracelet',
      category: 'Knots',
      name: 'Sunset Bracelet',
      knot: 'Chevron',
      colors: ['coral', 'peach', 'gold'],
      price: 15000,
      image:
        'https://images.unsplash.com/photo-1520975693410-00120b7d59a6?auto=format&fit=crop&w=1600&q=60',
      description: 'Warm sunset tones with a bold chevron pattern.',
      show_on_home: false,
      sort_order: 30,
    },
  ]
  for (const p of products) {
    await upsertWithTimestamps('products', p.id, p)
  }

  // Vlog videos (YouTube embed URLs)
  const vlogVideos = [
    {
      id: 'vv-1',
      title: 'How to tie a clean square knot',
      url: 'https://www.youtube.com/embed/G3e-cpL7ofc',
      note: 'A quick tutorial on the basics.',
      sort_order: 10,
    },
    {
      id: 'vv-2',
      title: 'Choosing colors that match',
      url: 'https://www.youtube.com/embed/1PnVor36_40',
      note: 'Simple color pairing tips for your next bracelet.',
      sort_order: 20,
    },
  ]
  for (const v of vlogVideos) {
    await upsertWithTimestamps('vlog_video_posts', v.id, v)
  }

  // Vlog experiences (image + text)
  const vlogExps = [
    {
      id: 've-1',
      date: '2026-02-01',
      title: 'A calm studio afternoon',
      mood: 'peaceful',
      image:
        'https://images.unsplash.com/photo-1526481280695-3c687fd643ed?auto=format&fit=crop&w=1600&q=60',
      text: 'We tested a new color combo today — icy blue + silver. It turned out even better than expected.',
      sort_order: 10,
    },
    {
      id: 've-2',
      date: '2026-02-10',
      title: 'Packing day',
      mood: 'busy',
      image:
        'https://images.unsplash.com/photo-1520975867597-0fbc19ff7b7f?auto=format&fit=crop&w=1600&q=60',
      text: 'A big batch of orders went out today. Thank you for supporting handmade!',
      sort_order: 20,
    },
  ]
  for (const e of vlogExps) {
    await upsertWithTimestamps('vlog_experience_posts', e.id, e)
  }

  console.log('Seed complete.')
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    if (err?.code === 5) {
      console.error(
        '\nFirestore NOT_FOUND.\n' +
          'This usually means Cloud Firestore is not created/enabled yet for this Firebase project.\n' +
          'Fix: Firebase Console → Build → Firestore Database → Create database (Native mode), then rerun: npm run seed\n',
      )
    }
    console.error(err)
    process.exit(1)
  })

