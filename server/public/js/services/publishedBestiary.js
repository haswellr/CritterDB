angular.module('myApp').factory("PublishedBestiary", function(CachedResourceAPI) {

  var PublishedBestiaryAPI = new CachedResourceAPI("/api/publishedbestiaries/:id");

  return PublishedBestiaryAPI;
});
