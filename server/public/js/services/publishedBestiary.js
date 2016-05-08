angular.module('myApp').factory("PublishedBestiary", function(CachedResourceAPI,Creature) {

  var PublishedBestiaryAPI = new CachedResourceAPI("/api/publishedbestiaries/:id");

  PublishedBestiaryAPI.get = function(id, success, error){
		CachedResourceAPI.prototype.get.call(this, id, function(data){
			for(var i=0;i<data.creatures.length;i++)
				Creature.calculateCreatureDetails(data.creatures[i]);
			if(success)
				success(data);
		}, error);
	}

	delete [PublishedBestiaryAPI.getAll];

	PublishedBestiaryAPI.create = function(data, success, error){
		CachedResourceAPI.prototype.create.call(this, data, function(data){
			for(var i=0;i<data.creatures.length;i++)
				Creature.calculateCreatureDetails(data.creatures[i]);
			if(success)
				success(data);
		}, error);
	}

	PublishedBestiaryAPI.update = function(id, data, success, error){
		CachedResourceAPI.prototype.update.call(this, id, data, function(data){
			for(var i=0;i<data.creatures.length;i++)
				Creature.calculateCreatureDetails(data.creatures[i]);
			if(success)
				success(data);
		}, error);
	}

  return PublishedBestiaryAPI;
});
