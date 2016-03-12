
var exportCreatureCtrl = function($scope,creature,html2canvas) {
	$scope.creature = creature;

	$scope.createImage = function(){
		var element = document.getElementById('stat-block');
		html2canvas.render(element, {
		  logging: true
		}).then(function(canvas){
			document.body.appendChild(canvas);
		});
	}

	$scope.saveImage = function(){
		var element = document.getElementById('stat-block');
		html2canvas.render(element, {
		  logging: true
		}).then(function(canvas){
			document.body.appendChild(canvas);
		});
	}
}

angular.module('myApp').controller('exportCreatureCtrl',exportCreatureCtrl);
