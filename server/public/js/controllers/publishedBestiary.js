
var publishedBestiaryCtrl = function ($scope,bestiary,PublishedBestiary,CreatureFilter,CreatureAPI,CreatureClipboard,$mdMedia,$mdDialog,Auth,$location,Bestiary,Creature) {
	$scope.bestiary = bestiary;

	$scope.creatureFilter = new CreatureFilter();

	var creatureApiOptions = {
		copy: true,
		export: true
	}
	$scope.creatureApi = new CreatureAPI(creatureApiOptions);

	$scope.CreatureClipboard = CreatureClipboard;

	$scope.getPublishedBestiaryListPath = function(){
		return("/#/bestiary/list");
	}

	$scope.editPublishedBestiary = function(ev){
		var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
    $mdDialog.show({
      controller: publishBestiaryCtrl,
      templateUrl: '/assets/partials/publishedBestiary/edit.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      locals: {
      	'baseBestiary': undefined,
      	'publishedBestiary': $scope.bestiary
      },
      fullscreen: useFullScreen
    }).then(function(updatedBestiary){
    	$scope.bestiary.name = updatedBestiary.name;
    	$scope.bestiary.description = updatedBestiary.description;
    });
	}

	$scope.deletePublishedBestiary = function(ev){
    var confirm = $mdDialog.confirm()
			.title("Confirm Deletion")
			.textContent("This published bestiary will be permanently deleted. Would you like to proceed?")
			.ariaLabel("Confirm Delete")
			.targetEvent(ev)
			.ok("Delete")
			.cancel("Cancel");
		$mdDialog.show(confirm).then(function() {
			PublishedBestiary.delete($scope.bestiary._id);
			//Don't wait for delete to actually finish so that the UI feels more responsive.
			$location.url("/bestiary/list");
		});
	}

	var copyCreaturesToBestiary = function(createdBestiary){
		var copiedCount = 0;
		var totalToCopy = $scope.bestiary.creatures.length;
		var finishedCreatingCreature = function(){
			copiedCount = copiedCount + 1;
			if(copiedCount==totalToCopy){
				$location.url("/bestiary/view/"+createdBestiary._id);
			}
		}
		for(var i=0;i<$scope.bestiary.creatures.length;i++){
			var newCreature = angular.copy($scope.bestiary.creatures[i]);
			newCreature._id = undefined;
			newCreature.bestiaryId = createdBestiary._id;
			Creature.create(newCreature,finishedCreatingCreature,finishedCreatingCreature);
		}
	}

	$scope.copyBestiary = function(){
		var newBestiary = Bestiary.generateNewBestiary(Auth.user._id);
		newBestiary.name = $scope.bestiary.name;
		newBestiary.description = $scope.bestiary.description;
		Bestiary.create(newBestiary,function(data){
			copyCreaturesToBestiary(data);
		},function(err){
			console.log("error: "+err);
		});
	}

	$scope.isOwner = function(){
		return(Auth.user._id == $scope.bestiary.owner._id);
	}

	$scope.isLiked = function(){
		if($scope.bestiary.likes){
			for(var i=0;i<$scope.bestiary.likes.length;i++){
				if($scope.bestiary.likes[i].userId == Auth.user._id)
					return true;
			}
		}
		return false;
	}

	$scope.toggleLike = function(){
		if($scope.isLiked())
			PublishedBestiary.unlike($scope.bestiary._id,function(data){
				$scope.bestiary.likes = data.likes;
			});
		else
			PublishedBestiary.like($scope.bestiary._id,function(data){
				$scope.bestiary.likes = data.likes;
			});
	}

	$scope.isFavorite = function(){
		if($scope.bestiary.favorites){
			for(var i=0;i<$scope.bestiary.favorites.length;i++){
				if($scope.bestiary.favorites[i].userId == Auth.user._id)
					return true;
			}
		}
		return false;
	}

	$scope.toggleFavorite = function(){
		if($scope.isFavorite())
			PublishedBestiary.unfavorite($scope.bestiary._id,function(data){
				$scope.bestiary.favorites = data.favorites;
			});
		else
			PublishedBestiary.favorite($scope.bestiary._id,function(data){
				$scope.bestiary.favorites = data.favorites;
			});
	}

};

//don't load controller until we've gotten the data from the server
publishedBestiaryCtrl.resolve = {
	bestiary: ['PublishedBestiary','$q','$route','Auth','$location',function(PublishedBestiary, $q, $route, Auth, $location){
			if($route.current.params.bestiaryId){
				var deferred = $q.defer();
				Auth.executeOnLogin(function(){
					PublishedBestiary.get($route.current.params.bestiaryId,function(data) {
						deferred.resolve(data);
					}, function(errorData) {
						deferred.reject();
					});
				});
				return deferred.promise;
			}
			else
				return {};
		}],
}

angular.module('myApp').controller('publishedBestiaryCtrl',publishedBestiaryCtrl);
