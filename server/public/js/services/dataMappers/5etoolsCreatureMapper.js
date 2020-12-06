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
        intelligence: "intelligence",
        charisma: "charisma"
    };

    class FiveEToolsCreatureMapper extends DataMapper {
        constructor() {
            super();
        }

        get _mappingDefinition() {
            return {
                "_type": "object",
                "valueMap": {
                    "name": "name",
                    "source": "%f%CritterDB",
                    "page": "%%0",
                    "size": "stats.size",
                    "type": {
                        "_type": "function",
                        "function": function (getterFunction) {
                            const critterDbRace = getterFunction("stats.race");
                            if (critterDbRace.includes(RACE_SUBTYPE_START) && critterDbRace.includes(RACE_SUBTYPE_END)) {
                                return {
                                    "type": critterDbRace.substring(0, critterDbRace.indexOf(RACE_SUBTYPE_START)).trim(),
                                    "tags": [
                                        critterDbRace.substring(critterDbRace.indexOf(RACE_SUBTYPE_START) + 1, critterDbRace.indexOf(RACE_SUBTYPE_END))
                                    ]
                                }
                            } else {
                                return critterDbRace;
                            }
                        }
                    },
                    "alignment": {
                        "_type": "function",
                        "function": function (getterFunction) {
                            // CritterDB Alignment looks like "Lawful Evil", "Neutral", etc. 5eTools is ["L", "E"] or ["N"].
                            const critterDbAlignment = getterFunction("stats.alignment");
                            return critterDbAlignment.split(" ").map(word => word.substring(0, 1)).map(letter => letter.toUpperCase());
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
                            const hitDieSize = CreatureData.sizes[getterFunction("stats.size")].hitDieSize;
                            const numHitDice = getterFunction("stats.numHitDie");
                            return {
                                "average": Math.ceil(((hitDieSize / 2.0) + 0.5) * numHitDice),
                                "formula": `${numHitDice}d${hitDieSize}`
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
                    "cha": "stats.abilityScores.cha",
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
                                    const critterDbAbilityMod = Math.floor((critterDbAbilityScore - 10) / 2.0);
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
                                    const critterDbAbilityMod = Math.floor((critterDbAbilityScore - 10) / 2.0);
                                    const calculatedSkillMod = critterDbProficiency + critterDbAbilityMod;
                                    outputSkills[outputKey] = `+${calculatedSkillMod}`
                                }
                            });
                            return outputSkills;
                        }
                    },
                    "senses": "stats.senses",
                    "passive": {
                        "_type": "function",
                        "function": function (getterFunction) {
                            const critterDbSenses = getterFunction("stats.senses").map(critterDbSense => critterDbSense.toLowerCase());
                            critterDbSenses.forEach(critterDbSense => {
                                if (critterDbSense.includes("passive perception")) {
                                    return critterDbSense.match(/\d/g).join("");
                                }
                            });
                            return 10;
                        }
                    },
                    "immune": "stats.damageImmunities",
                    "conditionImmune": "stats.conditionImmunities",
                    "languages": "stats.languages",
                    "cr": "challengeRating",
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
                        "_type": "singularArray",
                        "elementMap": "flavor.environment"
                    },
                    "soundClip": null,
                    "traitTags": {
                        "_type": "array",
                        "source": "stats.additionalAbilities",
                        "elementMap": "name"
                    },
                    "senseTags": null,
                    "actionTags": {
                        "_type": "array",
                        "source": "stats.actions",
                        "elementMap": "name"
                    },
                    "damageTags": null,
                    "miscTags": null,
                    "conditionInflict": null,
                    "conditionInflictLegendary": null
                }
            }
        }
    }

    return FiveEToolsCreatureMapper;
});