
angular.module('myApp').factory("CreatureData", function($resource) {

	var CreatureData = {};

	CreatureData.sizes = //import must be on its own line
		@import "../../data/creatureSizes.json";
	CreatureData.sizeNames = Object.keys(CreatureData.sizes);
	CreatureData.races = //import must be on its own line
		@import "../../data/races.json";
	CreatureData.alignments = //import must be on its own line
		@import "../../data/alignments.json";
	CreatureData.abilities = //import must be on its own line
		@import "../../data/abilities.json";
	CreatureData.skills = //import must be on its own line
		@import "../../data/skills.json";
	CreatureData.skillNames = Object.keys(CreatureData.skills);
	CreatureData.damageTypes = //import must be on its own line
		@import "../../data/damageTypes.json";
	CreatureData.senses = [];
	CreatureData.languages = //import must be on its own line
		@import "../../data/languages.json";
	CreatureData.conditions = //import must be on its own line
		@import "../../data/conditions.json";
	CreatureData.negativeConditions = Object.keys(CreatureData.conditions).filter(function(conditionName) {return CreatureData.conditions[conditionName].negative});
	CreatureData.attackTypes = //import must be on its own line
		@import "../../data/attackTypes.json";
	CreatureData.experienceByCR = //import must be on its own line
		@import "../../data/experienceByCR.json";
	CreatureData.raceDefaults =  //import must be on its own line
		@import "../../data/raceDefaults.json";
	CreatureData.armorTypeDefaults =  //import must be on its own line
		@import "../../data/armorTypeDefaults.json";
	CreatureData.weaponTypeDefaults =  //import must be on its own line
		@import "../../data/weaponTypeDefaults.json";
	CreatureData.spellcasters =
		@import "../../data/spellcasters.json";
	CreatureData.spellcasterTypes = Object.keys(CreatureData.spellcasters);
	CreatureData.spells = //import must be on its own line
		@import "../../data/spells.json";
	CreatureData.creatureAbilities = //import must be on its own line
		@import "../../data/creatureAbilities.json";
	CreatureData.challengeRating = //import must be on its own line
		@import "../../data/challengeRating.json";

	//populate challengeRating list based on data
	CreatureData.challengeRatingArray = [];
	for (var challengeRating in CreatureData.challengeRating){
		if(CreatureData.challengeRating.hasOwnProperty(challengeRating)){
			CreatureData.challengeRatingArray.push(CreatureData.challengeRating[challengeRating]);
		}
	}

	//populate armor types list based on data
	CreatureData.armorTypes = [];
	for (var armorType in CreatureData.armorTypeDefaults){
		if(CreatureData.armorTypeDefaults.hasOwnProperty(armorType)){
			CreatureData.armorTypes.push(armorType);
		}
	}
	//populate weapon types list based on data
	CreatureData.weaponTypes = [];
	for (var weaponType in CreatureData.weaponTypeDefaults){
		if(CreatureData.weaponTypeDefaults.hasOwnProperty(weaponType)){
			CreatureData.weaponTypes.push(weaponType);
		}
	}
  return CreatureData;
});
