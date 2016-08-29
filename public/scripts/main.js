/////////////////////////////
////    client side     ////
///////////////////////////
var articleArray = [];
var visibleRows = 0; // Visible rows in DOM
var articleCount = 0; // Total number of articles from currently loaded data (updates as you load second json file)
var extraRows = 0; // Additional rows from second file
var load = 10; // Set number of articles to load at a time here

var countRows = function(){
	visibleRows = $('tr.row').length;
}

// Add more articles from first file
var addArticles = function(a){
	countRows();
	var i = visibleRows + a;
	var displayArticles = articleArray.slice(visibleRows,i);
	$("tbody").append(displayArticles);
};

var buildRows = function(data, rowclass){
	articleCount = articleCount + data.length; // initial: article count = 30; data.length = 30
	// second: articleCount = 60;
	for(var i = 0; i < data.length; i++) { 
		// initial: for i = 0 i < 30 
		// second: for i = 0; i < 30
		var count = i + 1;
		var tblRow = "<tr class='row " + rowclass + "'>" + 
		"<td>" + count + "</td>" +			
		"<td>" + data[i].title + "</td>" +
		"<td>" + data[i].profile.first_name + " " + data[i].profile.last_name + "</td>" + 
		"<td>" + data[i].words + "</td>" + 
		"<td>" + data[i].publish_at + "</td>" +
		"</tr>"
		articleArray.push(tblRow)
	}
}

// Load the initial set of articles
var initialLoad = function(){
	$.get( '/loadarticles', function(data) {
		buildRows(data,"");
		addArticles(load);
	});
};

// Load second set of articles
var loadSet2 = function(){
	$.get( '/morearticles', function(data) {
		buildRows(data, "extra");
		addArticles(load);
	});
	window.setTimeout(updateSortTable, 1000)
};

var moreButton = function(){
	$("#btnLoadMore").click(function(){
		updateSortTable();
		countRows();
		extraRows = $('tr.extra').length;

		var maxArticles = articleCount - load; // defines second to last load
		
		// Hide load more button if on the second to last load
		if ((visibleRows == maxArticles ) && (extraRows > 0) ) { // if visibleRows = 50 and maxArticles = 50
			$("#btnLoadMore").hide();
		}	

		// if initial data 
		if ((visibleRows < articleCount) && ( extraRows == 0 )) { // if rows visible is less than file1 total, then keep adding from first file
			console.log("more from first set");
			addArticles(load);
			console.log(articleArray[40])

		}
		else if ((visibleRows = articleCount) && (extraRows == 0)) { // if  visible and equal to file1 total, then load next data
			console.log("load second set");			
			loadSet2(); // after click: now visibleRows = 40; articleCount = 60;  extraRows = 10 

		}
		// if second set has been loaded but not more than total articles, show more from json file 2
		else if ((visibleRows <= articleCount ) && (extraRows > 0) ) { // extraRows > 0 basically means the second set has been loaded
			console.log("more from second set");			
			addArticles(load); 
		};

	});
};
// Sort Table; rows must be fully loaded
var sortTable = function(){

	$("#articlesTable").tablesorter({
	  headers: { 
	      // Disable first and second columns (starts at 0)
	      0: { sorter: false }, 
	      1: { sorter: false },
	      2: { sorter: false }        
	  }
	}); 	
};
// Trigger sort function when new data is added
var updateSortTable = function(){
	$("#articlesTable").trigger("update"); 
}

// Initiate Functions
initialLoad();
moreButton();
window.setTimeout(sortTable, 1000);

