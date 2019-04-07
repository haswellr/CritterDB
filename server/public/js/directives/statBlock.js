angular.module('myApp').directive('ngStatBlock', ["$mdMedia", function ($mdMedia) {
	return {
		restrict: 'E',
		scope: {
			creature: '=creature',
			size: '@size',
			_isSelected: '@isSelected',
			creatureApi: '=creatureApi',
			statBlockStyle: '&statBlockStyle',
			hideCrTag: '=hideCrTag',
			noResize: '=noResize'
		},
		link: function(scope, element, attrs) {
			var setContentUrl = function(){
				if(attrs.size=='preview')
					scope.contentUrl = 'assets/partials/statblock/statBlockPreview.html?@@hash';
				else if(attrs.size=='mini')
					scope.contentUrl = 'assets/partials/statblock/statBlockMini.html?@@hash';
				else
					scope.contentUrl = 'assets/partials/statblock/statBlock.html?@@hash';
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

			scope.isMobile = function(){
				return($mdMedia('xs'));
			}

			scope.isSelected = function() {
				return scope._isSelected === 'true';
			}
		},
		template: '<div ng-include="contentUrl"></div>',
	}
}]);
