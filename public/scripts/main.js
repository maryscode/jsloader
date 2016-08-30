/////////////////////////////
////    client side     ////
///////////////////////////

var articleArray = [];
var visibleRows = 0; // Visible article rows in DOM
var articleCount = 0; // Total number of articles from currently loaded data (updates as you load second json file)
var extraRows = 0; // Additional rows from second file
var load = 10; // Set number of articles to load at a time
var sortType; // Stores sortby cookie
var articlesTable = "#articlesTable"

// Total visible article rows and total extra rows
var countRows = function(){
	visibleRows = $('tr.row').length;
	extraRows = $('tr.extra').length;	
}

// Load the initial set of articles
var initialLoad = function(){
	$.get( '/loadarticles', function(data) {
		buildRows(data,"");
	});
};

// Load second set of articles
var loadSet2 = function(){
	$.get( '/morearticles', function(data) {
		buildRows(data, "extra");
	});
	window.setTimeout(updateSortTable, 1000)
};

// Build HTML article rows from data
var buildRows = function(data, rowclass){
	articleCount = articleCount + data.length;
	for(var i = 0; i < data.length; i++) { 

		var thumbnail;
		if( data[i].image == "" || data[i].image == null ){
			thumbnail = "./img/placeholderthumb.gif"; // if no image is available, use placeholder thumbnail
		}
		else{
			thumbnail = data[i].image;
		}
		var tblRow = "<tr class='row " + rowclass + "'>" + 
		"<td><div class='thumbnailContainer'><a href='" + data[i].url + "' target='_blank'><img src='" +  thumbnail + "' alt='" + data[i].tags[0].name + "'></a></div> <a href='" + 
		data[i].url + "' target='_blank'>" + data[i].title + "</a></td>" +
		"<td>" + data[i].profile.first_name + " " + data[i].profile.last_name + "</td>" + 
		"<td>" + data[i].words + "</td>" + 
		"<td class='date'><span>" + data[i].publish_at + "</span> " +  data[i].time_ago + "</td>" +
		"</tr>"
		articleArray.push(tblRow)
	}
	addArticles(load);	
}

// Add articles to table from array
var addArticles = function(a){
	countRows();
	var i = visibleRows + a;
	var displayArticles = articleArray.slice(visibleRows,i);
	$("tbody").append(displayArticles);
	window.setTimeout(updateSortTable, 500);
};

// Button to load additional articles; load amount can be set in "load" variable at top.
var moreButton = function(){
	$("#btnLoadMore").click(function(){
		countRows();

		var maxArticles = articleCount - load; // defines second to last load
		
		// Hide load more button if on the second to last load
		if ((visibleRows == maxArticles ) && (extraRows > 0) ) { // if visibleRows = 50 and maxArticles = 50
			$("#btnLoadMore").hide();
		}	

		// if initial data 
		if ((visibleRows < articleCount) && ( extraRows == 0 )) { // if rows visible is less than file1 total, then keep adding from first file
			//console.log("more from first set");
			addArticles(load);
		}
		else if ((visibleRows = articleCount) && (extraRows == 0)) { // if  visible and equal to file1 total, then load next data
			//console.log("load second set");			
			loadSet2(); // after click: now visibleRows = 40; articleCount = 60;  extraRows = 10 

		}
		// if second set has been loaded but not more than total articles, show more from json file 2
		else if ((visibleRows <= articleCount ) && (extraRows > 0) ) { // extraRows > 0 basically means the second set has been loaded
			//console.log("more from second set");			
			addArticles(load); 
		};

	});
};

// Cookie recipes
function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname+"="+cvalue+"; "+expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// Check sortby cookie
function checkCookie() {
    var setSortCol = getCookie("sortby");
    sortType = setSortCol;
	window.setTimeout(sortTable, 500);
}

// Sort table; Rows must be fully loaded for function to work; Requires jquery.tablesorter.js
var sortTable = function(){
	$(articlesTable).tablesorter({
		headers: { 
			0: { sorter: false }, // disable title col sort
			1: { sorter: false } // disable author sort
		},
		 textExtraction: { // limit sort to data within .date's <span>
			'.date' : function(node, table, cellIndex){ return $(node).find("span").text(); }
		},
	    // initialize zebra striping of the table
	    widgets: ["zebra"],
	    widgetOptions : {
	      zebra : [ "even", "odd" ]
	    }		
	});	
	callSortCookie();
};

// Trigger sort function when new data is added
var updateSortTable = function(){
	var resort = true, // re-apply the current sort
	callback = function(){
	};	
	$(articlesTable).trigger("updateAll",[ resort, callback ]);
}

// Sort table based on last sort setting ("sortby" cookie)
var callSortCookie = function(){
	var sorting;
	if (sortType == "words-desc" ){
		sorting = [[2,1]];
		$("#header-words").addClass("down");
	}
	else if (sortType == "words-asc" ){
		sorting = [[2,0]];
		$("#header-words").addClass("up");
	}
	else if (sortType == "date-desc" ){
		sorting = [[3,1]];
		$("#header-date").addClass("down");
	}	
	else if (sortType == "date-asc" ){
		sorting = [[3,0]];
		$("#header-date").addClass("up");
	}		
	else {
		sorting = [[null,null]];
		$("#header-date, #header-words").addClass("down");
	}
	$(articlesTable).trigger("sorton", [ sorting ]);
}


// Set sort cookie on column click
$("#header-words").click(function() { 
	if($(this).is(".up")){
		setCookie("sortby","words-desc",365);
		$(this).removeClass("start").removeClass("up").addClass("down");
	}	
	else{
		setCookie("sortby","words-asc",365);
		$(this).removeClass("down").addClass("up");
	};
});
$("#header-date").click(function() { 
	if($(this).is(".up")){
		setCookie("sortby","date-desc",365);
		$(this).removeClass("start").removeClass("up").addClass("down");
	}	
	else{
		setCookie("sortby","date-asc",365);
		$(this).removeClass("down").addClass("up");
	};
});


// Initiate Functions
initialLoad(); // Loads JSON data and builds rows
checkCookie(); // Triggers tablesorter js
moreButton(); // Button to add more rows