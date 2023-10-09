import { NextRequest, NextResponse } from "next/server"
import { YoutubeTranscript } from "youtube-transcript"

import { Transcript_Obj } from "@/utils/types"

export async function POST(request: NextRequest) {
  try {
    console.log("transcribe api hit")
    const body = await request.json()

    console.log(body);

    const res = await YoutubeTranscript.fetchTranscript(body.vid, {
      lang: "en",
    })

    if (!res) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Failed to get transcripts",
        })
      )
    }

    let text: string = ""

    res.forEach((val: Transcript_Obj) => {
        text += ` ${val.text}`
    })

    return new Response(
      JSON.stringify({
        success: true,
        res,
        transcript: text,
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
