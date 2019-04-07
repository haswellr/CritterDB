
var creatureCtrl = function($scope,creature,Creature,$routeParams,Bestiary,$location,CreatureData,$mdMedia,$mdDialog,CreatureAPI,ChallengeRatingCalculator,TextUtils) {
	$scope.creature = creature;

	$scope.creatureData = CreatureData;
	$scope.searchArray = function(searchText,arrayToSearch,includeSearch){
		var returnedVals = [];
		if(searchText && arrayToSearch){
			var searchTextLower = searchText.toLowerCase();
			for(var i=0;i<arrayToSearch.length;i++){
				if(arrayToSearch[i].toLowerCase().indexOf(searchTextLower)!=-1)
					returnedVals.push(arrayToSearch[i]);
			}
		}
		if(includeSearch)
			returnedVals.push(searchText);
		return(returnedVals);
	}
	$scope.searchAbilities = function(abilityName){
		var returnedVals = [];
		if(abilityName){
			var searchTextLower = abilityName.toLowerCase();
			for(var i=0;i<CreatureData.creatureAbilities.length;i++){
				if(CreatureData.creatureAbilities[i].name.toLowerCase().indexOf(searchTextLower)!=-1)
					returnedVals.push(CreatureData.creatureAbilities[i]);
			}
		}
		else
			return(CreatureData.creatureAbilities);
		return(returnedVals);
	}

	function calculateCRStep(cr){
		if(cr>1)
			return 1;
		else if(cr>0.5)
			return 0.5;
		else if(cr>0.25)
			return 0.25;
		else
			return 0.125;
	}
	$scope.challengeRating = {
		step: calculateCRStep($scope.creature.stats.challengeRating),
		changed: function(){
			if($scope.creature.stats && $scope.creature.stats.challengeRating){
				//set new step
				$scope.challengeRating.step = calculateCRStep($scope.creature.stats.challengeRating);
				//fix up issues caused by dynamic step value
				if($scope.creature.stats.challengeRating==1.5)
					$scope.creature.stats.challengeRating = 2;
				else if($scope.creature.stats.challengeRating==0.75)
					$scope.creature.stats.challengeRating = 1;
				else if($scope.creature.stats.challengeRating==0.375)
					$scope.creature.stats.challengeRating = 0.5;
				//set new XP
				if($scope.creatureData.experienceByCR.hasOwnProperty($scope.creature.stats.challengeRating))
					$scope.creature.stats.experiencePoints = $scope.creatureData.experienceByCR[$scope.creature.stats.challengeRating];
			}
		}
	}

	$scope.savingThrows = {
		isUsed: function(savingThrowAbility){
			for(var i=0;i<$scope.creature.stats.savingThrows.length;i++){
				if(savingThrowAbility.toLowerCase() == $scope.creature.stats.savingThrows[i].ability.toLowerCase()){
					return true;
				}
			}
			return false;
		},
		getUnused: function(selectedSavingThrow){
			if(!$scope.creature.stats || !$scope.creature.stats.savingThrows)
				return $scope.creatureData.abilities;
			var unusedAbilities = [];
			for(var i=0;i<$scope.creatureData.abilities.length;i++){
				var unused = !$scope.savingThrows.isUsed($scope.creatureData.abilities[i]);
				if(unused || selectedSavingThrow.ability.toLowerCase()==$scope.creatureData.abilities[i].toLowerCase())
					unusedAbilities.push($scope.creatureData.abilities[i]);
			}
			return(unusedAbilities);
		},
		add: function(){
			if(!$scope.creature.stats)
				$scope.creature.stats = {};
			if(!$scope.creature.stats.savingThrows)
				$scope.creature.stats.savingThrows = [];
			for(var i=0;i<$scope.creatureData.abilities.length;i++){
				var unused = !$scope.savingThrows.isUsed($scope.creatureData.abilities[i]);
				if(unused){
					var newSavingThrow = {
						ability: $scope.creatureData.abilities[i],
						proficient: true
					};
					$scope.creature.stats.savingThrows.push(newSavingThrow);
					break;
				}
			}
		},
		remove: function(savingThrow){
			var index = $scope.creature.stats.savingThrows.indexOf(savingThrow);
			if(index!=-1)
				$scope.creature.stats.savingThrows.splice(index,1);
		}
	};

	$scope.skills = {
		isUsed: function(skillName){
			for(var i=0;i<$scope.creature.stats.skills.length;i++){
				if(skillName.toLowerCase() == $scope.creature.stats.skills[i].name.toLowerCase()){
					return true;
				}
			}
			return false;
		},
		getUnused: function(selectedSkill){
			if(!$scope.creature.stats || !$scope.creature.stats.skills)
				return $scope.creatureData.skillNames;
			var unusedSkills = [];
			for(var i=0;i<$scope.creatureData.skillNames.length;i++){
				var unused = !$scope.skills.isUsed($scope.creatureData.skillNames[i]);
				if(unused || selectedSkill.name.toLowerCase()==$scope.creatureData.skillNames[i].toLowerCase())
					unusedSkills.push($scope.creatureData.skillNames[i]);
			}
			return(unusedSkills);
		},
		add: function(){
			if(!$scope.creature.stats)
				$scope.creature.stats = {};
			if(!$scope.creature.stats.skills)
				$scope.creature.stats.skills = [];
			for(var i=0;i<$scope.creatureData.skillNames.length;i++){
				var unused = !$scope.skills.isUsed($scope.creatureData.skillNames[i]);
				if(unused){
					var newSkill = {
						name: $scope.creatureData.skillNames[i],
						proficient: true
					};
					$scope.creature.stats.skills.push(newSkill);
					break;
				}
			}
		},
		remove: function(skill){
			var index = $scope.creature.stats.skills.indexOf(skill);
			if(index!=-1)
				$scope.creature.stats.skills.splice(index,1);
		}
	};

	$scope.abilities = {
		addToList: function(list){
			var newAbility = {
				name: "",
				description: ""
			};
			list.push(newAbility);
		},
		removeFromList: function(ability,list){
			var index = list.indexOf(ability);
			if(index!=-1)
				list.splice(index,1);
		},
		canMoveUp: function(item,list){
			var index = list.indexOf(item);
			return(index>0);
		},
		moveUp: function(item,list){
			var index = list.indexOf(item);
			if(index>0){
				list.splice(index,1);
				list.splice(index-1,0,item);
			}
		},
		canMoveDown: function(item,list){
			var index = list.indexOf(item);
			return(index!=-1 && index<(list.length-1));
		},
		moveDown: function(item,list){
			var index = list.indexOf(item);
			if(index!=-1 && index<(list.length-1)){
				list.splice(index,1);
				list.splice(index+1,0,item);
			}
		},
		changed: function(ability){
			var matchingAbilities = $scope.searchAbilities(ability.name);
			var nameLower = ability.name.toLowerCase();
			for(var i=0;i<matchingAbilities.length;i++){
				if(matchingAbilities[i].name.toLowerCase()==nameLower){
					var creatureName = $scope.creature.name.toLowerCase();
					ability.description = matchingAbilities[i].description.replace(/{{name}}/g,creatureName);
					break;	//just find the first matching one
				}
			}
		}
	};

	$scope.race = {
		changed: function(){
			var race = $scope.creature.stats.race;
			if(CreatureData.raceDefaults.hasOwnProperty(race)){
				$scope.creature.stats.size = CreatureData.raceDefaults[race].size;
				$scope.creature.stats.speed = CreatureData.raceDefaults[race].speed;
				$scope.creature.stats.senses = CreatureData.raceDefaults[race].senses;
				$scope.creature.stats.languages = CreatureData.raceDefaults[race].languages;
			}
		}
	}
	$scope.$watch("creature.stats.race",function(newValue,oldValue){
		if(oldValue!=newValue)
			$scope.race.changed();
	},true);

	$scope.size = {
		changed: function(){
			$scope.creature.stats.hitDieSize = CreatureData.sizes[$scope.creature.stats.size].hitDieSize;
		}
	}
	$scope.$watch("creature.stats.size",function(newValue,oldValue){
		if(oldValue!=newValue)
			$scope.size.changed();
	},true);

	function generateLegendaryActionsDescriptionIfNeeded() {
		if ($scope.creature.stats && $scope.creature.stats.legendaryActions.length > 0 && !$scope.creature.stats.legendaryActionsDescription) {
			var nameWithPronoun = TextUtils.getCreatureNameAsProperNoun($scope.creature);
			$scope.creature.stats.legendaryActionsDescription =
				TextUtils.capitalizeFirstLetter(nameWithPronoun) + " can take " + $scope.creature.stats.legendaryActionsPerRound
				+ " legendary actions, choosing from the options below. Only one legendary action option can be used at a time and only at the end of another creature's turn. "
				+ TextUtils.capitalizeFirstLetter(nameWithPronoun) + " regains spent legendary actions at the start of its turn.";
		}
	}
	generateLegendaryActionsDescriptionIfNeeded();	//run once on page load
	$scope.addLegendaryAction = function() {
		$scope.abilities.addToList($scope.creature.stats.legendaryActions);
		generateLegendaryActionsDescriptionIfNeeded();
	}

	$scope.armorType = {
		changed: function(){
			var armorType = $scope.creature.stats.armorType;
			if(CreatureData.armorTypeDefaults.hasOwnProperty(armorType)){
				var armorTypeDefaults = CreatureData.armorTypeDefaults[armorType];
				var dexBonus = $scope.creature.stats.abilityScoreModifiers.dexterity;
				if(armorTypeDefaults.maxDex>-1)
					dexBonus = Math.min(dexBonus,armorTypeDefaults.maxDex);
				$scope.creature.stats.armorClass = armorTypeDefaults.ac + dexBonus;
			}
		}
	}
	$scope.$watch("creature.stats.armorType",function(newValue,oldValue){
		if(oldValue!=newValue)
			$scope.armorType.changed();
	},true);

	$scope.returnToBestiary = function(){
		if($scope.creature._id)
			$location.url("/bestiary/view/"+$scope.creature.bestiaryId);
		else if($routeParams.bestiaryId)
			$location.url("/bestiary/view/"+$routeParams.bestiaryId);
	}

	$scope.saveCreature = function(successCallback){
		if($scope.creature._id){
			Creature.update($scope.creature._id,$scope.creature,successCallback,function(err){
				console.log("error: "+err);
			});
		}
		else{
			$scope.creature.bestiaryId = $routeParams.bestiaryId;
			Creature.create($scope.creature,function(data){
				$scope.creature = data;
				if(successCallback)
					successCallback();
			},function(err){
				console.log("error: "+err);
			});
		}
	}

	$scope.saveAndFinish = function(){
		$scope.saveCreature($scope.returnToBestiary);
	}

	$scope.$on("$destroy", function() {
		$scope.saveCreature();
	});

	$scope.getBestiaryPath = function(){
		var bestiaryId = "";
		if($scope.creature._id)
			bestiaryId = $scope.creature.bestiaryId;
		else if($routeParams.bestiaryId)
			bestiaryId = $routeParams.bestiaryId;
		return("/#/bestiary/view/"+bestiaryId);
	}

	$scope.getBestiaryListPath = function(){
		return("/#/bestiary/list");
	}

	$scope.creatureApi = new CreatureAPI({export:true});

	$scope.generateAttack = function(ev){
		var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
    $mdDialog.show({
      controller: generateAttackCtrl,
      templateUrl: '/assets/partials/creature/create-abilities-add-attack.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      locals: {
      	'creature': $scope.creature
      },
      fullscreen: useFullScreen
    })
    .then(function(result){
    	if(result){
    		$scope.creature.stats.actions.push(result);
    	}
    });
	}

	$scope.generateSpellcasting = function(ev){
		var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
    $mdDialog.show({
      controller: generateSpellcastingCtrl,
      templateUrl: '/assets/partials/creature/create-abilities-add-spellcasting.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      locals: {
      	'creature': $scope.creature
      },
      fullscreen: useFullScreen
    })
    .then(function(result){
    	if(result){
    		$scope.creature.stats.additionalAbilities.push(result);
    	}
    });
	}

	$scope.calculateChallengeRating = function(ev){
		ChallengeRatingCalculator.openDialog(ev, $scope.creature, function(result) {
			if(result){
				$scope.creature.stats.challengeRating = result;
				$scope.challengeRating.changed();
			}
		});
	}

	$scope.$watch("creature",function(newValue,oldValue){
		Creature.calculateCreatureDetails($scope.creature);
	},true);
}

var defaultCreature = {
	name: "New Creature",
	flavor: {},
	stats: {
		size: "Medium",
		race: "Humanoid",
		alignment: "Unaligned",
		armorClass: 10,
		numHitDie: 1,
		proficiencyBonus: 0,
		speed: "30 ft.",
		abilityScores: {
			strength: 10,
			dexterity: 10,
			constitution: 10,
			intelligence: 10,
			wisdom: 10,
			charisma: 10
		},
		savingThrows: [],
		skills: [],
		damageVulnerabilities: [],
		damageResistances: [],
		damageImmunities: [],
		conditionImmunities: [],
		senses: [],
		languages: ["Common"],
		challengeRating: 0.125,
		experiencePoints: 25,
		additionalAbilities: [],
		actions: [{
			name: "Shortsword",
			description: "<i>Melee Weapon Attack:</i> +0 to hit, reach 5 ft., one target. <i>Hit:</i> 3 (1d6 + 0) piercing damage."
		}],
		reactions: [],
		legendaryActions: [],
		legendaryActionsPerRound: 3
	}
}

//don't load controller until we've gotten the data from the server
creatureCtrl.resolve = {
			creature: ['Creature',
								'Bestiary',
								'$q',
								'$route',
								'Auth',
								'$location',
								function(Creature, Bestiary, $q, $route, Auth, $location){
				var deferred = $q.defer();
				Auth.executeOnLogin(function(){
					if(!Auth.isLoggedIn()){
						$location.path('/login');
						deferred.reject();
					}
					else{
						if($route.current.params.creatureId){
							Creature.get($route.current.params.creatureId,function(creatureData) {
								//get bestiary info for creature (this should be cached so will be quick)
								Bestiary.get(creatureData.bestiaryId,function(bestiaryData) {
									creatureData.bestiary = bestiaryData;
									deferred.resolve(creatureData);
								}, function(errorData) {
									deferred.reject();
								});
							}, function(errorData) {
								deferred.reject();
							});
						}
						else if($route.current.params.bestiaryId){
							//This means we must be creating a new creature and adding it to a bestiary,
							// so just grab data for the current bestiary. This will be cached so it will
							// be quick.
							Bestiary.get($route.current.params.bestiaryId,function(bestiaryData) {
								var creatureData = angular.copy(defaultCreature);
								creatureData.bestiary = bestiaryData;
								deferred.resolve(creatureData);
							}, function(errorData) {
								deferred.reject();
							});
						}
						else{
							deferred.resolve(angular.copy(defaultCreature));
						}
					}
				});
				return deferred.promise;
			}]
		}

angular.module('myApp').controller('creatureCtrl',creatureCtrl);