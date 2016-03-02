angular.module('myApp').factory("User", function($resource,$sce) {
  var serv = {};

  var api = $resource("/api/users/:id", {
    id: '@id'
  }, {
  	'update': { method:'PUT' }
  });

  serv.get = function(id, success, error){
  	api.get({ 'id': id}, success,error);
  }

  serv.getPublic = function(id, success, error){
    $resource("/api/users/:id/public").get({ 'id': id}, success,error);
  }

  serv.getAll = function(success, error){
  	api.query(success,error);
  }

  serv.create = function(data,success,error){
  	api.save(data,success,error);
  }

  serv.update = function(id,data,success,error){
  	api.update({'id':id},data,success,error);
  }

  serv.delete = function(id, success, error){
  	api.delete({'id':id},success,error);
  }

  serv.resetPassword = function(email, success, error){
    var data = {
      'email': email
    };
    $resource("/api/users/resetpassword").save(data, success,error);
  }

  return serv;
});
