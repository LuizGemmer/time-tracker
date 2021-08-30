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

   // set initial state
   const [ settings, setSettings ] = useState( {
      workTime: 25 * 60,
      restTime: 5 * 60,
   } );

   const [ track, setTrack ] = useState( {
      time: shouldUsePomodoro ? settings.workTime : 0,
      isTracking: false,
      start: undefined,
      nextStage: "restTime",
   } );

   // this updates the state when the home component updates after the data fecth,
   // otherwise the state would not change, inturupting the track after
   // window reload 
   if ( currentTrack && currentTrack.start !== track.start ) {
      // get pomodoro state
      const [ pomodoroTime, stage ] = shouldUsePomodoro 
         ? getPomodoroState( currentTrack )
         : undefined

      // updates the state
      setTrack({
         time:       shouldUsePomodoro ? pomodoroTime : currentTrack.time,
         isTracking: true,
         start:      currentTrack.start,
         nextStage:  shouldUsePomodoro ? stage : "restTime" 
      });

      if ( shouldUsePomodoro ) {
         setSettings({
            workTime: currentTrack.workTime,
            restTime: currentTrack.restTime
         });
      };
   }

   /**
    * Calculate the pomodoro state based on the start time of the track,
    * returning the remaining time in the cycle and the next stage as a array
    * @param {Track Object} currentTrack 
    * @returns [ remaining time in cycle, nextStage ]
    */

   function getPomodoroState( currentTrack ) {
      const { workTime, restTime, start } = currentTrack;

      const elapsedTime =           getElapsedTime( start );
      const pomodoroCycleLength =   workTime + restTime;
      const fullCycles =            Math.floor( elapsedTime / pomodoroCycleLength );
      const currentCycleTime =      elapsedTime - ( fullCycles * pomodoroCycleLength );

      if ( currentCycleTime <= workTime ) {
         return [
            workTime - currentCycleTime,
            "restTime"
         ];
      } else {
         return [
            restTime - ( currentCycleTime - workTime ),
            "workTime"
         ];
      };
   }

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

   // Updates the main process every time the track start or ends ( or window reloads )
   useEffect(() => {
      if ( track.isTracking ) {
         update();
      }
   }, [ track.isTracking ])

   /**
    * Updates the render process every second, preventing loses 
    * due to window reload, made for use in development
    */
   function update() {
      ipc.async( channels.UPDATE_TRACK, { ...track, ...settings } );
   };
   
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
               // Sets the correct time for the countdown
               time:       settings[ nextStage ],
               // Alternates between rest and work cycles
               nextStage:  nextStage === "restTime" ? "workTime" : "restTime",
            });            
         } else {
            setTrack( { ...track, time: time - 1 } );
         };
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
      }, 1000 );
   }

   /**
    * Starts the timer
    */
   function start() {
      setTrack({ ...track, isTracking: true, start: Date.now() });
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

   /**
    * How much of the cycle was completed so far rounded to
    * 3 decimal places
    * @returns {number} percent completed of the cycle
    */
   function getCycleConclusion() {
      let completion = ( 
         track.nextStage === "restTime"
            ? 1 - track.time / settings.workTime
            : 1 - track.time / settings.restTime
      );

      completion *= 1000;
      return ( Math.round( completion ) / 1000 );
   }

   return {
      track,
      settings,
      start,
      stop,
      formatTimeToString,
      getCycleConclusion,
      getElapsedTime,
      getPomodoroState,
   }
};