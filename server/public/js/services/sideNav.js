angular.module('myApp').factory("SideNav", function($mdSidenav,$timeout) {

  function SideNav() {
    var openIds = {};

    this.close = function(id,callback) {
      openIds[id] = false;
      $mdSidenav(id).close().then(callback);
    };
    this.open = function(id,callback) {
      openIds[id] = true;
      $mdSidenav(id).open().then(callback);
    };
    this.toggle = function(id,callback) {
      openIds[id] = !openIds[id];
      $mdSidenav(id).toggle().then(callback);
    };
    //closes all other sidenavs that may be open, let them process, then open current one
    this.toggleExclusive = function(id,callback) {
      var self = this;
      var idsToClose = [];
      //Check for other open sidenavs
      for(var openId in openIds){
        if(openIds.hasOwnProperty(openId) && openIds[openId]==true && openId!=id)
          idsToClose.push(openId);
      }
      if(idsToClose.length>0){
        //Close any open sidenavs
        for(var i=0;i<idsToClose.length;i++){
          var idToClose = idsToClose[i];
          self.close(idToClose);
        }
        //Wait for next cycle so the closed sidenavs have 'processed'
        $timeout(function(){
          self.toggle(id,callback);
        });
      }
      else
        self.toggle(id,callback);

    }
    this.isOpen = function(id) {
      return($mdSidenav(id).isOpen());
    };
  }
  var serv = new SideNav();

  return(serv);
});
