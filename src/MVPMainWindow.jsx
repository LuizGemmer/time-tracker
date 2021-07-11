import React, { Component } from 'react'

export default class MVPMainWindow extends Component {
  render() {
    return (
      <div>
        <form>
          <input type="text" value={this.state.newProject} onChange={(e) => this.setState({newProject: e.target.value})} />
          <input type="button" onClick={this.addProject} value="Add Project"/>
        </form>

        <form>
          <input type="text" value={this.state.description} onChange={(e) => this.setState({description: e.target.value})} />
          
          <select value={this.state.trackerProject} onChange={(e) => this.setState({ trackerProject: e.target.value })} >
            { this.state.projects.map(project => (
              <option value={project.name} key={project.id}>{ project.name }</option>
            ) ) }
          </select>

          <input type="button" onClick={this.toggleTracking} value={ this.state.isTracking ? "Stop Tracking" : "Start Tracking" } />
        </form>

        <h3>{this.state.time}</h3>
      </div>
    )
  }

  constructor() {
    super();
    this.state = {
      newProject:       "",
      description:      "",
      trackerProject:   "No Project",
      projects:         [{name: "No Project", id: 0, tracks: []}],
      isTracking:       false,
      time:             0,
      tracker:          0,
      started:          0,
    }

    this.addProject = this.addProject.bind(this)
    this.toggleTracking = this.toggleTracking.bind(this)
  }
  
  toggleTracking() {
    if (this.state.isTracking) {
      clearInterval(this.state.tracker);
      const { time, description, trackerProject, started } = this.state
      const track = {
        id:           time,
        description:  description,
        project:      trackerProject,
        time:         time,
        started:      started,
        end:          Date(),
        pomodoro:     undefined
      }

      const projects = [...this.state.projects]
      projects.forEach( project => {
        console.log(trackerProject);
        if ( project.name === trackerProject ) {
          project.tracks.push(track);
        }
      } )

      this.setState({
        projects,
        isTracking:   false, 
        time:         0,
        description:  "",
        started:      0,
      })

      console.log(this.state.projects);
    } else {
      const tracker = setInterval( () => this.setState({time: this.state.time + 1, isTracking: true}), 1000 )
      this.setState({started: Date(), tracker})
    }
  }

  addProject() {
    let project = {id: this.state.projects.length, name: this.state.newProject, tracks: []}
    let projects = [...this.state.projects, project]
    this.setState({projects})
  }
}

