
import { NextResponse } from "next/server";


export async function GET() {
  return  NextResponse.json({
    products: [
        {
            id: 1,
            name:"koukou",
        }

    ],
});
}


export async function POST(req: Request) {
    const data = await req.json();
    return  NextResponse.json({
      data,
  });
  }
  