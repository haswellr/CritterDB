angular.module('myApp').factory("Bestiary", function($resource,$sce) {
  return $resource("/api/bestiaries/:id", null, {
  	'update': { method:'PUT' }
  });
});

var bestiaryCtrl = function ($scope, Creature, bestiary) {
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

};

//don't load controller until we've gotten the data from the server
bestiaryCtrl.resolve = {
			bestiary: function(Bestiary, $q, $route){
				var deferred = $q.defer();
				if($route.current.params.bestiaryId!=undefined){
					Bestiary.get({id:$route.current.params.bestiaryId},function(data) {
						deferred.resolve(data);
					}, function(errorData) {
						deferred.reject();
					});
				}
				return deferred.promise;
			}
		}

angular.module('myApp').controller('bestiaryCtrl',bestiaryCtrl);
