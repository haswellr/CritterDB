/**
 * Adapts creatures into the 5E tools format. https://5e.tools/bestiary.html#adult%20gold%20dragon_mm
 */

angular.module('myApp').factory("ImprovedInitiativeCreatureMapper", function (DataMapper, CreatureData) {

    const RACE_SUBTYPE_START = "(";
    const RACE_SUBTYPE_END = ")";
    const SPEED_TYPES = ["walk", "fly", "climb", "burrow", "swim"];
    const CRITTERDB_ABILITY_NAMES_TO_IMPROVED_INITIATIVE_ABILITY_NAMES = {
        strength: "Str",
        dexterity: "Dex",
        constitution: "Con",
        wisdom: "Wis",
        intelligence: "Int",
        charisma: "Cha"
    };

    function calcModifier(abilityScore) {
        return Math.floor((abilityScore - 10) / 2.0);
    }

    function toLower(str) {
        return str.toLowerCase();
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.substring(1);
    }

    class ImprovedInitiativeCreatureMapper extends DataMapper {
        constructor() {
            super();
        }

        get _mappingDefinition() {
            return {
                "_type": "object",
                "valueMap": {
                    "Type": {
                        "_type": "function",
                        "function": function (getterFunction) {
                            const critterDbSize = getterFunction("stats.size").capitalize();
                            const critterDbRace = getterFunction("stats.race").capitalize();
                            const critterDbAlignment = getterFunction("stats.alignment");
                            return critterDbSize + " " + critterDbRace + ", " + critterDbAlignment;
                        }
                    },
                    "Source": "%%CritterDB", // TODO: pass a bestiary name
                    "AC": {
                        "_type": "singularArray",
                        "elementMap": {
                            "_type": "object",
                            "valueMap": {
                                "Value": "stats.armorClass",
                                "Notes": "stats.armorType"
                            }
                        }
                    },
                    "HP": {
                        "_type": "function"
                        "function": function (getterFunction) {
                            const totalHealth = getterFunction("stats.hitPoints");
                            const hitDieSize = getterFunction("stats.hitDieSize");
                            const numHitDice = getterFunction("stats.numHitDie");
                            const extraHealth = getterFunction("stats.extraHealthFromConstitution");
                            return {
                                "Value": totalHealth,
                                "Notes": `(${numHitDice}d${hitDieSize} + ${extraHealth})`
                            };
                        }
                    },
                    "Speed": {
                        "_type": "function",
                        "function": function (getterFunction) {
                            const critterDbSpeedText = getterFunction("stats.speed");
                            const critterDbSpeeds = critterDbSpeedText.split(",");
                            const outputSpeed = [];
                            SPEED_TYPES.forEach(speedType => {
                                critterDbSpeeds.forEach(critterDbSpeed => {
                                    if (critterDbSpeed.includes(speedType)) {
                                        outputSpeed.push(critterDbSpeed);
                                    } else {
                                        // "walk" speed doesn't have designation
                                        outputSpeed.push("walk "+ critterDbSpeed);
                                    }
                                });
                        });
                        return outputSpeed;
                    },
                    "Abilities": {
                        "_type": "singularArray",
                        "elementMap": {
                            "_type": "object",
                            "valueMap": {
                                "Str": "stats.abilityScores.strength",
                                "Dex": "stats.abilityScores.dexterity",
                                "Con": "stats.abilityScores.constitution",
                                "Int": "stats.abilityScores.intelligence",
                                "Wis": "stats.abilityScores.wisdom",
                                "Cha": "stats.abilityScores.charisma"
                            }
                        }
                    },
                    "Senses": {
                        "_type": "function",
                        "function": function (getterFunction) {
                            const outputSenses = [];
                            const critterDbSenses = getterFunction("stats.senses");
                            critterDbSenses.forEach(critterDbSense => {
                                outputSenses.push(critterDbSense);
                            });
                            const passivePerception = getterFunction("stats.passivePerception");
                            outputSenses.push("passive Perception " + passivePerception);
                            return outputSenses;
                        }
                    },
                    "Challenge": {
                        "_type": "function",
                        "function": function (getterFunction) {
                            return getterFunction("stats.challengeRatingStr");
                        }
                    },
                    "languages": "stats.languages",
                    "Saves": {
                        "_type": "function",
                        "function": function (getterFunction) {
                            const outputSaves = [];
                            const critterDbSaves = getterFunction("stats.savingThrows");
                            critterDbSaves.forEach(critterDbSave => {
                                const outputSave = {};
                                const outputName = CRITTERDB_ABILITY_NAMES_TO_IMPROVED_INITIATIVE_ABILITY_NAMES[critterDbSave.ability];
                                outputSave["Name"] = outputName;
                                if (critterDbSave.value) {
                                    outputSave["Modifier"] = `${critterDbSave.value}`;
                                } else if (critterDbSave.proficient) {
                                    const critterDbProficiency = getterFunction("stats.proficiencyBonus");
                                    const critterDbAbilityScore = getterFunction(`stats.abilityScores.${critterDbSave.ability}`);
                                    const critterDbAbilityMod = calcModifier(critterDbAbilityScore);
                                    const calculatedSave = critterDbProficiency + critterDbAbilityMod;
                                    outputSave["Modifier"] = `${calculatedSave}`
                                }
                                outputSaves.push(outputSave);
                            });
                            return outputSaves;
                        }
                    },
                    "Skills": {
                        "_type": "function",
                        "function": function (getterFunction) {
                            const outputSkills = [];
                            const critterDbSkills = getterFunction("stats.skills");
                            critterDbSkills.forEach(critterDbSkill => {
                                const outputSkill = {};
                                const outputName = critterDbSkill.name.capitalize();
                                outputSkill["Name"] = outputName;
                                if (critterDbSkill.value) {
                                    outputSkill["Modifier"] = `${critterDbSkill.value}`;
                                } else if (critterDbSkill.proficient) {
                                    const critterDbProficiency = getterFunction("stats.proficiencyBonus");
                                    const critterDbAbility = CreatureData.skills[critterDbSkill.name].ability;
                                    const critterDbAbilityScore = getterFunction(`stats.abilityScores.${critterDbAbility}`);
                                    const critterDbAbilityMod = calcModifier(critterDbAbilityScore);
                                    const calculatedSkillMod = critterDbProficiency + critterDbAbilityMod;
                                    outputSkill["Modifier"] = `${calculatedSkillMod}`
                                }
                                outputSkills.push(outputSkill);
                            });
                            return outputSkills;
                        }
                    },
                    "Actions": {
                        "_type": "array",
                        "source": "stats.actions",
                        "elementMap": {
                            "_type": "object",
                            "valueMap": {
                                "Name": "name",
                                "Content": {
                                    "_type": "singularArray",
                                    "elementMap": "description"
                                }
                            }
                        }
                    },
                    "DamageImmunities": {
                        "_type": "function",
                        "function": function (getterFunction) {
                            return getterFunction("stats.damageImmunities").map(toLower);
                        }
                    },
                    "DamageVulnerabilities": {
                        "_type": "function",
                        "function": function (getterFunction) {
                            return getterFunction("stats.damageVulnerabilities").map(toLower);
                        }
                    },
                    "DamageResistances": {
                        "_type": "function",
                        "function": function (getterFunction) {
                            return getterFunction("stats.damageResistances").map(toLower);
                        }
                    },
                    "ConditionImmunities": {
                        "_type": "function",
                        "function": function (getterFunction) {
                            return getterFunction("stats.conditionImmunities").map(toLower);
                        },
                    },
                    "Traits": {
                        "_type": "array",
                        "source": "stats.additionalAbilities",
                        "elementMap": {
                            "_type": "object",
                            "valueMap": {
                                "Name": "name",
                                "Content": {
                                    "_type": "singularArray",
                                    "elementMap": "description"
                                }
                            }
                        }
                    },
                    "Reactions": {
                        "_type": "array",
                        "source": "stats.reactions",
                        "elementMap": {
                            "_type": "object",
                            "valueMap": {
                                "Name": "name",
                                "Content": {
                                    "_type": "singularArray",
                                    "elementMap": "description"
                                }
                            }
                        }
                    },
                    "LegendaryActions": {
                        "_type": "array",
                        "source": "stats.legendaryActions",
                        "elementMap": {
                            "_type": "object",
                            "valueMap": {
                                "Name": "name",
                                "Content": {
                                    "_type": "singularArray",
                                    "elementMap": "description"
                                }
                            }
                        }
                    },
                }
            }
        }
    }

    return ImprovedInitiativeCreatureMapper;
});
