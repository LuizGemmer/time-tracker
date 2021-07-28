import { useState, useEffect } from "react";

export default function useTimer( track ) {
   const [ intervalId, setIntervalId ] = useState( 0 );
   const [ startTime, setStart ] = useState( track ? track.start : 0 );
   const [ isTracking, setIsTracking ] = useState( false );
   const [ time, setTime ] = useState( track 
      ? Math.round( ( Date.now() - track.start ) / 1000 ) 
      : 0 
   );

   useEffect( () => {
      // The actual timer
      // Only counts if isTracking is true
      if ( isTracking ) {
         const timer = setTimeout( () => setTime( time + 1 ), 1000 );
         if ( intervalId === 0 ) setIntervalId( timer );
      };

      // Clean up
      return () => clearTimeout( intervalId );
   }, [ isTracking, intervalId, time ]);

   /**
    * Sets a timer with setInterval set to 1000 ms
    */
   function start() {
      setStart( Date.now() );
      setIsTracking( true );      
   };
   
   /**
    * Clear the timer returning (in ms) the start time, and end time
    * @returns object: {start, end}
    */
   function stop() {
      const returnValue = { start: startTime, end: Date.now(), time };
      clearTimeout( intervalId );
      
      setIntervalId( 0 );
      setIsTracking( false );
      setTimeout( () => setTime( 0 ), 1000 );

      return returnValue;
   };

   /**
    * A string with the time passed since the start of the timer in the format hh:mm:ss 
    * @returns string
    */
   function formatTimeToString( time ) {
      const hours = Math.floor( time / 3600 );
      const minutes = Math.floor( time / 60 ) - ( hours * 60 );
      const seconds = time - ( minutes * 60 ) - (hours * 3600);

      
      const secondsString = `${ seconds < 10 ? `0${ seconds }` : seconds }`;
      const minuteString = `${ minutes ? ( minutes < 10 ? `0${ minutes }:` : `${ minutes }:` ) : "" }`;
      const hoursString = `${ hours ? ( hours < 10 ? `0${ hours }:` : `${ hours }:` ) : "" }`;

      return `${ hoursString || ""}${ minuteString || "" }${ secondsString }`;
   };

   return {
      time,
      formatTimeToString,
      stop,
      start,
      isTracking,
   };
}