
var bestiaryCtrl = function ($scope, Creature, Bestiary, bestiary, $location, bestiaries, Auth, $mdDialog) {
	$scope.bestiaries = bestiaries;
	$scope.bestiary = bestiary;

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

	$scope.addCreature = function(){
		$location.url("/bestiary/add/"+$scope.bestiary._id);
	}

	$scope.editCreature = function(creature){
		$location.url("/creature/edit/"+creature._id);
	}

	$scope.copyCreature = function(creature){
		var newCreature = angular.copy(creature);
		newCreature._id = undefined;
		newCreature.name = newCreature.name + " Copy";
		Creature.create(newCreature,function(data){
			$scope.editCreature(data);
		},function(err){
			console.log("error: "+err);
		});
	}

	$scope.deleteCreature = function(ev,creature){
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
		});
	}

	$scope.createBestiary = function(){
		var newBestiary = Bestiary.generateNewBestiary(Auth.user._id);
		Bestiary.create(newBestiary,function(data){
			$scope.goToBestiary(data._id);
		},function(err){
			console.log("error: "+err);
		});
	}

	$scope.deleteBestiary = function(ev,bestiary){
		var confirm = $mdDialog.confirm()
			.title("Confirm Deletion")
			.textContent("This bestiary will be permanently deleted. Would you like to proceed?")
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

	$scope.doesBestiaryNeedEdits = function(bestiary){
		return(bestiary.name==Bestiary.newBestiaryModel.name || bestiary.description==Bestiary.newBestiaryModel.description);
	}

	$scope.goToBestiary = function(id){
		$location.url("/bestiary/view/"+id);
	}

	$scope.goToBestiaryList = function(){
		$location.url("/bestiary/list");
	}

	$scope.cancelSave = function(){
		$scope.unsavedBestiary = $scope.bestiary;
	}

	$scope.saveBestiaryInfo = function(){
		console.log("saving");
		if($scope.unsavedBestiary._id){
			Bestiary.update($scope.unsavedBestiary._id,$scope.unsavedBestiary,function(data){
				console.log("saved");
				$scope.bestiary.name = data.name;
				$scope.bestiary.description = data.description;
			},function(err){
				console.log("error: "+err);
			});
		}
	}

	$scope.creatureApi = {
		edit: $scope.editCreature,
		copy: $scope.copyCreature,
		delete: $scope.deleteCreature
	};
};

//don't load controller until we've gotten the data from the server
bestiaryCtrl.resolve = {
			bestiary: function(Bestiary, $q, $route, Auth, $location){
				if($route.current.params.bestiaryId){
					var deferred = $q.defer();
					Auth.executeOnLogin(function(){
						if(!Auth.isLoggedIn()){
							$location.path('/login');
							deferred.reject();
						}
						else{
							Bestiary.get($route.current.params.bestiaryId,function(data) {
								deferred.resolve(data);
								//save that bestiary was active, but no need to do it until after resolving
								data.lastActive = new Date();
								Bestiary.update(data._id,data);
							}, function(errorData) {
								deferred.reject();
							});
						}
					});
					return deferred.promise;
				}
				else
					return {};
			},
			bestiaries: function(Bestiary, $q, $route, Auth, $location){
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
			}
		}

angular.module('myApp').controller('bestiaryCtrl',bestiaryCtrl);
