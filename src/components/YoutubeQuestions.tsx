'use client'

import React, {useRef, useState} from 'react'
import toast from 'react-hot-toast';

import QuestionCard from './QuestionCard';

import { Question } from '@/utils/types';

const YoutubeQuestions = () => {

    const [parsingVideo, setParsingVideo] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false)
    const [vidTranscript, setVidTranscript] = useState<string>("")
    const [genQuestions,setGenQuestions] = useState<Question[]>([])

    const linkRef = useRef<HTMLInputElement>(null)

    const inputHandler = async () => {

        try {
            const inpVal = linkRef.current!.value.trim()
    
            if(inpVal.length === 0){
                toast.error("Please enter a YT Link")
            }
    
            const vid = inpVal.includes("youtu.be/")
            ? inpVal.split("youtu.be/")[1].split("?")[0]
            : inpVal.split("v=")[1].split("&")[0]
    
            if(!vid){
                toast.error("Please enter a valid link")
            } 

            setParsingVideo(true)

            const res = await fetch("/api/transcribeVid",{
                method: 'post',
                body: JSON.stringify({
                    vid
                })
            })

            const data = await res.json();

            setParsingVideo(false)

            if(!data.success){
                toast.error("Failed to fetch transcripts")
                return;
            }

            console.log(data.transcript);
            toast.success("Video parsed")  
            setVidTranscript(data.transcript)            
            
        } catch (error) {
            toast.error('Something went wrong')
            console.log('transcript front error');
            console.log(error);
            setParsingVideo(false)
        }
    }

    const parseQuestions = (inp: string): Question[] => {
        const qrr: Question[] = []
        // console.log("parse input :-")
        // console.log(inp)
    
        let s1: string[] = []
    
        const tt: string = inp.split("[")[1].trim().split("]")[0].trim()
    
        // console.log("tt")
        // console.log(tt)
    
        const cid = tt.lastIndexOf("}")
        const oid = tt.indexOf("{")
        s1 = tt.slice(oid + 1, cid).split("},")
    
        // console.log("s1")
        // console.log(s1)
    
        s1.forEach((val: string) => {
          const str = val.trim()
    
          const tArr = str.split(",\n")
        //   console.log("tArr")
        //   console.log(tArr)
    
          const question = tArr[0].trim().split(": ")[1].slice(1, -1)
          const optionA = tArr[1].trim().split(": ")[1].slice(1, -1)
          const optionB = tArr[2].trim().split(": ")[1].slice(1, -1)
          const optionC = tArr[3].trim().split(": ")[1].slice(1, -1)
          const optionD = tArr[4].trim().split(": ")[1].slice(1, -1)
          const answer = tArr[5].trim().split(": ")[1].slice(1, -1)
    
          qrr.push({
            question,
            optionA,
            optionB,
            optionC,
            optionD,
            answer,
          })
        })
    
        // console.log("parsed:-")
        // console.log(qrr)
    
        return qrr
    }

    const generateQuestions = async () => {
        try {
            //   const count = qnoRef.current!.value

            const trsLen = vidTranscript.length
            const contextArr: string[] = [];
            let qArr: Question[] = []

            for(let i = 0 ; i < trsLen; i += 1000){
                contextArr.push(vidTranscript.slice(i,i+1000));
            }

            console.log("contextArr");
            console.log(contextArr);

            setLoading(true)

            const res = await Promise.all(
                contextArr.map((val: string) => {
                    return fetch("/api/ai/getQuestions",{
                        method: 'post',
                        body: JSON.stringify({
                            data: val
                        })
                    })
                })
            )

            const qLen = res.length

            for(let i = 0 ; i < qLen ; i++){
                const data = await res[i].json();
                // console.log(data.message);

                if(!data.success){
                    toast.error("Failed to generate questions")
                    return;
                }

                const tArr = parseQuestions(data.message)
                qArr = [...qArr, ...tArr]
            }

            setLoading(false)

            toast.success("Questions generated")
            console.log(qArr);     
            
            setGenQuestions(qArr)
         
        } catch (error) {
        //   generateQuestions()
            toast.error("Someting went wrong")
            setLoading(false)
            console.log(error)
        }
    }

  return (
    <div
        className = "w-full flex-col items-center"
    >
        <div
        >
            <label 
                htmlFor="ytLink"
                className = "block text-xl font-bold mb-2"
            >
                Enter Youtube Video Link:
            </label>
            <input 
                type="text" 
                id = "ytLink" 
                ref = {linkRef}
                className = "w-full border-2 border-black rounded-md text-xl p-2"
            />
        </div>
        <button
            className = "text-lg font-bold bg-black text-white px-3 py-2 rounded-md mt-2 hover:bg-slate-800"
            onClick = {inputHandler}
        >
            {parsingVideo? "Parsing...":"Parse Video"}
        </button>
        {vidTranscript.length > 0 &&
            <div
                className = "mt-7"
            >
                <button
                    className = "text-lg font-bold bg-black text-white px-3 py-2 rounded-md mt-2 hover:bg-slate-800"
                    onClick = {generateQuestions}
                >
                    {loading? "Generating...":"Generate Questions"}
                </button>
                {/* Questions */}
                <div
                    className = "border-2 border-black border-dashed rounded-md p-1 mt-5 flex flex-col w-full gap-4"
                >
                    {genQuestions.map((val:Question, idx:number) => (
                        <QuestionCard
                            question={val}
                            key = {idx}
                        />
                    ))
                    }
                </div>
            </div>
        }
    </div>
  )
}

export default YoutubeQuestions