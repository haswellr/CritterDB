angular.module('myApp').directive('ngStatBlock', [ function () {
	return {
		restrict: 'E',
		scope: {
			creature: '=creature',
			size: '@size',
			creatureApi: '=creatureApi',
			statBlockStyle: '&statBlockStyle',
			hideCrTag: '=hideCrTag'
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

			scope.expand = function(){
				if(attrs.size=="mini" || attrs.size=="preview"){
					attrs.size = "";
					setContentUrl();
				}
			}

			scope.shrink = function(){
				if(attrs.size!="mini"){
					attrs.size = "mini";
					setContentUrl();
				}
			}
		},
		template: '<div ng-include="contentUrl"></div>',
	}
}]);
