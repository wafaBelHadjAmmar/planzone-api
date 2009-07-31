/*
Copyright (c) 2009, Augeo Software Inc. All rights reserved.
version: 1.0
*/


var PANEL_NORMAL_CLASS    = "panel";
var PANEL_COLLAPSED_CLASS = "panelcollapsed";
var PANEL_HEADING_TAG     = "h2";
var PANEL_CONTENT_CLASS   = "panelcontent";
var PANEL_COOKIE_NAME     = "panels";
var PZ_PANEL_ANIMATION_DELAY = 15; /*ms*/
var PZ_PANEL_ANIMATION_STEPS = 10;



/**
 * The file which contains several usefull functions
 */
 
/**
 * Constant representing the default sound's way
 */
WAV_DEFAULT="chrome://ProjectBar/skin/pz_warning.wav";

/**
 * Constant representing the preferences root
 */
PREF1 = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);

/**
 * Constant representing a branch from the preferences root
 * It represents the sound preferences
 * branch = "extensions.planzone.pref.son"
 */
PREF_SON = PREF1.getBranch("extensions.planzone.pref.son."); 

/**
 * Constant representing a branch from the preferences root
 * It represents the identification preferences
 * branch = "extensions.planzone.pref.id"
 */
PREF_ID=PREF1.getBranch("extensions.planzone.pref.id."); 

/**
 * Constant representing a branch from the preferences root
 * It used for the password preferences
 * branch = "extensions.planzone.pref."
 */
PREF_PASS=PREF1.getBranch("extensions.planzone.pref.");


/**
 * Constant representing a branch from the preferences root
 * It used for the refresh preferences
 * branch = "extensions.planzone.pref.refresh."
 */
PREF_REFRESH=PREF1.getBranch("extensions.planzone.pref.refresh.");


/**
 * Constant representing a branch from the preferences root
 * It used for the firstTime
 * branch = "extensions.planzone."
 */
PREF_FIRSTTIME=PREF1.getBranch("extensions.planzone.");









/**
  * Function which returns an Element by his Id
  * You can get an Element by his Id in a definite document
  * @param {String} the Element's Id
  * @param {String} the document where you want to find the Element
  * @return {Element} the Element
  */
function $(id, doc)
{
    if (doc)
        return doc.getElementById(id);
    else
        return document.getElementById(id);
};

/**
  * Function which returns the correspondence of a word
  * It find this correspondence in the planzone.properties file
  * if the correspondence doesn't exist, it return the word
  * @param {String} the word
  * @return {String} the correspondence if it was found, else the word  
  */
  
lib={
$STR:function (name) 
{
    try{
        return $("strings_planzone").getString(name.replace(' ', '_', "g"));
    }catch(err){
		
    }
    
    try{
        return $("propriete_planzone").getString(name.replace(' ', '_', "g"));
    }catch(err){
		
    }

    /*var index = name.lastIndexOf(".");
		if (index > 0)
			name = name.substr(index + 1);
    */
    return name;
}
}

function animateTogglePanel(panel, expanding)
{
	// find the .panelcontent div
	//var elements = panel.getElementsByTagName("div");
	var panelContent = panel;
	/*for (var i=0; i<elements.length; i++)
	{
		if (elements[i].className == PANEL_CONTENT_CLASS)
		{
			panelContent = elements[i];
			break;
		}
	}*/
	
	// make sure the content is visible before getting its height
	panelContent.style.display = "block";
	
	// get the height of the content
	var contentHeight = panelContent.offsetHeight;
	
    //alert(contentHeight+" "+expanding);
	
	// if panel is collapsed and expanding, we must start with 0 height
	if (expanding)
		panelContent.style.height = "0px";
	
	var stepHeight = contentHeight / PZ_PANEL_ANIMATION_STEPS;
	var direction = (!expanding ? -1 : 1);
	
	setTimeout(function(){animateStep(panelContent,1,stepHeight,direction)}, PZ_PANEL_ANIMATION_DELAY);
}

/**
 * Change the height of the target
 * @param panelContent	reference to the panel content to change height
 * @param iteration		current iteration; animation will be stopped when iteration reaches PZ_PANEL_ANIMATION_STEPS
 * @param stepHeight	height increment to be added/substracted in one step
 * @param direction		1 for expanding, -1 for collapsing
 */
function animateStep(panelContent, iteration, stepHeight, direction)
{
	if (iteration<PZ_PANEL_ANIMATION_STEPS)
	{
		panelContent.style.height = Math.round(((direction>0) ? iteration : 10 - iteration) * stepHeight) +"px";
		iteration++;
		setTimeout(function(){animateStep(panelContent,iteration,stepHeight,direction)}, PZ_PANEL_ANIMATION_DELAY);
	}
	else
	{
		// set class for the panel
		//panelContent.parentNode.className = (direction<0) ? PANEL_COLLAPSED_CLASS : PANEL_NORMAL_CLASS;
		// clear inline styles
		panelContent.style.display = panelContent.style.height = "";
	}
}