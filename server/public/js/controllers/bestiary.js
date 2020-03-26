
var bestiaryCtrl = function ($scope, Creature, Bestiary, bestiary, $location, bestiaries, Auth, $mdDialog, $mdMedia, CreatureClipboard, $mdToast, CreatureFilter, CreatureAPI, $cookies, $window, BestiaryCopier) {
	$scope.bestiaries = bestiaries;
	$scope.bestiary = bestiary;
	$scope.Auth = Auth;

	$scope.bestiary.creaturesLoading = true;
	var loadCreatures = function(){
		if($scope.bestiary._id){
			Creature.getAllForBestiary($scope.bestiary._id,function(data){
				$scope.bestiary.creaturesLoading = false;
				$scope.bestiary.creatures = data;
			});
		}
	}
	loadCreatures();

	$scope.unsavedBestiary = {
		_id: bestiary._id,
		name: bestiary.name+"",
		description: bestiary.description+""
	};

	var VIEW_MODE_COOKIE = "bestiary-view-mode";
	$scope.view = {
		modes: [
			{
				id: "fallingColumns",
				tooltip: "Falling Columns Mode",
				icon: "view_column"
			},
			{
				id: "previewList",
				tooltip: "List & Preview Mode",
				icon: "view_list"
			}
		],
		current: ($cookies.get(VIEW_MODE_COOKIE) || "previewList"),
		changeTo: function(id){
			$scope.view.current = id;
			$cookies.put(VIEW_MODE_COOKIE,id);
		}
	}

	$scope.isUserOwner = function() {
		return Auth.user && Auth.user._id == $scope.bestiary.ownerId;
	}

	$scope.preview = {
		creature: undefined
	}

	$scope.creatureFilter = new CreatureFilter();

	$scope.creatureApi = new CreatureAPI();
	//Override delete feature so we can immediately splice creature rather than waiting for server
	$scope.creatureApi.delete = function(ev,creature){
		var confirm = $mdDialog.confirm()
			.title("Confirm Deletion")
			.textContent("This creature will be permanently deleted. Would you like to proceed?")
			.ariaLabel("Confirm Delete")
			.targetEvent(ev)
			.ok("Delete")
			.cancel("Cancel");
		$mdDialog.show(confirm).then(function() {
			Creature.delete(creature._id);
			//Don't wait for delete to actually finish so that the UI feels more responsive.
			var index = $scope.bestiary.creatures.indexOf(creature);
			if(index!=-1)
				$scope.bestiary.creatures.splice(index,1);
			if($scope.preview.creature && $scope.preview.creature._id == creature._id)
				$scope.preview.creature = undefined;
		});
	}

	$scope.addCreature = function(){
		$location.url("/bestiary/add/"+$scope.bestiary._id);
	}

	$scope.goToBestiary = function(id){
		$location.url("/bestiary/view/"+id);
	}

	$scope.createBestiary = function(){
		var newBestiary = Bestiary.generateNewBestiary(Auth.user._id);
		Bestiary.create(newBestiary,function(data){
			$scope.goToBestiary(data._id);
		},function(err){
			console.log("error: "+err);
		});
	}

	$scope.shareBestiary = function(ev,bestiary){
		var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
        $mdDialog.show({
          controller: sharingCtrl,
          templateUrl: '/assets/partials/sharing/sharing-modal.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          locals: {
            'sharedEntity': bestiary,
            'entityAPIService': Bestiary,
            'entityLocalDirectory': "bestiary",
            'presentationData': {
              'entityName': "bestiary",
              'entityNameTitle': "bestiary" 
            }
          },
          fullscreen: true
        });
	}

	$scope.deleteBestiary = function(ev,bestiary){
		var confirm = $mdDialog.confirm()
			.title("Confirm Deletion")
			.textContent("This collection will be permanently deleted. Would you like to proceed?")
			.ariaLabel("Confirm Delete")
			.targetEvent(ev)
			.ok("Delete")
			.cancel("Cancel");
		$mdDialog.show(confirm).then(function() {
			Bestiary.delete(bestiary._id);
			//Don't wait for delete to actually finish so that the UI feels more responsive.
			var index = $scope.bestiaries.indexOf(bestiary);
			if(index!=-1)
				$scope.bestiaries.splice(index,1);
		});
	}

	$scope.copyBestiary = function(){
		BestiaryCopier.copy($scope.bestiary, function(createdBestiary) {
			$location.url("/bestiary/view/"+createdBestiary._id);
		}, function(error) {
			console.error(error);
		});
	}

	$scope.printBestiary = function(ev,bestiary){
		$window.print();
	}

	$scope.publishBestiary = function(ev,bestiary){
		var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
    $mdDialog.show({
      controller: publishBestiaryCtrl,
      templateUrl: '/assets/partials/bestiary/publish-bestiary.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      locals: {
      	'baseBestiary': bestiary,
      	'publishedBestiary': undefined
      },
      fullscreen: useFullScreen
    });
	}

	$scope.doesBestiaryNeedEdits = function(bestiary){
		return(bestiary.name==Bestiary.newBestiaryModel.name || bestiary.description==Bestiary.newBestiaryModel.description);
	}

	$scope.getBestiaryListPath = function(){
		return("/#/bestiary/list");
	}

	$scope.getBestiaryPath = function(bestiary){
		return("/#/bestiary/view/"+bestiary._id);
	}

	$scope.cancelSave = function(){
		$scope.unsavedBestiary = $scope.bestiary;
	}

	$scope.saveBestiaryInfo = function(){
		if($scope.unsavedBestiary._id){
			Bestiary.update($scope.unsavedBestiary._id,$scope.unsavedBestiary,function(data){
				$scope.bestiary.name = data.name;
				$scope.bestiary.description = data.description;
			},function(err){
				console.log("error: "+err);
			});
		}
	}

	$scope.CreatureClipboard = CreatureClipboard;

	$scope.pasteClipboard = function(){
		var creatures = CreatureClipboard.getAll();
		var copiedCount = 0;
		var totalToCopy = creatures.length;
		var finishedCopy = function(){
			copiedCount = copiedCount + 1;
			if(copiedCount==totalToCopy){
				loadCreatures();
				$mdToast.show(
					$mdToast.simple()
						.textContent(totalToCopy + " creatures pasted.")
						.position("bottom right")
						.hideDelay(2000)
				);
			}
		}
		for(var i=0;i<creatures.length;i++){
			var newCreature = angular.copy(creatures[i]);
			newCreature._id = undefined;
			newCreature.publishedBestiaryId = undefined;
			newCreature.bestiaryId = $scope.bestiary._id;
			Creature.create(newCreature,finishedCopy,finishedCopy);
		}
	}
};

//don't load controller until we've gotten the data from the server
bestiaryCtrl.resolve = {
			bestiary: ['Bestiary','$q','$route','Auth','$location','User',function(Bestiary, $q, $route, Auth, $location, User){
				if($route.current.params.bestiaryId){
					var deferred = $q.defer();
					const rejectAndReroute = function() {
						$location.path('/login');
						deferred.reject();
					};
					Auth.executeOnLogin(function(){
						Bestiary.get($route.current.params.bestiaryId,function(bestiaryData) {
							// Get the bestiary owner (note: this could be better done with Mongoose autopopulate, but it's not how the model was set up, and this is easy enough)
							User.getPublic(bestiaryData.ownerId,function(userData) {
								bestiaryData.owner = userData;
								deferred.resolve(bestiaryData);
								if (Auth.user && Auth.user._id == bestiaryData.ownerId) {
									// If this is the owner of the bestiary, save that bestiary was active, but no need to do it until after resolving
									bestiaryData.lastActive = new Date();
									Bestiary.update(bestiaryData._id, bestiaryData);
								}
							}, function(errorData) {
								deferred.reject();
							});
						}, function(errorData) {
							rejectAndReroute();
						});
					});
					return deferred.promise;
				}
				else
					return {};
			}],
			bestiaries: ['Bestiary','$q','$route','Auth','$location',function(Bestiary, $q, $route, Auth, $location){
				if($route.current.params.bestiaryId==undefined){
					var deferred = $q.defer();
					Auth.executeOnLogin(function(){
						if(!Auth.isLoggedIn()){
							$location.path('/login');
							deferred.reject();
						}
						else{
							Bestiary.getAllForUser(Auth.user._id,function(data) {
								deferred.resolve(data);
							}, function(errorData) {
								deferred.reject();
							});
						}
					});
					return deferred.promise;
				}
				else
					return [];
			}]
		}

angular.module('myApp').controller('bestiaryCtrl',bestiaryCtrl);
