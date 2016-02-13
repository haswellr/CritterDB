


var creatureCtrl = function($scope,creature) {
	$scope.creature = creature;
}

//don't load controller until we've gotten the data from the server
creatureCtrl.resolve = {
			creature: function(Creature, $q, $route){
				var deferred = $q.defer();
				Creature.get($route.current.params.creatureId,function(data) {
					deferred.resolve(data);
				}, function(errorData) {
					deferred.reject();
				});
				return deferred.promise;
			}
		}

angular.module('myApp').controller('creatureCtrl',creatureCtrl);
