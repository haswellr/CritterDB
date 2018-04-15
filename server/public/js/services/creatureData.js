
angular.module('myApp').factory("CreatureData", function($resource) {

	var CreatureData = {};

	CreatureData.sizes = ["Fine","Diminutive","Tiny","Small","Medium","Large",
		"Huge","Gargantuan","Colossal","Colossal+"];
	CreatureData.races = ["Dwarf","Hill Dwarf","Elf","High Elf","Halfling",
		"Lightfoot Halfling","Human","Dragonborn","Gnome","Half-Elf","Half-Orc",
		"Tiefling","Abberation","Beast","Celestial","Construct","Dragon",
		"Elemental","Fey","Fiend","Giant","Humanoid","Monstrosity","Ooze","Plant",
		"Undead"];
	CreatureData.alignments = ["Unaligned","Any Alignment","Lawful Good","Lawful Neutral",
		"Lawful Evil","Neutral Good","Neutral","Neutral Evil","Chaotic Good",
		"Chaotic Neutral","Chaotic Evil"];
	CreatureData.abilities = ["strength","dexterity","constitution",
		"intelligence","wisdom","charisma"];
	CreatureData.skills = ["Acrobatics","Animal Handling","Arcana","Athletics",
		"Deception","History","Insight","Intimidation","Investigation","Medicine",
		"Nature","Perception","Performance","Persuasion","Religion",
		"Sleight of Hand","Stealth","Survival"];
	CreatureData.damageTypes = ["Slashing","Piercing","Bludgeoning","Acid","Fire",
		"Cold","Poison","Necrotic","Radiant","Lightning","Psychic","Thunder",
		"Force"];
	CreatureData.senses = [];
	CreatureData.languages = ["Common","Dwarvish","Elvish","Giant","Gnomish",
		"Goblin","Halfling","Orc","Abyssal","Celestial","Draconic","Deep Speech",
		"Infernal","Primordial","Auran","Aquan","Ignan","Terran","Sylvan","Undercommon"];
	CreatureData.negativeConditions = ["Blinded","Charmed","Deafened",
		"Encumbered","Exhaustion","Frightened","Grappled","Intoxicated","Paralyzed","Petrified",
		"Poisoned","Prone","Restrained","Stunned","Unconscious"];
	CreatureData.attackTypes = ["Melee Weapon Attack","Ranged Weapon Attack",
		"Melee or Ranged Weapon Attack","Melee Spell Attack","Ranged Spell Attack"];
	CreatureData.experienceByCR = {'0': 10,'0.125': 25,'0.25': 50,'0.5': 100,
		'1': 200,'2': 450,'3': 700,'4': 1100,'5': 1800,'6': 2300,'7': 2900,
		'8': 3900,'9': 5000,'10': 5900,'11': 7200,'12': 8400,'13': 10000,
		'14': 11500,'15': 13000,'16': 15000,'17': 18000,'18': 20000,'19': 22000,
		'20': 25000,'21': 33000,'22': 41000,'23': 50000,'24': 62000,'25': 75000,
		'26': 90000,'27': 105000,'28': 120000,'29': 135000,'30': 155000};
	CreatureData.hitDieSizeBySize = {
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

//melee
//ranged
//finesse
//versatile
//damageType, damageDiceNum, damageDiceSize
//rangedDamageType, etc
//shortRange,longRange
//twoHandedDamageType, etc
  return CreatureData;
});
