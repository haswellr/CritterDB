angular.module('myApp').factory("SearchPublishedBestiaryPager", function(PublishedBestiary,PublishedBestiaryPager) {

  var SearchPublishedBestiaryPager = function(search,startingData,startingNextPage){
    PublishedBestiaryPager.call(this,"",startingData,startingNextPage);
    this.retrievalFunction = function(page,callback) {
      PublishedBestiary.search(search,page,callback);
    }
  }
  
  SearchPublishedBestiaryPager.prototype = PublishedBestiaryPager.prototype;

  return SearchPublishedBestiaryPager;
});
