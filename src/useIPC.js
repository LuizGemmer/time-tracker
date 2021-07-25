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

            callback();
         }
      };
   };

   /**
    * calls a IPC sendSync()
    * @param {string} channel 
    * @param {*} args 
    */
   function sync( channel, args ) {
      ipcRenderer.sendSync( channel, args );
   }

   /**
    * Calls ipc.send()
    * @param {string} channel 
    * @param {*} args 
    */
   function async( channel, args ) {
      ipcRenderer.send( channel, args );
   }
}