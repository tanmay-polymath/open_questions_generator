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

    const path = join(process.cwd(),"public","tempFiles","currFile.pdf")
    await writeFile(path, buffer)    

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