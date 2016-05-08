
var publishedBestiaryCtrl = function ($scope,bestiary,CreatureFilter,CreatureAPI,CreatureClipboard) {
	$scope.bestiary = bestiary;

	$scope.creatureFilter = new CreatureFilter();

	var creatureApiOptions = {
		copy: true,
		export: true
	}
	$scope.creatureApi = new CreatureAPI(creatureApiOptions);

	$scope.CreatureClipboard = CreatureClipboard;

	$scope.getPublishedBestiaryListPath = function(){
		return("/#/bestiary/list");
	}

};

//don't load controller until we've gotten the data from the server
publishedBestiaryCtrl.resolve = {
	bestiary: ['PublishedBestiary','$q','$route','Auth','$location',function(PublishedBestiary, $q, $route, Auth, $location){
			if($route.current.params.bestiaryId){
				var deferred = $q.defer();
				Auth.executeOnLogin(function(){
					if(!Auth.isLoggedIn()){
						$location.path('/login');
						deferred.reject();
					}
					else{
						PublishedBestiary.get($route.current.params.bestiaryId,function(data) {
							deferred.resolve(data);
						}, function(errorData) {
							deferred.reject();
						});
					}
				});
				return deferred.promise;
			}
			else
				return {};
		}],
}

angular.module('myApp').controller('publishedBestiaryCtrl',publishedBestiaryCtrl);
