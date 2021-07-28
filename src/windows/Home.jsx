import React, { useState } from 'react';

import useIPC from "../hooks/useIPC"
import useTimer from "../hooks/useTimer"
import { channels } from '../shared/channels';

export default function Home() {
   const ipc = useIPC();
   
   let constructor = ipc.constructor();
   let [ projects, track ] = constructor( channels.APP_INIT );
   const timer = useTimer( track );

   if ( !track ) {
      track = {
         description: "",
         project:     "",
         start:       0
      };
   };
   
   const [ description, setDescription ] = useState( track.description );
   const [ trackProject, setTrackProject ] = useState( track.project );
   const [ options, setOptions ] = useState( projects );
      
   const [ newProject, setNewProject ] = useState( "" );

   const addProject = () => {
      let project = {
			name: 	newProject,
			tracks: 	[],
		};
		
		let projects = [ ...options, project.name ];
      setOptions( projects );
      setNewProject( "" );

		ipc.send( channels.ADD_PROJECT, project );
   };

   const startTrack = () => {
      timer.start();
      ipc.async( channels.TRACKER_START, {
         description,
         start: Date.now(),
         project: trackProject,
      } );
   };

   const stopTrack = () => {
      const track = {
         description,
         project: trackProject,
         ...timer.stop()
      };
      ipc.async( channels.TRACKER_STOP, track );
   };

   return (
      <div>
         <form>
            <input
               type=		"text"
               value=	{ newProject }
               onChange={ (event) => setNewProject( event.target.value ) }
            />
            <input type="button" onClick={ addProject } value="Add Project" />
         </form>

         <form>
            <input
               type=		"text"
               value=	{ description }
               onChange={ e => setDescription( e.target.value ) }
            />

            <select
               value=	{ trackProject }
               onChange={ e => setTrackProject( e.target.value ) }
            >
               { options.map( project => (
                  <option value={ project } key={ project }>
                     { project }
                  </option>
               ) ) }
            </select>

            <input
               type=		"button"
               onClick=	{ timer.isTracking ? stopTrack : startTrack }
               value=	{ timer.isTracking ? "Stop Tracking" : "Start Tracking" }
            />
         </form>

         <h3>{ timer.formatTimeToString( timer.time ) }</h3>
      </div>
   );
};
