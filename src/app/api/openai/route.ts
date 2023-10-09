import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

export const dynamic = "force-dynamic"
export const runtime = "edge"

export async function POST(request: NextRequest) {
  try {
    console.log("openai api hit")
    const body = await request.json()
    console.log(body);

    const mssg: string = body.message

    const openai = new OpenAI({
      apiKey: `${process.env.NEXT_PUBLIC_OPENAI_KEY}`,
    })

    const res = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Your are a helpful teaching assistent",
        },
        {
          role: "user",
          content: mssg,
        },
      ],
    })

    console.log(res)

    return new Response(
      JSON.stringify({
        success: true,
        message: res.choices[0].message.content,
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