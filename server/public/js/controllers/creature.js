angular.module('myApp').factory("Creature", function($resource) {
  return $resource("/api/creatures/:id");
});

var creatureCtrl = angular.module('myApp').controller('creatureCtrl', function ($scope, creature, $routeParams, $sce) {
	$scope.creature = creature;

	var hitDieSize = {
		"Fine": 4,
		"Diminutive": 4,
		"Tiny": 4,
		"Small": 6,
		"Medium": 8,
		"Large": 10,
		"Huge": 12,
		"Gargantuan": 20,
		"Colossal": 20,
		"Colossal+": 20
	};

	var shortFormAbilities = {
		"strength": "Str",
		"dexterity": "Dex",
		"constitution": "Con",
		"intelligence": "Int",
		"wisdom": "Wis",
		"charisma": "Cha"
	};

	var skillAbilities = {
		"Acrobatics": "dexterity",
		"Animal Handling": "wisdom",
		"Arcana": "intelligence",
		"Athletics": "strength",
		"Deception": "charisma",
		"History": "intelligence",
		"Insight": "wisdom",
		"Intimidation": "charisma",
		"Investigation": "intelligence",
		"Medicine": "wisdom",
		"Nature": "intelligence",
		"Perception": "wisdom",
		"Performance": "charisma",
		"Persuasion": "charisma",
		"Religion": "intelligence",
		"Sleight of Hand": "dexterity",
		"Stealth": "dexterity",
		"Survival": "wisdom"
	};

	var getAbilityModifier = function(abilityScore){
		return(Math.floor((abilityScore - 10.0)/2.0));
	}

	var fillInCreatureDetails = function(creature){
		//displayed armor type
		if(creature.stats.armorType=="")
			creature.stats.armorTypeStr = "";
		else
			creature.stats.armorTypeStr = "("+creature.stats.armorType+")";
		//ability modifiers
		creature.stats.abilityScoreModifiers = {};
		creature.stats.abilityScoreStrs = {};
		for(var key in creature.stats.abilityScores){
			if(creature.stats.abilityScores.hasOwnProperty(key)){
				creature.stats.abilityScoreModifiers[key] = getAbilityModifier(creature.stats.abilityScores[key]);
				var sign = "+";
				if(creature.stats.abilityScoreModifiers[key]<0)
					sign = "–";
				creature.stats.abilityScoreStrs[key] = creature.stats.abilityScores[key]+" ("+sign+Math.abs(creature.stats.abilityScoreModifiers[key])+")";
			}
		}
		//hit points
		creature.stats.hitDieSize = hitDieSize[creature.stats.size];
		creature.stats.extraHealthFromConstitution = creature.stats.abilityScoreModifiers["constitution"] * creature.stats.numHitDie;
		creature.stats.hitPoints = Math.floor(creature.stats.numHitDie * ((creature.stats.hitDieSize/2.0) + 0.5 + creature.stats.abilityScoreModifiers["constitution"]));
		//make ability descriptions html safe so we can use italics and other markup
		for(var index in creature.stats.additionalAbilities){
			var ability = creature.stats.additionalAbilities[index];
			ability.descriptionHtml = $sce.trustAsHtml(ability.description);
		}
		for(var index in creature.stats.actions){
			var ability = creature.stats.actions[index];
			ability.descriptionHtml = $sce.trustAsHtml(ability.description);
		}
		for(var index in creature.stats.reactions){
			var ability = creature.stats.reactions[index];
			ability.descriptionHtml = $sce.trustAsHtml(ability.description);
		}
		//saving throws
		for(var index in creature.stats.savingThrows){
			var savingThrow = creature.stats.savingThrows[index];
			var mod = creature.stats.abilityScoreModifiers[savingThrow.ability];
			if(savingThrow.value)
				mod = savingThrow.value;
			else if(savingThrow.proficient)
				mod = mod + creature.stats.proficiencyBonus;
			savingThrow.modifier = mod;
			var sign = "+";
				if(mod<0)
					sign = "–";
			savingThrow.modifierStr = shortFormAbilities[savingThrow.ability]+" "+sign+Math.abs(mod);
		}
		//skills
		for(var index in creature.stats.skills){
			var skill = creature.stats.skills[index];
			var ability = skillAbilities[skill.name];
			var mod = creature.stats.abilityScoreModifiers[ability];
			if(skill.value)
				mod = skill.value;
			else if(skill.proficient)
				mod = mod + creature.stats.proficiencyBonus;
			skill.modifier = mod;
			var sign = "+";
				if(mod<0)
					sign = "–";
			skill.modifierStr = skill.name+" "+sign+Math.abs(mod);
		}
	}

	fillInCreatureDetails($scope.creature);

});

//don't load controll until we've gotten the creature from the server
creatureCtrl.resolve = {
			creature: function(Creature, $q, $route){
				var deferred = $q.defer();
				Creature.get({id:$route.current.params.creatureId},function(data) {
					deferred.resolve(data);
				}, function(errorData) {
					deferred.reject();
				});
				return deferred.promise;
			}
		}
