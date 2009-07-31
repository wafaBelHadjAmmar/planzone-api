const MY_EXTENSION_UUID = "ProjectBar@planzone.fr";

UninstallObserver = {
    _uninstall : false,
    observe : function(subject, topic, data) {
      
      if (topic == "em-action-requested") {
        subject.QueryInterface(Components.interfaces.nsIUpdateItem);

        if (subject.id == MY_EXTENSION_UUID) {
          if (data == "item-uninstalled") {
            this._uninstall = true;
          } else if (data == "item-cancel-action") {
            this._uninstall = false;
          }
        }
      } else if (topic == "quit-application-granted") {
        if (this._uninstall) {
          
          /* uninstall stuff. */
          
          var pref=Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.planzone.");
          
          
          pref.deleteBranch("");
        }
        this.unregister();
      }
    },
    register : function() {
    
     var observerService =
       Components.classes["@mozilla.org/observer-service;1"].
         getService(Components.interfaces.nsIObserverService);

     observerService.addObserver(this, "em-action-requested", false);
     observerService.addObserver(this, "quit-application-granted", false);
    },
    unregister : function() {
      var observerService =
        Components.classes["@mozilla.org/observer-service;1"].
          getService(Components.interfaces.nsIObserverService);

      observerService.removeObserver(this,"em-action-requested");
      observerService.removeObserver(this,"quit-application-granted");
    }
}

