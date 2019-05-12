angular.module('myApp').factory("Notification", function(Auth, CachedResourceAPI,$resource) {

  var NotificationAPI = new CachedResourceAPI("/api/notifications/:id");

	var currentUserId = undefined;  //track the current user - pull first page of notifications from server if the user has changed

  delete NotificationAPI.get;
  delete NotificationAPI.update;
  delete NotificationAPI.delete;

  NotificationAPI.getAll = function(page, success, error){
    if (!Auth.user) {
      setTimeout(function(){
        error("Not logged in.");
      });
    }
    if(currentUserId==undefined || Auth.usercurrentUserId != Auth.user.id){
      this.cache.clear();
      currentUserId = userId;   //update current user
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

  NotificationAPI.markAsRead = function(notificationId, success, error){
    $resource("/api/notifications/:id/read").save({'id':notificationId},"",(function(data){
      if(success)
        success(data);
    }).bind(this),error);
  }

  NotificationAPI.markAllAsRead = function(success, error){
    $resource("/api/notifications/read").save({},"",(function(data){
      if(success) {
        // This function does not return all of the modified notifications, so we clear the cache and grab new ones here.
        this.cache.clear();
        this.getList(1, success, error);
      }
    }).bind(this),error);
  }

  return NotificationAPI;
});
