angular.module('myApp').factory("Mongo", function() {

  function Mongo(){

  }

  Mongo.prototype.getTimestamp = function(objectId){
    return new Date(parseInt(objectId.toString().slice(0,8), 16)*1000);
  }

  var mongo = new Mongo();

  return mongo;
});
