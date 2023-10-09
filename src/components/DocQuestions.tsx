'use client'

import React, {useState, useRef} from 'react'
import toast from 'react-hot-toast';

import { Question } from '@/utils/types';

import QuestionCard from './QuestionCard';

const DocQuestions = () => {

    const [uploadDoc, setUploadDoc] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false)
    const [currFile, setCurrFile] = useState<File>()
    const [genQuestions,setGenQuestions] = useState<Question[]>([])
    const [docData, setDocData] = useState<string>("")
  
    const uploadHandler = async () => {
  
      try {
  
          if(!currFile){
              toast.error("Add a file first")
              return;
          }
  
          const fileData = new FormData();
          fileData.set('file',currFile)
  
          setUploadDoc(true)
  
          const res = await fetch("/api/files/upload", {
              method: 'post',
              body: fileData
          })
  
          const data = await res.json();
          console.log(data);
  
          setUploadDoc(false)
  
        //   if(!data.file_text){
        //       toast.error("No text extracted from pdf")
        //       return;
        //   }
  
        //   const fileText: string = data.file_text.reduce((acc:string,arr: string) => {
        //       return `${acc} ${arr}`
        //   },"")
  
        //   console.log(fileText);
  
        //   toast.success("PDF parsed")
        //   setDocData(fileText)
  
          
      } catch (error) {
          console.log('file upload error');
          console.log(error);
          toast.error("Something went wrong")
          setUploadDoc(false)
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
  
          const trsLen = docData.length
          const contextArr: string[] = [];
          let qArr: Question[] = []
  
          for(let i = 0 ; i < trsLen; i += 1000){
              contextArr.push(docData.slice(i,i+1000));
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
                  htmlFor="docInp"
                  className = "block text-xl font-bold mb-2"
              >
                   Insert Document (*.doc,*.docx) below:
              </label>
              <input 
                  type= "file" 
                  id = "docInp" 
                  accept = ".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  // ref = {docRef}
                  onChange={(e) => {setCurrFile(e.target.files?.[0])}}
                  className = "w-full border-2 border-black rounded-md text-xl p-2"
              />
  
          </div>
          <button
              className = "text-lg font-bold bg-black text-white px-3 py-2 rounded-md mt-2 hover:bg-slate-800"
              onClick = {uploadHandler}
          >
              {uploadDoc? "Uploading...":"Upload PDF"}
          </button>
          {docData.length > 0 &&
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

export default DocQuestions