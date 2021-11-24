import './preview.css'
import React,{useRef,useEffect} from 'react'
interface PreviewProps{
    code:string
}

const html  = `
<html >
    <head>
        <style>
            baclground-color:white
        </style>
    </head>
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


const Preview:React.FC<PreviewProps>  = ({code})=>{
    const iframe = useRef<any>()

    useEffect(()=>{
        iframe.current.srcdoc = html
        setTimeout(()=>{
             iframe.current.contentWindow.postMessage(code,'*')
        },50)
    },[code])

    return <div className="preview-wrapper">
         <iframe 
            style={{backgroundColor:"white"}} 
            title="Code Preview" 
            ref={iframe} 
            sandbox="allow-scripts" 
            srcDoc={html}
         />
     </div>
}

export default Preview