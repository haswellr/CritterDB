angular.module('myApp').factory("CachedResourceAPI", function($resource,$sce,Cache) {

  //route should be something like '/api/bestiaries/:id'
  function CachedResourceAPI(route){
    //cache anything we receive to speed things up. This could be a concern if memory usage grows too high...some system to clear old things out might be good?
    this.cache = new Cache();

    this.api = $resource(route, {
      id: '@id'
    }, {
      'update': { method:'PUT' }
    });
  }

  CachedResourceAPI.prototype.get = function(id, success, error){
    if(this.cache.has(id)){
      if(success){
        setTimeout((function(){
          success(this.cache.get(id));
        }).bind(this));
      }
    }
    else{
      this.api.get({ 'id': id}, (function(data){
        this.cache.add(id,data);
        if(success)
          success(data);
      }).bind(this),error);
    }
  }

  CachedResourceAPI.prototype.getAll = function(success, error){
    if(this.cache.isEmpty()){
    	this.api.query((function(data){
        for(var i=0;i<data.length;i++)
          this.cache.add(data[i]._id,data[i]);
        if(success)
          success(data);
      }).bind(this),error);
    }
    else{
      if(success){
        setTimeout((function(){
          success(this.cache.getAll());
        }).bind(this));
      }
    }
  }

  CachedResourceAPI.prototype.create = function(data,success,error){
  	this.api.save(data,(function(data){
      this.cache.add(data._id,data);
      success(data);
    }).bind(this),error);
  }

  CachedResourceAPI.prototype.update = function(id,data,success,error){
  	this.api.update({'id':id},data,(function(data){
      this.cache.add(data._id,data);
      if(success)
        success(data);
    }).bind(this),error);
  }

  CachedResourceAPI.prototype.delete = function(id, success, error){
  	this.api.delete({'id':id},(function(data){
      this.cache.remove(id);
      if(success)
        success(data);
    }).bind(this),error);
  }

  return CachedResourceAPI;
});
