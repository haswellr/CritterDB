angular.module('myApp').directive('ngStatBlock', [ function () {
	return {
		restrict: 'E',
		scope: {
			creature: '=creature'
		},
		templateUrl: 'assets/partials/statBlock.html'
	}
}]);
