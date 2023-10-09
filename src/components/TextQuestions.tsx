import React, {useState, useRef} from 'react'

const TextQuestions = () => {
  // const [uploadDoc, setuploadDoc] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false)
  const textRef = useRef<HTMLTextAreaElement>(null)

  const inputHandler = () => {

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
                Insert PDF document below:
            </label>
            <textarea
                id = "docInp" 
                ref = {textRef}
                className = "w-full border-2 border-black rounded-md text-xl p-2"
            />

        </div>
        <div
            className = "mt-7"
        >
            <button
                className = "text-lg font-bold bg-black text-white px-3 py-2 rounded-md mt-2 hover:bg-slate-800"
                onClick = {inputHandler}
            >
                {loading? "Generating...":"Generate Questions"}
            </button>
            {/* Questions */}
            <div
                className = "border-2 border-black border-dashed rounded-md p-1 w-full mt-5"
            >

            </div>
        </div>
    </div>
  )
}

export default TextQuestions