import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const supabase = createPagesServerClient({ req, res })
  const { code } = req.query

  if (code) {
    await supabase.auth.exchangeCodeForSession(String(code))
  }

  res.redirect('/')
}