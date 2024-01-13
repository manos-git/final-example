
import { NextResponse } from "next/server";
import { logger } from "@/logger"; // our logger import

export async function GET() {
    logger.info("Products GET called "); // calling our logger
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
    logger.info("Products POST called "); // calling our logger
    const data = await req.json();
    return  NextResponse.json({
      data,
  });
  }
  