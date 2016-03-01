
var bestiaryCtrl = function ($scope, Creature, Bestiary, bestiary, $location, bestiaries, Auth) {
	$scope.bestiaries = bestiaries;
	$scope.bestiary = bestiary;

	var loadCreatures = function(){
		if($scope.bestiary._id){
			Creature.getAllForBestiary($scope.bestiary._id,function(data){
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
		console.log("edit creature: "+creature._id);
		$location.url("/creature/edit/"+creature._id);
	}

	$scope.createBestiary = function(){
		var newBestiary = {
			name: 'New Bestiary',
			description: '',
			ownerId: Auth.user._id
		};
		Bestiary.create(newBestiary,function(data){
			$scope.goToBestiary(data._id);
		},function(err){
			console.log("error: "+err);
		});
	}

	$scope.goToBestiary = function(id){
		$location.url("/bestiary/view/"+id);
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
