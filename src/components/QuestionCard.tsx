import React from "react"
import toast from "react-hot-toast"

import { Question } from "@/utils/types"

interface Props {
  question: Question
}

const QuestionCard: React.FC<Props> = (props) => {

    const checkAnswer = (inp: string) => {

        if(inp === props.question.answer){
            toast.success("Correct Answer")
        }
        else{
            toast.error("Wrong Answer")
        }
    }
    

  return (
    <div 
        className="flex h-full w-full flex-col justify-center overflow-hidden p-2 border-2 border-black rounded-md"
    >
      <div>
        <p className="mb-2 text-xl">
          <strong>{`Q: `}</strong>
          {`${props.question!.question}`}
        </p>
        {/* {hint.trim().length !== 0 && (
          <p className="mb-6 text-xl">
            <strong>Hint: </strong>
            {`${hint.trim()}`}
          </p>
        )} */}
      </div>
      <div className="grid grid-cols-6 gap-3 text-xl">
        <div className="col-span-3">
          <button
            className="mb-6 block w-full text-lg rounded-md bg-black px-3 py-2 text-white hover:bg-slate-800"
            onClick={() => {
              checkAnswer("optionA")
            }}
          >
            {props.question!.optionA}
          </button>
          <button
            className="block w-full text-lg rounded-md bg-black px-3 py-2 text-white hover:bg-slate-800"
            onClick={() => {
              checkAnswer("optionB")
            }}
          >
            {props.question!.optionB}
          </button>
        </div>
        <div className="col-span-3">
          <button
            className="mb-6 block w-full text-lg rounded-md bg-black px-3 py-2 text-white hover:bg-slate-800"
            onClick={() => {
              checkAnswer("optionC")
            }}
          >
            {props.question!.optionC}
          </button>
          <button
            className="block w-full text-lg rounded-md bg-black px-3 py-2 text-white hover:bg-slate-800"
            onClick={() => {
              checkAnswer("optionD")
            }}
          >
            {props.question!.optionD}
          </button>
        </div>
      </div>
      <div>
        <p
            className="text-lg mt-3 mb-2"
        >
            <strong>Answer: </strong>
            ({
                props.question.answer === "optionA"? "a": 
                props.question.answer === "optionB"? "b":
                props.question.answer === "optionC"? "c":"d"
            })
        </p>
      </div>
      {/* <div className="flex justify-center">
        <button
          className="mt-5 rounded-md bg-black px-3 py-1 text-2xl text-white hover:bg-black/80"
          onClick={() => {
            checkAnswer()
          }}
        >
          {checking ? "Checking..." : "Check"}
        </button>
      </div> */}
    </div>
  )
}

export default QuestionCard
