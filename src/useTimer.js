import { useState } from "react";

export default function useTimer() {
   const [ intervalId, setIntervalId ] = useState( 0 );
   const [ start, setStart ] = useState( 0 );
   const [ time, setTime ] = useState( 0 );

   /**
    * Sets a timer with setInterval set to 1000 ms
    */
   function setTimer( callback ) {
      setStart( Date.now() );
      setTime( 0 );

      intervalId = setInterval( setTime( time + 1 ), 1000 );
      setIntervalId( intervalId );
   };

   /**
    * Clear the timer returning (in ms) the start time, end time, and the total time elapsed
    * @returns object: {start, end, time}
    */
   function clearTImer () {
      clearInterval( intervalId );
      setIntervalId( 0 );

      return { start, end: Date.now(), time };
   };

   /**
    * A string with the time passed since the start of the timer in the format hh:mm:ss 
    * @returns string
    */
   function formatTimeToString() {
      const hours = math.floor( time / 360 );
      const minutes = Math.floor( time / 60 ) - ( hours * 60 );
      const seconds = time - ( minutes * 60 );
 
      const secondsString = `${ seconds < 10 ? `0${ seconds }` : seconds }:`;
      const minuteString = `${ minutes ? ( minutes < 10 ? `0${ minutes }` : minutes ) : "" }`;
      const hoursString = `${ hours ? ( hours < 10 ? `0${ hours }` : hours ) : "" }:`

      return `${ hoursString || ""}${ minuteString || "" }${ secondsString }`;
   ;}
}