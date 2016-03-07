angular.module('myApp').factory("CreatureData", function() {

	var CreatureData = {};

	CreatureData.sizes = ["Fine","Diminutive","Tiny","Small","Medium","Large",
		"Huge","Gargantuan","Colossal","Colossal+"];
	CreatureData.races = ["Dwarf","Hill Dwarf","Mountain Dwarf","Duergar","Elf",
		"Drow","High Elf","Wood Elf","Halfling","Lightfoot Halfling",
		"Stout Halfling","Human","Abberation","Beast","Celestial","Construct",
		"Dragon","Elemental","Fey","Fiend","Giant","Humanoid","Monstrosity","Ooze",
		"Plant","Undead"];
	CreatureData.alignments = ["Unaligned","Lawful Good","Lawful Neutral",
		"Lawful Evil","Neutral Good","Neutral","Neutral Evil","Chaotic Good",
		"Chaotic Neutral","Chaotic Evil"];
	CreatureData.armorTypes = ["Natural Armor","Padded","Leather",
		"Studded leather","Hide","Chain shirt","Scale mail","Breastplate",
		"Half plate","Ring mail","Chain mail","Splint","Plate"];
	CreatureData.abilities = ["strength","dexterity","constitution",
		"intelligence","wisdom","charisma"];
	CreatureData.skills = ["Acrobatics","Animal Handling","Arcana","Athletics",
		"Deception","History","Insight","Intimidation","Investigation","Medicine",
		"Nature","Perception","Performance","Persuasion","Religion",
		"Sleight of Hand","Stealth","Survival"];
	CreatureData.damageTypes = ["Slashing","Piercing","Bludgeoning","Acid","Fire",
		"Cold","Poison","Necrotic","Radiant","Lightning","Psychic","Thunder",
		"Force"];
	CreatureData.languages = ["Common","Dwarvish","Elvish","Giant","Gnomish",
		"Goblin","Halfling","Orc","Abyssal","Celestial","Draconic","Deep Speech",
		"Infernal","Primordial","Sylvan","Undercommon"];
	CreatureData.negativeConditions = ["Blinded","Charmed","Deafened",
		"Encumbered","Exhaustion","Frightened","Intoxicated","Paralyzed","Poisoned",
		"Prone","Restrained","Stunned","Unconscious"];
	CreatureData.experienceByCR = {'0.0': 10,'0.125': 25,'0.25': 50,'0.5': 100,
		'1': 200,'2': 450,'3': 700,'4': 1100,'5': 1800,'6': 2300,'7': 2900,
		'8': 3900,'9': 5000,'10': 5900,'11': 7200,'12': 8400,'13': 10000,
		'14': 11500,'15': 13000,'16': 15000,'17': 18000,'18': 20000,'19': 22000,
		'20': 25000,'21': 33000,'22': 41000,'23': 50000,'24': 62000,'25': 75000,
		'26': 90000,'27': 105000,'28': 120000,'29': 135000,'30': 155000};
	CreatureData.raceDefaults = {
		'Dwarf': {
			size: "Medium",
			speed: "25 ft.",
			senses: ["Darkvision 60ft."],
			languages: ["Common","Dwarvish"]
		},
		'Hill Dwarf': {
			size: "Medium",
			speed: "25 ft.",
			senses: ["Darkvision 60ft."],
			languages: ["Common","Dwarvish"]
		},
		'Mountain Dwarf': {
			size: "Medium",
			speed: "25 ft.",
			senses: ["Darkvision 60ft."],
			languages: ["Common","Dwarvish"]
		},
		'Duergar': {
			size: "Medium",
			speed: "25 ft.",
			senses: ["Darkvision 60ft."],
			languages: ["Common","Dwarvish"]
		},
		'Elf': {
			size: "Medium",
			speed: "30 ft.",
			senses: ["Darkvision 60ft."],
			languages: ["Common","Elvish"]
		},
		'Drow': {
			size: "Medium",
			speed: "30 ft.",
			senses: ["Darkvision 60ft."],
			languages: ["Common","Elvish"]
		},
		'High Elf': {
			size: "Medium",
			speed: "30 ft.",
			senses: ["Darkvision 60ft."],
			languages: ["Common","Elvish"]
		},
		'Wood Elf': {
			size: "Medium",
			speed: "36 ft.",
			senses: ["Darkvision 60ft."],
			languages: ["Common","Elvish"]
		},
		'Halfing': {
			size: "Small",
			speed: "25 ft.",
			senses: [],
			languages: ["Common","Halfling"]
		},
		'Lightfoot Halfling': {
			size: "Small",
			speed: "25 ft.",
			senses: [],
			languages: ["Common","Halfling"]
		},
		'Stout Halfling': {
			size: "Small",
			speed: "25 ft.",
			senses: [],
			languages: ["Common","Halfling"]
		},
		'Human': {
			size: "Medium",
			speed: "30 ft.",
			senses: [],
			languages: ["Common"]
		}
	};
	CreatureData.armorTypeDefaults = {
		'Padded': {
			ac: 11,
			maxDex: -1
		},
		'Leather': {
			ac: 11,
			maxDex: -1
		},
		'Studded leather': {
			ac: 12,
			maxDex: -1
		},
		'Hide': {
			ac: 12,
			maxDex: 2
		},
		'Chain shirt': {
			ac: 13,
			maxDex: 2
		},
		'Scale mail': {
			ac: 14,
			maxDex: 2
		},
		'Breastplate': {
			ac: 14,
			maxDex: 2
		},
		'Half plate': {
			ac: 15,
			maxDex: 2
		},
		'Ring mail': {
			ac: 14,
			maxDex: 0
		},
		'Chain mail': {
			ac: 16,
			maxDex: 0
		},
		'Splint': {
			ac: 17,
			maxDex: 0
		},
		'Plate': {
			ac: 18,
			maxDex: 0
		}
	}

  return CreatureData;
});
