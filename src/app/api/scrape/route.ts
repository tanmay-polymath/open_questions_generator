import { NextRequest, NextResponse } from "next/server"
// import {JSDOM} from "jsdom"

// export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    console.log("scrape api hit")
    const body = await request.json()
    console.log(body);

    

    return new Response(
      JSON.stringify({
        success: true,
      })
    )
  } catch (error: any) {
    console.log(error)

    return new NextResponse(
      JSON.stringify({
        message: error.message,
        success: false,
      })
    )
  }
}