import '../scss/app.scss';
var $ = require("jquery");

const OMDB = 'http://www.omdbapi.com/?';
var searchValue;

window.onload = function (){
	var queryString = decodeURIComponent(window.location.search).substring(1).split('=');
	searchValue = queryString.length > 1 ? queryString[1] : '';
	if(!searchValue){
		return;
	}
	
	loadResults(searchValue);
};

function loadResults (searchValue){
	$('.searchResultLabel')[1].innerText = searchValue.replace(/[+]/g, ' ');
	
	$.get(OMDB + "s=" + searchValue.replace(/\s/g, '+') + '&apikey=c01cad4f', function(response){
		if(response.Error){
			var containerEl = $('#resultCont')[0];
			var rowEl = $(getRow())[0];
			var errorEl = document.createElement('h1');
			errorEl.innerText = response.Error;
			rowEl.appendChild(errorEl);
			containerEl.appendChild(rowEl);
			return;
		}
		//OMDB Api doesn't return details of search results, so getting imdbIds of each movie and requesting details.
		var index = 0, totalResultCount = response.Search.length;
		$('.resultCountLabel')[1].innerText = response.totalResults;
		loadNext(index, totalResultCount, response);
	});
};

window.showDetails = function(element){
	element.parentNode.children[0].classList.toggle('showDetails');
	if (element.getAttribute("data-text-swap") == element.innerHTML) {
		element.innerHTML = element.getAttribute("data-text-original");
	} else {
		element.setAttribute("data-text-original", element.innerHTML);
		element.innerHTML = element.getAttribute("data-text-swap");
	}
};

function loadNext(index, totalResultCount, response){
	var containerEl = $('#resultCont')[0];

	var res = response.Search[index]
	if(index < totalResultCount){
		$.get(OMDB + "i=" + res.imdbID + '&apikey=c01cad4f', function(movieRes){
			var rowEl = null;
			if(index % 2 == 0){
					rowEl = $(getRow())[0];
			}else{
				var lastRowIndex = $('#resultCont > .row').length -1;
				rowEl = $('#resultCont > .row')[lastRowIndex];
			}
			var colEl = $(getCol())[0];
			var resultEl = $(getResultEl(movieRes))[0];
			boldenMatchString(searchValue.trim(), resultEl.getElementsByClassName('twentypx')[0]);
			colEl.appendChild(resultEl);
			rowEl.appendChild(colEl);
			containerEl.appendChild(rowEl);
			index++;
			if(totalResultCount > index){
				loadNext(index, totalResultCount, response);
			}
		});
	}
};


function getRow(){
	var rowEl = document.createElement('div');
	rowEl.classList = 'row m-5';
	return rowEl;
}

function getCol(){
	var colEl = document.createElement('div');
	colEl.classList = 'col-sm-6'
	return colEl;
}

function getResultEl(result){
	var image = result.Poster != "N/A" ? '<img src="' + result.Poster + '">' : '<img src="http://www.indre-reisid.ee/wp-content/themes/envision/lib/images/default-placeholder.png">'
	return template`<div class="row">
	<div class="col-sm-4 mx-auto imageContainer">
		${0}
	</div>
	<div class="col-sm-8 mx-auto detailContainer">
		<div class="row">
			<div class="col-sm-12">
				<span class="twentypx">${1}</span>
			</div>
		</div>
		<div class="row">
			<div class="col-sm-12">
				<i class="fas fa-star imdbScore"></i>
				<span class="imdbScore">${2}</span>
				<span>/10</span>
			</div>
		</div>
		<div class="row mt-3 point8font">
			<div class="col-sm-12">
				<span><b>Language:</b> </span>
				<span>${3}</span>
			</div>
		</div>
		<div class="row point8font">
			<div class="col-sm-12">
				<span class="textOverflow2line"><b>Actors:&nbsp</b>${4}</span>
				<a href="#null" data-text-swap='Hide list' onclick="showDetails(this)">Show all&nbsp<i class="fas fa-angle-double-right"></i></a>
			</div>
		</div>
		<div class="row mt-3 point8font">
			<div class="col-sm-12">
				<span class="textOverflow">${5}</span>
				<a href="#null" data-text-swap='Hide Details' onclick="showDetails(this)">Details&nbsp<i class="fas fa-angle-double-right"></i></a>
			</div>
		</div>
	</div>
</div>`(image, result.Title, result.imdbRating, result.Language, result.Actors, result.Plot);
}

function template(strings, ...keys) {
	return (function(...values) {
	  var dict = values[values.length - 1] || {};
	  var result = [strings[0]];
	  keys.forEach(function(key, i) {
		var value = Number.isInteger(key) ? values[key] : dict[key];
		result.push(value, strings[i + 1]);
	  });
	  return result.join('');
	});
};

function boldenMatchString(matchedString, title){
	var startIndex = title.innerHTML.toLocaleLowerCase().indexOf(matchedString.toLocaleLowerCase());
	if(startIndex > -1){
		var endIndex = startIndex + matchedString.length;
		var casedMatch = title.innerHTML.substring(startIndex, endIndex);

		title.innerHTML =  title.innerHTML.replace(casedMatch, '<b><u>' + casedMatch + '</u></b>');
	}
};

module.exports = loadResults;