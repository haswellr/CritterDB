/** 
 * Adapts creatures into the 5E tools format. https://5e.tools/bestiary.html#adult%20gold%20dragon_mm
 */

angular.module('myApp').factory("FiveEToolsCreatureMapper", function (DataMapper, CreatureData) {

    const RACE_SUBTYPE_START = "(";
    const RACE_SUBTYPE_END = ")";
    const SPEED_TYPES = ["walk", "fly", "climb", "burrow", "swim"];
    const CRITTERDB_ABILITY_NAMES_TO_5ETOOLS_ABILITY_NAMES = {
        strength: "str",
        dexterity: "dex",
        constitution: "con",
        wisdom: "wis",
        intelligence: "int",
        charisma: "cha"
    };

    function calcModifier(abilityScore) {
        return Math.floor((abilityScore - 10) / 2.0);
    }

    function toLower(str) {
        return str.toLowerCase();
    }

    class FiveEToolsCreatureMapper extends DataMapper {
        constructor() {
            super();
        }

        get _mappingDefinition() {
            return {
                "_type": "object",
                "valueMap": {
                    "name": "name",
                    "size": {
                        "_type": "function",
                        "function": function (getterFunction) {
                            return [getterFunction("stats.size").substring(0, 1).toUpperCase()];
                        }
                    },
                    "type": {
                        "_type": "function",
                        "function": function (getterFunction) {
                            const critterDbRace = getterFunction("stats.race");
                            if (critterDbRace.includes(RACE_SUBTYPE_START) && critterDbRace.includes(RACE_SUBTYPE_END)) {
                                return {
                                    "type": critterDbRace.substring(0, critterDbRace.indexOf(RACE_SUBTYPE_START)).trim().toLowerCase(),
                                    "tags": [
                                        critterDbRace.substring(critterDbRace.indexOf(RACE_SUBTYPE_START) + 1, critterDbRace.indexOf(RACE_SUBTYPE_END)).toLowerCase()
                                    ]
                                }
                            } else {
                                return critterDbRace.toLowerCase();
                            }
                        }
                    },
                    "source": "%%CritterDB", // TODO: pass a bestiary name
                    "alignment": {
                        "_type": "function",
                        "function": function (getterFunction) {
                            // CritterDB Alignment looks like "Lawful Evil", "Neutral", etc. 5eTools is ["L", "E"] or ["N"].
                            const critterDbAlignment = getterFunction("stats.alignment");
                            return critterDbAlignment.split(" ").reduce((acc, item) => {
                                const letter = item.substring(0, 1).toUpperCase();
                                if (!acc.includes(letter)) { // avoid ["A", "A"] for "Any Alignment"
                                    acc.push(letter);
                                }
                                return acc;
                            }, []);
                        }
                    },
                    "ac": {
                        "_type": "singularArray",
                        "elementMap": {
                            "_type": "object",
                            "valueMap": {
                                "ac": "stats.armorClass",
                                "from": {
                                    "_type": "singularArray",
                                    "elementMap": "stats.armorType"
                                }
                            }
                        }
                    },
                    "hp": {
                        "_type": "function",
                        "function": function (getterFunction) {
                            const hitDieSize = getterFunction("stats.hitDieSize");
                            const numHitDice = getterFunction("stats.numHitDie");
                            const extraHealth = getterFunction("stats.extraHealthFromConstitution");
                            return {
                                "average": Math.floor((hitDieSize / 2.0) * numHitDice) + extraHealth,
                                "formula": `${numHitDice}d${hitDieSize} + ${extraHealth}`
                            };
                        }
                    },
                    "speed": {
                        "_type": "function",
                        "function": function (getterFunction) {
                            const critterDbSpeedText = getterFunction("stats.speed");
                            const critterDbSpeeds = critterDbSpeedText.split(",");
                            const outputSpeed = {};
                            SPEED_TYPES.forEach(speedType => {
                                critterDbSpeeds.forEach(critterDbSpeed => {
                                    if (critterDbSpeed.includes(speedType)) {
                                        const speed = parseInt(critterDbSpeed.match(/\d/g).join(""));
                                        if (speed) {
                                            outputSpeed[speedType] = critterDbSpeed.match(/\d/g).join("");
                                        }
                                    } else {
                                        // "walk" speed doesn't have designation
                                        const walkingSpeedMatch = critterDbSpeed.match(/^(\d{1,3}) ft\.$/i);
                                        if (walkingSpeedMatch) {
                                            outputSpeed.walk = parseInt(walkingSpeedMatch[1], 10);
                                        }
                                    }
                                });
                            });
                            return outputSpeed;
                        }
                    },
                    "str": "stats.abilityScores.strength",
                    "dex": "stats.abilityScores.dexterity",
                    "con": "stats.abilityScores.constitution",
                    "int": "stats.abilityScores.intelligence",
                    "wis": "stats.abilityScores.wisdom",
                    "cha": "stats.abilityScores.charisma",
                    "passive": {
                        "_type": "function",
                        "function": function (getterFunction) {
                            const critterDbSenses = getterFunction("stats.senses").map(toLower);
                            critterDbSenses.forEach(critterDbSense => {
                                if (critterDbSense.includes("passive perception")) {
                                    return critterDbSense.match(/\d/g).join("");
                                }
                            });
                            return 10;                        }
                    },
                    "cr": {
                        "_type": "function",
                        "function": function (getterFunction) {
                            return getterFunction("stats.challengeRatingStr");
                        }
                    },
                    "senses": {
                        "_type": "function",
                        "function": function (getterFunction) {
                            return getterFunction("stats.senses").map(toLower);
                        }
                    },
                    "senseTags": {
                        "_type": "function",
                        "function": function (getterFunction) {
                            return getterFunction("stats.senses").map((sense) => {
                                if (sense.match(/darkvision/i)) {
                                    return "D";
                                }
                                if (sense.match(/blindsight/i)) {
                                    return "B"
                                }
                                if (sense.match(/tremorsense/i)) {
                                    return "T"
                                }
                                if (sense.match(/truesight/i)) {
                                    return "U"
                                }
                            });
                        }
                    },
                    "languages": "stats.languages",
                    "save": {
                        "_type": "function",
                        "function": function (getterFunction) {
                            const outputSaves = {};
                            const critterDbSaves = getterFunction("stats.savingThrows");
                            critterDbSaves.forEach(critterDbSave => {
                                const outputKey = CRITTERDB_ABILITY_NAMES_TO_5ETOOLS_ABILITY_NAMES[critterDbSave.ability];
                                if (critterDbSave.value) {
                                    outputSaves[outputKey] = `+${critterDbSave.value}`;
                                } else if (critterDbSave.proficient) {
                                    const critterDbProficiency = getterFunction("stats.proficiencyBonus");
                                    const critterDbAbilityScore = getterFunction(`stats.abilityScores.${critterDbSave.ability}`);
                                    const critterDbAbilityMod = calcModifier(critterDbAbilityScore);
                                    const calculatedSave = critterDbProficiency + critterDbAbilityMod;
                                    outputSaves[outputKey] = `+${calculatedSave}`
                                }
                            });
                            return outputSaves;
                        }
                    },
                    "skill": {
                        "_type": "function",
                        "function": function (getterFunction) {
                            const outputSkills = {};
                            const critterDbSkills = getterFunction("stats.skills");
                            critterDbSkills.forEach(critterDbSkill => {
                                const outputKey = critterDbSkill.name.toLowerCase();
                                if (critterDbSkill.value) {
                                    outputSkills[outputKey] = `+${critterDbSkill.value}`;
                                } else if (critterDbSkill.proficient) {
                                    const critterDbProficiency = getterFunction("stats.proficiencyBonus");
                                    const critterDbAbility = CreatureData.skills[critterDbSkill.name].ability;
                                    const critterDbAbilityScore = getterFunction(`stats.abilityScores.${critterDbAbility}`);
                                    const critterDbAbilityMod = calcModifier(critterDbAbilityScore);
                                    const calculatedSkillMod = critterDbProficiency + critterDbAbilityMod;
                                    outputSkills[outputKey] = `+${calculatedSkillMod}`
                                }
                            });
                            return outputSkills;
                        }
                    },
                    "action": {
                        "_type": "array",
                        "source": "stats.actions",
                        "elementMap": {
                            "_type": "object",
                            "valueMap": {
                                "name": "name",
                                "entries": {
                                    "_type": "singularArray",
                                    "elementMap": "description"
                                }
                            }
                        }
                    },
                    "immune": {
                        "_type": "function",
                        "function": function (getterFunction) {
                            return getterFunction("stats.damageImmunities").map(toLower);
                        }
                    },                    
                    "vulnerable": {
                        "_type": "function",
                        "function": function (getterFunction) {
                            return getterFunction("stats.damageVulnerabilities").map(toLower);
                        }
                    },
                    "resist": {
                        "_type": "function",
                        "function": function (getterFunction) {
                            return getterFunction("stats.damageResistances").map(toLower);
                        }
                    },
                    "conditionImmune": {
                        "_type": "function",
                        "function": function (getterFunction) {
                            return getterFunction("stats.conditionImmunities").map(toLower);
                        },
                    },
                    "trait": {
                        "_type": "array",
                        "source": "stats.additionalAbilities",
                        "elementMap": {
                            "_type": "object",
                            "valueMap": {
                                "name": "name",
                                "entries": {
                                    "_type": "singularArray",
                                    "elementMap": "description"
                                }
                            }
                        }
                    },

                    "reaction": {
                        "_type": "array",
                        "source": "stats.reactions",
                        "elementMap": {
                            "_type": "object",
                            "valueMap": {
                                "name": "name",
                                "entries": {
                                    "_type": "singularArray",
                                    "elementMap": "description"
                                }
                            }
                        }
                    },
                    "legendary": {
                        "_type": "array",
                        "source": "stats.legendaryActions",
                        "elementMap": {
                            "_type": "object",
                            "valueMap": {
                                "name": "name",
                                "entries": {
                                    "_type": "singularArray",
                                    "elementMap": "description"
                                }
                            }
                        }
                    },
                    "legendaryGroup": null,
                    "environment": {
                        "_type": "function",
                        "function": function(getterFunction) {
                            return getterFunction("flavor.environment").split(/, /).map(toLower);
                        }
                    },
                    "soundClip": null,
                    "traitTags": {
                        "_type": "array",
                        "source": "stats.additionalAbilities",
                        "elementMap": "name"
                    },

                    "damageTags": null,
                    "miscTags": null,
                    "conditionInflict": null,
                    "conditionInflictLegendary": null,
                    "group": "flavor.faction",
                    "isNamedCreature": "flavor.nameIsProper",
                    "fluff": {
                        "_type": "function",
                        "function": function (getterFunction) {
                            return {
                                "entries": [
                                    getterFunction("flavor.description"),
                                ],
                                "images": [
                                    {
                                        "type": "image",
                                        "href": {
                                            "type": "external",
                                            "url": getterFunction("flavor.imageUrl")
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        }
    }

    return FiveEToolsCreatureMapper;
});
