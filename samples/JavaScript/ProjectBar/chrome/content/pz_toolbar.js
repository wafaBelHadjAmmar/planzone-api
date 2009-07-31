/*
Copyright (c) 2009, Augeo Software Inc. All rights reserved.
version: 1.0
*/

/**
 * The file which manages the toolbar in the front
 */
 
/**
 * Constant representing the planzone url website
 */
PLANZONE_URL="http://www.planzone.com"; 
 
top.PzToolbar={
	  
	  /**
		* Function wich is used to go in the Planzone website
		* @event button pressed
		*/
	  goPlanzone : function(event){
			var url=PLANZONE_URL;
			this.LoadURL(url);
		},
	  
	  /**
		* The URL Loader
		* @param {String} the url
		*/
	  LoadURL : function(url){
			// Set the browser window's location to the incoming URL
			window._content.document.location = url;
			// Make sure that we get the focus
			window.content.focus();
		},    
		
		 test : function(){
      alert("looooool");
		 },
    };