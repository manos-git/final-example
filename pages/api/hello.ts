// https://nextjs.org/docs/app/building-your-application/routing/route-handlers
// http://localhost:8502/api/hello

import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ name: 'John Doe' })
}