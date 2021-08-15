import React, { useState } from 'react';

import Helpers from "../styles/Helpers" 
import useIPC from "../hooks/useIPC"
import useTracker from '../hooks/useTracker';
import { channels } from '../shared/channels';
import Clock from '../Clock';

import { Button } from "@material-ui/core";

export default function Home() {
   const ipc = useIPC();
   
   let constructor = ipc.constructor();
   let [ projects, track ] = constructor( channels.APP_INIT );
   const tracker = useTracker( track );

   if ( !track ) {
      track = {
         description: "",
         project:     projects[0],
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
      tracker.start();
      ipc.async( channels.TRACKER_START, {
         description,
         ...tracker.track,
         ...tracker.settings,
         project: trackProject,
      } );
   };

   const stopTrack = () => {
      const track = {
         description,
         project: trackProject,
         ...tracker.stop(),
      };
      ipc.async( channels.TRACKER_STOP, track );
   };

   return (
      <Helpers.CenterFlex column>
         <Clock 
            toggleTracking={ 
               tracker.track.isTracking ? stopTrack : startTrack
            }
            isTracking={ tracker.track.isTracking }
            cycleCompletion={ tracker.getCycleConclusion() }
         > 
            <h3>{ tracker.formatTimeToString( tracker.track.time ) }</h3>      
         </Clock>

         <form>
            <Helpers.Label>
               What are you doing?
               <Helpers.TextInput
                  type=		"text"
                  value=	{ description }
                  width="60%"
                  onChange={ e => setDescription( e.target.value ) }
               />
            </Helpers.Label>

            <Helpers.SelectInput
               value=	{ trackProject }
               onChange={ e => setTrackProject( e.target.value ) }
            >
               { options.map( project => (
                  <option value={ project } key={ project }>
                     { project }
                  </option>
               ) ) }
            </Helpers.SelectInput>
         </form>

      </Helpers.CenterFlex>
   );
};
