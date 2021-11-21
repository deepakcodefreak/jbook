import ReactDOM from "react-dom";
import { useState, useEffect, useRef } from "react";
import * as esbuild from "esbuild-wasm"
import { unpkgPathPlugin } from "./plugins/unpkg-path-pugin";

const App = ()=>{

    const ref = useRef<any>()
    const [text,setText] = useState("")
    const [code,setCode] = useState("")

    const startService = async()=>{
        const service = await esbuild.startService({
            worker:true,
            wasmURL:"./esbuild.wasm"
        })
        ref.current = service
    }


    useEffect(()=>{
        startService()
    },[])

    const onClick = async ()=>{
        if(!ref.current) return
       const result = await ref.current.build({
           entryPoints:['index.js'],
           bundle:true,
           write:false,
           plugins:[unpkgPathPlugin(text)],
           define:{
               'process.env.NODE_ENV':'"production"',
               global:'window'
           }
       }) 
       console.log(result.outputFiles[0].text)
       setCode(result.outputFiles[0].text)
    }


   return (
       <div>
           <textarea value={text} onChange={(e)=>setText(e.target.value)}></textarea>
           <div>
               <button onClick={onClick}>Submit</button>
               <pre>{code}</pre>
           </div>
       </div>
   ) 
}

ReactDOM.render(<App/>,document.getElementById("root"))