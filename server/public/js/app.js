'use strict';

/* App Module */

//App Module
var myApp = angular.module('myApp', ['ngRoute','ngResource','ngMaterial']);

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
				templateUrl: 'assets/partials/bestiary.html',
				controller: 'bestiaryCtrl',
				resolve: bestiaryCtrl.resolve
			}).
			when('/creature/view/:creatureId',{
				templateUrl: 'assets/partials/creature/view.html',
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
