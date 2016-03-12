angular.module('myApp').factory("Creature", function($resource,$sce,CachedResourceAPI) {

	var CreatureAPI = new CachedResourceAPI("/api/creatures/:id");

  var hitDieSize = {
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

	var shortFormAbilities = {
		"strength": "Str",
		"dexterity": "Dex",
		"constitution": "Con",
		"intelligence": "Int",
		"wisdom": "Wis",
		"charisma": "Cha"
	};

	var skillAbilities = {
		"Acrobatics": "dexterity",
		"Animal Handling": "wisdom",
		"Arcana": "intelligence",
		"Athletics": "strength",
		"Deception": "charisma",
		"History": "intelligence",
		"Insight": "wisdom",
		"Intimidation": "charisma",
		"Investigation": "intelligence",
		"Medicine": "wisdom",
		"Nature": "intelligence",
		"Perception": "wisdom",
		"Performance": "charisma",
		"Persuasion": "charisma",
		"Religion": "intelligence",
		"Sleight of Hand": "dexterity",
		"Stealth": "dexterity",
		"Survival": "wisdom"
	};

	var getAbilityModifier = function(abilityScore){
		return(Math.floor((abilityScore - 10.0)/2.0));
	}

	CreatureAPI.calculateCreatureDetails = function(creature){
		//displayed armor type
		if(creature.stats && creature.stats.armorType){
			if(creature.stats.armorType=="")
				creature.stats.armorTypeStr = "";
			else
				creature.stats.armorTypeStr = "("+creature.stats.armorType+")";
		}
		//ability modifiers
		if(creature.stats && creature.stats.abilityScores){
			creature.stats.abilityScoreModifiers = {};
			creature.stats.abilityScoreStrs = {};
			for(var key in creature.stats.abilityScores){
				if(creature.stats.abilityScores.hasOwnProperty(key)){
					creature.stats.abilityScoreModifiers[key] = getAbilityModifier(creature.stats.abilityScores[key]);
					var sign = "+";
					if(creature.stats.abilityScoreModifiers[key]<0)
						sign = "–";
					creature.stats.abilityScoreStrs[key] = creature.stats.abilityScores[key]+" ("+sign+Math.abs(creature.stats.abilityScoreModifiers[key])+")";
				}
			}
		}
		//hit points
		if(creature.stats && creature.stats.size && creature.stats.abilityScoreModifiers && creature.stats.numHitDie){
			creature.stats.hitDieSize = hitDieSize[creature.stats.size];
			creature.stats.extraHealthFromConstitution = creature.stats.abilityScoreModifiers["constitution"] * creature.stats.numHitDie;
			creature.stats.hitPoints = Math.floor(creature.stats.numHitDie * ((creature.stats.hitDieSize/2.0) + 0.5 + creature.stats.abilityScoreModifiers["constitution"]));
			var sign = "+";
			if(creature.stats.extraHealthFromConstitution<0)
				sign = "–";
			creature.stats.hitPointsStr = creature.stats.hitPoints + " " +
					"(" + creature.stats.numHitDie + "d" + creature.stats.hitDieSize + " " +
					sign + " " + Math.abs(creature.stats.extraHealthFromConstitution) + ")";
		}
		//make ability descriptions html safe so we can use italics and other markup
		if(creature.stats && creature.stats.additionalAbilities){
			for(var index in creature.stats.additionalAbilities){
				var ability = creature.stats.additionalAbilities[index];
				ability.descriptionHtml = $sce.trustAsHtml(ability.description);
			}
		}
		if(creature.stats && creature.stats.actions){
			for(var index in creature.stats.actions){
				var ability = creature.stats.actions[index];
				ability.descriptionHtml = $sce.trustAsHtml(ability.description);
			}
		}
		if(creature.stats && creature.stats.reactions){
			for(var index in creature.stats.reactions){
				var ability = creature.stats.reactions[index];
				ability.descriptionHtml = $sce.trustAsHtml(ability.description);
			}
		}
		//make description html safe so we can use italics and other markup
		if(creature.flavor && creature.flavor.description!=undefined){
			creature.flavor.descriptionHtml = $sce.trustAsHtml(creature.flavor.description);
		}
		//saving throws
		if(creature.stats && creature.stats.savingThrows && creature.stats.abilityScoreModifiers && creature.stats.proficiencyBonus!=undefined){
			for(var index in creature.stats.savingThrows){
				var savingThrow = creature.stats.savingThrows[index];
				var mod = creature.stats.abilityScoreModifiers[savingThrow.ability];
				if(savingThrow.value != undefined)
					mod = savingThrow.value;
				else if(savingThrow.proficient)
					mod = mod + creature.stats.proficiencyBonus;
				savingThrow.modifier = mod;
				var sign = "+";
					if(mod<0)
						sign = "–";
				savingThrow.modifierStr = shortFormAbilities[savingThrow.ability]+" "+sign+Math.abs(mod);
			}
		}
		//skills
		if(creature.stats && creature.stats.skills && creature.stats.abilityScoreModifiers && creature.stats.proficiencyBonus!=undefined){
			for(var index in creature.stats.skills){
				var skill = creature.stats.skills[index];
				var ability = skillAbilities[skill.name];
				var mod = creature.stats.abilityScoreModifiers[ability];
				if(skill.value != undefined)
					mod = skill.value;
				else if(skill.proficient)
					mod = mod + creature.stats.proficiencyBonus;
				skill.modifier = mod;
				var sign = "+";
					if(mod<0)
						sign = "–";
				skill.modifierStr = skill.name+" "+sign+Math.abs(mod);
			}
		}
		//passive perception
		if(creature.stats && creature.stats.senses && creature.stats.abilityScoreModifiers){
			var mod = creature.stats.abilityScoreModifiers.wisdom;
			if(creature.stats.skills){
				for(var index in creature.stats.skills){
					if(creature.stats.skills[index].name=="Perception")
					{
						mod = creature.stats.skills[index].modifier;
						break;
					}
				}
			}
			creature.stats.passivePerception = 10 + mod;
		}
		//challenge rating
		if(creature.stats && creature.stats.challengeRating!=undefined){
			if(creature.stats.challengeRating==0.125)
				creature.stats.challengeRatingStr = "1/8";
			else if(creature.stats.challengeRating==0.25)
				creature.stats.challengeRatingStr = "1/4";
			else if(creature.stats.challengeRating==0.5)
				creature.stats.challengeRatingStr = "1/2";
			else
				creature.stats.challengeRatingStr = creature.stats.challengeRating.toString();
		}
	}

	CreatureAPI.get = function(id, success, error){
		CachedResourceAPI.prototype.get.call(this, id, function(data){
			CreatureAPI.calculateCreatureDetails(data);
			if(success)
				success(data);
		}, error);
	}

	delete [CreatureAPI.getAll];

	CreatureAPI.update = function(id, data, success, error){
		CachedResourceAPI.prototype.update.call(this, id, data, function(data){
			CreatureAPI.calculateCreatureDetails(data);
			if(success)
				success(data);
		}, error);
	}

	var currentBestiaryId = undefined;	//track the current bestiary - clear cache if it changes, otherwise cache things. This way we have one Bestiary's worth of creatures cached but no more - don't want to use too much memory.
  CreatureAPI.getAllForBestiary = function(bestiaryId, success, error){
  	if(currentBestiaryId==undefined || currentBestiaryId != bestiaryId){	//if bestiary has changed, pull new data from server
  		currentBestiaryId = bestiaryId;	//update current bestiary
  		this.cache.clear();							//and clear cache
	    $resource("/api/bestiaries/:id/creatures").query({ 'id': bestiaryId}, (function(data){
	    	for(var i=0;i<data.length;i++){
	    		this.cache.add(data[i]._id,data[i]);
	    		CreatureAPI.calculateCreatureDetails(data[i]);
	    	}
	    	if(success)
	    		success(data);
	    }).bind(this),error);
	  }
	  else {		//if bestiary hasn't changed, get data from cache
	  	var allCreatures = this.cache.getAll();
	  	var bestiaryCreatures = [];
	  	for(var i=0;i<allCreatures.length;i++){
	  		if(allCreatures[i].bestiaryId == bestiaryId)
	  			bestiaryCreatures.push(allCreatures[i]);
	  	}
	  	setTimeout(function(){
	  		success(bestiaryCreatures);
	  	});
	  }
  }

  return CreatureAPI;
});
