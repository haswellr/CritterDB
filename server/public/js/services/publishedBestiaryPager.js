angular.module('myApp').factory("PublishedBestiaryPager", function(PublishedBestiary) {

  var PublishedBestiaryPager = function(listType,startingData,startingNextPage){
    if(PublishedBestiary.listConstants[listType])
  	 this.retrievalFunction = PublishedBestiary.listConstants[listType].retrievalFunction;
  	this.bestiaries = startingData || [];
  	this.nextPage = startingNextPage || 1;
  	this.busy = false;
  }
  PublishedBestiaryPager.prototype.loadNextPage = function() {
  	if(!this.busy){
  		this.busy = true;
      if(this.retrievalFunction){
    		this.retrievalFunction(this.nextPage,function(data){
    			if(data.length>0){	//if we are receiving no more data remain busy so we don't repeat request
  	  			for(var i=0;i<data.length;i++)
  	  				this.bestiaries.push(data[i]);
  	  			this.nextPage = this.nextPage + 1;
  	  			this.busy = false;
  	  		}
    		}.bind(this));	//on error do nothing and remain busy so we don't repeat the faulty request
      }
  	}
  }


  return PublishedBestiaryPager;
});
