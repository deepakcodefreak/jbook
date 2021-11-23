import 'bulmaswatch/superhero/bulmaswatch.min.css'
import ReactDOM from "react-dom";
import { useState } from "react";
import CodeEditor from "./components/code-editor"
import Preview from "./components/Preview"
import bundle from "./bundler"

const App = ()=>{

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



ReactDOM.render(<App/>,document.getElementById("root"))