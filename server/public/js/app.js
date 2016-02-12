'use strict';

/* App Module */

//App Module
var myApp = angular.module('myApp', ['ngRoute','ngResource']);

//Set up routing
myApp.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/index',{
				templateUrl: 'assets/partials/index.html'
			}).
			when('/creature/:creatureId',{
				templateUrl: 'assets/partials/creature.html',
				controller: 'creatureCtrl',
				resolve: creatureCtrl.resolve
			}).
			otherwise({
				redirectTo: '/index'
			});
	}]);
