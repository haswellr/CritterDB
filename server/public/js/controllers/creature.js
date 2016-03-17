
var creatureCtrl = function($scope,creature,Creature,$routeParams,Bestiary,$location,CreatureData,$mdMedia,$mdDialog) {
	$scope.creature = creature;

	$scope.creatureData = CreatureData;
	$scope.searchArray = function(searchText,arrayToSearch,includeSearch){
		var returnedVals = [];
		if(includeSearch)
			returnedVals.push(searchText);
		if(searchText && arrayToSearch){
			var searchTextLower = searchText.toLowerCase();
			for(var i=0;i<arrayToSearch.length;i++){
				if(arrayToSearch[i].toLowerCase().indexOf(searchTextLower)!=-1)
					returnedVals.push(arrayToSearch[i]);
			}
		}
		return(returnedVals);
	}

	$scope.challengeRating = {
		step: 0.125,
		changed: function(){
			if($scope.creature.stats && $scope.creature.stats.challengeRating){
				//set new step
				if($scope.creature.stats.challengeRating>1)
					$scope.challengeRating.step = 1;
				else if($scope.creature.stats.challengeRating>0.5)
					$scope.challengeRating.step = 0.5;
				else if($scope.creature.stats.challengeRating>0.25)
					$scope.challengeRating.step = 0.25;
				else
					$scope.challengeRating.step = 0.125;
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
					$scope.creature.stats.savingThrows.splice(0,0,newSavingThrow);
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
				return $scope.creatureData.skills;
			var unusedSkills = [];
			for(var i=0;i<$scope.creatureData.skills.length;i++){
				var unused = !$scope.skills.isUsed($scope.creatureData.skills[i]);
				if(unused || selectedSkill.name.toLowerCase()==$scope.creatureData.skills[i].toLowerCase())
					unusedSkills.push($scope.creatureData.skills[i]);
			}
			return(unusedSkills);
		},
		add: function(){
			if(!$scope.creature.stats)
				$scope.creature.stats = {};
			if(!$scope.creature.stats.skills)
				$scope.creature.stats.skills = [];
			for(var i=0;i<$scope.creatureData.skills.length;i++){
				var unused = !$scope.skills.isUsed($scope.creatureData.skills[i]);
				if(unused){
					var newSkill = {
						name: $scope.creatureData.skills[i],
						proficient: true
					};
					$scope.creature.stats.skills.splice(0,0,newSkill);
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
			list.splice(0,0,newAbility);
		},
		removeFromList: function(ability,list){
			var index = list.indexOf(ability);
			if(index!=-1)
				list.splice(index,1);
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
			$scope.creature.stats.hitDieSize = CreatureData.hitDieSizeBySize[$scope.creature.stats.size];
		}
	}
	$scope.$watch("creature.stats.size",function(newValue,oldValue){
		if(oldValue!=newValue)
			$scope.size.changed();
	},true);

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

	$scope.saveAndGoToBestiaryList = function(){
		$scope.saveCreature(function(){
			$location.url("/bestiary/list");
		});
	}

	$scope.saveAsImage = function(){
		$scope.saveCreature(function(){
			$location.url("/creature/image/"+$scope.creature._id);
		});
	}

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
    		$scope.creature.stats.actions.splice(0,0,result);
    	}
    });;
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
    		$scope.creature.stats.actions.splice(0,0,result);
    	}
    });;
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
		reactions: []
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


var generateAttackCtrl = function ($scope,creature,CreatureData,$mdDialog) {

	$scope.creatureData = CreatureData;

	$scope.attack = {
		weapon: '',
		melee: true,
		ranged: false,
		reach: 5,
		shortRange: 80,
		longRange: 320,
		damageType: 'Slashing',
		damageDiceSize: 6,
		damageDiceNum: 1,
	};

	var createDamageStr = function(damageType,diceSize,numDice,modifier){
		var diceAvg = (diceSize/2.0) + 0.5;
		var avgDamage = Math.floor(numDice * diceAvg) + modifier;
		var damageStr = avgDamage + " (" + numDice + "d" + diceSize;
		if(modifier!=0)
			damageStr = damageStr + " + "	+ modifier;
		damageStr = damageStr + ") " + damageType.toLowerCase() + " damage";
		return(damageStr);
	}

	//melee, ranged, versatile, bonus damage
	var createDescription = function(attack){
		var ability = "strength";
		if((attack.finesse || (attack.ranged && !attack.melee)) && creature.stats.abilityScoreModifiers["dexterity"] > creature.stats.abilityScoreModifiers["strength"])
			ability = "dexterity";
		var type;
		if(attack.melee && attack.ranged)
			type = "Melee or Ranged Weapon Attack:";
		else if(attack.melee)
			type = "Melee Weapon Attack:";
		else if(attack.ranged)
			type = "Ranged Weapon Attack:";
		else
			type = "Weapon Attack:";
		var toHit = creature.stats.abilityScoreModifiers[ability]
			+ creature.stats.proficiencyBonus;
		var rangeStr;
		if(attack.melee && attack.ranged)
			rangeStr = "reach " + attack.reach + " ft. or range " + attack.shortRange
				+ "/" + attack.longRange + " ft.";
		else if(attack.melee)
			rangeStr = "reach " + attack.reach + " ft.";
		else if(attack.ranged)
			rangeStr = "range " + attack.shortRange + "/" + attack.longRange + " ft.";
		var damageMod = creature.stats.abilityScoreModifiers[ability];
		var meleeDamageStr,
			rangedDamageStr,
			twoHandedDamageStr,
			bonusDamageStr;
		if(attack.melee)
			meleeDamageStr = createDamageStr(attack.damageType,attack.damageDiceSize,attack.damageDiceNum,damageMod);
		if(attack.ranged)
			rangedDamageStr = createDamageStr(attack.rangedDamageType,attack.rangedDamageDiceSize,attack.rangedDamageDiceNum,damageMod);
		if(attack.versatile)
			twoHandedDamageStr = createDamageStr(attack.twoHandedDamageType,attack.twoHandedDamageDiceSize,attack.twoHandedDamageDiceNum,damageMod);
		if(attack.bonusDamage)
			bonusDamageStr = createDamageStr(attack.bonusDamageType,attack.bonusDamageDiceSize,attack.bonusDamageDiceNum,0);
		var hitStr;
		if(attack.melee){
			hitStr = meleeDamageStr;
			if(attack.ranged){
				hitStr = hitStr + " in melee, or " + rangedDamageStr + " at range";
			}
		}
		else if(attack.ranged)
			hitStr = rangedDamageStr;
		if(attack.versatile)
			hitStr = hitStr + ", or " + twoHandedDamageStr + " if used with two "
				+ "hands to make a melee attack";
		if(attack.bonusDamage)
			hitStr = hitStr + ", plus " + bonusDamageStr;

		var description = "<i>" + type + "</i> +" + toHit + " to hit, " + rangeStr
			+ ", one creature. <i>Hit:</i> " + hitStr + ".";
		return(description);
	}

	$scope.generateAttack = function() {
		var ability = {
			name: $scope.attack.weapon,
			description: createDescription($scope.attack)
		};
		$mdDialog.hide(ability);
	}
	$scope.cancel = function() {
    $mdDialog.cancel();
  };

  $scope.searchArray = function(searchText,arrayToSearch){
		var returnedVals = [];
		if(searchText && arrayToSearch){
			var searchTextLower = searchText.toLowerCase();
			for(var i=0;i<arrayToSearch.length;i++){
				if(arrayToSearch[i].toLowerCase().indexOf(searchTextLower)!=-1)
					returnedVals.push(arrayToSearch[i]);
			}
		}
		return(returnedVals);
	}

	$scope.weapon = {
		changed: function(){
			var weapon = $scope.attack.weapon;
			if(CreatureData.weaponTypeDefaults.hasOwnProperty(weapon)){
				$scope.attack = angular.copy(CreatureData.weaponTypeDefaults[weapon]);
				$scope.attack.weapon = weapon;
			}
		}
	}
	$scope.$watch("attack.weapon",function(newValue,oldValue){
		if(oldValue!=newValue)
			$scope.weapon.changed();
	},true);
};

var generateSpellcastingCtrl = function ($scope,creature,CreatureData,$mdDialog) {

	$scope.creatureData = CreatureData;

	$scope.spellcasting = (function(){
		return {
			type: 'Innate',	//wizard, cleric, innate, etc
			ability: 'intelligence',
			level: 1,				//1-20
			spells: [
				{
					name: ""
				}
			],
			nameChanged: function(spell){
				var add = false;
				console.log("name changed, spell name: "+spell.name);
				if(spell.name!="" && this.spells.length>0){
					console.log("ok 1");
					var lastSpell = this.spells[this.spells.length-1];
					console.log("last spell name: "+lastSpell.name);
					if(lastSpell.name!="")
						add = true;
				}
				if(add){
					console.log("adding");
					this.spells.push({
						name: "",
						perDay: 0
					});
				}
			}
		}
	})();

	$scope.generateSpellcasting = function() {
		var ability = {
			name: "Spellcasting",
			description: "Spellcasting description"
		};
		$mdDialog.hide(ability);
	}
	$scope.cancel = function() {
    $mdDialog.cancel();
  };

  $scope.searchArray = function(searchText,arrayToSearch){
		var returnedVals = [];
		if(searchText && arrayToSearch){
			var searchTextLower = searchText.toLowerCase();
			for(var i=0;i<arrayToSearch.length;i++){
				if(arrayToSearch[i].toLowerCase().indexOf(searchTextLower)!=-1)
					returnedVals.push(arrayToSearch[i]);
			}
		}
		return(returnedVals);
	}
};
