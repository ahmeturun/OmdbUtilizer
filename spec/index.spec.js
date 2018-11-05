var searchOnKeyUp = require("../src/scripts/index");

describe("Search 'iron man'", () => {
	beforeAll(() => {
		var body = document.getElementsByTagName("body")[0];
		var resultDiv = document.createElement('div');
		resultDiv.classList = "arrow_box row";
		body.appendChild(resultDiv);

		var moreResultButton = document.createElement('div');
		moreResultButton.classList = "row box";
		moreResultButton.style.display = "none";
		body.appendChild(moreResultButton);

		var searchResLabel = document.createElement('div');
		var searchResLabelSpan = document.createElement('span');
		searchResLabel.classList = searchResLabelSpan.classList ="searchResultLabel";
		searchResLabel.appendChild(searchResLabelSpan);
		body.appendChild(searchResLabel);

		var searchCountLabel = document.createElement('div');
		searchCountLabel.classList = "resultCountLabel";
		body.appendChild(searchCountLabel);
	});

	beforeEach((done) => {
		searchOnKeyUp('iron man');
		setTimeout(() => {
			done();
		}, 2500);
	});
  
	it("auto comletes with two results.", () => {
		console.log(document.getElementsByClassName('arrow_box row'));
		expect(document.getElementsByClassName('arrow_box row')[0].childElementCount).toEqual(2);
	});
});