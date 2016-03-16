
var headerCtrl = function ($scope,$timeout) {
	var logoIconPaths = [
		"/assets/img/icons/dragon-head.svg",
		"/assets/img/icons/ghost.svg",
		"/assets/img/icons/orc-head.svg",
		"/assets/img/icons/hanging-spider.svg",
		"/assets/img/icons/minotaur.svg",
		"/assets/img/icons/snail.svg"];
	$scope.logoIconPath = logoIconPaths[Math.floor(Math.random()*logoIconPaths.length)];

	$scope.logoStyle = {
		'margin-top': '-55px'
	};
	$timeout(function(){
		$scope.logoStyle = {};
	},1000);
};
headerCtrl.$inject = ["$scope", "$timeout"];

angular.module('myApp').controller('headerCtrl',headerCtrl);


