import 'bulmaswatch/superhero/bulmaswatch.min.css'
import ReactDOM from "react-dom";
import { useState, useEffect, useRef } from "react";
import * as esbuild from "esbuild-wasm"
import { unpkgPathPlugin } from "./plugins/unpkg-path-pugin";
import {fetchPlugin} from "./plugins/fetchPlugin"
import CodeEditor from "./components/code-editor"
import Preview from "./components/Preview"

const App = ()=>{

    const [text,setText] = useState("")
    const [code,setCode] = useState("")

    const ref = useRef<any>()


    const startService = async()=>{
        const service = await esbuild.startService({
            worker:true,
            wasmURL:"https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm"
        })
        ref.current = service
    }


    useEffect(()=>{
        startService()
    },[])

   

    const onClick = async ()=>{
        if(!ref.current) return

        // iframe.current.srcdoc = html

       const result = await ref.current.build({
           entryPoints:['index.js'],
           bundle:true,
           write:false,
           plugins:[
               unpkgPathPlugin(),
               fetchPlugin(text)],
           define:{
               'process.env.NODE_ENV':'"production"',
               global:'window'
           }
       }) 
       setCode(result.outputFiles[0].text)
    
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