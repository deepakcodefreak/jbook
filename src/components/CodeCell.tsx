import { useState, useEffect } from "react";
import CodeEditor from "./code-editor"
import Preview from "./Preview"
import bundle from "./../bundler"
import Resizeable from "./Resizeable";

const CodeCell = ()=>{

    const [text,setText] = useState("")
    const [code,setCode] = useState("")

    useEffect(()=>{
        const timer = setTimeout(async ()=>{
            const output = await bundle(text)
            setCode(output)
        },1000)


        return ()=>{
            clearTimeout(timer)
        }

    },[text])

    const onClick = async ()=>{
       const output = await bundle(text) 
       setCode(output)
    }

   return (
       <div >
          <Resizeable direction="vertical">
            <div style={{height:'100%',display:'flex',flexDirection:'row'}}>
                <Resizeable direction="horizontal">
                    <CodeEditor 
                        initialValue={"//start typing..."}
                        onChange={(value)=>setText(value)}   
                    />
                </Resizeable>
                <Preview code={code}/>
            </div>
          </Resizeable>
       </div>
   ) 
}



export default CodeCell