import { storeScreenerResponse } from "@/api/response"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    await storeScreenerResponse(body)
    return NextResponse.json({ message: 'Assessment screener response saved' }, { status: 204 })
  } catch (error) {
    console.error('Error processing request: ', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}