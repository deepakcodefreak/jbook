import * as esbuild from 'esbuild-wasm';
import axios from 'axios'
import localForage from 'localforage'

export const fetchPlugin = (inputCode:string)=>{
    return {
        name:'fetch-plugin',
        setup(build:esbuild.PluginBuild){

            build.onLoad({ filter:/(^index\.js$)/},()=>{
              return {
                loader: 'jsx',
                contents: inputCode,
              };
            })

          build.onLoad({ filter:/.*/},async (args:any)=>{
            const cachedFile = await localForage.getItem<esbuild.OnLoadResult>(args.path)
            if(cachedFile) return cachedFile

            //  if it does not return anything, it will fallback to other onLoads
  
          })

            build.onLoad( { filter:/.css$/ },async (args:any)=>{
              // const cachedFile = await localForage.getItem<esbuild.OnLoadResult>(args.path)
              //   if(cachedFile) return cachedFile
        
                const {data,request} = await axios.get(args.path)
  

                const escapedContent = data
                .replace(/\n/g,'')
                .replace(/"/g,'\\"')
                .replace(/'/g,"\\'")

                const contents = 
                  `const style = document.createElement('style')
                  style.innerText = '${escapedContent}'
                  document.head.appendChild(style)
                `
                console.log(contents)
                const result:esbuild.OnLoadResult = await  { 
                    loader: 'jsx',
                    contents,
                    resolveDir: new URL('./',request.responseURL).pathname
                }
                await localForage.setItem(args.path,result)
                return result
            })
           
            build.onLoad({ filter: /.*/ ,namespace: 'a'}, async (args: any) => {
                
                // const cachedFile = await localForage.getItem<esbuild.OnLoadResult>(args.path)
                // if(cachedFile) return cachedFile
        
                const {data,request} = await axios.get(args.path)
          
                const result:esbuild.OnLoadResult = await  { 
                    loader: 'jsx',
                    contents:data,
                    resolveDir: new URL('./',request.responseURL).pathname
                }
                await localForage.setItem(args.path,result)
                return result
              });
        }
    }
}