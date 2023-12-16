/*import type { NextApiRequest, NextApiResponse } from 'next'
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ name: 'John Doe' })
}
*/

import { NextResponse } from "next/server";

export async function GET() {
  return  NextResponse.json({hello:"World"});
}
