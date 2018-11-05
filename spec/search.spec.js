var loadResults = require("../src/scripts/search");

describe("Load search results", () => {
	beforeAll(() => {
		var body = document.getElementsByTagName("body")[0];
		var resultContDiv = document.createElement('div');
		resultContDiv.id = "resultCont";

		var resultConRowtDiv = document.createElement('div');
		resultConRowtDiv.classList = "row";

		var searchResLabel = document.createElement('div');
		var searchResLabelSpan = document.createElement('span');
		searchResLabel.classList = searchResLabelSpan.classList ="searchResultLabel";
		searchResLabel.appendChild(searchResLabelSpan);

		var searchCountLabel = document.createElement('div');
		searchCountLabel.classList = "resultCountLabel";

		resultConRowtDiv.appendChild(searchResLabel);
		resultConRowtDiv.appendChild(searchCountLabel);

		resultContDiv.appendChild(resultConRowtDiv);

		body.appendChild(resultContDiv);
	});

	beforeEach((done) => {
		loadResults('iron man');
		setTimeout(() => {
			done();
		}, 4000);
	});

	it("lists results of search with query string.", () => {
		console.log(document.getElementsByClassName('arrow_box row'));
		expect(document.getElementById('resultCont').childElementCount).toBeGreaterThan(0);
	});
});