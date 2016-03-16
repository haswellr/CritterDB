angular.module('myApp').factory("CreatureData", function() {

	var CreatureData = {};

	CreatureData.sizes = ["Fine","Diminutive","Tiny","Small","Medium","Large",
		"Huge","Gargantuan","Colossal","Colossal+"];
	CreatureData.races = ["Dwarf","Hill Dwarf","Elf","High Elf","Halfling",
		"Lightfoot Halfling","Human","Dragonborn","Gnome","Half-Elf","Half-Orc",
		"Tiefling","Abberation","Beast","Celestial","Construct","Dragon",
		"Elemental","Fey","Fiend","Giant","Humanoid","Monstrosity","Ooze","Plant",
		"Undead"];
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
	CreatureData.weaponTypes = ["Club","Dagger","Greatclub","Handaxe","Javelin",
		"Light hammer","Mace","Quarterstaff","Sickle","Spear","Crossbow, light",
		"Dart","Shortbow","Sling","Battleaxe","Flail","Glaive","Greataxe",
		"Greatsword","Halberd","Lance","Longsword","Maul","Morningstar","Pike",
		"Rapier","Scimitar","Shortsword","Trident","War pick","Warhammer","Whip",
		"Blowgun","Crossbow, hand","Crossbow, heavy","Longbow","Net"];
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
		'Elf': {
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
		'Halfling': {
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
		'Human': {
			size: "Medium",
			speed: "30 ft.",
			senses: [],
			languages: ["Common"]
		},
		'Dragonborn': {
			size: "Medium",
			speed: "30 ft.",
			senses: [],
			languages: ["Common","Draconic"]
		},
		'Gnome': {
			size: "Small",
			speed: "25 ft.",
			senses: ["Darkvision 60ft."],
			languages: ["Common","Gnomish"]
		},
		'Half-Elf': {
			size: "Medium",
			speed: "30 ft.",
			senses: ["Darkvision 60ft."],
			languages: ["Common","Elvish"]
		},
		'Half-Orc': {
			size: "Medium",
			speed: "30 ft.",
			senses: ["Darkvision 60ft."],
			languages: ["Common","Orc"]
		},
		'Tiefling': {
			size: "Medium",
			speed: "30 ft.",
			senses: ["Darkvision 60ft."],
			languages: ["Common","Infernal"]
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
	};
	CreatureData.weaponTypeDefaults = {
		'Club': {
			melee: true,
			reach: 5,
			damageType: "Bludgeoning",
			damageDiceNum: 1,
			damageDiceSize: 4
		},
		'Dagger': {
			melee: true,
			reach: 5,
			finesse: true,
			ranged: true,
			shortRange: 20,
			longRange: 60,
			damageType: "Piercing",
			damageDiceNum: 1,
			damageDiceSize: 4,
			rangedDamageType: "Piercing",
			rangedDamageDiceNum: 1,
			rangedDamageDiceSize: 4
		},
		'Greatclub': {
			melee: true,
			reach: 5,
			damageType: "Bludgeoning",
			damageDiceNum: 1,
			damageDiceSize: 8
		},
		'Handaxe': {
			melee: true,
			reach: 5,
			ranged: true,
			shortRange: 20,
			longRange: 60,
			damageType: "Slashing",
			damageDiceNum: 1,
			damageDiceSize: 6,
			rangedDamageType: "Slashing",
			rangedDamageDiceNum: 1,
			rangedDamageDiceSize: 6
		},
		'Javelin': {
			melee: true,
			reach: 5,
			ranged: true,
			shortRange: 30,
			longRange: 120,
			damageType: "Piercing",
			damageDiceNum: 1,
			damageDiceSize: 6,
			rangedDamageType: "Piercing",
			rangedDamageDiceNum: 1,
			rangedDamageDiceSize: 6
		},
		'Light hammer': {
			melee: true,
			reach: 5,
			ranged: true,
			shortRange: 20,
			longRange: 60,
			damageType: "Bludgeoning",
			damageDiceNum: 1,
			damageDiceSize: 4,
			rangedDamageType: "Bludgeoning",
			rangedDamageDiceNum: 1,
			rangedDamageDiceSize: 4
		},
		'Mace': {
			melee: true,
			reach: 5,
			damageType: "Bludgeoning",
			damageDiceNum: 1,
			damageDiceSize: 6
		},
		'Quarterstaff': {
			melee: true,
			reach: 5,
			veratile: true,
			damageType: "Bludgeoning",
			damageDiceNum: 1,
			damageDiceSize: 6,
			twoHandedDamageType: "Bludgeoning",
			twoHandedDamageDiceNum: 1,
			twoHandedDamageDiceSize: 8
		},
		'Sickle': {
			melee: true,
			reach: 5,
			damageType: "Slashing",
			damageDiceNum: 1,
			damageDiceSize: 4
		},
		'Spear': {
			melee: true,
			reach: 5,
			ranged: true,
			shortRange: 20,
			longRange: 60,
			versatile: true,
			damageType: "Piercing",
			damageDiceNum: 1,
			damageDiceSize: 6,
			rangedDamageType: "Piercing",
			rangedDamageDiceNum: 1,
			rangedDamageDiceSize: 6,
			twoHandedDamageType: "Piercing",
			twoHandedDamageDiceNum: 1,
			twoHandedDamageDiceSize: 8
		},
		'Crossbow, light': {
			ranged: true,
			shortRange: 80,
			longRange: 320,
			rangedDamageType: "Piercing",
			rangedDamageDiceNum: 1,
			rangedDamageDiceSize: 8
		},
		'Dart': {
			ranged: true,
			shortRange: 20,
			longRange: 60,
			rangedDamageType: "Piercing",
			rangedDamageDiceNum: 1,
			rangedDamageDiceSize: 4
		},
		'Shortbow': {
			ranged: true,
			shortRange: 80,
			longRange: 320,
			rangedDamageType: "Piercing",
			rangedDamageDiceNum: 1,
			rangedDamageDiceSize: 6
		},
		'Sling': {
			ranged: true,
			shortRange: 30,
			longRange: 120,
			rangedDamageType: "Bludgeoning",
			rangedDamageDiceNum: 1,
			rangedDamageDiceSize: 4
		},
		'Battleaxe': {
			melee: true,
			reach: 5,
			versatile: true,
			damageType: "Slashing",
			damageDiceNum: 1,
			damageDiceSize: 8,
			twoHandedDamageType: "Slashing",
			twoHandedDamageDiceNum: 1,
			twoHandedDamageDiceSize: 10
		},
		'Flail': {
			melee: true,
			reach: 5,
			damageType: "Bludgeoning",
			damageDiceNum: 1,
			damageDiceSize: 8
		},
		'Glaive': {
			melee: true,
			reach: 10,
			damageType: "Slashing",
			damageDiceNum: 1,
			damageDiceSize: 10
		},
		'Greataxe': {
			melee: true,
			reach: 5,
			damageType: "Slashing",
			damageDiceNum: 1,
			damageDiceSize: 12
		},
		'Greatsword': {
			melee: true,
			reach: 5,
			damageType: "Slashing",
			damageDiceNum: 2,
			damageDiceSize: 6
		},
		'Halberd': {
			melee: true,
			reach: 10,
			damageType: "Slashing",
			damageDiceNum: 1,
			damageDiceSize: 10
		},
		'Longsword': {
			melee: true,
			reach: 5,
			versatile: true,
			damageType: "Slashing",
			damageDiceNum: 1,
			damageDiceSize: 8,
			twoHandedDamageType: "Slashing",
			twoHandedDamageDiceNum: 1,
			twoHandedDamageDiceSize: 10
		},
		'Maul': {
			melee: true,
			reach: 5,
			damageType: "Bludgeoning",
			damageDiceNum: 2,
			damageDiceSize: 6
		},
		'Morningstar': {
			melee: true,
			reach: 5,
			damageType: "Piercing",
			damageDiceNum: 1,
			damageDiceSize: 8
		},
		'Pike': {
			melee: true,
			reach: 10,
			damageType: "Piercing",
			damageDiceNum: 1,
			damageDiceSize: 10
		},
		'Rapier': {
			melee: true,
			reach: 5,
			finesse: true,
			damageType: "Piercing",
			damageDiceNum: 1,
			damageDiceSize: 8
		},
		'Scimitar': {
			melee: true,
			reach: 5,
			finesse: true,
			damageType: "Slashing",
			damageDiceNum: 1,
			damageDiceSize: 6
		},
		'Shortsword': {
			melee: true,
			reach: 5,
			finesse: true,
			damageType: "Piercing",
			damageDiceNum: 1,
			damageDiceSize: 6
		},
		'Trident': {
			melee: true,
			reach: 5,
			ranged: true,
			shortRange: 20,
			longRange: 60,
			versatile: true,
			damageType: "Piercing",
			damageDiceNum: 1,
			damageDiceSize: 6,
			rangedDamageType: "Piercing",
			rangedDamageDiceNum: 1,
			rangedDamageDiceSize: 6,
			twoHandedDamageType: "Piercing",
			twoHandedDamageDiceNum: 1,
			twoHandedDamageDiceSize: 8
		},
		'War pick': {
			melee: true,
			reach: 5,
			damageType: "Piercing",
			damageDiceNum: 1,
			damageDiceSize: 8
		},
		'Warhammer': {
			melee: true,
			reach: 5,
			versatile: true,
			damageType: "Bludgeoning",
			damageDiceNum: 1,
			damageDiceSize: 8,
			twoHandedDamageType: "Bludgeoning",
			twoHandedDamageDiceNum: 1,
			twoHandedDamageDiceSize: 10
		},
		'Whip': {
			melee: true,
			reach: 10,
			finesse: true,
			damageType: "Slashing",
			damageDiceNum: 1,
			damageDiceSize: 4
		},
		'Blowgun': {
			ranged: true,
			shortRange: 25,
			longRange: 100,
			rangedDamageType: "Piercing",
			rangedDamageDiceNum: 1,
			rangedDamageDiceSize: 1
		},
		'Crossbow, hand': {
			ranged: true,
			shortRange: 30,
			longRange: 120,
			rangedDamageType: "Piercing",
			rangedDamageDiceNum: 1,
			rangedDamageDiceSize: 6
		},
		'Crossbow, heavy': {
			ranged: true,
			shortRange: 100,
			longRange: 400,
			rangedDamageType: "Piercing",
			rangedDamageDiceNum: 1,
			rangedDamageDiceSize: 10
		},
		'Longbow': {
			ranged: true,
			shortRange: 150,
			longRange: 600,
			rangedDamageType: "Piercing",
			rangedDamageDiceNum: 1,
			rangedDamageDiceSize: 8
		}
	};
	CreatureData.spells = @import("config.js");

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
