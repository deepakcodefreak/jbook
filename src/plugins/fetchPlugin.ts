import * as esbuild from 'esbuild-wasm';
import axios from 'axios'
import localForage from 'localforage'

export const fetchPlugin = (inputCode:string)=>{
    return {
        name:'fetch-plugin',
        setup(build:esbuild.PluginBuild){
            build.onLoad({ filter: /.*/ ,namespace: 'a'}, async (args: any) => {
                console.log('onLoad', args);
         
                if (args.path === 'index.js') {
                  return {
                    loader: 'jsx',
                    contents: inputCode,
                  };
                } 
        
                const cachedFile = await localForage.getItem<esbuild.OnLoadResult>(args.path)
                if(cachedFile) return cachedFile
        
                const {data,request} = await axios.get(args.path)
                
                const result:esbuild.OnLoadResult = await  { 
                    loader:'jsx',
                    contents: data,
                    resolveDir: new URL('./',request.responseURL).pathname
                }
                await localForage.setItem(args.path,result)
                return result
              });
        }
    }
}