const fs = require("fs");
const path = require("path");
const { app } = require("electron")

const { IS_DEV } = process.env 

class Store {
   defaults = {
      // Default values of user's files
      tracks: {
         projectId:  1,
         trackId:    1,
   
         projects: {
            "No Project": {
               id:      0,
               name:    "No Project",
               tracks:  [],
            } 
         }
      },
   
      settings: {
         theme: "dark",
      }
   };

   constructor() {
      // Var holding user's file's paths
      this.paths = {
         settings: IS_DEV
            ? "./public/electron/developmentSettings.json" 
            : path.join( app.getPath( "userData" ), "settings.json" ) ,
         tracks: IS_DEV ? 
            "./public/electron/developmentTrack.json" :
            path.join( app.getPath( "userData" ), "tracks.json" ),
      };

      // Create user's files if they do not exist
      for ( let path in this.paths ) {
         if ( !fs.existsSync( this.paths[path] ) ) {
            fs.writeFileSync( this.paths[path], JSON.stringify( this.defaults[path] ) );
         }
      }
      
      // Reads user's files
      this.tracks =     JSON.parse( fs.readFileSync( this.paths.tracks ) );
      this.settings =   JSON.parse( fs.readFileSync( this.paths.settings ) );
   
   }

   addTrack( track ) {
      track.id = this.tracks.trackId;
      ++ this.tracks.trackId;
      
      // Removes pomodoro related properties
      delete track.isTracking;
      delete track.nextStage;
      
      const { project } = track;
      this.tracks.projects[ project ].tracks.push( track ); 
   }

   addProject( project ) {
      project.id = this.tracks.projectId;
      ++ this.tracks.projectId;
      this.tracks.projects[ project.name ] = project;
   }

   getProjects() {
      return Object.keys( this.tracks.projects );
   }

   saveTracks() {
      fs.writeFileSync( this.paths.tracks, JSON.stringify( this.tracks ) );
   }

   saveSettings() {
      fs.writeFileSync( this.paths.settings, JSON.stringify( this.settings ) );
   }

}

module.exports = { Store }