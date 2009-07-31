var PLANZONEPLUGIN = {

	
	
	oauth : {
	    consumer_key : "uir0cooKEije2ahkluPae9buCod2zojo",
	    consumer_secret : "Nooz5eexpiLu1mai", 
	    
	    request_token : {
    	    oauth_token : "",
    	    oauth_token_secret : ""
    	},
    	
        serviceProvider : {
            signatureMethod : "HMAC-SHA1",
            requestTokenURL : "",
            userAuthorizationURL : "",
            accessTokenURL : "",
            echoURL : "http://www.planzone.com"
        }
    },
    
    getBrowser: function () {
        if (typeof Browser != 'undefined') {
            return Browser;
        }
        else {
            return getBrowser();
        }
    },
    
    alert : function (msg) {
        var title = lib.$STR("titre-html");
        
        var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                                .getService(Components.interfaces.nsIPromptService);
        prompts.alert(null, title, msg);
    },
    
    confirm : function (msg) {
        
        var title = lib.$STR("titre-html");
        
        
        var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                                .getService(Components.interfaces.nsIPromptService);
        return prompts.confirm(null, title, msg);
    },
	

    
	reAuthorize : function () {
	
        PLANZONEPLUGIN.addListener();
        PLANZONEPLUGIN.prefs.setCharPref("oauth_username", "");
        PLANZONEPLUGIN.prefs.setCharPref("access_token.oauth_token", "");
        PLANZONEPLUGIN.prefs.setCharPref("access_token.oauth_token_secret", "");
        PLANZONEPLUGIN.prefs.setCharPref("oauth_timestamp", "");
	    
	    this.oAuthorize();
    },
    
  logout:function (){
  
  var pref=Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).QueryInterface(Components.interfaces.nsIPrefBranch).getBranch("extensions.planzone.");
  
        pref.setCharPref("oauth_username", "");
        pref.setCharPref("access_token.oauth_token", "");
        pref.setCharPref("access_token.oauth_token_secret", "");
        pref.setCharPref("oauth_timestamp", "");
		pref.setBoolPref("logged",false);
        PLANZONEPLUGIN.alert(lib.$STR("reset-good"));
        window.opener.document.defaultView.PzPanel.switchDeck1();
  },
	
	
	init : function(bool){
    //alert("dans Pz_API");
    URL_REQ = PREF_FIRSTTIME.getCharPref("URL_REQ");
    URL_AUTH = PREF_FIRSTTIME.getCharPref("URL_AUTH");
    URL_CALLBACK= PREF_FIRSTTIME.getCharPref("URL_CALLBACK");
    
    PLANZONEPLUGIN.oauth.serviceProvider.requestTokenURL=URL_REQ + lib.$STR("URL_REQ_SUITE");
    PLANZONEPLUGIN.oauth.serviceProvider.userAuthorizationURL=URL_AUTH ;
    PLANZONEPLUGIN.oauth.serviceProvider.accessTokenURL=URL_REQ + lib.$STR("URL_ACCESS_SUITE");
    
    
    this.prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.planzone.");	
   
		this.prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);
		this.prefs.addObserver("", this, false);
		 
		var version = Components.classes["@mozilla.org/extensions/manager;1"].getService(Components.interfaces.nsIExtensionManager).getItemForID("ProjectBar@planzone.fr").version;
		
		 try{
        if (this.prefs.getCharPref("version") != version) {
          this.prefs.setCharPref("version", version);
          PLANZONEPLUGIN.alert(lib.$STR("new-version"));
          
        }
       }catch(e){
       
       this.prefs.setCharPref("version", version);
       }
        
        
          if (this.prefs.getCharPref("access_token.oauth_token") == "" || this.prefs.getCharPref("access_token.oauth_token_secret") == "") {
                    if(bool){
                      
                      this.addListener();
                      setTimeout(function () { PLANZONEPLUGIN.oAuthorize(); }, 3000); 
                     }
                   
          }
        
        
    
    
    
    
    
    
    
	},
	
	addListener : function(){
	//PLANZONEPLUGIN.alert("Listener ON");
              try {
                      var browsers = document.getElementById("browsers");
                      browsers.addEventListener("load", PLANZONEPLUGIN.getAccessToken, true);
                      
                  } catch (notFennec) {
                    getBrowser().addEventListener("load", PLANZONEPLUGIN.getAccessToken, true);
                  }
	},
	
	removeListener : function(){
	//PLANZONEPLUGIN.alert("Listener OFF");
              this.prefs.removeObserver("", this);
		
            try {
                  document.getElementById("browsers").removeEventListener("load", PLANZONEPLUGIN.getAccessToken, true);
              } catch (notFennec) {
                  getBrowser().removeEventListener("load", PLANZONEPLUGIN.getAccessToken, true);
                }
         
	},
	
	oAuthorize : function () {

	
      
                    var token = "";
                    var url= PLANZONEPLUGIN.oauth.serviceProvider.requestTokenURL;
                    
                    PLANZONEPLUGIN.pz_ApiCallTemplate(url,"POST",function(req,OAuth){
                            try {
                                    var parts = req.responseText.split("&");
                                    
                                    var tab=new Array();
                                    if(parts[0].split("=")[0]=="oauth_token_secret"){   
                                          tab[0]= OAuth.decodePercent(parts[1].split("=")[1]);                         
                                          tab[1]=OAuth.decodePercent(parts[0].split("=")[1]);
                                        
                                      }
                                    else{
                                          tab[0]= OAuth.decodePercent(parts[0].split("=")[1]);
                                          tab[1]=OAuth.decodePercent(parts[1].split("=")[1]);     
                                    }
                                        
                                    PLANZONEPLUGIN.oauth.request_token.oauth_token = tab[0];
                                    PLANZONEPLUGIN.oauth.request_token.oauth_token_secret = tab[1];
                                  
                                    if (PLANZONEPLUGIN.confirm(lib.$STR("oAuth-req1") + "\n\n" + lib.$STR("oAuth-req2") ) ) {
                                
                                            PLANZONEPLUGIN.getBrowser().selectedTab = PLANZONEPLUGIN.getBrowser().addTab(URL_AUTH+"?oauth_token="+PLANZONEPLUGIN.oauth.request_token.oauth_token);
                                            PLANZONEPLUGIN.prefs.setCharPref("access_token.oauth_token", tab[0]);
                                            PLANZONEPLUGIN.prefs.setCharPref("access_token.oauth_token_secret", tab[1]);
                                            PLANZONEPLUGIN.oauth.request_token.oauth_token_secret= tab[1];
                                      }
                                    
                                } catch (e) {
                                    PLANZONEPLUGIN.alert("Error Authorize : "+lib.$STR("ERROR_AUTH"));
                                    $('pz_browser').contentDocument.all["pz_load"].innerHTML="";
                     
                              }
                        
      
                    },null,token);
	
    },
	
	getAccessToken : function (event) {
   
	    if (event.originalTarget instanceof HTMLDocument) {

            var doc = event.originalTarget;
            
            if (doc.location.href.match(URL_CALLBACK)) {
                    
                    var token = PLANZONEPLUGIN.prefs.getCharPref("access_token.oauth_token"); 
                    var url= PLANZONEPLUGIN.oauth.serviceProvider.accessTokenURL;
                    
                    PLANZONEPLUGIN.pz_ApiCallTemplate(url,"POST",function(req,OAuth){
                            try {   
                                    var parts = req.responseText.split("&");
                                    
                                    var tab=new Array();
                                    if(parts[0].split("=")[0]=="oauth_token_secret"){   
                                          tab[0]= OAuth.decodePercent(parts[1].split("=")[1]);                         
                                          tab[1]=OAuth.decodePercent(parts[0].split("=")[1]);
                                        
                                      }
                                    else{
                                          tab[0]= OAuth.decodePercent(parts[0].split("=")[1]);
                                          tab[1]=OAuth.decodePercent(parts[1].split("=")[1]);     
                                    }
                                        
                                    PLANZONEPLUGIN.prefs.setCharPref("access_token.oauth_token",tab[0]);
                                    PLANZONEPLUGIN.prefs.setCharPref("access_token.oauth_token_secret", tab[1]);
                                    
                                    PLANZONEPLUGIN.prefs.setCharPref("oauth_timestamp", (new Date().getTime()));
                                   
                                  
                                    PLANZONEPLUGIN.removeListener();
                                    PLANZONEPLUGIN.prefs.setBoolPref("logged", true);
                                    PLANZONEPLUGIN.alert(lib.$STR("pref-id-good"));
                                    PzPanel.init(true);
                                } catch (e) {
                                    PLANZONEPLUGIN.alert("Error access Token : "+lib.$STR("ERROR_ACCESSTOKEN"));
                                    $('pz_browser').contentDocument.all["pz_load"].innerHTML="";
                                   
                     
                              }
                        
      
                    },null,token);
                        
           }
      }        
    },
    

   pzGetJSON : function (url, callback) {

      var token =PLANZONEPLUGIN.prefs.getCharPref("access_token.oauth_token");
      PLANZONEPLUGIN.pz_ApiCallTemplate(url,"GET",function(req){
                            
                            var contentType = null;
                            try {
                                contentType = req.getResponseHeader('Content-type');
                            } catch (e) {
                                contentType = null;
                            }
                            if (contentType && contentType == "application/json") {
                                try {
                                    var o = eval('('+req.responseText+')');
                                
                                    callback(o);
                                } catch(e) {
                                    PLANZONEPLUGIN.alert("Error JSON " + lib.$STR("ERROR_JSON") );
                                    $('pz_browser').contentDocument.all["pz_load"].innerHTML="";
                                    
                                }
                            }
            },null,token);
     
  },
  
  pz_makeRequest :function (url) {
      var token =PLANZONEPLUGIN.prefs.getCharPref("access_token.oauth_token");
      PLANZONEPLUGIN.pz_ApiCallTemplate(url,"GET",function(req){
      
                  var xmlobject = req.responseXML;
                  var root = xmlobject.getElementsByTagName('resp')[0];
                  var planzones = root.getElementsByTagName("todos");
                  PzPanel.pz_creerPanel_tab2(planzones);
                  $('pz_browser').contentDocument.all["pz_titre"].innerHTML= lib.$STR("mes-todos"); 
                  
      
      },null,token);
  
    },
    
    

  createTodo:function (titre, idProjet, date,idIntitule){
        var token =PLANZONEPLUGIN.prefs.getCharPref("access_token.oauth_token");
        var url=URL_REQ+'/v1/rest/todos/create';
        var param='project='+idProjet+'&title='+titre+'&assign=me'+'&date='+date;
        
        PLANZONEPLUGIN.pz_ApiCallTemplate(url,"POST",function(req){
      
                  //$("intitule"+idIntitule,$('pz_browser').contentDocument).childNodes[0].className="intit_icon";
                  PzPanel.switchDeck1();
      
        },param,token,idIntitule);
        
   
    },
    
    
   pz_completeTodo:function (url,idIntitule) {
        
        
        
        var token =PLANZONEPLUGIN.prefs.getCharPref("access_token.oauth_token");
        PLANZONEPLUGIN.pz_ApiCallTemplate(url,"PUT",function(req){
      
                 //$("intitule"+idIntitule,$('pz_browser').contentDocument).childNodes[0].className="intit_icon";
                 PzPanel.switchDeck1();
      
        },null,token,idIntitule);
        
   
    },
    
  
  
  
  pz_ApiCallTemplate:function(_url,_methode,_function,param,token,idIntitule){
  
  
  
  var url=_url;
  var methode=_methode;

  var accessor = {
	        consumerSecret : PLANZONEPLUGIN.oauth.consumer_secret,
	        tokenSecret : PLANZONEPLUGIN.prefs.getCharPref("access_token.oauth_token_secret")
	    };

	    var message = {
	        action : url,
	        method : methode,
	        parameters : [
    	        ["oauth_consumer_key",PLANZONEPLUGIN.oauth.consumer_key],
    	        ["oauth_token", token],
    	        ["oauth_signature_method",PLANZONEPLUGIN.oauth.serviceProvider.signatureMethod],
    	        ["oauth_version","1.0"]
    	        
	        ]
	    };
       
      var OAuth = PLANZONE_OAUTH();
    
	    OAuth.setTimestampAndNonce(message);
	    OAuth.SignatureMethod.sign(message, accessor);
	    
	    
	    
	    var oAuthArgs = OAuth.getParameterMap(message.parameters);
	    var authHeader = OAuth.getAuthorizationHeader(URL_REQ, oAuthArgs);
	    var req = new XMLHttpRequest();
	    req.mozBackgroundRequest = true;
      req.open(message.method, message.action, true);
	    req.setRequestHeader("Authorization", authHeader);
      
      req.onreadystatechange = function(){
         
         if (req.readyState == 4) {
            if (req.status == 401) {
              
                if (req.responseText.indexOf("expired") != -1) {
                    PLANZONEPLUGIN.alert(lib.$STR("expiration"));
                    $('pz_browser').contentDocument.all["pz_load"].innerHTML="";
                    PLANZONEPLUGIN.reAuthorize();
                  }
                  else {
                    PLANZONEPLUGIN.alert("ERROR "+req.status+" "+lib.$STR("ERROR_401"));
                    
                    
                    
                    
                    $('pz_browser').contentDocument.all["pz_load"].innerHTML="";            
                    try{      $("intitule"+idIntitule,$('pz_browser').contentDocument).childNodes[0].className="intit_icon"; }
                    catch(e){}
                }
            }
            else  
                  if (req.status == 200) {
                       
                        _function(req,OAuth);
                  }
                  else if(req.status ==201){
                         _function(req,OAuth);
                        }
                        else {
                          if(req.status==0) PLANZONEPLUGIN.alert("ERROR "+req.status+" "+lib.$STR("ERROR_0"));
                          if(req.status==403) PLANZONEPLUGIN.alert("ERROR "+req.status+" "+lib.$STR("ERROR_403")); //forbidden
                          if(req.status==404) PLANZONEPLUGIN.alert("ERROR "+req.status+" "+lib.$STR("ERROR_404")); //Not Found
                          if(req.status==405) PLANZONEPLUGIN.alert("ERROR "+req.status+" "+lib.$STR("ERROR_405")); //Not allowed
                          if(req.status==500) PLANZONEPLUGIN.alert("ERROR "+req.status+" "+lib.$STR("ERROR_500")); //bug data
                          
                          $('pz_browser').contentDocument.all["pz_load"].innerHTML="";
                          $("intitule"+idIntitule,$('pz_browser').contentDocument).childNodes[0].className="intit_icon";
                           
                        }
				
				}

     }; 
       
     req.send(param);
  
  
  },

    
};