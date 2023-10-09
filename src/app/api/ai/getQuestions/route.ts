import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

export const dynamic = "force-dynamic"
export const runtime = "edge"

export async function POST(request: NextRequest) {
  try {
    console.log("openai api hit")
    const body = await request.json()
    console.log(body);

    // const mssg: string = body.message

    const openai = new OpenAI({
      apiKey: `${process.env.NEXT_PUBLIC_OPENAI_KEY}`,
    })

    const mssg: string = `
    You are a teaching guide. You have to generate 1 multiple choice question from the given text enclosed in triple quotes '''${body.data}'''. Provide your response strictly as an Array of JSON objects (with proper formatting and indentations) of the following format only :-
    [{
        question: {generated question text},
        optionA: {1st choice of the multiple choices},
        optionB: {2nd choice of the multiple choices},
        optionC: {3rd choice of the multiple choices},
        optionD: {4th choice of the multiple choices},
        answer: {option for the correct choice, should be only the option name that is either "optionA","optionB","optionC" or "optionD"}
    }]
    `

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