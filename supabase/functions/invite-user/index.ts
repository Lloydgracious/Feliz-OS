// Supabase Edge Function: invite-user
// Invite a user by email (admin-only)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

type Payload = { email?: string }

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'content-type': 'application/json' },
      })
    }

    const url = Deno.env.get('SUPABASE_URL')
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!url || !anonKey || !serviceRoleKey) {
      return new Response(JSON.stringify({ error: 'Missing Supabase env vars' }), {
        status: 500,
        headers: { 'content-type': 'application/json' },
      })
    }

    const authHeader = req.headers.get('Authorization') || ''

    // Client bound to the caller's JWT (to identify who is calling)
    const supabaseCaller = createClient(url, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const {
      data: { user },
      error: userErr,
    } = await supabaseCaller.auth.getUser()

    if (userErr || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'content-type': 'application/json' },
      })
    }

    // Admin client
    const supabaseAdmin = createClient(url, serviceRoleKey)

    // Check admin role
    const { data: profile, error: profileErr } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle()

    if (profileErr) throw profileErr
    if (profile?.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'content-type': 'application/json' },
      })
    }

    const body = (await req.json().catch(() => ({}))) as Payload
    const email = (body.email ?? '').trim().toLowerCase()

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Valid email is required' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      })
    }

    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email)
    if (error) throw error

    return new Response(JSON.stringify({ ok: true, user: data.user }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: e?.message || 'Unknown error' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    })
  }
})
