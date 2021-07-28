const { ipcRenderer } = window.electron;

export default function useIPC() {
   /**
    * Pevents the callback from being called multiple times in a short time span
    * @param ms debounce time in ms
    * @returns function( callback )
    */
   function debouncer( ms ) {
      let debounce = false;

      return function ( callback ) {
         if ( !debounce ) {
            debounce = true;
            
            setTimeout( () => {
               debounce = false;
            }, ms );

            return callback();
         };
      };
   };

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
    * Calls a IPC sendSync in the specified channel and memoizes the result to
    * prevent unneeded ipc calls
    * @returns { * } ipc return
    */
   function constructor() {
      let lastReturn = "";

      return function ( channel ) {
         if ( !lastReturn ) {
            lastReturn = sync( channel );
         };
         return lastReturn;
      };
   };

   return {
      debouncer,
      sync,
      async,
      constructor
   };
}