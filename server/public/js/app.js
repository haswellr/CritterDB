'use strict';

/* App Module */

//App Module
var myApp = angular.module('myApp', ['ngRoute','ngResource','ngMaterial','ngMessages']).
config(function($mdThemingProvider) {
  $mdThemingProvider.definePalette('amazingPaletteName', {
    '50': 'E0F7FA',
    '100': 'B2EBF2',
    '200': '80DEEA',
    '300': '4DD0E1',
    '400': '26C6DA',
    '500': '00BCD4',
    '600': '00ACC1',
    '700': '0097A7',
    '800': '00838F',
    '900': '006064',
    'A100': '84FFFF',
    'A200': '18FFFF',
    'A400': '00E5FF',
    'A700': '00B8D4',
    'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                        // on this palette should be dark or light
    'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
     '200', '300', '400', 'A100'],
    'contrastLightColors': undefined    // could also specify this if default was 'dark'
  });
  $mdThemingProvider.theme('default')
    .primaryPalette('amazingPaletteName')
});

//Set up routing
myApp.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/index',{
				templateUrl: 'assets/partials/index.html'
			}).
			when('/login',{
				templateUrl: 'assets/partials/login.html'
			}).
			when('/bestiary/view/:bestiaryId',{
				templateUrl: 'assets/partials/bestiary/view.html',
				controller: 'bestiaryCtrl',
				resolve: bestiaryCtrl.resolve
			}).
			when('/bestiary/list',{
				templateUrl: 'assets/partials/bestiary/list.html',
				controller: 'bestiaryCtrl'
			}).
			when('/creature/view/:creatureId',{
				templateUrl: 'assets/partials/creature/view.html',
				controller: 'creatureCtrl',
				resolve: creatureCtrl.resolve
			}).
			when('/creature/edit/:creatureId',{
				templateUrl: 'assets/partials/creature/create.html',
				controller: 'creatureCtrl',
				resolve: creatureCtrl.resolve
			}).
			when('/creature/create',{
				templateUrl: 'assets/partials/creature/create.html',
				controller: 'creatureCtrl',
				resolve: creatureCtrl.resolve
			}).
			otherwise({
				redirectTo: '/index'
			});
	}]);
