angular.module('myApp').factory("PublishedBestiary", function(CachedResourceAPI,Creature,$resource) {

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

	PublishedBestiaryAPI.like = function(id, success, error){
		$resource("/api/publishedbestiaries/:id/likes").save({'id':id},"",(function(data){
      this.cache.add(data._id,data);
      if(success)
        success(data);
    }).bind(this),error);
	}

	PublishedBestiaryAPI.unlike = function(id, success, error){
		$resource("/api/publishedbestiaries/:id/likes").delete({'id':id},(function(data){
      this.cache.add(data._id,data);
      if(success)
        success(data);
    }).bind(this),error);
	}

	PublishedBestiaryAPI.favorite = function(id, success, error){
		$resource("/api/publishedbestiaries/:id/favorites").save({'id':id},"",(function(data){
      this.cache.add(data._id,data);
      if(success)
        success(data);
    }).bind(this),error);
	}

	PublishedBestiaryAPI.unfavorite = function(id, success, error){
		$resource("/api/publishedbestiaries/:id/favorites").delete({'id':id},(function(data){
      this.cache.add(data._id,data);
      if(success)
        success(data);
    }).bind(this),error);
	}

  PublishedBestiaryAPI.getPopular = function(page,success, error){
    $resource("/api/publishedbestiaries/popular/:page").query({ 'page': page}, function(data){
      for(var i=0;i<data.length;i++)
        PublishedBestiaryAPI.cache.add(data[i]._id,data[i]);
      if(success)
        success(data);
    },error);
  }

	PublishedBestiaryAPI.getRecent = function(page,success, error){
    $resource("/api/publishedbestiaries/recent/:page").query({ 'page': page}, function(data){
      for(var i=0;i<data.length;i++)
        PublishedBestiaryAPI.cache.add(data[i]._id,data[i]);
      if(success)
        success(data);
    },error);
  }

	PublishedBestiaryAPI.getFavorites = function(page,success, error){
    $resource("/api/publishedbestiaries/favorites/:page").query({ 'page': page}, function(data){
      for(var i=0;i<data.length;i++)
        PublishedBestiaryAPI.cache.add(data[i]._id,data[i]);
      if(success)
        success(data);
    },error);
  }

	PublishedBestiaryAPI.getOwned = function(page,success, error){
    $resource("/api/publishedbestiaries/owned/:page").query({ 'page': page}, function(data){
      for(var i=0;i<data.length;i++)
        PublishedBestiaryAPI.cache.add(data[i]._id,data[i]);
      if(success)
        success(data);
    },error);
  }

  PublishedBestiaryAPI.listConstants = {
		popular: {
			type: "popular",
			retrievalFunction: PublishedBestiaryAPI.getPopular,
			name: 'Popular',
			path: "/#/publishedbestiary/list/popular"
		},
		recent: {
			type: "recent",
			retrievalFunction: PublishedBestiaryAPI.getRecent,
			name: 'Recent',
			path: "/#/publishedbestiary/list/recent"
		},
		favorites: {
			type: "favorites",
			retrievalFunction: PublishedBestiaryAPI.getFavorites,
			name: 'My Favorites',
			path: "/#/publishedbestiary/list/favorites"
		},
		owned: {
			type: "owned",
			retrievalFunction: PublishedBestiaryAPI.getOwned,
			name: 'My Bestiaries',
			path: "/#/publishedbestiary/list/owned"
		}
	};

  return PublishedBestiaryAPI;
});
