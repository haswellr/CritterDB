var mongoose = require('mongoose');

//Flavor
var CreatureFlavor = new mongoose.Schema(
    {
        faction: {
            type: String,
            default: ""
        },
        environment: {
            type: String,
            default: ""
        },
        description: {
            type: String,
            default: ""
        }
    },
    {
        _id : false
    });

//6 core ability sores
var AbilityScores = new mongoose.Schema(
    {
        strength: {
            type: Number,
            default: 10
        },
        dexterity: {
            type: Number,
            default: 10
        },
        constitution: {
            type: Number,
            default: 10
        },
        intelligence: {
            type: Number,
            default: 10
        },
        wisdom: {
            type: Number,
            default: 10
        },
        charisma: {
            type: Number,
            default: 10
        }
    },
    {
        _id : false
    });

//a special saving throw - either proficient, or a specific value
var SavingThrow = new mongoose.Schema(
    {
        ability: {
            type: String,
            enum: ["strength","dexterity","constitution","intelligence","wisdom","charisma"],
            required: true
        },
        value: {
            type: Number
        },
        proficient: {
            type: Boolean
        }
    },
    {
        _id : false
    });

//a special skill - either proficient, or a specific value
var Skill = new mongoose.Schema(
    {
        name: {
            type: String,
            enum: ["Acrobatics","Animal Handling","Arcana","Athletics","Deception","History","Insight","Intimidation","Investigation","Medicine","Nature","Perception","Performance","Persuasion","Religion","Sleight of Hand","Stealth","Survival"],
            required: true
        },
        value: {
            type: Number
        },
        proficient: {
            type: Boolean
        }
    },
    {
        _id : false
    });

//an ability or attack
var Ability = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    },
    {
        _id : false
    });

//Stat Block
var StatBlock = new mongoose.Schema(
    {
        size: {
            type: String,
            enum: ["Fine","Diminutive","Tiny","Small","Medium","Large","Huge","Gargantuan","Colossal","Colossal+"],
            default: "Medium"
        },
        race: {
            type: String,
            default: ""
        },
        alignment: {
            type: String,
            default: ""
        },
        armorType: {
            type: String,
            default: ""
        },
        armorClass: {
            type: Number,
            default: 10
        },
        hitDieSize: {
            type: Number
        },
        numHitDie: {
            type: Number,
            default: 1
        },
        speed: {
            type: String,
            default: ""
        },
        abilityScores: {
            type: AbilityScores,
            default: {}
        },
        proficiencyBonus: {
            type: Number,
            default: 0
        },
        savingThrows: [SavingThrow],
        skills: [Skill],
        damageVulnerabilities: [String],
        damageResistances: [String],
        damageImmunities: [String],
        conditionImmunities: [String],
        senses: [String],
        languages: [String],
        challengeRating: {
            type: Number,
            default: 0
        },
        experiencePoints: {
            type: Number,
            default: 0
        },
        additionalAbilities: [Ability],
        actions: [Ability],
        reactions: [Ability],
        legendaryActionsPerRound: {
            type: Number,
            default: 3
        },
        legendaryActions: [Ability]
    },
    {
        _id : false
    });

var CreatureSchema = new mongoose.Schema(
	{
        //Flavor
        name: {
            type: String,
            required: true
        },
        bestiaryId: {
          type: mongoose.Schema.Types.ObjectId,  //this can refer to a publishedBestiary or just bestiary
          index: true
        },
        flavor: {
            type: CreatureFlavor,
            default: {}
        },
        //Stats
        stats: {
            type: StatBlock,
            default: {}
        }
    });

module.exports = mongoose.model('Creature',CreatureSchema);
