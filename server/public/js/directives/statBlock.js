angular.module('myApp').directive('ngStatBlock', [ function () {
	return {
		restrict: 'E',
		scope: {
			creature: '=creature',
			size: '=size',
			creatureApi: '=creatureApi',
			statBlockStyle: '&statBlockStyle'
		},
		link: function(scope, element, attrs) {
			var setContentUrl = function(){
				if(attrs.size=='preview')
					scope.contentUrl = 'assets/partials/statblock/statBlockPreview.html';
				else if(attrs.size=='mini')
					scope.contentUrl = 'assets/partials/statblock/statBlockMini.html';
				else
					scope.contentUrl = 'assets/partials/statblock/statBlock.html';
			}
			setContentUrl();

			attrs.$observe("size",function(size){
				setContentUrl();
			});
		},
		template: '<div ng-include="contentUrl"></div>',
	}
}]);
