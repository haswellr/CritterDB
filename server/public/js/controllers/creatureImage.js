
var creatureImageCtrl = function($scope,creature,html2canvas,$location) {
	$scope.creature = creature;

	$scope.image = {
		width: 500,
		background: true,
		border: true
	};
	$scope.$watch("image.background",function(newValue,oldValue){
		if(oldValue!=newValue)
			$scope.image.border = newValue;
	},true);

	$scope.getStatBlockStyle = function(){
		var style = {
			'width': $scope.image.width + 'px',
			'min-width': $scope.image.width + 'px'
		};
		return(style);
	}

	$scope.testStyle = function(){
		return {};
	}

	$scope.getBackgroundStyle = function(){
		var style = {
			'box-shadow': 'none'
		};
		if(!$scope.image.border){
			style.border = "none";
		}
		if(!$scope.image.background)
			style.background = "none";
		return(style);
	}

	$scope.returnToBestiary = function(){
		$location.url("/bestiary/view/"+$scope.creature.bestiaryId);
	}

	$scope.goToBestiaryList = function(){
		$location.url("/bestiary/list");
	}

	$scope.saveImage = function(){
		var element = document.getElementById('stat-block');
		html2canvas.render(element, {}).then(function(canvas){
			var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

			var link = document.createElement('a');
			link.download = $scope.creature.name+".png";
			link.href = image;
			link.click();
		});
	}
}

angular.module('myApp').controller('creatureImageCtrl',creatureImageCtrl);
