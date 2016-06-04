
var publishedBestiaryCtrl = function ($scope,bestiary,bestiaries,owner,$routeParams,PublishedBestiary,PublishedBestiaryPager,UserPublishedBestiaryPager,CreatureFilter,CreatureAPI,CreatureClipboard,$mdMedia,$mdDialog,Auth,$location,Bestiary,Creature,$window,Mongo) {
	$scope.bestiary = bestiary;
	$scope.bestiaries = bestiaries;
	$scope.owner = owner;
	$scope.commentEdits = {};
	if(bestiaries && bestiaries.length>0){
		if($routeParams.userId)
			$scope.bestiaryPager = new UserPublishedBestiaryPager(bestiaries,2);
		else
			$scope.bestiaryPager = new PublishedBestiaryPager($routeParams.bestiaryType,bestiaries,2);
	}
	if($routeParams.bestiaryType && PublishedBestiary.listConstants[$routeParams.bestiaryType])
		$scope.bestiaryType = PublishedBestiary.listConstants[$routeParams.bestiaryType].name;

	$scope.canInteract = function(){
		return(Auth.user!=null);
	}

	$scope.creatureFilter = new CreatureFilter();
	$scope.bestiaryListTypes = function(){
		var bestiaryListTypes = [];
		for(var key in PublishedBestiary.listConstants){
			if (PublishedBestiary.listConstants.hasOwnProperty(key)){
				if(!PublishedBestiary.listConstants[key].loginRequired || $scope.canInteract()){
					var listType = angular.copy(PublishedBestiary.listConstants[key]);
					bestiaryListTypes.push(listType);
				}
			}
		}
		return(bestiaryListTypes);
	}();
	$scope.getCurrentBestiaryListType = function(){
		return(PublishedBestiary.listConstants[$routeParams.bestiaryType]);
	}

	var creatureApiOptions = {
		copy: true,
		export: true
	}
	$scope.creatureApi = new CreatureAPI(creatureApiOptions);

	$scope.CreatureClipboard = CreatureClipboard;

	$scope.getPublishedBestiaryListPath = function(){
		return("/#/publishedbestiary/list/recent");
	}

	$scope.getBestiaryPath = function(bestiary){
		if(bestiary)
			return("/#/publishedbestiary/view/"+bestiary._id);
		else
			return("");
	}

	$scope.getUserBestiaryListPath = function(user){
		if(user)
			return("/#/user/"+user._id+"/publishedbestiaries");
		else
			return("");
	}

	$scope.bestiarySortFunction = function(bestiary) {
		if($routeParams.bestiaryType=="popular")
			return(-1*bestiary.popularity);
		else
			return(-1*parseInt("0x"+bestiary._id));
	}

	$scope.goBack = function(){
		$window.history.back();
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
		return(Auth.user && Auth.user._id == $scope.bestiary.owner._id);
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

	function resetNewComment(){
		$scope.newComment = {
			text: ""
		}
	}
	resetNewComment();
	$scope.postComment = function(){
		if($scope.newComment.text.length>0){
			$scope.newComment.author = Auth.user._id;
			$scope.postingComment = true;
			PublishedBestiary.addComment($scope.bestiary._id,$scope.newComment,function(data){
				resetNewComment();
				$scope.bestiary.comments = data.comments;
				$scope.postingComment = false;
			},function(err){
				$scope.postingComment = false;
			});
		}
	}

	function resetCommentEdits(comment){
		if($scope.commentEdits[comment._id])
			delete $scope.commentEdits[comment._id];
	}

	$scope.editComment = function(comment){
		$scope.commentEdits[comment._id] = {
			text: comment.text
		}
	}

	$scope.cancelCommentEdits = function(comment){
		resetCommentEdits(comment);
	}

	$scope.saveCommentEdits = function(comment){
		//Take effect immediately before we actually talk to the server
		comment.text = $scope.commentEdits[comment._id].text;
		resetCommentEdits(comment);
		PublishedBestiary.updateComment($scope.bestiary._id,comment._id,comment,function(data){
			$scope.bestiary.comments = data.comments;
		});
	}

	$scope.deleteComment = function(ev,id){
		var confirm = $mdDialog.confirm()
			.title("Confirm Deletion")
			.textContent("This comment will be permanently deleted. Would you like to proceed?")
			.ariaLabel("Confirm Delete")
			.targetEvent(ev)
			.ok("Delete")
			.cancel("Cancel");
		$mdDialog.show(confirm).then(function() {
			PublishedBestiary.deleteComment($scope.bestiary._id,id,function(data){
				$scope.bestiary.comments = data.comments;
			});
		});
	}

	$scope.getCommentsHeader = function(){
		if($scope.bestiary && $scope.bestiary.comments){
			var header = $scope.bestiary.comments.length + " comment";
			if($scope.bestiary.comments.length != 1)
				header = header + "s";
			return(header);
		}
		else
			return "0 comments";
	}

	$scope.getCreationDate = Mongo.getTimestamp;

};

//don't load controller until we've gotten the data from the server
publishedBestiaryCtrl.resolve = {
	bestiary: ['PublishedBestiary','$q','$route','Auth',function(PublishedBestiary, $q, $route, Auth){
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
	bestiaries: ['PublishedBestiary','$q','$route','Auth',function(PublishedBestiary, $q, $route, Auth){
			if($route.current.params.bestiaryType){
				var deferred = $q.defer();
				Auth.executeOnLogin(function(){
					var type = $route.current.params.bestiaryType;
					if(PublishedBestiary.listConstants[type]){
						var retrievalFunction = PublishedBestiary.listConstants[type].retrievalFunction;
						var page = $route.current.params.page || 1;
						retrievalFunction(page,function(data) {
							deferred.resolve(data);
						}, function(errorData) {
							deferred.reject();
						});
					}
					else
						deferred.reject();
				});
				return deferred.promise;
			}
			else if($route.current.params.userId){
				var deferred = $q.defer();
				var page = $route.current.params.page || 1;
				PublishedBestiary.getByUser($route.current.params.userId,page,function(data) {
					deferred.resolve(data);
				}, function(errorData) {
					deferred.reject();
				});
				return deferred.promise;
			}
			else
				return undefined;
		}],
	owner: ['User','$q','$route','Auth',function(User, $q, $route, Auth){
			if($route.current.params.userId){
				var deferred = $q.defer();
				Auth.executeOnLogin(function(){
					var userId = $route.current.params.userId;
					User.getPublic(userId,function(data) {
						deferred.resolve(data);
					}, function(errorData) {
						deferred.reject();
					});
				});
				return deferred.promise;
			}
			else
				return undefined;
		}]
}

angular.module('myApp').controller('publishedBestiaryCtrl',publishedBestiaryCtrl);
