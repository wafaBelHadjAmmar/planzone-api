/*
Copyright (c) 2009, Augeo Software Inc. All rights reserved.
version: 1.0
*/

/**
 * The file which manages the status-Bar
 */
top.PzStatusBar={
		
	  /**
		* Function which opens the About window
		*/
	  openApropos :function(){
			window.openDialog("chrome://ProjectBar/content/apropos.xul", "_blank", "centerscreen,chrome,resizable=no,dependent=yes");
		},
		
	  /**
      * Function which opens the Preferences window
      * @param {int} the tab to show
	    */
	  openPref :function(i){
			window.openDialog("chrome://ProjectBar/content/pref.xul", "_blank", "centerscreen,chrome,resizable=no,dependent=yes",i);
			//PzPref.selectTab();
		},
		
	  /**
		* Function which will make a request to update the weather
		*/
	  misAJourMeteo :function() {
			this.makeRequest('http://www.wunderground.com/auto/rss_full/global/stations/07157.xml', '');
			//self.setTimeout('misAJourMeteo()', 900000); // mis a jour toutes les 15mins
		},
		
	  /**
		* Function which makes a request to get the temperature in Paris 
		* It receive an XML file after the request
		* And it calls alertsChangements() when the xml is loaded
		* @param {String} the url
		* @param {String} the url's parameters
		* @return {Boolean} false , if the request failed
		*/
	  makeRequest : function (url, parameters) {
			http_request = false;
			http_request = new XMLHttpRequest();
			if (http_request.overrideMimeType) {
				http_request.overrideMimeType('text/xml');
			}
			if (!http_request) {
				alert('Cannot create XMLHTTP instance');
				return false;
			}
			http_request.onreadystatechange = PzStatusBar.alertsChangements;
			http_request.open('GET', url + parameters, true);
			http_request.send(null);
		},

	  /**
		* Function which shows the Paris's temperature
		* For each to-dos, we take only the description
		*/	
	  alertsChangements : function () {
		   if (http_request.readyState == 4) {
			  if (http_request.status == 200) {
					var xmlobject = http_request.responseXML;
					var root = xmlobject.getElementsByTagName('rss')[0];
					var channels = root.getElementsByTagName("channel");
					var items = channels[0].getElementsByTagName("item");
					var descriptions = items[0].getElementsByTagName("description");
					var desc = descriptions[0].firstChild.nodeValue;
					var descarray = desc.split("|");
					var temp = descarray[0];
					var temparray = temp.split(":");
					var temperature = temparray[1];
					
					alert("Paris: " + temperature);

				}else {
						alert('Il y a un probleme avec la requete.');
			        }
		    }else{
				 //chargement
		        }
		},
		
		/**
		* Function which plays the sound selected by 
		* the user
		*/
	  beep:function(){
			if(PzPref.isSound()){
				var wav=PzPref.getWav();
				PzPref.playSound(wav); 
			}
		},
	  /***************************************************** TEST  ************************************************************/
		test : function(){
      PLANZONEPLUGIN.addListener();
		  PLANZONEPLUGIN.oAuthorize();

		},

		reset : function(){
		
			$('pz_nbTodo').value=0;
			var label=$('pz_tooltiplabel');
		  label.setAttribute("class","pz_new_todos_normal");
        
		
			
			
		},
		clear : function(){
		
			
			PzPass.clearAuth();
			
		},
		get : function(){
		
			
			PzPass.getAuth();
		
			
		},
	
	  /***************************************************** TEST  ************************************************************/  
	};
	
	