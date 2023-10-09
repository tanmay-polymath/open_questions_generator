import { writeFile } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    console.log("file upload api hit")
    
    const data = await request.formData()
    const fileData: File | null = data.get('file') as unknown as File

    if(!fileData){
        return new Response(
            JSON.stringify({
              success: false,
            })
          )
    }

    const bytes = await fileData.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const textDecoder = new TextDecoder('utf-8');

    // Convert the ArrayBuffer to a Uint8Array
    const uint8Array = new Uint8Array(buffer);

    // Decode the Uint8Array to text
    const text = textDecoder.decode(uint8Array);

    // Print the decoded text
    console.log(text.toString());

    return new Response(
      JSON.stringify({
        success: true,
        res: text
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