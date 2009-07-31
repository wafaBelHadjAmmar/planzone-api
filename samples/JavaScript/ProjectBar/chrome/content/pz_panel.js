/*
Copyright (c) 2009, Augeo Software Inc. All rights reserved.
version: 1.0
*/


/**
 * The file which manages the panel
 */

etatPlanzone = new  Array();

listePlanzone= new Array();
listeProjet=new Array();

todoByPlanzone= new Array();
listeTodo=new Array();
listeNewTodo= new Array();

nbTodoByPlanzone= new Array();

var URL_REQ;
var URL_AUTH;
var URL_CALLBACK;



top.PzPanel ={
    
    
    /**
      * Function which initialize all preferences, if ProjectBar is used for the first time
      * it launch the authentification process. It loads the main frame
      * It also set the Theme
      * @param {bool} to know if we need to open the Panel ( for the first time for example ) 
      */	
     init:function(openPanel){
     
         if(openPanel){
          if($('pz_panel').collapsed)
            this.showPanel();
         
         
         }
         
        /** Save the Operating System Name
         */
        
        var OSName="Unknown OS";
        if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
        if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
        if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
        if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";

        PREF_FIRSTTIME.setCharPref("OSName",OSName);


         
         try {
         
          this.pz_setTheme(PREF_FIRSTTIME.getCharPref('idTheme'));
         
         } catch(e) {/* Default theme */};
         
         
        /* About */
        var doc1 = $('pz_browser').contentDocument;
        $('pz_logo',doc1).onclick=function(){PzPanel.pz_openApropos();};
        
      
   
        
        URL_REQ=lib.$STR("URL_REQ");        
        URL_AUTH=lib.$STR("URL_AUTH"); 
        URL_CALLBACK=lib.$STR("URL_CALLBACK"); 
        
        var firstTime=false;
        
        try{
            var bool = PREF_FIRSTTIME.getBoolPref("firstTime");
            if (PREF_FIRSTTIME.getBoolPref("logged")) {
                  PzPanel.etatLogged();   
            }
            else {
                  PzPanel.etatNotLogged();
            }  
   
        
        }
        catch (e) {
            /* it's the firstTime, set Preferences */
            
            firstTime=true;
            
            PREF_FIRSTTIME.setBoolPref("firstTime",false);
            PREF_FIRSTTIME.setCharPref("URL_REQ",URL_REQ);
            PREF_FIRSTTIME.setCharPref("URL_AUTH",URL_AUTH);
            PREF_FIRSTTIME.setCharPref("URL_CALLBACK",URL_CALLBACK);
            PREF_FIRSTTIME.setCharPref("SelectedDate",0);
            PREF_FIRSTTIME.setCharPref("idTheme","pz_themeDefaut")
            
            PREF_FIRSTTIME.setCharPref("access_token.oauth_token","");
            PREF_FIRSTTIME.setCharPref("access_token.oauth_token_secret","");
            PREF_FIRSTTIME.setCharPref("oauth_username", "");
            PREF_FIRSTTIME.setCharPref("oauth_timestamp", "");
            PREF_FIRSTTIME.setBoolPref("logged", false);  
            
            var PREFTMP =PREF1.getBranch("extensions.planzone.pref.");
            
            PREFTMP.setIntPref("nbtodos",0);
            PREFTMP.setIntPref("nbtodosNew",-1);
            PREF_REFRESH.setIntPref("time",0);
            PREF_REFRESH.setBoolPref("bool",false);
            
            PREF_SON.setCharPref("chemin", WAV_DEFAULT);
            PREF_SON.setBoolPref("on",false);
            
            PzPanel.etatNotLogged();
            
            //alert("good 1ere fois");
        }
       
        PLANZONEPLUGIN.init(firstTime);
        
     },
     
     
     /**
      * This function opens the About window
      */
     pz_openApropos: function () {
    
        var extensionManager = Components.classes["@mozilla.org/extensions/manager;1"].getService(Components.interfaces.nsIExtensionManager);
        window.openDialog("chrome://mozapps/content/extensions/about.xul", "",
            "chrome,centerscreen,modal", "urn:mozilla:item:ProjectBar@planzone.fr", extensionManager.datasource);
        
     },
    
     /**
      * This function sets the main frame as "Logged state" (change text, add buttons , etc...)
      */
     etatLogged: function () {
     
          var doc1 = $('pz_browser').contentDocument;
          
          doc1.all["pz_titre"].innerHTML = lib.$STR("welcome"); 
          doc1.all["pz_corpsPrincipal"].innerHTML = "";
          doc1.all["pz_refreshLink"].innerHTML = "";
          doc1.all["pz_menuDroit"].innerHTML = "";
          doc1.all["pz_menuDroit"].setAttribute("class","element-nonvisible");
          var WelcomeMsg=doc1.createElement("div");
          WelcomeMsg.setAttribute("class", "MsgLogged");
          
          var WelcomeMsg_titre=doc1.createElement("p");
          WelcomeMsg_titre.appendChild(doc1.createTextNode(lib.$STR("welcome-msg1")));
          WelcomeMsg_titre.setAttribute("class","welcome-titre");
          
          var WelcomeMsg_1=doc1.createElement("div");
          WelcomeMsg_1.setAttribute("class","welcome-msg");
          var image1=doc1.createElement("div");
          image1.setAttribute("id","pz_icon_createTodo");
          var separator1=doc1.createElement("div");
          separator1.setAttribute("class","pz_icon_separator");
          var texte1=doc1.createElement("div");
          texte1.setAttribute("class","pz_welcomeMsg");
          texte1.appendChild(doc1.createTextNode(lib.$STR("welcome-msg2")));
          
          WelcomeMsg_1.appendChild(image1);
          WelcomeMsg_1.appendChild(separator1);
          WelcomeMsg_1.appendChild(texte1);
           
          var WelcomeMsg_2=doc1.createElement("div");
          WelcomeMsg_2.setAttribute("class","welcome-msg");
          var image2=doc1.createElement("div");
          image2.setAttribute("id","pz_icon_completeTodo");
          var separator2=doc1.createElement("div");
          separator2.setAttribute("class","pz_icon_separator");
          var texte2=doc1.createElement("div");
          texte2.setAttribute("class","pz_welcomeMsg");
          texte2.appendChild(doc1.createTextNode(lib.$STR("welcome-msg3")));
          
          WelcomeMsg_2.appendChild(image2);
          WelcomeMsg_2.appendChild(separator2);
          WelcomeMsg_2.appendChild(texte2);

          var accesTodo = doc1.createElement("div");
          accesTodo.appendChild(doc1.createTextNode(lib.$STR("welcome-msg4")));
          accesTodo.onclick=function(){PzPanel.switchDeck1();}
          accesTodo.setAttribute("id","pz_accessTodo");
          accesTodo.setAttribute("class","pz_accessTodo");
           
          WelcomeMsg.appendChild(WelcomeMsg_titre);
          WelcomeMsg.appendChild(WelcomeMsg_1);
          WelcomeMsg.appendChild(WelcomeMsg_2);
          WelcomeMsg.appendChild(accesTodo);

          $("pz_corpsPrincipal",doc1).appendChild(WelcomeMsg);

     },
     
     /**
      * This function sets the main frame as "not Logged state" (change text, add buttons to authentificate)
      */
     etatNotLogged: function () {
     
                var doc1 = $('pz_browser').contentDocument;
                
                doc1.all["pz_corpsPrincipal"].innerHTML = "";
                doc1.all["pz_titre"].innerHTML = lib.$STR("pref-id-wrong"); 
                doc1.all["pz_message"].innerHTML="";
                doc1.all["pz_menuGauche_titre"].innerHTML = lib.$STR("fiche-user"); 
                doc1.all["pz_menuGauche_nom"].innerHTML = lib.$STR("user-name");
                doc1.all["pz_menuDroit"].innerHTML = "";
                doc1.all["pz_refreshLink"].innerHTML = "";
                doc1.all["pz_menuDroit"].setAttribute("class","element-nonvisible");
                doc1.all["pz_load"].innerHTML = "";
                
                var msgNotLogged= doc1.createElement("div");
                msgNotLogged.setAttribute("class", "MsgNotLogged");
                msgNotLogged.appendChild(doc1.createTextNode(lib.$STR("not-Logged1")));
                
                var link=doc1.createElement("div");
                link.setAttribute("class","pz_accessTodo");
                link.setAttribute("id","pz_notLogged");
                
                link.onclick= function () {
                  
                  PREF_FIRSTTIME.setCharPref("access_token.oauth_token","");
                  PREF_FIRSTTIME.setCharPref("access_token.oauth_token_secret","");
                  PREF_FIRSTTIME.setCharPref("oauth_username", "");
                  PREF_FIRSTTIME.setCharPref("oauth_timestamp", "");
                  PLANZONEPLUGIN.addListener();
                  PLANZONEPLUGIN.oAuthorize();
                
                };
                
                link.appendChild(doc1.createTextNode(lib.$STR("not-Logged2")));
                msgNotLogged.appendChild(link);
                $("pz_corpsPrincipal",doc1).appendChild(msgNotLogged);
                  
     },

    

	  /**
	   * Function which shows or hide the panel
	   * It manages the splitter too
	   */
	  showPanel:function(){

		  var panel=$('pz_panel');
		  var isCollapsed =panel.collapsed;
		  var splitter =$('pz_Splitter');
		  
		  if (isCollapsed) {
				panel.setAttribute('collapsed','false');
				if (splitter.collapsed) {
					splitter.setAttribute('collapsed','false');
				}
			}
		  else {
				panel.setAttribute('collapsed','true');
				splitter.setAttribute('collapsed','true');
		  }
		},
	  
	  
	  /**
		* Function which shows the browser(first Deck's element) in the panel
		* It shows the user's to-dos too
		* If the user isn't logged, it switchs to the 'not logged state' 
		*/
	  switchDeck1 :function() {
	  

		   /* Switch to the Browser */ 
		   $('pz_deck').setAttribute('selectedIndex',0);
		   var doc1 = $('pz_browser').contentDocument;  
		   
		   /* To know if the user is logged or not */
		   var pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
		   pref = pref.getBranch("extensions.planzone.access_token.");   

		   try {
		   
            if (PREF_FIRSTTIME.getBoolPref("logged")) {
                  
                  /*save the Planzone status (collapsed or not) */
                  PzPanel.pz_saveStatus(); 
                  
                  /* Loading gif */
                  doc1.all["pz_load"].innerHTML=" <image id='gif' src='chrome://ProjectBar/skin/pz_loading2.gif'/>";

                  PzPanel.getListePlanzone();
                  
                  doc1.all["pz_titre"].innerHTML = lib.$STR("mes-todos"); 
                  
                  
                  /* reset the refresh, if there is one */
                  try {
                
                    window.clearTimeout(timeoutID);
                
                  } catch (e) {};
                    
                  /* launch the refresh */
                  PzPanel.pz_refresh();
      
            } else {
            
              PzPanel.etatNotLogged();
              
            }
          
        } catch (e) {
        
          PzPanel.etatNotLogged();
          
        }

		},
		
		/**
      * This function is used to save the status of all " 'ul' Planzone " ( Collapsed or not )
      * Like this, we can load the frame with the last aspect
      */
		pz_saveStatus: function () {
		
          var doc1 = $('pz_browser').contentDocument;
  
          var tmp=doc1.getElementsByTagName("li");
          
          var j=0;
          
          for (var i=0 ; i< tmp.length ; i++) {
              if (tmp[i].className == "liOpen" || tmp[i].className == "liClose") {
                    etatPlanzone[j]=tmp[i].className;
                    j++;
              }
          }
  	},
		
		
		/**
      * This function is used to save all selected projects of each Planzone
      * Like this, we can load the frame with the last aspect
      */
	  pz_saveStatusProjects: function() {
                
               
          var doc1 = $('pz_browser').contentDocument;
          var PREF_TMP =PREF1.getBranch("extensions.planzone.");

          var selects=doc1.getElementsByTagName("select");
          var chaine="";
          var j=0;

          for (var i=0 ; i< selects.length ; i++) {
            if (selects[i].id == "add_comboboxProjet"+j) {
                  chaine=chaine+selects[i].selectedIndex+"/";
                  j++;
            }
          }
          PREF_TMP.setCharPref("SelectedProject",chaine);              
       },
       
       
    /**
      * This function is used to save the last date used
      * Like this, we can load the frame with the last aspect, for all Planzone
      * @param {int} : the index selected
      */
    pz_saveDate: function(index) {
                
                
          var doc1 = $('pz_browser').contentDocument;
          
          var PREF_TMP =PREF1.getBranch("extensions.planzone.");
          
          PREF_TMP.setCharPref("SelectedDate",index);
         
          var selects=doc1.getElementsByTagName("select");  
          
          var j=0;
          
          for (var i=0 ; i< selects.length ; i++) {
            
            if (selects[i].id == "add_calendar_date"+j) {
               
                $("add_calendar_date"+j,doc1).selectedIndex=index;
                
                if ($("add_calendar_date"+j,doc1).value == lib.$STR("today")) {
                      $("add_calendar_date"+j,doc1).setAttribute("class","add_calendar_date_today");
                }         
                else {
                      $("add_calendar_date"+j,doc1).setAttribute("class","add_calendar_date_after");
                }
                if ($("add_calendar_date"+j,doc1).value == lib.$STR("today")) {
                      $("add_calendar_date"+j,doc1).setAttribute("dateAPI","today");
                }
                if ($("add_calendar_date"+j,doc1).value==lib.$STR("tomorrow")) {
                      $("add_calendar_date"+j,doc1).setAttribute("dateAPI","tomorrow");
                }
                if ($("add_calendar_date"+j,doc1).value==lib.$STR("in-2-days")) {
                      $("add_calendar_date"+j,doc1).setAttribute("dateAPI","in-2-days");
                }
                if ($("add_calendar_date"+j,doc1).value==lib.$STR("in-3-days")) {
                      $("add_calendar_date"+j,doc1).setAttribute("dateAPI","in-3-days");
                }
                if ($("add_calendar_date"+j,doc1).value==lib.$STR("next-week")) {
                      $("add_calendar_date"+j,doc1).setAttribute("dateAPI","in-7-days");
                }
                if ($("add_calendar_date"+j,doc1).value==lib.$STR("in-15-days")) {
                      $("add_calendar_date"+j,doc1).setAttribute("dateAPI","in-15-days");
                }
                if ($("add_calendar_date"+j,doc1).value==lib.$STR("next-month")) {
                      $("add_calendar_date"+j,doc1).setAttribute("dateAPI","in-30-days");
                }
                
                j++;
            }     
                
         }    
    
    },
    


    /**
      * This function makes a request to the API to have the list of todos
      */
    pz_getTodoAPI: function () {
            
      PLANZONEPLUGIN.pz_makeRequest(URL_REQ+'/v1/rest/todos', '');
        
    },
    
    
    /**
      * This function makes a request to the API to have the list of Planzones
      * the callback is implements here, it calls getListeProjet()
      */
    getListePlanzone: function () {
        
        PLANZONEPLUGIN.pzGetJSON(URL_REQ+'/v1/rest/planzones?format=json', function(result) {
           
                var pz;
                listePlanzone=new Array(); 
                
                /* for each Planzone we save his name, his url and his id on 
                 * the listePlanzone tab
                 */
                for (var i=0; i < result.planzones.length; i++) {
                    
                    pz = result.planzones[i];
                    listePlanzone[i]=new Array();
                    listePlanzone[i][0]=pz.planzone;
                    listePlanzone[i][1]=pz.name;
                    listePlanzone[i][2]=pz.url

                    todoByPlanzone[i]=new Array();
                    todoByPlanzone[i][0]=pz.planzone;
                }
                PzPanel.getListeProjet();
        
        } );
   
    },

    /**
      * This function is used to know if a Planzone has todos or not, and his num in the Planzone List
      * @param {int} the id of th Planzone
      * @return {int} : return the num of the Planzone (-1 if it has no todos)
      */
    planzoneVide: function (idPlanzone, planzones_ac_Todo) {

        for (var i=0 ; i<planzones_ac_Todo.length ; i++) {
          if (planzones_ac_Todo[i].getAttribute('planzone') == idPlanzone) {
                return i
          }
        }
        return -1;

    },
    
    
    /**
      * This function makes a request to the API to have the list of Projects
      * the callback is implements here, it calls PzPanel.pz_getTodoAPI()
      */
    getListeProjet:function () {
    
        PLANZONEPLUGIN.pzGetJSON(URL_REQ+'/v1/rest/projects?format=json', function(result) {
       
            var un_projet;
            var pz;
            var prj
            
            /* for each Project we save the Planzone id
             * the listePlanzone tab
             */
            for (var i=0; i < result.projects.length; i++) {
                pz = result.projects[i];
                listeProjet[i]=new Array();
                listeProjet[i][0]=pz.planzone;
                listeProjet[i][1]=new Array();
                listeProjet[i][1]=pz.projects;
            }
            PzPanel.pz_getTodoAPI();
        } );
                
    },

    /**
      * This is the main function which build the html web page.
      * It creates all of the frame architecture 
      * @param {Planzone[]} the list of Planzone with todos
      */
    pz_creerPanel_tab2 : function (planzones_ac_Todo) {

        var idPlanzone;
        var laPlanzone;
        var nbTodosTotal=0;
        var doc1 = $('pz_browser').contentDocument; 
        var today=new Date();
        
        var PREF_TMP =PREF1.getBranch("extensions.planzone.");
        
        PzPanel.pz_majTabTodo(planzones_ac_Todo);
        
        doc1.all["pz_message"].innerHTML="";
        doc1.all["pz_load"].innerHTML="";
        
        var divPrinc = doc1.createElement("div"); 
         
        if (listePlanzone.length==0) {
        
             var msgNoPlanzone= doc1.createElement("div");
             msgNoPlanzone.setAttribute("class", "Msg-noPlanzone");
             msgNoPlanzone.appendChild(doc1.createTextNode(lib.$STR("no-Planzone")));
             divPrinc.appendChild(msgNoPlanzone);
        
        }
        else {
        
            for (var i=0; i<listePlanzone.length; i++) {

                laPlanzone =listePlanzone[i];
                var ulPrinc= doc1.createElement("ul");
                var liP= doc1.createElement("li");
                var ul= doc1.createElement("ul");
                
                ulPrinc.setAttribute("class","pz_tree");
                
                if (etatPlanzone[i]) {
                    liP.setAttribute("class",etatPlanzone[i]);
                }
                else {
                    liP.setAttribute("class","liClose");
                }
                            
                liP.setAttribute("id",laPlanzone[0]);

                /* Intitule */
                var intitule= doc1.createElement("div");
                intitule.setAttribute("class","intitule"); 
                intitule.setAttribute("id","intitule"+i); 
                
                var intit_icon = doc1.createElement("div");
                var intit_nom = doc1.createElement("div");
                var intit_count = doc1.createElement("div");  
                var intit_newTodo = doc1.createElement("div");
                
                
                intit_icon.setAttribute("class","intit_icon"); 
                intitule.appendChild(intit_icon);
                intit_nom.setAttribute("class","intit_nom"); 
                intit_count.setAttribute("class","intit_count"); 
                intit_newTodo.setAttribute("class","intit_newTodo"); 
                
                PzPanel.pz_setNomPlanzone(intit_nom, laPlanzone[0],doc1);
                
                intitule.appendChild(intit_count);
                intitule.appendChild(intit_nom);
                intitule.appendChild(intit_newTodo);
                
                intit_nom.onclick = function () {
                        
                        
                        if (this.parentNode.parentNode.className=="liClose") {
                            this.parentNode.parentNode.setAttribute("class","liOpen");
                            var divTodo = this.parentNode.parentNode.childNodes[1];
                            var collapsed=true;
                            animateTogglePanel(divTodo, collapsed);
                        }
                        else {
                            this.parentNode.parentNode.setAttribute("class","liClose");
                            var divTodo = this.parentNode.parentNode.childNodes[1];
                            var collapsed=false;
                            animateTogglePanel(divTodo, collapsed);
                        
                        }
        
                        return false;
                }
                
                intit_icon.onclick=intit_nom.onclick;
                intit_count.onclick=intit_nom.onclick;
                
                
                idPlanzone= PzPanel.planzoneVide(laPlanzone[0],planzones_ac_Todo);
                
                if (idPlanzone<0) {
                
                      var lesTodos= "";
                      var nbTodos= lesTodos.length;
                      nbTodosTotal+=nbTodos;
                      ulPrinc.setAttribute("class","pz_tree_vide");
                      
                      var todos = doc1.createElement("div");
                      todos.setAttribute("class","les_todos");
                      todos.setAttribute("id","les_todos"+i);
                      
                      var li_notodo=doc1.createElement("li");
                      li_notodo.setAttribute("class","liNotodo");
                      li_notodo.appendChild(doc1.createTextNode(lib.$STR("no-todos")));
                       
                      ul.appendChild(li_notodo);
                        
                }
                else {	
                
                      var lesTodos= planzones_ac_Todo[idPlanzone].getElementsByTagName('todo');
                      var nbTodos= lesTodos.length;
                      nbTodosTotal+=nbTodos;
                      
                      var todos = doc1.createElement("div");
                      todos.setAttribute("class","les_todos");
                      todos.setAttribute("id","les_todos"+i);
               }
                if (nbTodos > 1) {
                  intit_count.appendChild(document.createTextNode(nbTodos+" "+lib.$STR("to-dos")));
                }
                else {
                  intit_count.appendChild(document.createTextNode(nbTodos+" "+lib.$STR("to-do")));
                }
                
                var idPlanzoneMere=idPlanzone;
                PzPanel.pz_isNewAllTodo(lesTodos);
              
                todoByPlanzone[i][1]=new Array();
                todoByPlanzone[i][1]=lesTodos;    
                
                for (var j=0; j<nbTodos && j<4; j++) {
                        
                      var li_container = doc1.createElement("div");
                      var li_icon = doc1.createElement("div");
                      var li_nom = doc1.createElement("div");
                      var li_date = doc1.createElement("div");
                      var li_indicatorNew = doc1.createElement("div");
                      
                      li_icon.setAttribute("class","li_icon"); 
                      li_nom.setAttribute("class","li_nom");
                      li_container.setAttribute("class","li_container");
                      
                      li_indicatorNew.onclick= function () {
                        
                        this.className="li_indicatorNonNew";
                        var idTodo=this.parentNode.parentNode.getAttribute('id');
                        PzPanel.pz_removeAndAddTodoNew(idTodo);
                        PzPanel.switchDeck1(); 
                      }
                      
                      li_indicatorNew.appendChild(document.createTextNode(lib.$STR('new')));
                      
                      var newAttIntituleId=doc1.createAttribute("intituleID");
                      newAttIntituleId.value=i;
                      li_icon.setAttributeNode(newAttIntituleId);
                      
                      var date= lesTodos[j].getAttribute('date');
                      if (date != "") {
                      
                          var tableauDate=date.split("-");
                          var month=today.getMonth()+1;
                          
                          if (tableauDate[0]== today.getFullYear() && tableauDate[1]== month && tableauDate[2]== today.getDate()) {
                                li_date.setAttribute("class","li_date_today");     
                          }
                          else {  
                                if (tableauDate[0] >= today.getFullYear()) {          
                                      if (tableauDate[1] >= month) {
                                            if (tableauDate[1]> month) {
                                                  li_date.setAttribute("class","li_date_futur");
                                            }
                                            else {
                                                  if (tableauDate[2]> today.getDate()) {
                                                        li_date.setAttribute("class","li_date_futur");
                                                  }
                                                  else {
                                                        li_date.setAttribute("class","li_date_passe");
                                                  }
                                            
                                            }
                                    
                                       } 
                                       else {
                                              li_date.setAttribute("class","li_date_passe");
                                       }
                                } 
                                else {
                                        li_date.setAttribute("class","li_date_passe");
                                }
                         }  
                         li_date.appendChild(document.createTextNode(date));
                      }  
                      else {
                            li_date.setAttribute("class","li_date_vide");
                      }
                                      
                      var li=doc1.createElement("li");  
                      li.setAttribute("class","li_unchecked");
                      
                      var titreTodo= lesTodos[j].getElementsByTagName('title')[0].firstChild.nodeValue;
                      var priority=lesTodos[j].getAttribute('priority');
                      var font=document.createElement("font");
                      font.setAttribute('style','font-style : italic');
                      
                      if (priority!='normal') {
                          if (priority =='high') {
                            font.style.color='red';
                          }
                          priority= "   ("+lib.$STR(priority)+")";
                          font.appendChild(document.createTextNode(priority)); 
                      }
                      li_nom.appendChild(doc1.createTextNode(titreTodo+"     "));
                      li_nom.appendChild(font);

                      /*  attributes */
                      
                      var url=lesTodos[j].getElementsByTagName('url')[0].firstChild.nodeValue;
                      var newAttUrl=doc1.createAttribute("url");
                      newAttUrl.value=url;
                      
                      var id=lesTodos[j].getAttribute('id');
                      var newAttId=doc1.createAttribute("id");
                      newAttId.value=id;

                      var idPlanzoneMere=laPlanzone[0];
                      var newAttPl=doc1.createAttribute("planzone");
                      newAttPl.value=idPlanzoneMere;
                      
                      li.setAttribute("id",id);
                      li.setAttributeNode(newAttUrl);
                      li.setAttributeNode(newAttId);
                      li.setAttributeNode(newAttPl);
                     
                      li_icon.onclick= function () {
                      
                                  var c = (this.parentNode.parentNode.className=="li_unchecked") ? "li_checked" : "li_unchecked";
                                  this.parentNode.parentNode.setAttribute("class",c); 
                                  var d = (this.className=="li_icon") ? "li_icon_check" : "li_icon";
                                  this.setAttribute("class",d); 
                                  
                                  var planzone = this.parentNode.parentNode.getAttribute('planzone');
                                  var idTodo = this.parentNode.parentNode.getAttribute('id');
                                  var urlTest=URL_REQ+"/v1/rest/todo/"+idTodo+"/complete";  
                                 
                                  /* save planzones statuts */
                                  
                                  var tmp=doc1.getElementsByTagName("li");
                                  var j=0;
                                  for ( var i=0; i< tmp.length ;i++) {
                                      
                                      if (tmp[i].className=="liOpen" || tmp[i].className=="liClose") {
                                        etatPlanzone[j]=tmp[i].className;
                                        j++;
                                      }
                                  }
                                  
                                  $("intitule"+this.getAttribute('intituleID'),doc1).childNodes[0].className="intit_icon_load";
                                  PLANZONEPLUGIN.pz_completeTodo(urlTest,this.getAttribute('intituleID')) ;
                                     
                      };

                      li_nom.onclick= function () {  
                      
                                  PzToolbar.LoadURL(this.parentNode.parentNode.getAttribute('url'));
                                  return false;
                      };

                      li_container.appendChild(li_icon);
                      li_container.appendChild(li_nom);
                      li_container.appendChild(li_date);
                      li_container.appendChild(li_indicatorNew);
                      
                      li.appendChild(li_container);
                      ul.appendChild(li);
                      
                      
                      if (PzPanel.pz_isNew( lesTodos[j].getAttribute('id'))) {
                      
                        li_indicatorNew.setAttribute("class","li_indicatorNew");
                      
                      }
                      else {
                      
                        li_indicatorNew.setAttribute("class","li_indicatorNonNew");
                        
                      }
      
                }
                       
                /***** is new Todo  ***/
                          
                var nbNewTodo = PzPanel.pz_nbNewTodo(lesTodos);
                
                if (nbNewTodo > 0) {
                
                        if (nbNewTodo>1) {
                          intit_newTodo.innerHTML= nbNewTodo+" "+lib.$STR("news");
                        }
                        else {
                          intit_newTodo.innerHTML= nbNewTodo+" "+lib.$STR("new");
                        } 
                        intit_newTodo.setAttribute("class","intit_newTodo");
                }
                else {
                        intit_newTodo.innerHTML= "";
                        intit_newTodo.setAttribute("class","intit_newTodo_none");
                
                }
                intit_newTodo.onclick= function () {

                        for (var i=0 ; i< todoByPlanzone.length ; i++) {
                            if (this.parentNode.parentNode.getAttribute('id') == todoByPlanzone[i][0]) {
                                for (var j=0 ; j< todoByPlanzone[i][1].length ; j++) {
                                    PzPanel.pz_removeAndAddTodoNew(todoByPlanzone[i][1][j].getAttribute('id'));
                                 }
                                 PzPanel.switchDeck1();
                                 return
                               
                             }
                         }
                                
                
                };
          
             

                /*** see more label ***/
                
                if (nbTodos>j) {
                
                  var li_msg=doc1.createElement("li");
                  li_msg.setAttribute("class","liMsg");
                  li_msg.setAttribute("id",laPlanzone[2]); //Planzone URL
                  li_msg.appendChild(doc1.createTextNode(lib.$STR("see-more")));
                  li_msg.onclick= function () {
                        PzToolbar.LoadURL(this.id+"/home/todo");
                  };
                  ul.appendChild(li_msg);
                  
                }
                /***              ***/
                
                PzPanel.pz_creerAddTodo(ul, doc1,laPlanzone[0],i);
                
                todos.appendChild(ul);
                liP.appendChild(intitule);
                liP.appendChild(todos);                         
                ulPrinc.appendChild(liP);
                divPrinc.appendChild(ulPrinc);
                    

            }
            
        }
        
        doc1.all["pz_corpsPrincipal"].innerHTML="";  
        $("pz_corpsPrincipal",doc1).appendChild(divPrinc); 
        
        try { 
        
          PREF_TMP.getCharPref("SelectedProject");
          PzPanel.pz_setSelectedIndexProject();
       
         
        }
        catch (e) {};
       
        PzPanel.pz_setSelectedDate();
       
        PzPanel.pz_creerPanel_menuDroit(listePlanzone.length,nbTodosTotal);
        
        PzPanel.pz_creerRefreshLink();
        
        PzPanel.pz_setNbTodos(nbTodosTotal);
        
        PzPanel.pz_majTooltip();

    },
    
   /** This function calls pz_isNew() for each todo
     * @param {todo[]} :the list of todos
     */
    pz_isNewAllTodo: function (lesTodos) {
        
        for (var i=0; i<lesTodos.length ; i++) {
          sertarien = PzPanel.pz_isNew(lesTodos[i].getAttribute('id'));
        }
      
    },
      
    /** This function is used to know if a todo is New or not
     *  @param {string}: the id of a todo
     *  @return {boolean}: true if it is new
     */
    pz_isNew: function (idTodo) {

         if (listeTodo.length==0) {
            return false;  
          }   
         
         for(var i =0; i< listeTodo.length; i++) { 

              if (listeTodo[i] == idTodo) {
              
                return false;
              }       
         }
         
         PzPanel.pz_addToNew(idTodo);   
         return true;  
      
    },
    
    
    /** This function adds a tod to the tab which contains 
     *  the id of all new todo
     *  @param {string}: the id of a todo
     */ 
    pz_addToNew: function(idTodo) {
      
      for (var i=0; i < listeNewTodo.length; i++) {
      
        if (listeNewTodo[i] == idTodo) {
          return ;
        }
      
      }
      
      listeNewTodo[i]=idTodo;

    },

      
    /** This function updates the todo list (list A), and the new todo list
     *  @param {planzone[]}: the list of planzone with todo (list B) (we get it by request to the API)
     */
    pz_majTabTodo: function (planzones_ac_Todo) {
        
        /* update the list of todo */
        
        var tmp= new Array();
        var lesTodos; /* list B */
        
        /** We Compare the todo List to the todo that we get by the request
         *  We keep only todo that are in the list B, and creates a new list A
         */
        if (listeTodo.length !=0) { /* list A */

            for ( var i=0; i<listeTodo.length; i++) {
                for (var j=0; j< planzones_ac_Todo.length; j++) {
                   lesTodos = planzones_ac_Todo[j].getElementsByTagName('todo');
                   for (var k=0; k < lesTodos.length; k++) {
                        if (listeTodo[i] == lesTodos[k].getAttribute('id')) {
                          tmp[tmp.length]=listeTodo[i];
                      }
                   }   
                
                }
    
            }
            listeTodo=new Array();
            listeTodo=tmp;
            
        }
        else {
              
              /** creates the list A, by copying all todo of list B
                * notice that we take only the id of todo
                */
              for (var z=0; z< planzones_ac_Todo.length; z++) {
                 
                   lesTodos = planzones_ac_Todo[z].getElementsByTagName('todo');
                   for (var k=0; k<lesTodos.length; k++) { 
                        listeTodo[listeTodo.length]=lesTodos[k].getAttribute('id');             
                   }                
              }
        
        }
        
        /* update the list of new todo */

        tmp=new Array();
        
        /** We Compare the new todo List to the todo that we get by the request
         *  We keep only todo that are in the list B, and creates the new todo list
         *  Like this todo which were new are still new
         */
        for( var i=0; i<listeNewTodo.length; i++) {

              for (var j=0; j< planzones_ac_Todo.length; j++) {
       
                   lesTodos = planzones_ac_Todo[j].getElementsByTagName('todo');

                   for (var k=0; k<lesTodos.length; k++) {
                     
                      if (listeNewTodo[i] == lesTodos[k].getAttribute('id')) {
                        
                        tmp[tmp.length]=listeNewTodo[i];
                      }
                   }   
                
              }
    
        }
    
        listeNewTodo=new Array();
        listeNewTodo=tmp;

        
    },
    
    /** This function counts the number of new todo in a list
     *  @param {todo[]}: the list of todo
     *  @return {int}: the number of new todo
     */
    pz_nbNewTodo: function (lesTodos) {
      
        var nb=0;
        for (var i=0; i<lesTodos.length; i++) { 
            for (var j=0; j< listeNewTodo.length ; j++) {
                if (lesTodos[i].getAttribute('id') == listeNewTodo[j]) {
                  nb++;
                }
            }
         
        }
        return nb;
    },
      
     
    /** This function remove a todo from the the new todo list and
     *  ad it to the todo list
     *  @param {string}: the id of todo
     */
    pz_removeAndAddTodoNew: function (idTodo) { 
      
          var tmp= new Array();
         
          for (var i=0; i< listeNewTodo.length ; i++) {
            if ( listeNewTodo[i] != idTodo ) {
              tmp[tmp.length]=listeNewTodo[i];
              
            }
          else {       
            listeTodo[listeTodo.length]=idTodo;
           }
          
          }
          listeNewTodo= new Array();
          listeNewTodo= tmp;
      
    },
      
      
   /** This function set all selected Project from the list that we saved in pz_saveStatusProjects()
     * the list is like that : /indexProject/indexProject/indexProject/indexProject
     * So the function split the chain and use information. (index are in order)
     */
    pz_setSelectedIndexProject: function() {
      
          var doc1 = $('pz_browser').contentDocument;
          var selects=doc1.getElementsByTagName("select");
          var PREF_TMP =PREF1.getBranch("extensions.planzone.");
          var chaine;
          chaine=PREF_TMP.getCharPref("SelectedProject");
          chaine=chaine.split("/");
          var j=0;
          
          /** We take all comboBox in the HTML, and set the selectedIndex for
           *  "add_comboboxProjet" comboBox
           */
          for (var i=0; i< selects.length ;i++) {          
              if(selects[i].id=="add_comboboxProjet"+j) {
                  selects[i].selectedIndex=chaine[j];
                  j++;
              }
                    
                  
          }

    },
    
  
    /** This function set the selected date for all Date comboBox from the list that we saved in pz_saveDate()
     */
    pz_setSelectedDate: function () {
    
        var PREF_TMP =PREF1.getBranch("extensions.planzone.");
       
         try {
            PzPanel.pz_saveDate(PREF_TMP.getCharPref("SelectedDate"));
         }
         catch (e) {
            PzPanel.pz_saveDate(0);
         }
    },
    
    
    /** This function builds the refresh button
     */
    pz_creerRefreshLink: function () {
    
        var doc1 = $('pz_browser').contentDocument; 
        var divPrinc = doc1.createElement("div");
        divPrinc.setAttribute("id","pz_refreshContainer");
        
        var image=doc1.createElement("div");
        image.setAttribute("id","pz_imageRefresh");
        
        var msg=doc1.createElement("div");
        msg.setAttribute("id","pz_labelRefresh");
        msg.appendChild(doc1.createTextNode(lib.$STR("actualiser")));
        
        divPrinc.onclick=function(){PzPanel.switchDeck1();};
        
        divPrinc.appendChild(image);
        divPrinc.appendChild(msg);
        
        doc1.all["pz_refreshLink"].innerHTML="";
        $("pz_refreshLink",doc1).appendChild(divPrinc);

    },
    
    
    /** This function builds create todo menu
     *  @param {String}: the UL id
     *  @param {Element}: doc1 represents the document which all Elements are installed on
     *  @param {String}: the id of the Planzone
     *  @param {int}: the num of the Planzone
     */
    pz_creerAddTodo: function (ul, doc1,laPlanzone,i) {

      var bool=false;
      var li_AddTodo = doc1.createElement("li");
      li_AddTodo.setAttribute("class","li_Add");
      var add_icon   = doc1.createElement("div");
      var add_titre  = doc1.createElement("div");
      var add_projet = doc1.createElement("div");
      var add_date   = doc1.createElement("div");
      
      add_icon.setAttribute("class","add_icon");
      add_titre.setAttribute("class","add_titre");
      add_projet.setAttribute("class","add_projet");
      add_date.setAttribute("class","add_date");
      
      /*** The add Icon ***/
      add_icon.id=i; 
      add_icon.onclick= function () {
      
          var titre = $("add_textbox"+this.id,doc1).value;
          
          if (titre!="" && titre!=lib.$STR('name-new-todo')) {
            var selInd =$("add_comboboxProjet"+this.id,doc1).selectedIndex;
            var projet= $("add_comboboxProjet"+this.id,doc1).options[selInd].id;
            var date= $("add_calendar_date"+this.id,doc1).getAttribute("dateAPI");
            
            $("intitule"+this.id,doc1).childNodes[0].className="intit_icon_load";
            PLANZONEPLUGIN.createTodo(titre, projet, date,this.id);
      
        } 
      };
       
      
      /*** The textBox which will contains the todo title ***/
      
      var add_textbox = doc1.createElement("input");
      add_textbox.id="add_textbox"+i;
      add_textbox.setAttribute("class","add_textbox");
      add_textbox.value=lib.$STR('name-new-todo');
      add_textbox.type="text";
      
      add_textbox.onkeypress= function (e) {
                                       
                                      if (e.which == 13) {
                                          $(i,doc1).onclick(); //ENTER
                                      }
                                      
      };
      
      add_textbox.onfocus= function () {
                                     
                                      if (this.value == lib.$STR('name-new-todo')) {
                                          this.value='' ;
                                      } 
                                      
      };
                                      
      add_textbox.onblur= function () {  
          
                                      if (this.value == "") {
                                          this.value=lib.$STR('name-new-todo') ;
                                      }
      };                              
                                      
      add_titre.appendChild(add_textbox); 
       
      /*** the Project Combobox ***/
      
      var add_comboboxProjet = doc1.createElement("select");
      add_comboboxProjet.setAttribute("class","add_comboboxProjet");
      add_comboboxProjet.id="add_comboboxProjet"+i;
      var SelectedInd=doc1.createAttribute("selindex");
      add_comboboxProjet.setAttributeNode(SelectedInd);
         
      add_comboboxProjet.onkeypress= function (e) {
                                       
                                      if (e.which==13) {
                                          $(i,doc1).onclick(); //ENTER
                                      }
                                      
      };
      
      add_comboboxProjet.onclick= function () {
                                     
                                      PzPanel.pz_saveStatusProjects();
      };
     
      PzPanel.charger_comboboxProjet(add_comboboxProjet, doc1,laPlanzone,i);
     
      if (add_comboboxProjet.length==0) {
            return;
      }  
 
      add_projet.appendChild(add_comboboxProjet);
      
      /*** the Date Combobox ***/

      var add_calendar_date = doc1.createElement("select");
       
      add_calendar_date.setAttribute("class","add_calendar_date_today");
       
      add_calendar_date.setAttribute("id","add_calendar_date"+i);
      
      add_calendar_date.onclick= function () {
      
                                              PzPanel.pz_saveDate(this.selectedIndex);
      };
      
      add_calendar_date.onkeypress= function (e) {
                                       
                                              if (e.which==13) {
                                                  $(i,doc1).onclick(); //ENTER
                                              }
                                      
      };
     
      var date_1 = doc1.createElement("option");
      var date_2 = doc1.createElement("option");
      var date_3 = doc1.createElement("option");
      var date_4 = doc1.createElement("option");
      var date_5 = doc1.createElement("option");
      var date_6 = doc1.createElement("option");
      var date_7 = doc1.createElement("option");
      
      date_1.appendChild(doc1.createTextNode(lib.$STR("today")));
      date_2.appendChild(doc1.createTextNode(lib.$STR("tomorrow")));
      date_3.appendChild(doc1.createTextNode(lib.$STR("in-2-days")));
      date_4.appendChild(doc1.createTextNode(lib.$STR("in-3-days")));
      date_5.appendChild(doc1.createTextNode(lib.$STR("next-week")));
      date_6.appendChild(doc1.createTextNode(lib.$STR("in-15-days")));
      date_7.appendChild(doc1.createTextNode(lib.$STR("next-month")));
      
      var newAttAPI=doc1.createAttribute("dateAPI");
      newAttAPI.value="today";
      add_calendar_date.setAttributeNode(newAttAPI);
      
      
      add_calendar_date.appendChild(date_1);
      add_calendar_date.appendChild(date_2);
      add_calendar_date.appendChild(date_3);
      add_calendar_date.appendChild(date_4);
      add_calendar_date.appendChild(date_5);
      add_calendar_date.appendChild(date_6);
      add_calendar_date.appendChild(date_7);
      
      add_calendar_date.onchange= function () {
                                              
                                              if (this.value==lib.$STR("today")) {
                                                    this.setAttribute("class","add_calendar_date_today");
                                              }
                                              else {
                                                    this.setAttribute("class","add_calendar_date_after");
                                              }
                                              if (this.value==lib.$STR("today")) {
                                                    this.setAttribute("dateAPI","today");
                                              }
                                              if (this.value==lib.$STR("tomorrow")) {
                                                    this.setAttribute("dateAPI","tomorrow");
                                              }
                                              if (this.value==lib.$STR("in-2-days")) {
                                                    this.setAttribute("dateAPI","in-2-days");
                                              }
                                              if (this.value==lib.$STR("in-3-days")) {
                                                    this.setAttribute("dateAPI","in-3-days");
                                              }
                                              if (this.value==lib.$STR("next-week")) {
                                                    this.setAttribute("dateAPI","in-7-days");
                                              }
                                              if (this.value==lib.$STR("in-15-days")) {
                                                    this.setAttribute("dateAPI","in-15-days");
                                              }
                                              if (this.value==lib.$STR("next-month")) {
                                                    this.setAttribute("dateAPI","in-30-days");
                                              }
                                                
                                              
      };
      
      add_date.appendChild(add_calendar_date);

      li_AddTodo.appendChild(add_icon);
      li_AddTodo.appendChild(add_titre);
      li_AddTodo.appendChild(add_projet);
      li_AddTodo.appendChild(add_date);
      ul.appendChild(li_AddTodo);

    },
       
     
    /** This function loads the Project comboBox
     *  @param {Object}: the comboboxProjet 
     *  @param {Element}: doc1 represents the document which all Elements are installed on
     *  @param {String}: the id of the Planzone
     *  @param {int}: the num of the Planzone
     */
    charger_comboboxProjet: function (add_comboboxProjet, doc1, laPlanzone,idCombobox) {
       
        var nbPlanzoneProjet = listeProjet.length;
        var projets;
        var un_projet;
        var prj_tmp;
        var PREF_TMP =PREF1.getBranch("extensions.planzone.");

       
        for (var i=0; i<nbPlanzoneProjet; i++) {
            if (laPlanzone == listeProjet[i][0]) {
                projets=listeProjet[i][1];
                for (j=0;j< projets.length; j++) {
                  prj_tmp=projets[j];
                  un_projet=doc1.createElement("option");
                  un_projet.id=prj_tmp.id;
                  un_projet.appendChild(doc1.createTextNode(prj_tmp.name));
                  add_comboboxProjet.appendChild(un_projet)
                  
                }
                
            }
    
        }
        
        
       
    },
    
    
    /** This function set the Planzone Name to an 'intitule' (div)
     *  @param {div}: intitule contains an icon, the Planzone name, the number of new todo, and the number of todo
     *  @param {Element}: doc1 represents the document which all Elements are installed on
     *  @param {String}: the id of the Planzone
     *  @param {int}: the num of the Planzone
     */
    pz_setNomPlanzone: function (intitule ,idPlanzone,doc1) {
    
        var nomPlanzone;
        var nbPlanzone = listePlanzone.length
        
        for (var i=0; i<nbPlanzone; i++) {
        
          if (idPlanzone == listePlanzone[i][0]) {
            
            nomPlanzone=document.createTextNode(listePlanzone[i][1]);  
            intitule.appendChild(nomPlanzone);
          
          }
        
        }
   
    },
  
    
    /** This function builds the right menu (stats)
     *  @param {int}: nb Planzone
     *  @param {int}: nb Todo
     */
    pz_creerPanel_menuDroit:function (nbPlanzone,nbTodo){
        
       
        var doc1 = $('pz_browser').contentDocument; 
        var divPrinc = doc1.createElement("div");
        
        var msg_planzone=doc1.createElement("p");
        msg_planzone.appendChild(doc1.createTextNode(lib.$STR('nb-planzone')+" : "+nbPlanzone));
        divPrinc.appendChild(msg_planzone);
        
        var msg_todo=doc1.createElement("p");
        msg_todo.appendChild(doc1.createTextNode(lib.$STR('nb-todo')+" : "+nbTodo));
        divPrinc.appendChild(msg_todo);
        doc1.all["pz_menuDroit"].innerHTML="";
        doc1.all["pz_menuDroit"].setAttribute("class","element-visible");
        $("pz_menuDroit",doc1).appendChild(divPrinc);

    },
  
    
    /** This function made a refresh , it wait a time and calls switchDeck1().
     *  The time is set on Preferences
     */
    pz_refresh: function () {

      var pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
          pref = pref.getBranch("extensions.planzone.pref.refresh."); 
      
      var isRefresh = pref.getBoolPref("bool");
      
      if (isRefresh) {
      
        var time= pref.getIntPref("time");
        
        time=time*60*1000;
        
        timeoutID=window.setTimeout('PzPanel.switchDeck1()', time);
      
      }
    },



    /**
      * Function which save/set the number of to-dos in the Preferences 
      * @param {int} the number of to-dos 
      */	
    pz_setNbTodos: function (nbTodos) {
         
          var pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
          pref = pref.getBranch("extensions.planzone.pref."); 
         
          pref.setIntPref("nbtodosAncien",pref.getIntPref("nbtodosNew"));
          pref.setIntPref("nbtodosNew",listeNewTodo.length);  
     
          pref.setIntPref("nbtodos",listeNewTodo.length + listeTodo.length);

    },

    /**
      * Function which updates the tooltip
      */	
    pz_majTooltip: function () {
      
        var pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
            pref = pref.getBranch("extensions.planzone.pref."); 
            
        var ancienNb=pref.getIntPref("nbtodosAncien");
      
        $("pz_nbTodo").value=PzPanel.pz_getNbTodosNew();
        if ($("pz_nbTodo").value>1) {
              $("pz_labelpanel").value=lib.$STR("taches-tooltip");
        }
        else {
              $("pz_labelpanel").value=lib.$STR("tache-tooltip");
        }
            
        if (ancienNb<$("pz_nbTodo").value ) {
          PzStatusBar.beep();
          PzPanel.pz_blinkFooter(25); //25 blinks
          
        }
        else {
            if ($("pz_nbTodo").value>0) {
                  var label=$('pz_tooltiplabel');
                  label.setAttribute("class","pz_new_todos_new");
            }
            else {
                  var label=$('pz_tooltiplabel');
                  label.setAttribute("class","pz_new_todos_normal");
            }
        }
    },


    /** This function makes the footer blinking. and set the label footer class (are there New todo or not)
     *  @param {int} nb blink
     */
    pz_blinkFooter: function (nbBlink) {
      
      try {
      
          var label=$('pz_tooltiplabel');
          
          if (nbBlink > 0) {
                if (label.getAttribute("class") == "pz_new_todos_normal") {
                      label.setAttribute("class","pz_new_todos_alerte");
                }
                else {
                      label.setAttribute("class","pz_new_todos_normal");
                }
                nbBlink--;
                setTimeout(function() {PzPanel.pz_blinkFooter(nbBlink);}, 150);
            
          }
          else {
            
                label.setAttribute("class","pz_new_todos_new");
          }
          
      } 
      catch (e) {
          dump(e);
      }
      
      return;
      
    },


    /**
      * Function which returns the number of to-dos in the Preferences 
      * @return {int} the number of to-dos 
      */	
    pz_getNbTodos: function () {
    
      var pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
      pref = pref.getBranch("extensions.planzone.pref."); 
      var nbtodos=pref.getIntPref("nbtodos");
      return nbtodos;
      
    },


    /**
      * Function which returns the number of new to-dos in the Preferences 
      * @return {int} the number of  new to-dos 
      */	
    pz_getNbTodosNew: function () {
    
      var pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
      pref = pref.getBranch("extensions.planzone.pref."); 
      var nbtodos=pref.getIntPref("nbtodosNew");
      return nbtodos;
      
    },

    /** This function set the Theme from preferences
     *  @param {String} the Theme
     */
    pz_setTheme: function (theme) {
    
      var pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
      pref = pref.getBranch("extensions.planzone."); 
      pref.setCharPref("idTheme",theme);
      var doc1 = $('pz_browser').contentDocument;    
      $("pz_body",doc1).setAttribute("class",theme);
    
    }



};










