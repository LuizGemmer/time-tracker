import React, { Component } from "react";

import { channels } from "./shared/channels";

const { ipcRenderer } = window.electron;

export default class MVPMainWindow extends Component {
	render() {
		return (
			<div>
				<div>
			<form>
					<input
						type=		"text"
						value=	{ this.state.newProject }
						onChange={ e => this.setState({ newProject: e.target.value } ) }
					/>
					<input type="button" onClick={ this.addProject } value="Add Project" />
				</form>

				<form>
					<input
						type=		"text"
						value=	{ this.state.description }
						onChange={ e => this.setState({ description: e.target.value })}
					/>

					<select
						value=	{ this.state.trackerProject }
						onChange={ e => this.setState({ trackerProject: e.target.value })}
					>
						{ this.state.projects.map( project => (
							<option value={ project } key={ project }>
								{ project }
							</option>
						) ) }
					</select>

					<input
						type=		"button"
						onClick=	{ this.state.isTracking ? this.stopTracking : this.startTracking }
						value=	{ this.state.isTracking ? "Stop Tracking" : "Start Tracking" }
					/>
				</form>

				<h3>{ this.state.time }</h3>
		</div>
			</div>
		);
	}

	constructor() {
		super();
	
		this.state = {
			newProject: 			"",
			description: 			"",
			trackerProject: 		"",
			isTracking: 			false,
			time: 					0,
			tracker: 				0,
			started: 				0,
		};

		// Gets the projects and the last running track if the window
		// was updated before stopping the track
		const [ projects, track ] = ipcRenderer.sendSync( channels.APP_INIT );
		this.state.projects = projects;
		this.state.trackerProject = projects[0];

		// Sets the last running track if no stopped properly before window reload
		if (track) {
			this.state = {
				...this.state,
				description: 		track.description,
				trackerProject: 	track.project,
				started: 			track.started,
				time: 				Math.round(( Date.now() - track.started ) / 1000),
				isTracking: 		true,
				tracker: 			this.startTimer(), // Returns a setInterval ID
			};
		};

		this.addProject = 	this.addProject.bind( this );
		this.startTracking = this.startTracking.bind( this );
		this.stopTracking = 	this.stopTracking.bind( this );
		this.startTimer = 	this.startTimer.bind( this );
	}

	startTracking() {
		const timer = this.startTimer();

		this.setState({ 
			started: 	this.state.started || Date.now(), 
			isTracking: true, 
			tracker: 	timer, 
		});

		// Sends the track to the main process to prevent track lost
		// in case of window reload before proper stop of the track
		ipcRenderer.send(channels.TRACKER_START, {
			description: 	this.state.description,
			project: 		this.state.trackerProject,
			started: 		this.state.started || Date.now(),
			pomodoro: 		undefined,
		});
	}

	stopTracking() {
		clearInterval( this.state.tracker );
		const { time, description, trackerProject, started } = this.state;
		const track = {
			description: 	description,
			project: 		trackerProject,
			time: 			time,
			started: 		started,
			end: 				Date.now(),
			pomodoro: 		undefined,
		};

		// Resets the forms
		this.setState({
			isTracking: 	false,
			time: 			0,
			description: 	"",
			started: 		0,
		});

		// Sends the track to the main process to be saved to disk 
		ipcRenderer.send( channels.TRACKER_STOP, track );
	}

	startTimer() {
		const timer = setInterval( () => {
			this.setState({
				time: Math.round( ( Date.now() - this.state.started ) / 1000 ),
				isTracking: true, 
			});
		}, 1000 );

		return timer;
	}

	addProject() {
		let project = {
			name: 	this.state.newProject,
			tracks: 	[],
		};
		
		let projects = [...this.state.projects, project.name];
		this.setState({ projects, newProject: "" });

		ipcRenderer.send(channels.ADD_PROJECT, project);
	}
}
