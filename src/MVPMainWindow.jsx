import React, { Component } from "react";
import { channels } from "./shared/channels";

const { ipcRenderer } = window.electron;

export default class MVPMainWindow extends Component {
	render() {
		return (
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
						onChange={e => this.setState({ description: e.target.value })}
					/>

					<select
						value=	{ this.state.trackerProject }
						onChange={e => this.setState({ trackerProject: e.target.value })}
					>
						{ this.state.projects.map( project => (
							<option value={ project } key={ project }>
								{ project }
							</option>
						) ) }
					</select>

					<input
						type=		"button"
						onClick=	{ this.toggleTracking }
						value=	{ this.state.isTracking ? "Stop Tracking" : "Start Tracking" }
					/>
				</form>

				<h3>{ this.state.time }</h3>
			</div>
		);
	}

	constructor() {
		super();
	
		this.state = {
			newProject: 			"",
			description: 			"",
			trackerProject: 		"",
			projects: 				undefined,
			isTracking: 			false,
			time: 					0,
			tracker: 				0,
			started: 				0,
		};

		const projects = ipcRenderer.sendSync( channels.APP_INIT );
		this.state.projects = projects
		this.state.trackerProject = projects[0]

		this.addProject = this.addProject.bind(this);
		this.toggleTracking = this.toggleTracking.bind(this);

	}

	toggleTracking() {
		if (this.state.isTracking) {
			clearInterval(this.state.tracker);
			const { time, description, trackerProject, started } = this.state;
			const track = {
				description: 	description,
				project: 		trackerProject,
				time: 			time,
				started: 		started,
				end: 				Date.now(),
				pomodoro: 		undefined,
			};

			const projects = [...this.state.projects];
			projects.forEach(project => {
				if (project.name === trackerProject) {
					project.tracks.push(track);
				}
			});

			this.setState({
				projects,
				isTracking: 	false,
				time: 			0,
				description: 	"",
				started: 		0,
			});

			ipcRenderer.send(channels.TRACKER_STOP, track);
		} else {
			const tracker = setInterval(
				() => this.setState({
						time: 		this.state.time + 1,
						isTracking: true,
					}),
				1000
			);
			this.setState({ started: Date.now(), tracker });

			ipcRenderer.send(channels.TRACKER_START);
		}
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
