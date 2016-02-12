angular.module('myApp').factory("Creature", function($resource) {
  return $resource("/api/creatures/:id");
});

angular.module('myApp').controller('creatureCtrl', function ($scope, Creature, $routeParams) {
	$scope.creature = {};

	Creature.get({id:$routeParams.creatureId}, function(data) {
		console.log("got data: "+JSON.stringify(data));
		$scope.creature = data;
	});
});