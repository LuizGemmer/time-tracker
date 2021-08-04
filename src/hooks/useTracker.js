import { useState, useEffect } from "react";
import { channels } from "../shared/channels";
import useIPC from "./useIPC";

/**
 * Setup and manages a timer that counts down or up depending of the
 * shouldUsePomodoro param
 * @param {Track Object} currentTrack 
 * @param {Boolean} shouldUsePomodoro 
 * @returns Functions to deal with the tracker
 */
export default function useTracker( currentTrack, shouldUsePomodoro = true ) {
   const ipc = useIPC();
   
   const [ settings ] = useState( {
      workTime: currentTrack ? currentTrack.workTime : 25 * 60,
      restTime: currentTrack ? currentTrack.restTime : 5 * 60,
   } );

   const [ track, setTrack ] = useState( {
      time: currentTrack 
         ? currentTrack.time
         : ( shouldUsePomodoro ? settings.workTime : 0 ),
      isTracking: currentTrack ? true : false,
      start: currentTrack ? currentTrack.start : undefined,
      nextStage: "restTime",
   } );

   // Actual timer, will not run except tracker.isTracking === true
   useEffect(() => {
      let timer;
      if ( track.isTracking ) {
         // Uses the required effect according to the setting chosen by the user
         timer = shouldUsePomodoro 
            ? pomodoroEffect()
            : stopWatchEffect()
      };

      return () => {
         // Cleanup
         clearTimeout( timer );
      };
   });

   /**
    * Creates a timer that counts downwards, alternating between
    * work and rest time accordingly
    * @returns Timer Id
    */
   function pomodoroEffect() {
      const { time, nextStage } = track;

      return setTimeout( () => {
         if ( time === 0 ) {
            setTrack({ 
               ...track,
               // Alternates between rest and work cycles
               nextStage:  nextStage === "restTime" ? "workTime" : "restTime",
               // Sets the correct time for the countdown
               time:       settings[ nextStage ],
            });            
         } else {
            setTrack( { ...track, time: time - 1 } );
         };

         update();
      }, 1000 );
   };

   /**
    * Creates a timer that counts upwards
    * @returns Timer Id
    */
   function stopWatchEffect() {
      const { time } = track;

      return setTimeout( () => {
         setTrack( { ...track, time: time + 1 } );
         update();
      }, 1000 );
   }

   /**
    * Starts the timer
    */
   function start() {
      setTrack({ ...track, isTracking: true, start: Date.now() });
   };

   /**
    * Updates the render process every second, preventing loses 
    * due to window reload, made for use in development
    */
   function update() {
      ipc.async( channels.UPDATE_TRACK, { ...track, ...settings } );
   };

   /**
    * Stops the timer and resets the state
    * @returns Track Object: { time, start, end, isTracking, pomodoro }
    */
   function stop() {
      // Resets the state
      setTimeout( () => {
         setTrack( {
            ...track,
            time: shouldUsePomodoro ? settings.workTime : 0, 
            isTracking: false 
         } )
      }, 1000 )
      
      setTrack({ ...track, isTracking: false });
      return {
         ...track,
         end: Date.now(),
         usedPomodoro: shouldUsePomodoro,
         pomodoro: shouldUsePomodoro ? { ...settings } : undefined,
         time: getElapsedTime(),
      };
   };

   /**
    * Returns the number of seconds elapsed between the param time and
    * Date.now()
    * @param {number} time 
    * @returns Number of seconds
    */
   function getElapsedTime( time = track.start ) {
      return Math.round( ( Date.now() - time ) / 1000 );
   }

   /**
    * Takes a number of seconds and formats it
    * @param {number} time 
    * @returns Time string hh:mm:ss
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
      track,
      settings,
      start,
      stop,
      formatTimeToString,
   }
};