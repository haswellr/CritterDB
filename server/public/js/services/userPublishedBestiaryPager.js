angular.module('myApp').factory("UserPublishedBestiaryPager", function(PublishedBestiary,PublishedBestiaryPager) {

  var UserPublishedBestiaryPager = function(userId,startingData,startingNextPage){
    PublishedBestiaryPager.call(this,"",startingData,startingNextPage);
    this.retrievalFunction = function(page,callback) {
      PublishedBestiary.getByUser(userId,page,callback);
    }
  }

  return UserPublishedBestiaryPager;
});
