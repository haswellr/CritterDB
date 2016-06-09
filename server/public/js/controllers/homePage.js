
var homePageCtrl = function ($scope,selectedBestiary,bestiaryList,PublishedBestiary,CreatureClipboard,$location,Creature) {
	$scope.selectedBestiary = selectedBestiary;
	$scope.bestiaryList = bestiaryList;

	$scope.selectedBestiary.creaturesLoading = true;
	var loadCreatures = function(){
		if($scope.selectedBestiary._id){
			Creature.getAllForPublishedBestiary($scope.selectedBestiary._id,1,function(data){
				$scope.selectedBestiary.creaturesLoading = false;
				$scope.selectedBestiary.creatures = data;
				if(!$scope.$$phase)
					$scope.$digest();
			});
		}
	}
	loadCreatures();

	$scope.CreatureClipboard = CreatureClipboard;

	$scope.goToSearchPage = function(){
		$location.path("/publishedbestiary/search");
	}

	$scope.getBestiaryPath = function(bestiary){
		if(bestiary)
			return("/#/publishedbestiary/view/"+bestiary._id);
		else
			return("");
	}

	$scope.getUserBestiaryListPath = function(user){
		if(user)
			return("/#/user/"+user._id+"/publishedbestiaries");
		else
			return("");
	}

	$scope.bestiarySortFunction = function(bestiary) {
		return(-1*parseInt("0x"+bestiary._id));
	}
};

//don't load controller until we've gotten the data from the server
homePageCtrl.resolve = {
	selectedBestiary: ['PublishedBestiary','$q','$route','Auth',function(PublishedBestiary, $q, $route, Auth){
			var deferred = $q.defer();
			Auth.executeOnLogin(function(){
				PublishedBestiary.getMostPopular(function(data) {
					deferred.resolve(data);
				}, function(errorData) {
					deferred.reject();
				});
			});
			return deferred.promise;
		}],
	bestiaryList: ['PublishedBestiary','$q','$route','Auth',function(PublishedBestiary, $q, $route, Auth){
			var deferred = $q.defer();
			Auth.executeOnLogin(function(){
				PublishedBestiary.getRecent(1,function(data) {
					deferred.resolve(data);
				}, function(errorData) {
					deferred.reject();
				});
			});
			return deferred.promise;
		}]
}

angular.module('myApp').controller('homePageCtrl',homePageCtrl);
