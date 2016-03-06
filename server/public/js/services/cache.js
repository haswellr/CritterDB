angular.module('myApp').factory("Cache", function() {

  function Cache() {
    var cache = {};

    this.add = function(id,data) {
      cache[id] = data;
    }

    this.get = function(id) {
      return(cache[id]);
    }

    this.getAll = function() {
      var list = [];
      for (var key in cache){
        if(Object.prototype.hasOwnProperty.call(cache, key)) {
          list.push(cache[key]);
        }
      }
      return(list);
    }

    this.remove = function(id) {
      delete cache[id];
    }

    this.has = function(id) {
      return(cache.hasOwnProperty(id));
    }

    this.isEmpty = function() {
      return(Object.keys(cache).length==0);
    }

    this.clear = function() {
      cache = {};
    }
  }

  return Cache;
});
