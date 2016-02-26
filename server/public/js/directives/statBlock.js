angular.module('myApp').directive('ngStatBlock', [ function () {
	return {
		restrict: 'E',
		scope: {
			creature: '=creature',
			size: '=size',
			editCreature: '=editCreature'
		},
		link: function(scope, element, attrs) {
			var setContentUrl = function(){
				if(attrs.size=='preview')
					scope.contentUrl = 'assets/partials/statBlockPreview.html';
				else if(attrs.size=='mini')
					scope.contentUrl = 'assets/partials/statBlockMini.html';
				else
					scope.contentUrl = 'assets/partials/statBlock.html';
			}
			setContentUrl();

			attrs.$observe("size",function(size){
				setContentUrl();
			});
		},
		template: '<div ng-include="contentUrl"></div>',
	}
}]);
