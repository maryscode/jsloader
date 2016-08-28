/////////////////////////////
////    client side     ////
///////////////////////////

var articleArray = [];
var articleArray2 = [];
var visibleRows = 0;
var extraRows = 0; // Additional rows from second file
var articleCount; // Total number of articles from requested files (updates as you load second json file)
var load = 10; // Total number of articles to load at a time

// Add more articles from first file
var addArticles = function(a){
//	visibleRows = $('#articlesTable>tbody>tr:visible').length;	
	var i = visibleRows + a;  
	var displayArticles = articleArray.slice(0,i);
	$("tbody").html(displayArticles);
};

// Load the initial set of articles
var initialLoad = function(){
	$.get( '/loadarticles', function(data) {
		articleCount = data.length;	
		for(var i = 0; i < data.length; i++) {
			var count = i + 1;
			var tblRow = "<tr>" + 
			"<td>" + count + "</td>" +			
			"<td>" + data[i].title + "</td>" +
			"<td>" + data[i].profile.first_name + " " + data[i].profile.last_name + "</td>" + 
			"<td>" + data[i].words + "</td>" + 
			"<td>" + data[i].publish_at + "</td>" + 
			"</tr>"
			articleArray[i] = tblRow
		}
		addArticles(load);
	});      	
};



// Add article amount function
var addArticles2 = function(a){
	var i = extraRows + a;
	var displayArticles = articleArray2.slice(extraRows,i);
	$("tbody").append(displayArticles);
	
};


// Load second set of articles
var loadSet2 = function(){
	$.get( '/morearticles', function(data) {
		articleCount = articleCount + data.length;	
		//console.log("updated articleCount: " + articleCount);
		for(var i = 0; i < data.length; i++) {
			var count = i + 1;
			var tblRow = "<tr class='extra'>" + 
			"<td>new " + count + "</td>" +
			"<td>" + data[i].title + "</td>" +
			"<td>" + data[i].profile.first_name + " " + data[i].profile.last_name + "</td>" + 
			"<td>" + data[i].words + "</td>" + 
			"<td>" + data[i].publish_at + "</td>" + 
			"</tr>"
			articleArray2[i] = tblRow
		}
		addArticles2(load);
	});
	window.setTimeout(updateSortTable, 1000)
};

var moreButton = function(){
	$("#btnLoadMore").click(function(){
		updateSortTable();

		visibleRows = $('#articlesTable>tbody>tr:visible').length;
		extraRows = $('#articlesTable>tbody>tr.extra:visible').length;
		var maxArticles = articleCount - load; // defines second to last load
		//console.log("visibleRows: " + visibleRows + "\narticleCount: " + articleCount + "\nextraRows: " + extraRows + "\nmaxArticles: " + maxArticles);		
		
		// Hide load more button if on the second to last load
		if ((visibleRows == maxArticles ) && (extraRows > 0) ) { // if visibleRows = 50 and maxArticles = 50
			$("#btnLoadMore").hide();
		}	
			

		// if initial data 
		if ((visibleRows < articleCount) && ( extraRows == 0 )) { // if rows visible is less than file1 total, then keep adding from first file
			addArticles(load);
		}
		else if ((visibleRows = articleCount) && (extraRows == 0)) { // if  visible and equal to file1 total, then load next data
			loadSet2(); // after click: now visibleRows = 40; articleCount = 60;  extraRows = 10 
		}
		// if second set has been loaded but not more than total articles, show more from json file 2
		else if ((visibleRows <= articleCount ) && (extraRows > 0) ) { // extraRows > 0 basically means the second set has been loaded
			addArticles2(load); 
		}

	});
};
// Sort Table; rows must be fully loaded
var sortTable = function(){
	$("#articlesTable").tablesorter({
	  headers: { 
	      // Disable first and second columns (starts at 0)
/*	      0: { sorter: false }, 
	      1: { sorter: false },
	      2: { sorter: false }        */
	  }
	}); 	
};
// Trigger sort function when new data is added
var updateSortTable = function(){
	$("#articlesTable").trigger("update"); 

  // bind to sort events
  /*$("#articlesTable")
    .bind("sortStart",function() {
    	alert("start!");
    })
    .bind("sortEnd",function() {
    	alert("end!");
    });
*/

}


// Initiate Functions
initialLoad();
moreButton();
window.setTimeout(sortTable, 1000);

