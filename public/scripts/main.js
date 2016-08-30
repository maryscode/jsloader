/////////////////////////////
////    client side     ////
///////////////////////////
var articleArray = [];
var visibleRows = 0; // Visible rows in DOM
var articleCount = 0; // Total number of articles from currently loaded data (updates as you load second json file)
var extraRows = 0; // Additional rows from second file
var load = 10; // Set number of articles to load at a time
var sortColumn;
var sortOrder;

// Total visible article rows and total extra rows
var countRows = function(){
	visibleRows = $('tr.row').length;
	extraRows = $('tr.extra').length;	
}

// Add articles from array
var addArticles = function(a){
	countRows();
	var i = visibleRows + a;
	var displayArticles = articleArray.slice(visibleRows,i);
	$("tbody").append(displayArticles);

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
		"<td class='timeago'>" + data[i].time_ago + "</td>" +
		"<td class='rawtime'>" + data[i].publish_at + "</td>" +
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
		var maxArticles = articleCount - load; // defines second to last load
		
		// Hide load more button if on the second to last load
		if ((visibleRows == maxArticles ) && (extraRows > 0) ) { // if visibleRows = 50 and maxArticles = 50
			$("#btnLoadMore").hide();
		}	

		// if initial data 
		if ((visibleRows < articleCount) && ( extraRows == 0 )) { // if rows visible is less than file1 total, then keep adding from first file
			//console.log("more from first set");
			addArticles(load);
			console.log(articleArray[40])

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


// Trigger sort function when new data is added
var updateSortTable = function(){
	$("#articlesTable").trigger("update"); 
}

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
function checkCookie() {
    var user=getCookie("sortcol");
    if (user != "") {
        alert("cookie set to: " + user);
    } 
    else {
		alert("no cookie!");
		window.setTimeout(function(){
			sortTable(0,0)
		}, 2000);
    }
}

var setSortCookie = function(){
	$("#header-timeago").click(function() { 
        if( $(this).hasClass("ascending") ){
	        // set sorting column and direction, this will sort on the first and third column the column index starts at zero 
	        var sorting = [[4,1]]; 
	        $("#articlesTable").trigger("sorton",[sorting]); 
	        $(this).removeClass("ascending");
	        setCookie("sortcol",4,365);
	        return false;         	
        }
        else {
	        // set sorting column and direction, this will sort on the first and third column the column index starts at zero 
	        var sorting = [[4,0]]; 
	        $("#articlesTable").trigger("sorton",[sorting]); 
	        $(this).addClass("ascending");
	        setCookie("sortcol",4,365);
	        return false; 
		}
    }); 			
	$("#header-words").click(function() { 
        if( $(this).hasClass("headerSortUp") ){
	        setCookie("sortcol",2,365);
	        return false;         	
        }
        else if( $(this).hasClass("headerSortDown") ){
	        setCookie("sortcol",2,365);
	        return false;         	
        }
    });	
}
// Sort Table; Rows must be fully loaded for function to work
var sortTable = function(a, b){
	if ( a = 0 ){
		$("#articlesTable").tablesorter({
			headers: { 
				0: { sorter: false }, 
				1: { sorter: false },
				3: { sorter: false }
			}			
		});
	}
	else {
		$("#articlesTable").tablesorter({		
			sortList: [[a,b]],
			headers: { 
				0: { sorter: false }, 
				1: { sorter: false },
				3: { sorter: false }
			}			
		});
	}; 
};



// Initiate Functions
initialLoad();
moreButton();
checkCookie();
setSortCookie();
//window.setTimeout(sortTable, 5000);