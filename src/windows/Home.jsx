import React, { useState } from 'react';

import Helpers from "../styles/Helpers" 
import useIPC from "../hooks/useIPC"
import useTracker from '../hooks/useTracker';
import { channels } from '../shared/channels';
import Clock from '../Clock';
import { Button } from '@material-ui/core';

export default function Home() {
   const ipc = useIPC();
   
   let constructor =          ipc.constructor();
   let [ projects, track ] =  constructor( channels.APP_INIT );
   const tracker =            useTracker( track );

   if ( !track ) {
      track = {
         description: "",
         project:     projects[0],
         start:       0
      };
   };
   
   const [ description, setDescription ] =   useState( track.description );
   const [ trackProject, setTrackProject ] = useState( track.project );
   const [ options, setOptions ] =           useState( projects );
   const [ newProject, setNewProject ] =     useState( "" );

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
      <Helpers.CenterFlex column margin="0" width ="100%">
         <Clock 
            toggleTracking={ 
               tracker.track.isTracking ? stopTrack : startTrack
            }
            isTracking={ tracker.track.isTracking }
            cycleCompletion={ tracker.getCycleConclusion() }
         > 
            <Helpers.Font
               size="18px"
               weight="600"
               margin=".3rem"
            >
               { tracker.formatTimeToString( tracker.track.time ) }
            </Helpers.Font>
            <Helpers.Font
               size="12px"
               tone="secondary"
            >
               { 
               tracker.track.isTracking 
                  ? tracker.formatTimeToString( tracker.getElapsedTime( tracker.track.start ) ) 
                  : undefined
               }
            </Helpers.Font> 

         </Clock>

         <Helpers.CenterFlex
            height="auto"
            margin="1rem"
         >
            <Helpers.Label width="65%">
               What are you doing?
               <Helpers.TextInput
                  transparent
                  type=		"text"
                  value=	{ description }
                  onChange={ e => setDescription( e.target.value ) }
               />
            </Helpers.Label>

            <Helpers.Label width="25%" >
               Project:
               <Helpers.SelectInput
                  transparent
                  value=	{ newProject }
                  onChange={ e => setNewProject( e.target.value ) }
               >
                  { options.map( project => (
                     <option value={ project } key={ project }>
                        { project }
                     </option>
                  ) ) }
               </Helpers.SelectInput>
            </Helpers.Label>
         </Helpers.CenterFlex>

         <Helpers.CenterFlex
            height="auto"
            margin="1rem"
         >
            <Helpers.Label width="65%">
               Starting a new project, how're you gonna name it?
               <Helpers.TextInput
                  transparent
                  type=		"text"
                  value=	{ description }
                  onChange={ e => setDescription( e.target.value ) }
               />
            </Helpers.Label>
            <Button 
               onClick={ addProject } 
               style={{ alignSelf: "flex-end", height: "70%", marginLeft: ".3rem" }}
               color="primary"
               variant="contained"
            >
               Add it
            </Button>
         </Helpers.CenterFlex>

      </Helpers.CenterFlex>
   );
};
