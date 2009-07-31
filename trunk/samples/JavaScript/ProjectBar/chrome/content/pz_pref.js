/*
Copyright (c) 2009, Augeo Software Inc. All rights reserved.
version: 1.0
*/

/**
 * The file which manages the User's preferences (Sound and ID)
 */

/**
 * Constant representing the sound's way
 */
WAV_CHOIX="chrome://ProjectBar/skin/pz_warning.wav";



top.PzPref={
	  /**
		* Function called when the user
		* press OK in the preferences window
		* @return {Boolean} true in the Identification tabPanel, if the users is logged
		* @return {Boolean} true in the Sound tabPanel, if the users press OK
		*/
	  OK :function(){
		   /**
			* A string variable representing the sound file way
			* It saved on the firefox preferences
			
			*/
			
			
			/***************************************************SON*********************************************/
			
		   PzPref.setSon();
		 
		   
		   
		   /***************************************************REFRESH*********************************************/
		   
		   
        PzPref.setRefresh();
     
		  

		   /****************************************************THEME********************************************/
		   
        PzPref.setTheme();
		   
		   
		   /***************************************************id*********************************************/
		   if($('pz_tabpanels').selectedIndex==1 ){
          try{
				   window.opener.document.defaultView.PzPanel.switchDeck1();
				   }
				   catch(e){}
			} 
		  return true;  
		},
		
		setTheme:function(){
		
      if($("pz_pref_theme1").selected)
            window.opener.document.defaultView.PzPanel.pz_setTheme("pz_themeDefaut");
		   else
            window.opener.document.defaultView.PzPanel.pz_setTheme("pz_blueTheme");
		
		},
		
		setRefresh:function(){
		
      if($('pz_pref_refresh_check').checked){
            PREF_REFRESH.setBoolPref("bool", true);
            if($('pz_pref_refresh_choix_man').selected) { 
                PREF_REFRESH.setIntPref("time",$('pz_pref_refresh_txtbox').value);	
            }
            else{
            
                if($('pz_pref_refresh_choix_5').selected) PREF_REFRESH.setIntPref("time",5);
                
                if($('pz_pref_refresh_choix_10').selected) PREF_REFRESH.setIntPref("time",10);
                
                if($('pz_pref_refresh_choix_20').selected) PREF_REFRESH.setIntPref("time",20);
              
              
            } 
            
		   }
		   else{
				PREF_REFRESH.setBoolPref("bool", false);
		   }
		
		},
		
		setSon:function(){
		
      
      var wav = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
			wav.data = "";
      if($("pz_pref_son_check").checked){
		   	
				   
				PREF_SON.setBoolPref("on", true);
			
				  
				if($("pz_pref_son_choix_defaut").selected){
					
					wav.data=WAV_DEFAULT;
					PREF_SON.setComplexValue("chemin", Components.interfaces.nsISupportsString, wav);  
						
				}
				else{
				
					wav.data=PzPref.getWav();
					PREF_SON.setComplexValue("chemin", Components.interfaces.nsISupportsString, wav);
					
				}  
		   }else{
		    
				PREF_SON.setBoolPref("on", false);
		   }
		
		
		},



	  /**
		* Function which verify if the user's ID are right
		* @return {Boolean} true , if the user enters a good mail and a valide password
		*/
	  verif_id: function(){
		  /**
			* A string variable representing the encryption (mail + password)
			* It saved on the firefox preferences
			*/
		  var cryptage = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
			  cryptage.data="";
			  
		  /**
			* A string variable representing the mail 
			* It saved on the firefox preferences
			*/
		  var mail = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
			  mail.data="";
			  
		  if($("pz_mail").value!="" && $("pz_password").value!=""){
				 
				 $("pz_pref_status").value=lib.$STR("pref-id-good");
				 $("pz_pref_icon").setAttribute("src","chrome://ProjectBar/skin/check_vert.png");
				
				 PzPass.saveAuth($("pz_mail").value,$("pz_password").value);
				 
				 PREF_ID.setBoolPref("login", true);
				
				 return true;
		  }else{
				$("pz_pref_status").value=lib.$STR("pref-id-wrong");
				$("pz_pref_icon").setAttribute('src','chrome://ProjectBar/skin/croix_rouge.png');
				PREF_ID.setBoolPref("login", false);
				return false;
		  }
		},

	  /**
		* Function called when the user press the 'browse' button
		* This function shows a browse folder window and save the path
		*/
	  onBrowse: function() {

			var nsIFilePicker = Components.interfaces.nsIFilePicker;
			var nsILocalFile = Components.interfaces.nsILocalFile;
			var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);

			fp.init(window, lib.$STR("pref-borwse"), nsIFilePicker.modeOpen);
			fp.appendFilter(lib.$STR("pref-borwse-son"),"*.wav");

			var ret=fp.show();

			var fileField = $('pz_pref_folderName');
			if (ret == nsIFilePicker.returnOK) {
			
				var localFile = fp.file.QueryInterface(nsILocalFile);
				var viewable = fp.file.path;
				$('pz_pref_folderName').value = viewable;
				//WAV_CHOIX="file:///"+viewable;
				
				this.setWav("file:///"+viewable);
				
			}
			else if (ret == nsIFilePicker.returnCancel) {
				//Cancel key pressed
			}
		},
	  
	  
	  /**
		* Function called when the user press the 'replay' button
		* This function plays the selected by the user
		* If no sound is selected, it plays the default sound
		*/
	  rePlaySound :function(){
			
			var wav ="chrome://ProjectBar/skin/pz_warning.wav"; //default way
			if($('pz_pref_son_choix_parcourir').selected){
				  wav=$("pz_pref_folderName").value;
			 }  
			 this.playSound(wav); 
	 
		},
			
	  /**
		* Function checks if sound is enabled
		* It searchs on the Sound preference 
		* @return {Boolean} true , if the sound preference boolean is true
		*/
	  isSound :function(){
			
			var pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
			pref = pref.getBranch("extensions.planzone.pref.son."); 
			var bool_son= pref.getBoolPref("on"); // récupère une préférence
			return bool_son;     
		},

	 
	  /**
		* Function which returns the selected sound file way
		* It searchs on the Sound preference 
		* @return {String} , the sound file way
		*/
	  getWav:function(){
			var pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
			pref = pref.getBranch("extensions.planzone.pref.son."); 
			var value = pref.getComplexValue("chemin",Components.interfaces.nsISupportsString).data;
			return value;
		},   
		
	  setWav:function(url){
			var wav = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
			wav.data = url;
	 
			var pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
			pref = pref.getBranch("extensions.planzone.pref.son."); 
			pref.setComplexValue("chemin", Components.interfaces.nsISupportsString,wav);
			
		},
		
	  /**
		* Function which plays a sound entered in the param
		* @param {String} the sound file way
		*/
	  playSound :function(wav){
		   
			  try {
					var sound = Components.classes["@mozilla.org/sound;1"].createInstance(Components.interfaces.nsISound);
					var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
					var soundUri = ioService.newURI(wav, null, null);
					sound.play(soundUri);
				}
				catch(e) {
					dump(e);
				}
		 
		},    

	  
	  
	  
	  
	  selectTab:function(id){
	  
		$('pz_tabpanel'+id).click();

	  
	  },
	  
	  init:function(){
      
      //alert(PREF_FIRSTTIME.getCharPref("OSName"));
      
      if(PREF_FIRSTTIME.getCharPref("OSName")=="MacOS"){
      
        $('pz_applySon').collapsed=false;
        $('pz_applyTheme').collapsed=false;
        $('pz_applyRefresh').collapsed=false;
      
      }
      var meRefresh=$('pz_pref_refresh_check');
      meRefresh.checked=PREF_REFRESH.getBoolPref("bool");
      this.behaviorRefresh(meRefresh,true);
      
      
      var meSound=$('pz_pref_son_check');
      meSound.checked=PREF_SON.getBoolPref("on");
      this.behaviorSound(meSound,true);
      
      
      theme=PREF_FIRSTTIME.getCharPref("idTheme");
      this.behaviorTheme(theme);
      
     
      
	  
	  
	  },
	  refreshCK :function(){
      
      
			var me=$('pz_pref_refresh_check');
			this.behaviorRefresh(me);
	  
	  
	  },
	  
	  behaviorRefresh:function(me,init){
	  
	  if(init){
      
   
      if(me.checked==false){
      
			/*deselectione*/
			
				$('pz_pref_refresh_choix').disabled=!me.checked;
					$('pz_pref_refresh_choix_5').disabled=!me.checked;
					$('pz_pref_refresh_choix_10').disabled=!me.checked;
					$('pz_pref_refresh_choix_20').disabled=!me.checked;
					$('pz_pref_refresh_choix_man').disabled=!me.checked;
				$('pz_pref_refresh_txtbox').disabled=!me.checked;	
				$('pz_pref_refresh_label').disabled=!me.checked;	
		
			}else{
			
			/*selectionne*/
			
				
				
				$('pz_pref_refresh_choix').disabled=!me.checked;
					$('pz_pref_refresh_choix_5').disabled=!me.checked;
					$('pz_pref_refresh_choix_10').disabled=!me.checked;
					$('pz_pref_refresh_choix_20').disabled=!me.checked;
					$('pz_pref_refresh_choix_man').disabled=!me.checked;
				
				if($('pz_pref_refresh_choix_man').selected){
					$('pz_pref_refresh_txtbox').disabled=!me.checked;	
					$('pz_pref_refresh_label').disabled=!me.checked;	
				}
				
				
			}
	  
	  }
	  else	  
      if(me.checked==true){
			/*deselectione*/
				$('pz_pref_refresh_choix').disabled=me.checked;
					$('pz_pref_refresh_choix_5').disabled=me.checked;
					$('pz_pref_refresh_choix_10').disabled=me.checked;
					$('pz_pref_refresh_choix_20').disabled=me.checked;
					$('pz_pref_refresh_choix_man').disabled=me.checked;
				$('pz_pref_refresh_txtbox').disabled=me.checked;		
				$('pz_pref_refresh_label').disabled=me.checked;	
				
				
			}else{
			/*selectionne*/
			
				
				
          $('pz_pref_refresh_choix').disabled=me.checked;
					$('pz_pref_refresh_choix_5').disabled=me.checked;
					$('pz_pref_refresh_choix_10').disabled=me.checked;
					$('pz_pref_refresh_choix_20').disabled=me.checked;
					$('pz_pref_refresh_choix_man').disabled=me.checked;
				
				if($('pz_pref_refresh_choix_man').selected){
					$('pz_pref_refresh_txtbox').disabled=me.checked;	
					$('pz_pref_refresh_label').disabled=me.checked;	
				}
				
				
			}
	  
	  },
	  
	  soundCK :function(){
			var me=$('pz_pref_son_check');
			this.behaviorSound(me);
	  
	  
	  },
	  
	  behaviorSound:function(me, init){
	  if(init){
      if(me.checked==false){
        /*deselectione*/
          $('pz_pref_son_choix').disabled=!me.checked;
            $('pz_pref_son_choix_defaut').disabled=!me.checked;
            $('pz_pref_son_choix_parcourir').disabled=!me.checked;
          $('pz_pref_folderName').disabled=!me.checked;	
          $('pz_pref_btnBrowse').disabled=!me.checked;
          $('pz_pref_btnRejouer').disabled=!me.checked;
          
        }else{
        /*selectionne*/
        
          
          
          $('pz_pref_son_choix').disabled=!me.checked;
            $('pz_pref_son_choix_defaut').disabled=!me.checked;
            $('pz_pref_son_choix_parcourir').disabled=!me.checked;
          if($('pz_pref_son_choix_parcourir').selected){
            
            $('pz_pref_btnBrowse').disabled=!me.checked;
            $('pz_pref_folderName').disabled=!me.checked;
          }
          $('pz_pref_btnRejouer').disabled=!me.checked;
          
        }
	  
	  
	  
	  
	  }else
      if(me.checked==true){
        /*deselectione*/
          $('pz_pref_son_choix').disabled=me.checked;
            $('pz_pref_son_choix_defaut').disabled=me.checked;
            $('pz_pref_son_choix_parcourir').disabled=me.checked;
          $('pz_pref_folderName').disabled=me.checked;
          $('pz_pref_btnBrowse').disabled=me.checked;
          $('pz_pref_btnRejouer').disabled=me.checked;
          
        }else{
        /*selectionne*/
        
          
          
          $('pz_pref_son_choix').disabled=me.checked;
            $('pz_pref_son_choix_defaut').disabled=me.checked;
            $('pz_pref_son_choix_parcourir').disabled=me.checked;
          if($('pz_pref_son_choix_parcourir').selected){
            
            $('pz_pref_btnBrowse').disabled=me.checked;
            $('pz_pref_folderName').disabled=me.checked;
          }
          $('pz_pref_btnRejouer').disabled=me.checked;
          
        }
	  
	  },
	  
	  
	  behaviorTheme:function(theme){
     
    
      if(theme=="pz_themeDefaut"){
        
        $('pz_pref_theme1').checked=true;
        
      } 
      if(theme=="pz_blueTheme") {
        $('pz_pref_theme1').checked=true;
      }
	  
     
	  },
        
        
	};       