import * as esbuild from 'esbuild-wasm';
import axios from 'axios'
import localForage from 'localforage'



export const unpkgPathPlugin = (inputCode:string) => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {

    build.onResolve({filter:/(^index\.js$)/},(args:any)=>{
        return {path:'index.js',namespace:'a'}
    }); 
        

    build.onResolve({filter:/^\.+\//},(args:any)=>{
        return { path: new URL(args.path,`https://unpkg.com` + args.resolveDir+'/').href, namespace:'a'}
    })

    build.onResolve({ filter: /.*/ }, async (args: any) => {
        return { path: `https://unpkg.com/${args.path}`, namespace:'a'}
    });
 
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
    },
  };
};