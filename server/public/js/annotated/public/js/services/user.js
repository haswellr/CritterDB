angular.module('myApp').factory("User", ["$resource", "$sce", "CachedResourceAPI", function($resource,$sce,CachedResourceAPI) {
  var serv = {};

  serv = new CachedResourceAPI("/api/users/:id");

  serv.getPublic = function(id, success, error){
    $resource("/api/users/:id/public").get({ 'id': id}, success,error);
  }

  serv.resetPassword = function(email, success, error){
    var data = {
      'email': email
    };
    $resource("/api/users/resetpassword").save(data, success,error);
  }

  return serv;
}]);
