angular.module('myApp').directive('ngStatBlock', ["$mdMedia", "TextUtils", function ($mdMedia, TextUtils) {
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
			scope.TextUtils = TextUtils;
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
			scope.getLegendaryActionsText = function() {
				// Creatures with no legendary actions yet will have the description initialized with a default. It can then be customized.
				const defaultText = TextUtils.capitalizeFirstLetter(TextUtils.getCreatureNameAsProperNoun(scope.creature)) + " can take " +
					scope.creature.stats.legendaryActionsPerRound + " legendary actions, choosing from the options below. Only one legendary action " +
					"can be used at a time and only at the end of another creature's turn. " +
					TextUtils.capitalizeFirstLetter(TextUtils.getCreatureNameAsProperNoun(scope.creature)) + " regains spent legendary actions " +
					"at the start of its turn.";
				return scope.creature.stats.legendaryActionsDescription ? scope.creature.stats.legendaryActionsDescription : defaultText;
			}
		},
		template: '<div ng-include="contentUrl"></div>',
	}
}]);
