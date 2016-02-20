
var bestiaryCtrl = function ($scope, Creature, Bestiary, bestiary) {
	$scope.bestiary = bestiary;
	var loadCreatures = function(){
		$scope.bestiary.creatures = [];
		for(index in $scope.bestiary.creatureIds){
			var creatureId = $scope.bestiary.creatureIds[index];
			Creature.get(creatureId,function(data){
				$scope.bestiary.creatures.push(data);
			});
		}
	}
	loadCreatures();

	$scope.unsavedBestiary = {
		name: bestiary.name+"",
		description: bestiary.description+""
	};

	$scope.cancelSave = function(){
		$scope.unsavedBestiary = $scope.bestiary;
	}

	$scope.saveBestiaryInfo = function(){
		if($scope.unsavedBestiary._id){
			Bestiary.update($scope.unsavedBestiary._id,$scope.unsavedBestiary,function(data){
				console.log("updated bestiary info!");
				$scope.bestiary.name = data.name;
				$scope.bestiary.description = data.description;
			},function(err){
				console.log("error: "+err);
			});
		}
	}
};

//don't load controller until we've gotten the data from the server
bestiaryCtrl.resolve = {
			bestiary: function(Bestiary, $q, $route){
				if($route.current.params.bestiaryId){
					var deferred = $q.defer();
					if($route.current.params.bestiaryId!=undefined){
						Bestiary.get($route.current.params.bestiaryId,function(data) {
							deferred.resolve(data);
						}, function(errorData) {
							deferred.reject();
						});
					}
					return deferred.promise;
				}
				else
					return {};
			}
		}

angular.module('myApp').controller('bestiaryCtrl',bestiaryCtrl);
