
//Get mongoose Creature model
var Creature = require('../models/creature');
var Bestiary = require('../models/bestiary');
var jwt = require("jsonwebtoken");
var config = require("../config");

var authenticateBestiaryByOwner = function(req, bestiary, callback){
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(token){
        jwt.verify(token,config.secret,function(err,decoded){
            if(err)
                callback("Failed to authenticate token.");
            else{
                if(decoded._doc._id != bestiary.ownerId)
                    callback("Not authorized for access.");
                else
                    callback(null);
            }
        });
    }
    else{
        callback("No token provided.");
    }
}

var authenticateCreatureByBestiary = function(req, creature, callback){
    var query = {'_id':creature.bestiaryId};
    Bestiary.findOne(query, function(err, doc){
        if(err)
            callback(err.errmsg);
        else if(doc)
            authenticateBestiaryByOwner(req, doc, callback);
        else
            callback("Bestiary not found.");
    });
}

exports.findById = function(req, res) {
    var id = req.params.id;
    var query = {'_id':id};

    Creature.findOne(query, function (err, doc) {
        if(err) {
            res.status(400).send(err.errmsg);
        }
        else if(doc){
            authenticateCreatureByBestiary(req, doc, function(err){
                if(err)
                    res.status(400).send(err);
                else
                    res.send(doc);
            });
        }
        else{
            res.status(400).send("Creature not found");
        }
    });
};

exports.findAll = function(req, res) {
    Creature.find({}, function(err, docs) {
        if(err){
            res.status(400).send(err.errmsg);
        }
        else{
            res.send(docs);
        }
    });
};

exports.create = function(req, res) {
    var creature = new Creature(req.body);

    authenticateCreatureByBestiary(req, creature, function(err){
        if(err)
            res.status(400).send(err);
        else{
            creature.save(function (err, doc) {
                if(err) {
                    res.status(400).send(err.errmsg);
                }
                else {
                    res.send(doc);
                }
            });
        }
    });
}

exports.updateById = function(req, res) {
    var id = req.params.id;
    var query = {'_id':id};
    var creature = new Creature(req.body);
    var options = {
        upsert: true,       //creates if not found
        new: true           //retrieves new object from database and returns that as doc
    }

    Creature.findOne(query, function (err, doc) {
        if(err) {
            res.status(400).send(err.errmsg);
        }
        else if(doc){
            authenticateCreatureByBestiary(req, doc, function(err){
                if(err)
                    res.status(400).send(err);
                else{
                    Creature.findOneAndUpdate(query, creature, options, function(err, doc){
                        if(err){
                            res.status(400).send(err.errmsg);
                        }
                        else if(doc){
                            res.send(doc);
                        }
                    });
                }
            });
        }
        else{
            res.status(400).send("Creature not found");
        }
    });
}

exports.deleteById = function(req, res) {
    var id = req.params.id;
    var query = {'_id':id};

    Creature.findOne(query, function (err, doc) {
        if(err) {
            res.status(400).send(err.errmsg);
        }
        else if(doc){
            authenticateCreatureByBestiary(req, doc, function(err){
                if(err)
                    res.status(400).send(err);
                else{
                    Creature.findByIdAndRemove(query, function(err, doc, result){
                        if(err){
                            res.status(400).send(err.errmsg);
                        }
                        else{
                            res.send(doc);
                        }
                    });
                }
            });
        }
        else{
            res.status(400).send("Creature not found");
        }
    });
}


//----------------------------------------------------------
//TEMP FOR DEV -- REMOVE ALL OF THIS
exports.createABunchOfCreatures = function(req, res) {
    var creatures = req.body;
    var returned = [];
    var savedCount = 0;

    console.log("--- CREATING MULTIPLE CREATURES ---");
    console.log("input: "+JSON.stringify(creatures));
    for(var i=0;i<creatures.length;i++){
        var creatureJson = creatures[i];
        var creature = new Creature(creatureJson);

        creature.save(function (err, doc) {
            if(err) {
                console.log("FAILED: "+creatureJson.name);
                savedCount = savedCount + 1;
                if(savedCount == creatures.length){
                    console.log("--- FINISHED ---");
                    res.send(returned);
                }
            }
            else {
                console.log("SAVED: "+creatureJson.name);
                returned.push(doc);
                savedCount = savedCount + 1;
                if(savedCount == creatures.length){
                    console.log("--- FINISHED ---");
                    res.send(returned);
                }
            }
        });
    }
}

function parseRace(srdCreature){
    var race = srdCreature.type;
    if(srdCreature.subtype)
        race = race + " ("+srdCreature.subtype+")";
    return(race);
}

function parseHitDie(srdCreature){
    var hitDice = srdCreature.hit_dice;
    var countStr = hitDice.split("d")[0];
    var sizeStr = hitDice.split("d")[1];
    var parsed = {
        size: parseInt(sizeStr),
        count: parseInt(countStr)
    };
    return(parsed);
}

function parseAbilityScores(srdCreature){
    var abilityScores = {
        strength: srdCreature.strength,
        dexterity: srdCreature.dexterity,
        constitution: srdCreature.constitution,
        intelligence: srdCreature.intelligence,
        wisdom: srdCreature.wisdom,
        charisma: srdCreature.charisma
    };
    return(abilityScores);
}

function createSavingThrow(ability,value){
    var savingThrow = {
        ability: ability,
        value: value,
        proficient: false
    };
    return(savingThrow);
}

function parseSavingThrows(srdCreature){
    var savingThrows = [];
    if(srdCreature.strength_save)
        savingThrows.push(createSavingThrow("strength",srdCreature.strength_save));
    if(srdCreature.dexterity_save)
        savingThrows.push(createSavingThrow("dexterity",srdCreature.dexterity_save));
    if(srdCreature.constitution_save)
        savingThrows.push(createSavingThrow("constitution",srdCreature.constitution_save));
    if(srdCreature.intelligence_save)
        savingThrows.push(createSavingThrow("intelligence",srdCreature.intelligence_save));
    if(srdCreature.wisdom_save)
        savingThrows.push(createSavingThrow("wisdom",srdCreature.wisdom_save));
    if(srdCreature.charisma_save)
        savingThrows.push(createSavingThrow("charisma",srdCreature.charisma_save));
    return(savingThrows);
}

function createSkill(name,value){
    var skill = {
        name: name,
        value: value,
        proficient: false
    }
    return(skill);
}

function parseSkills(srdCreature){
    var skills = [];
    var skillsFields = ["acrobatics","animal_handling","arcana","athletics","deception","history","insight","intimidation","investigation","medicine","nature","perception","performance","persuasion","religion","sleight_of_hand","stealth","survival"];
    var skillsNames = ["Acrobatics","Animal Handling","Arcana","Athletics","Deception","History","Insight","Intimidation","Investigation","Medicine","Nature","Perception","Performance","Persuasion","Religion","Sleight of Hand","Stealth","Survival"];
    for(var i=0;i<skillsFields.length;i++){
        var skillsField = skillsFields[i];
        if(srdCreature[skillsField])
            skills.push(createSkill(skillsNames[i],srdCreature[skillsField]));
    }
    return(skills);
}

function convertCSVToArray(csv){
    //split by semicolon first, ignoring anything after semicolon
    var semi_split = csv.split("; ");
    var max = semi_split.length;
    var output = [];
    if(semi_split.length>1 || semi_split[0]!=""){
        if(semi_split.length>1)
            max = max - 1;  //ignore anything after the last semicolon
        for(var i=0;i<max;i++){
            var semi_split_csv = semi_split[i];
            //now split by comma
            var comma_split = semi_split_csv.split(", ");
            for(var j=0;j<comma_split.length;j++)
                output.push(comma_split[j]);
        }
        if(semi_split.length>1)
            output.push(semi_split[semi_split.length-1]);
    }
    return(output);
}

function getXPFromCR(crStr){
    var experienceByCR = {'0': 10,'1/8': 25,'1/4': 50,'1/2': 100,
        '1': 200,'2': 450,'3': 700,'4': 1100,'5': 1800,'6': 2300,'7': 2900,
        '8': 3900,'9': 5000,'10': 5900,'11': 7200,'12': 8400,'13': 10000,
        '14': 11500,'15': 13000,'16': 15000,'17': 18000,'18': 20000,'19': 22000,
        '20': 25000,'21': 33000,'22': 41000,'23': 50000,'24': 62000,'25': 75000,
        '26': 90000,'27': 105000,'28': 120000,'29': 135000,'30': 155000};
    return(experienceByCR[crStr]);
}

function parseAbilities(abilities){
    var parsed = [];
    if(abilities){
        for(var i=0;i<abilities.length;i++){
            var ability = abilities[i];
            var parsedAbility = {
                name: ability.name,
                description: ability.desc
            };
            parsed.push(parsedAbility);
        }
    }
    return(parsed);
}

function parseSRDCreatureStats(srdCreature){
    var parsed = {
        size: srdCreature.size,
        race: parseRace(srdCreature),
        alignment: srdCreature.alignment,
        armorType: "",
        armorClass: srdCreature.armor_class,
        hitDieSize: parseHitDie(srdCreature).size,
        numHitDie: parseHitDie(srdCreature).count,
        speed: srdCreature.speed,
        abilityScores: parseAbilityScores(srdCreature),
        proficiencyBonus: 0,
        savingThrows: parseSavingThrows(srdCreature),
        skills: parseSkills(srdCreature),
        damageVulnerabilities: convertCSVToArray(srdCreature.damage_vulnerabilities),
        damageResistances: convertCSVToArray(srdCreature.damage_resistances),
        damageImmunities: convertCSVToArray(srdCreature.damage_immunities),
        conditionImmunities: convertCSVToArray(srdCreature.condition_immunities),
        senses: convertCSVToArray(srdCreature.senses),
        languages: convertCSVToArray(srdCreature.languages),
        challengeRating: eval(srdCreature.challenge_rating),
        experiencePoints: getXPFromCR(srdCreature.challenge_rating),
        additionalAbilities: parseAbilities(srdCreature.specialAbilities),
        actions: parseAbilities(srdCreature.actions),
        reactions: parseAbilities(srdCreature.reactions),
        legendaryActionsPerRound: 3,
        legendaryActions: parseAbilities(srdCreature.legendary_actions)
    };
    return(parsed);
}

function parseFlavor(srdCreature){
    var flavor = {
        faction: "",
        environment: "",
        description: ""
    };
    return(flavor);
}

function parseSRDCreature(srdCreature,bestiaryId){
    var parsed = {
        name: srdCreature.name,
        bestiaryId: bestiaryId,
        flavor: parseFlavor(srdCreature),
        stats: parseSRDCreatureStats(srdCreature)
    };
    return(parsed);
}

exports.parseSRDJson = function(req, res) {
    var creatures = req.body;
    var bestiaryId = req.params.bestiaryId;
    var parsed = [];
    console.log("--- parsing srd creatures ---");
    for(var i=0;i<creatures.length;i++){
        var creature = creatures[i];
        console.log("parsing: "+creature.name);
        var parsedCreature = parseSRDCreature(creature,bestiaryId);
        parsed.push(parsedCreature);
    }
    console.log("--- finished parsing ---");
    res.send(parsed);
}
//===================