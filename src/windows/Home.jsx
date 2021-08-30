import React, { useState } from 'react';

import Helpers from "../styles/Helpers" 
import useIPC from "../hooks/useIPC"
import useTracker from '../hooks/useTracker';
import { channels } from '../shared/channels';
import Clock from '../Clock';
import { Button } from '@material-ui/core';

export default function Home() {
   const ipc = useIPC();
   
   const [ track, setTrack ] =               useState( null );
   const [ description, setDescription ] =   useState( null );
   const [ trackProject, setTrackProject ] = useState( null );
   const [ options, setOptions ] =           useState( null );
   const [ newProject, setNewProject ] =     useState( "" );

   ipc.useDeepEqualEffect(
      () => {
         const [ projects, currentTrack ] = ipc.sync( channels.APP_INIT );

         setDescription( currentTrack ? currentTrack.description : "" );
         setTrackProject( currentTrack ? currentTrack.project : projects[ 0 ] );
         setTrack( currentTrack );
         
         console.log(currentTrack)
         setOptions( projects )
      },
      [ track ]
   );

   const tracker = useTracker( track ); 

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

   if ( track !== null ) {

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
                     value=	{ trackProject }
                     onChange={ e => setTrackProject( e.target.value ) }
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
                     value=	{ newProject }
                     onChange={ e => setNewProject( e.target.value ) }
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
   } else return <div></div>
};
