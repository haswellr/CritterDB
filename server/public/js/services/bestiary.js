angular.module('myApp').factory("Bestiary", function($resource,$sce) {
  var serv = {};

  var api = $resource("/api/bestiaries/:id", {
    id: '@id'
  }, {
    'update': { method:'PUT' }
  });

  serv.get = function(id, success, error){
  	api.get({ 'id': id}, success,error);
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

  serv.getAllForUser = function(userId, success, error){
    $resource("/api/users/:id/bestiaries").query({ 'id': userId}, success,error);
  }

  return serv;
});
