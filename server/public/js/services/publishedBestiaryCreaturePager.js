angular.module('myApp').factory("PublishedBestiaryCreaturePager", function(Creature) {

  var PublishedBestiaryCreaturePager = function(bestiaryId,startingData,startingNextPage){
    this.bestiaryId = bestiaryId;
  	this.creatures = startingData || [];
  	this.nextPage = startingNextPage || 1;
  	this.busy = false;
  }
  
  PublishedBestiaryCreaturePager.prototype.loadNextPage = function(callback) {
  	if(!this.busy){
  		this.busy = true;
  		Creature.getAllForPublishedBestiary(this.bestiaryId,this.nextPage,function(data){
  			if(data.length>0){	//if we are receiving no more data remain busy so we don't repeat request
	  			for(var i=0;i<data.length;i++)
	  				this.creatures.push(data[i]);
	  			this.nextPage = this.nextPage + 1;
	  			this.busy = false;
          if(callback)
            callback();
	  		}
  		}.bind(this));	//on error do nothing and remain busy so we don't repeat the faulty request
  	}
  }

  return PublishedBestiaryCreaturePager;
});
