/**
 * Adapts creatures into the Improved Initiative format.
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

    function stripMarkup(str) {
      let doc = new DOMParser().parseFromString(str, 'text/html');
      return doc.body.textContent || "";
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
                            const critterDbSize = capitalize(getterFunction("stats.size"));
                            const critterDbRace = capitalize(getterFunction("stats.race"));
                            const critterDbAlignment = getterFunction("stats.alignment");
                            return critterDbSize + " " + critterDbRace + ", " + critterDbAlignment;
                        }
                    },
                    "Source": "%%CritterDB", // TODO: pass a bestiary name
                    "AC": {
                          "_type": "object",
                          "valueMap": {
                              "Value": "stats.armorClass",
                              "Notes": "stats.armorType"
                          }
                    },
                    "HP": {
                        "_type": "function",
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
                                    } else if (speedType == "walk") {
                                        // "walk" speed doesn't have designation
                                        outputSpeed.push("walk "+ critterDbSpeed);
                                    }
                                });
                            });
                            return outputSpeed;
                        }
                    },
                    "Abilities": {
                          "_type": "object",
                          "valueMap": {
                              "Str": "stats.abilityScores.strength",
                              "Dex": "stats.abilityScores.dexterity",
                              "Con": "stats.abilityScores.constitution",
                              "Int": "stats.abilityScores.intelligence",
                              "Wis": "stats.abilityScores.wisdom",
                              "Cha": "stats.abilityScores.charisma"
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
                                    outputSave["Modifier"] = `${calculatedSave}`;
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
                                const outputName = capitalize(critterDbSkill.name);
                                outputSkill["Name"] = outputName;
                                if (critterDbSkill.value) {
                                    outputSkill["Modifier"] = `${critterDbSkill.value}`;
                                } else if (critterDbSkill.proficient) {
                                    const critterDbProficiency = getterFunction("stats.proficiencyBonus");
                                    const critterDbAbility = CreatureData.skills[critterDbSkill.name].ability;
                                    const critterDbAbilityScore = getterFunction(`stats.abilityScores.${critterDbAbility}`);
                                    const critterDbAbilityMod = calcModifier(critterDbAbilityScore);
                                    const calculatedSkillMod = critterDbProficiency + critterDbAbilityMod;
                                    outputSkill["Modifier"] = `${calculatedSkillMod}`;
                                }
                                outputSkills.push(outputSkill);
                            });
                            return outputSkills;
                        }
                    },
                    "Actions": {
                        "_type": "function",
                        "function": function (getterFunction) {
                            const outputActions = [];
                            const critterDbActions = getterFunction("stats.actions");
                            critterDbActions.forEach(critterDbAction => {
                                const outputAction = {};
                                outputAction["Name"] = critterDbAction.name;
                                outputAction["Content"] = stripMarkup(critterDbAction.description);
                                outputActions.push(outputAction);
                            });
                            return outputActions;
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
                        "_type": "function",
                        "function": function (getterFunction) {
                            const outputTraits = [];
                            const critterDbTraits = getterFunction("stats.additionalAbilities");
                            critterDbTraits.forEach(critterDbTrait => {
                                const outputTrait = {};
                                outputTrait["Name"] = critterDbTrait.name;
                                outputTrait["Content"] = stripMarkup(critterDbTrait.description);
                                outputTraits.push(outputTrait);
                            });
                            return outputTraits;
                        }
                    },
                    "Reactions": {
                      "_type": "function",
                      "function": function (getterFunction) {
                          const outputReactions = [];
                          const critterDbReactions = getterFunction("stats.reactions");
                          critterDbReactions.forEach(critterDbReaction => {
                              const outputReaction = {};
                              outputReaction["Name"] = critterDbReaction.name;
                              outputReaction["Content"] = stripMarkup(critterDbReaction.description);
                              outputReactions.push(outputReaction);
                          });
                          return outputReactions;
                      }
                    },
                    "LegendaryActions": {
                      "_type": "function",
                      "function": function (getterFunction) {
                          const outputLegendaryActions = [];
                          const critterDbLegendaryActions = getterFunction("stats.legendaryActions");
                          critterDbLegendaryActions.forEach(critterDbLegendaryAction => {
                              const outputLegendaryAction = {};
                              outputLegendaryAction["Name"] = critterDbLegendaryAction.name;
                              outputLegendaryAction["Content"] = stripMarkup(critterDbLegendaryAction.description);
                              outputLegendaryAction.push(outputLegendaryAction);
                          });
                          return outputLegendaryActions;
                      }
                    }
                }
            }
        }
    }

    return ImprovedInitiativeCreatureMapper;
});
