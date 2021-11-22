import 'bulmaswatch/superhero/bulmaswatch.min.css'
import ReactDOM from "react-dom";
import { useState, useEffect, useRef } from "react";
import * as esbuild from "esbuild-wasm"
import { unpkgPathPlugin } from "./plugins/unpkg-path-pugin";
import {fetchPlugin} from "./plugins/fetchPlugin"
import CodeEditor from "./components/code-editor"

const App = ()=>{

    const ref = useRef<any>()
    const iframe = useRef<any>()
    const [text,setText] = useState("")

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

    const html  = `
    <html>
        <head></head>
        <body>
            <div id="root"></div>
            <script>
                window.addEventListener('message',(event)=>{
                   try{ 
                      eval(event.data)
                   }catch(e){
                      const root = document.getElementById('root')
                      root.innerHTML = '<div style="color:red"><h4>Runtime Error</h4>' + e + '</div>'  
                      console.error(e)  
                    }
                },false)
            </script>
        </body>
    <html>
    `


    const onClick = async ()=>{
        if(!ref.current) return

        iframe.current.srcdoc = html

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
      
    
        iframe.current.contentWindow.postMessage(result.outputFiles[0].text,'*')
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
               <pre></pre>
               <iframe title="code preview" ref={iframe} sandbox="allow-scripts" srcDoc={html} />
           </div>
       </div>
   ) 
}



ReactDOM.render(<App/>,document.getElementById("root"))