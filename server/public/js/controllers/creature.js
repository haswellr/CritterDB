
var creatureCtrl = function($scope,creature,Creature,$routeParams,Bestiary,$location,CreatureData,$mdMedia,$mdDialog,CreatureAPI) {
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
    		$scope.creature.stats.actions.splice(0,0,result);
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
    		$scope.creature.stats.additionalAbilities.splice(0,0,result);
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
		reactions: [],
		legendaryActions: []
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

	$scope.spellLevels = [];
	var initializeSpellLevelArray = function(){
		for(var i=0;i<=9;i++){
			$scope.spellLevels.push(i);
		}
	}
	initializeSpellLevelArray();
	$scope.getSpellLevelText = function(level){
		if(level==0)
			return("Cantrips");
		else
			return("Level "+level+" spells");
	}

	$scope.spellcasting = (function(){
		return {
			type: 'Innate',	//wizard, cleric, innate, etc
			ability: 'charisma',
			level: 1,				//1-20
			components: {
				material: false,
				somatic: true,
				verbal: true
			},
			spells: {
				level0: [],
				level1: [],
				level2: [],
				level3: [],
				level4: [],
				level5: [],
				level6: [],
				level7: [],
				level8: [],
				level9: [],
				atWill: [],
				perDay3: [],
				perDay2: [],
				perDay1: []
			},
			getHighestSpellSlotLevel: function(){
				if(this.type){
					var spellcaster = CreatureData.spellcasters[this.type];
					if(this.level){
						var spellSlots = spellcaster.level[this.level].spellSlots;
						return(spellSlots.length);
					}
					else{
						return 0;
					}
				}
				else {
					return 0;
				}
			},
			hasSpellSlotsOfLevel: function(level){
				if(this.type){
					var spellcaster = CreatureData.spellcasters[this.type];
					if(level==0)
						return true;
					else if(this.level){
						var spellSlots = spellcaster.level[this.level].spellSlots;
						if(spellSlots.hasOwnProperty(level-1) && spellSlots[level-1]!=0)
							return true;
					}
					else {
						return false;
					}
				}
				else{
					return false;
				}
			},
			typeChanged: function(){
				var spellcaster = CreatureData.spellcasters[this.type];
				if(spellcaster){
					if(spellcaster.ability){
						this.ability = spellcaster.ability;
					}
					if(spellcaster.components){
						this.components = angular.copy(spellcaster.components);
					}
				}
			},
			getSaveDC: function(creature){
				var dc = 8 +
					creature.stats.proficiencyBonus +
					creature.stats.abilityScoreModifiers[this.ability];
				return(dc);
			},
			getSpellAttackBonus: function(creature){
				var bonus = creature.stats.proficiencyBonus +
					creature.stats.abilityScoreModifiers[this.ability];
				return(bonus);
			}
		}
	})();
	$scope.$watch("spellcasting.type",function(newValue,oldValue){
		if(oldValue!=newValue)
			$scope.spellcasting.typeChanged();
	},true);

	var generateStatsText = function(){
		var text = "(spell save DC " +
			$scope.spellcasting.getSaveDC(creature) +
			", +" +
			$scope.spellcasting.getSpellAttackBonus(creature) +
			" to hit with spell attacks)";
		return(text);
	}

	var generateComponentText = function(){
		var text = "";
		var requiredComponents = [];
		var notRequiredComponents = [];
		for(var key in $scope.spellcasting.components){
			if($scope.spellcasting.components.hasOwnProperty(key)){
				var componentType = $scope.spellcasting.components[key];
				if(componentType)
					requiredComponents.push(key);
				else
					notRequiredComponents.push(key);
			}
		}
		if(requiredComponents.length<3){
			if($scope.spellcasting.type=="Innate"){
				text = text + ", requiring ";
				if(notRequiredComponents.length==1){
					text = text + "no " +
						notRequiredComponents[0] +
						" components";
				}
				else if(notRequiredComponents.length==2){
					text = text + "only " +
						requiredComponents[0] +
						" components";
				}
				else{
					text = text +"no components";
				}
			}
			else{
				text = getNameAsIt(true) + " requires ";
				if(notRequiredComponents.length==1){
					text = text + "no " +
						notRequiredComponents[0] +
						" components to cast its spells";
				}
				else if(notRequiredComponents.length==2){
					text = text + "only " +
						requiredComponents[0] +
						" components to cast its spells";
				}
				else{
					text = text +"no components to cast its spells";
				}
				text = text + ". ";
			}
		}
		return(text);
	}

	var generateSpellLine = function(type,spells){
		var text = type + ": ";
		for(var i=0;i<spells.length;i++){
			var spell = spells[i];
			text = text + "<i>" + spell.toLowerCase() + "</i>";
			if(i<(spells.length-1))
				text = text + ", ";
		}
		return(text);
	}

	function getOrdinal(n) {
	  var s=["th","st","nd","rd"],
	      v=n%100;
	  return n+(s[(v-20)%10]||s[v]||s[0]);
	}

	var generateSpellBlock = function(){
		var text = "";
		var tryAddLine = function(title,levelStr,level){
			var spellcasterData = CreatureData.spellcasters[$scope.spellcasting.type];
			var slots = undefined;
			if(level && spellcasterData.hasOwnProperty("level")){
				var dataByLevel = spellcasterData["level"];
				if(dataByLevel.hasOwnProperty($scope.spellcasting.level)){
					var slotsByLevel = dataByLevel[$scope.spellcasting.level].spellSlots;
					if(slotsByLevel){
						slots = slotsByLevel[level-1];
					}
				}
			}
			if($scope.spellcasting.spells[levelStr].length>0 && (slots==undefined || slots>0)){
				if(slots>0){
					title = title + " ("+ slots +" slots)";
				}
				text = text +
					generateSpellLine(title,$scope.spellcasting.spells[levelStr]) +
					"\n";
			}
		}
		if($scope.spellcasting.type=="Innate"){
			tryAddLine("At will","atWill");
			tryAddLine("3/day","perDay3");
			tryAddLine("2/day","perDay2");
			tryAddLine("1/day","perDay1");
		}
		else{
			var slots = 0;
			tryAddLine("Cantrip (at will)","level0");
			for(var i=1;i<=9;i++){
				var title = getOrdinal(i);
				tryAddLine(getOrdinal(i)+" level","level"+i,i);
			}
		}
		if(text[text.length-1]=='\n')
			text = text.substring(0,text.length-1);	//cut off the ending newline
		return(text);
	}

	var getNameAsProperNoun = function(){
		if(creature.flavor.nameIsProper)
			return(creature.name);
		else
			return("The " + creature.name.toLowerCase());
	}

	//not sure what to call this function, but it determines when to call
	//	a creature "it" or by its full name like "King George".
	var getNameAsIt = function(capitalize){
		if(creature.flavor.nameIsProper)
			return(creature.name);
		else if(capitalize)
			return("It");
		else
			return("it");
	}

	var getPossessive = function(name){
		if(name.toLowerCase() == "it")
			return (name + "s");
		else
			return (name + "'s");		//just keeping things simple
	}

	var generateInnateDescription = function(){
		var abilityStr = $scope.spellcasting.ability.charAt(0).toUpperCase() +  $scope.spellcasting.ability.slice(1).toLowerCase();
		var text = getPossessive(getNameAsProperNoun()) + " innate spellcasting ability is " +
			abilityStr + " " + generateStatsText() + ". " + getNameAsIt(true) + " can " +
			"innately cast the following spells" + generateComponentText() +
			":\n\n" + generateSpellBlock();
		return(text);
	}

	var generateClassDescription = function(){
		var abilityStr = $scope.spellcasting.ability.charAt(0).toUpperCase() +  $scope.spellcasting.ability.slice(1).toLowerCase();
		var levelStr = getOrdinal($scope.spellcasting.level)+"-level";
		var classStr = $scope.spellcasting.type.toLowerCase();
		var text = getNameAsProperNoun() + " is a " + levelStr + " spellcaster. " + getPossessive(getNameAsIt(true)) +
			" spellcasting ability is " + abilityStr + " " + generateStatsText() +
			". " + generateComponentText() + getNameAsProperNoun() + " has the following " +
			classStr + " spells prepared:\n\n" + generateSpellBlock();
		return(text);
	}

	var generateDescription = function(){
		if($scope.spellcasting.type=='Innate')
			return(generateInnateDescription());
		else
			return(generateClassDescription());
	}

	var generateTitle = function(){
		if($scope.spellcasting.type=='Innate')
			return("Innate Spellcasting");
		else
			return("Spellcasting");
	}

	$scope.generateSpellcasting = function() {
		var ability = {
			name: generateTitle(),
			description: generateDescription()
		};
		$mdDialog.hide(ability);
	}
	$scope.cancel = function() {
    $mdDialog.cancel();
  };

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
	};

	$scope.searchSpellNames = function(searchText,level){
		var returnedVals = [];
		if(searchText){
			var searchTextLower = searchText.toLowerCase();
			var classLower = ($scope.spellcasting.type!='Innate' ? $scope.spellcasting.type.toLowerCase() : null);
			for(var i=0;i<CreatureData.spells.length;i++){
				var spell = CreatureData.spells[i];
				var matchesLevel = (level==undefined || level==null || spell.level==level || (level==0 && spell.level.toLowerCase()=="cantrip"));
				var matchesClass = (classLower==undefined || classLower==null || spell.tags.indexOf(classLower)!=-1);
				var matchesName = (spell.name.toLowerCase().indexOf(searchTextLower)!=-1);
				var school = spell[school] || "";
				var matchesSchool = (school.toLowerCase().indexOf(searchTextLower)!=-1);
				if(matchesLevel && matchesClass && (matchesName || matchesSchool))
					returnedVals.push(spell.name);
			}
		}
		returnedVals.push(searchText);
		return(returnedVals);
	};
};
