
var publishedBestiaryCtrl = function ($scope,bestiary,CreatureFilter,CreatureAPI,CreatureClipboard,$mdMedia,$mdDialog,Auth) {
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

	$scope.editPublishedBestiary = function(ev){
		var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
    $mdDialog.show({
      controller: publishBestiaryCtrl,
      templateUrl: '/assets/partials/publishedBestiary/edit.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      locals: {
      	'baseBestiary': undefined,
      	'publishedBestiary': $scope.bestiary
      },
      fullscreen: useFullScreen
    }).then(function(updatedBestiary){
    	$scope.bestiary.name = updatedBestiary.name;
    	$scope.bestiary.description = updatedBestiary.description;
    });
	}

	$scope.isOwner = function(){
		return(Auth.user._id == $scope.bestiary.owner._id);
	}

};

//don't load controller until we've gotten the data from the server
publishedBestiaryCtrl.resolve = {
	bestiary: ['PublishedBestiary','$q','$route','Auth','$location',function(PublishedBestiary, $q, $route, Auth, $location){
			if($route.current.params.bestiaryId){
				var deferred = $q.defer();
				Auth.executeOnLogin(function(){
					PublishedBestiary.get($route.current.params.bestiaryId,function(data) {
						deferred.resolve(data);
					}, function(errorData) {
						deferred.reject();
					});
				});
				return deferred.promise;
			}
			else
				return {};
		}],
}

angular.module('myApp').controller('publishedBestiaryCtrl',publishedBestiaryCtrl);
