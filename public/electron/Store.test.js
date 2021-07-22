const { Store } = require("./Store");
const store = new Store();

const tracks = JSON.stringify({
	projectId: 5,
	trackId: 2,
	projects: {
		"No Project": { id: 0, name: "No Project", tracks: [] },
		"Developing The App": {
			name: "Developing The App",
			tracks: [
				{
					description: "My First Track on the MVP",
					project: "Developing The App",
					time: 10,
					started: 1626137058480,
					end: 1626137068800,
					id: 1,
				},
			],
			id: 1,
		},
	},
});

// Resets the tracks for every test
beforeEach(() => (store.tracks = JSON.parse( tracks ) ));

test("addTracks increments trackId by 1", () => {
	const track = { project: "No Project" };
	store.addTrack(track);
	expect(store.tracks.trackId).toBe(3);
});

test("Should add a track", () => {
	const track = { project: "No Project" };
	store.addTrack(track);
	expect(store.tracks.projects["No Project"].tracks.length).toBe(1);
});

test("should add a project", () => {
	const project = { name: "test" };
	store.addProject(project);

	const projects = store.getProjects();
   expect(projects.length).toBe(3);
});

test("should increment projectId by 1", () => {
	const project = { name: "test" };
	store.addProject(project);
	expect(store.tracks.projectId).toBe(6);
});

test("should return all projects names", () => {
	expect( store.getProjects() ).toMatchObject( [
      "No Project",
      "Developing The App"
   ] );
});
