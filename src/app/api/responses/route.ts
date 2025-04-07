import { storeScreenerResponse } from "@/api/response"
import { NextResponse, NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    await storeScreenerResponse(body)
    return NextResponse.json({ message: 'Assessment screener response saved' }, { status: 200 })
  } catch (error) {
    console.error('Error processing request: ', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}