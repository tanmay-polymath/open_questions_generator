import { writeFile } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import { join } from 'path'
import { PdfReader } from 'pdfreader'

export async function GET(request: NextRequest) {
  try {
    console.log("file read api hit")
    
    const path = join(process.cwd(),"public","tempFiles","currFile.pdf")

    let str = ""

    const temp = new PdfReader(null).parseFileItems(path, (err,data) => {
        if(err){
            console.log(err);
        }
        else if(!data){
            console.log("end of file");
        }
        else if(data.text){
            str += `data.text`
            console.log(data.text);
        }
    })    

    return new Response(
      JSON.stringify({
        success: true,
        res: str
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