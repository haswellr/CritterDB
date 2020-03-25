angular.module('myApp').factory("Notification", function(Auth, CachedResourceAPI,$resource) {

  var NotificationAPI = new CachedResourceAPI("/api/notifications/:id");

	var currentUserId = undefined;  //track the current user - re-retrieve notifications from server if the user has changed

  delete NotificationAPI.get;

  NotificationAPI.getAll = function(success, error){
    if (!Auth.user) {
      setTimeout(function(){
        error("Not logged in.");
      });
      return;
    }
    if(currentUserId==undefined || currentUserId != Auth.user.id){
      this.cache.clear();
      currentUserId = Auth.user.id;   //update current user
      $resource("/api/notifications").query({}, (function(data){
        for(var i=0;i<data.length;i++)
          this.cache.add(data[i]._id,data[i]);
        if(success)
          success(data);
      }).bind(this),error);
    }
    else {
      var userNotifications = this.cache.getAll();
      setTimeout(function(){
        success(userBestiaries);
      });
    }
  }

  NotificationAPI.deleteAll = function(success, error){
    $resource("/api/notifications").delete({},"",(function(data){
      if(success) {
        this.cache.clear();
        success([]);
      }
    }).bind(this),error);
  }

  return NotificationAPI;
});
