import '../scss/app.scss';
var $ = require("jquery");

const OMDB = 'http://www.omdbapi.com/?';
var resultTemlate = `<div class="col-sm-4 imageContainer">
	{poster}
</div>
<div class="col-sm-8 detailContainer">
	<div class="row">
		<div class="col-sm-12">
			<span class="twentypx">{title}</span>
		</div>
	</div>
	<div class="row">
		<div class="col-sm-12">
			<i class="fas fa-star imdbScore"></i>
			<span class="imdbScore">{imdbRating}</span>
			<span>/10</span>
		</div>
	</div>
	<div class="row mt-3">
		<div class="col-sm-12">
			<span><b>Language:</b> </span>
			<span>{language}</span>
		</div>
	</div>
	<div class="row">
		<div class="col-sm-12">
			<span class="textOverflow2line"><b>Actors:&nbsp</b>{actors}</span>
			<a href="#null" data-text-swap='Hide list' onclick="showDetails(this)">Show all&nbsp<i class="fas fa-angle-double-right"></i></a>
		</div>
	</div>
	<div class="row mt-3">
		<div class="col-sm-12">
			<span class="textOverflow">{plot}</span>
			<a href="#null" data-text-swap='Hide Details' onclick="showDetails(this)">Details&nbsp<i class="fas fa-angle-double-right"></i></a>
		</div>
	</div>
</div>`

var arrowBox;
var moreResultButton;
$('.form-control.input-lg').on("keyup",function(){
	searchOnKeyUp($('.form-control.input-lg')[0].value);
});

function searchOnKeyUp(searchInput) {
	var searchValue = searchInput;
	if (searchValue) {
		$('#searcIcon').removeClass('fa-search').addClass('fa-arrow-right');
	}
	else {
		$('#searcIcon').removeClass('fa-arrow-right').addClass('fa-search');
	}
	;
	setTimeout(function () {
		arrowBox = document.getElementsByClassName('arrow_box row')[0];
		moreResultButton = document.getElementsByClassName('row box')[0];
		$.get(OMDB + "s=" + searchValue.replace(/\s/g, '+') + '&apikey=c01cad4f', function (response) {
			arrowBox.innerHTML = "";
			arrowBox.style.display = 'none';
			moreResultButton.style.display = 'none';
			if (!response.Error) {
				var count = response.Search.length > 1 ? 2 : response.Search.length;
				var index = 0;
				loadNext(index, count, response, searchValue);
			}
		});
	}, 500);
}

function loadNext(index, totalResultCount, response, searchValue){
	var res = response.Search[index]
	if(index < totalResultCount){
		$.get(OMDB + "i=" + res.imdbID + '&apikey=c01cad4f', function(movieRes){
			if(!movieRes.Error){
				arrowBox.style.display = '';
				moreResultButton.style.display = '';
				var resultNode = document.createElement('div');
				resultNode.classList = 'row mr-0 ml-0';
	
				var result = getResultNode(movieRes, searchValue);
				resultNode.innerHTML = result;
	
				if(arrowBox.childElementCount <2){
					arrowBox.appendChild(resultNode);
				}
			}else{
				arrowBox.style.display = 'none';
				moreResultButton.style.display = 'none';
			}
			index++;
			if(totalResultCount > index){
				loadNext(index, totalResultCount, response,searchValue);
			}
		});
	}
};

function getResultNode(movie, searchValue){
	var templateIns = resultTemlate;
	templateIns = templateIns.replace('{poster}',movie.Poster != "N/A" ? '<img src="' + movie.Poster + '">' : '<i class="fas fa-file-image" style="font-size: 234px;"></i>');
	templateIns = templateIns.replace('{imdbRating}', movie.imdbRating);
	templateIns = templateIns.replace('{language}', movie.Language);
	templateIns = templateIns.replace('{title}', boldenMatchString(searchValue.trim(), movie.Title));
	templateIns = templateIns.replace('{actors}', movie.Actors);
	templateIns = templateIns.replace('{plot}', movie.Plot);
	return templateIns;
}

function boldenMatchString(matchedString, title){
	var startIndex = title.toLocaleLowerCase().indexOf(matchedString.toLocaleLowerCase());
	if(startIndex > -1){
		var endIndex = startIndex + matchedString.length;
		var casedMatch = title.substring(startIndex, endIndex);

		return title.replace(casedMatch, '<b><u>' + casedMatch + '</u></b>');
	}
};

window.submitForm = function (){
	if($('.form-control.input-lg')[0].value){
		document.getElementById('searchform').submit();
	}
}

window.showDetails = function(element){
	element.parentNode.children[0].classList.toggle('showDetails');
	if (element.getAttribute("data-text-swap") == element.innerHTML) {
		element.innerHTML = element.getAttribute("data-text-original");
	} else {
		element.setAttribute("data-text-original", element.innerHTML);
		element.innerHTML = element.getAttribute("data-text-swap");
	}
};

module.exports = searchOnKeyUp;