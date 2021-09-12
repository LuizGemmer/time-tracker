import { useEffect } from "react";

const { ipcRenderer } = window.electron;

export default function useIPC() {
   /**
    * calls a IPC sendSync()
    * @param {string} channel 
    * @param {*} args 
    */
   function sync( channel, args = undefined ) {
      return ipcRenderer.sendSync( channel, args );
   };

   /**
    * Calls ipc.send()
    * @param {string} channel 
    * @param {*} args 
    */
   function async( channel, args = undefined ) {
      return ipcRenderer.send( channel, args );
   };

   /**
    * useEffect hook but with deep compare on the dependencies
    * @param {Function} callback 
    * @param {Array} dependencies 
    */
   function useDeepEqualEffect( callback, dependencies ) {
      useEffect(
         callback,
         dependencies.map( dependency => JSON.stringify( dependency ) )
      );
   };

   return {
      sync,
      async,
      useDeepEqualEffect
   };
}