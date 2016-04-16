
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

	function Filter(){
		return {
			text: "",
			operator: "or",
			toggleOperator: function(){
				if(this.operator=="or")
					this.operator = "and";
				else
					this.operator = "or";
			},
			doesCreaturePass: function(creature){
				if(this.text.length>0){
					var lowerText = this.text.toLowerCase();
					var matchesName = creature.name.toLowerCase().indexOf(lowerText)!=-1;
					var matchesFaction = creature.flavor.faction.toLowerCase().indexOf(lowerText)!=-1;
					var matchesEnvironment = creature.flavor.environment.toLowerCase().indexOf(lowerText)!=-1;
					return(matchesName || matchesEnvironment || matchesFaction);
				}
				else
					return true;
			}
		};
	}
	$scope.creatureFilter = {
		challengeRating: {
			min: {
				value: 0,
				step: 0.125
			},
			max: {
				value: 30,
				step: 1
			},
			changed: function(cr){
				//set new step
				if(cr.value>1)
					cr.step = 1;
				else if(cr.value>0.5)
					cr.step = 0.5;
				else if(cr.value>0.25)
					cr.step = 0.25;
				else
					cr.step = 0.125;
				//fix up issues caused by dynamic step value
				if(cr.value==1.5)
					cr.value = 2;
				else if(cr.value==0.75)
					cr.value = 1;
				else if(cr.value==0.375)
					cr.value = 0.5;
			}
		},
		filters: [new Filter()],
		addFilter: function(){
			var filter = new Filter();
			$scope.creatureFilter.filters.push(filter);
		},
		removeFilter: function(index){
			$scope.creatureFilter.filters.splice(index,1);
		},
		resetFilters: function(){
			$scope.creatureFilter.filters = [new Filter()];
			$scope.creatureFilter.challengeRating.min = {
				value: 0,
				step: 0.125
			};
			$scope.creatureFilter.challengeRating.max = {
				value: 30,
				step: 1
			};
		},
		areFiltersActive: function(){
			var active = false;
			for(var i=0;i<$scope.creatureFilter.filters.length;i++){
				var filter = $scope.creatureFilter.filters[i];
				if(filter.text.length>0){
					active = true;
					break;
				}
			}
			if($scope.creatureFilter.challengeRating.min.value>0 || $scope.creatureFilter.challengeRating.max.value<30){
				active = true;
			}
			return active;
		},
		fillBackground: function(isBody,index){
			var show = false;
			var filter = $scope.creatureFilter.filters[index];
			var prevFilter = undefined;
			if(index>0)
				prevFilter = $scope.creatureFilter.filters[index-1];
			if(isBody && filter.operator=="and")
				show = true;
			else if(!isBody && prevFilter!=undefined && prevFilter.operator=="and" && filter.operator!="and")
				show = true;
			return show;
		},
		isCreatureShown: function(creature){
			if(creature.stats.challengeRating >= $scope.creatureFilter.challengeRating.min.value
				&& creature.stats.challengeRating <= $scope.creatureFilter.challengeRating.max.value){
				if($scope.creatureFilter.filters.length>0){
					var andFilterGroups = [];
					var currentAndFilterGroup = undefined;
					//follow order of operations - do ANDs, then ORs. We do this by calculating all groups
					//of consecutive ANDs, then doing OR between those groups.
					for(var i=0;i<$scope.creatureFilter.filters.length;i++){
						var filter = $scope.creatureFilter.filters[i];
						var passes = filter.doesCreaturePass(creature);
						if(currentAndFilterGroup==undefined)
							currentAndFilterGroup = passes;
						else
							currentAndFilterGroup = currentAndFilterGroup && passes;
						if(filter.operator=="or" || (i+1)==($scope.creatureFilter.filters.length)){
							andFilterGroups.push(currentAndFilterGroup);
							currentAndFilterGroup = undefined;
						}
					}
					var matches = false;
					for(var i=0;i<andFilterGroups.length;i++){
						matches = matches || andFilterGroups[i];
					}
					return(matches);
				}
				else{
					return true;
				}
			}
			else
				return false;
		}
	};

	$scope.addCreature = function(){
		$location.url("/bestiary/add/"+$scope.bestiary._id);
	}

	$scope.editCreature = function(creature){
		$location.url("/creature/edit/"+creature._id);
	}

	$scope.saveImageOfCreature = function(creature){
		$location.url("/creature/image/"+creature._id);
	}

	$scope.exportCreatureToHTML = function(creature){

	}

	$scope.exportCreatureToNaturalCrit = function(creature){

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
		if($scope.unsavedBestiary._id){
			Bestiary.update($scope.unsavedBestiary._id,$scope.unsavedBestiary,function(data){
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
		delete: $scope.deleteCreature,
		exportImage: $scope.saveImageOfCreature,
		exportHTML: $scope.exportCreatureToHTML,
		exportNaturalCrit: $scope.exportCreatureToNaturalCrit
	};
};

//don't load controller until we've gotten the data from the server
bestiaryCtrl.resolve = {
			bestiary: ['Bestiary','$q','$route','Auth','$location',function(Bestiary, $q, $route, Auth, $location){
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
