import { useState } from "react";
import CodeEditor from "./code-editor"
import Preview from "./Preview"
import bundle from "./../bundler"

const CodeCell = ()=>{

    const [text,setText] = useState("")
    const [code,setCode] = useState("")

    const onClick = async ()=>{
       const output = await bundle(text) 
       setCode(output)
    }

   return (
       <div className="editor-wrapper">
           <CodeEditor 
             initialValue={"//start typing..."}
             onChange={(value)=>setText(value)}   
           />
           <textarea value={text} onChange={(e)=>setText(e.target.value)}></textarea>
           <div>
               <button onClick={onClick}>Submit</button>
               <Preview code={code}/>
           </div>
       </div>
   ) 
}



export default CodeCell