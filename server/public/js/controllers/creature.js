


var creatureCtrl = function($scope,creature,Creature) {
	$scope.creature = creature;

	$scope.creatureData = {
		sizes: ["Fine","Diminutive","Tiny","Small","Medium","Large","Huge","Gargantuan","Colossal","Colossal+"],
		races: ["Human","Dwarf","Elf","Halfling","Gnome","Dragonborn","Undead","Beast","Elemental","Ooze","Giant","Construct"],
		alignments: ["Unaligned","Lawful Good","Lawful Neutral","Lawful Evil","Neutral Good","Neutral","Neutral Evil","Chaotic Good","Chaotic Neutral","Chaotic Evil"],
		armorTypes: ["Natural Armor","Padded","Leather","Studded leather","Hide","Chain shirt","Scale mail","Breastplate","Half plate","Ring mail","Chain mail","Splint","Plate"],
		abilities: ["strength","dexterity","constitution","intelligence","wisdom","charisma"],
		skills: ["Acrobatics","Animal Handling","Arcana","Athletics","Deception","History","Insight","Intimidation","Investigation","Medicine","Nature","Perception","Performance","Persuasion","Religion","Sleight of Hand","Stealth","Survival"],
		damageTypes: ["Slashing","Piercing","Bludgeoning","Acid","Fire","Cold","Poison","Necrotic","Radiant","Lightning","Psychic","Thunder","Force"],
		languages: ["Common","Dwarvish","Elvish","Giant","Gnomish","Goblin","Halfling","Orc","Abyssal","Celestial","Draconic","Deep Speech","Infernal","Primordial","Sylvan","Undercommon"],
		negativeConditions: ["Blinded","Charmed","Deafened","Encumbered","Exhaustion","Frightened","Intoxicated","Paralyzed","Poisoned","Prone","Restrained","Stunned","Unconscious"],
		experienceByCR: {'0': 10,'0.125': 25,'0.25': 50,'0.5': 100,'1': 200,'2': 450,'3': 700,'4': 1100,'5': 1800,'6': 2300,'7': 2900,'8': 3900,'9': 5000,'10': 5900,'11': 7200,'12': 8400,'13': 10000,'14': 11500,'15': 13000,'16': 15000,'17': 18000,'18': 20000,'19': 22000,'20': 25000,'21': 33000,'22': 41000,'23': 50000,'24': 62000,'25': 75000,'26': 90000,'27': 105000,'28': 120000,'29': 135000,'30': 155000},
		search: function(searchText,arrayToSearch){
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

	$scope.challengeRating = {
		step: 0.25,
		changed: function(){
			if($scope.creature.stats && $scope.creature.stats.challengeRating){
				//set new step
				if($scope.creature.stats.challengeRating>1)
					$scope.challengeRating.step = 1;
				else
					$scope.challengeRating.step = 0.25;
				//fix up issues caused by dynamic step value
				if($scope.creature.stats.challengeRating==1.25)
					$scope.creature.stats.challengeRating = 2;
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
		}
	};


	$scope.$watch("creature",function(newValue,oldValue){
		Creature.calculateCreatureDetails($scope.creature);
	},true);
}

var defaultCreature = {
	flavor: {},
	stats: {
		damageVulnerabilities: [],
		damageResistances: [],
		damageImmunities: [],
		conditionImmunities: [],
		senses: [],
		languages: [],
		additionalAbilities: [],
		actions: [],
		reactions: []
	}
}

//don't load controller until we've gotten the data from the server
creatureCtrl.resolve = {
			creature: function(Creature, $q, $route){
				if($route.current.params.creatureId){
					var deferred = $q.defer();
					Creature.get($route.current.params.creatureId,function(data) {
						deferred.resolve(data);
					}, function(errorData) {
						deferred.reject();
					});
					return deferred.promise;
				}
				else
					return defaultCreature;
			}
		}

angular.module('myApp').controller('creatureCtrl',creatureCtrl);