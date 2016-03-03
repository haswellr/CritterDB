angular.module('myApp').factory("Creature", function($resource,$sce) {
  var serv = {};

  var api = $resource("/api/creatures/:id", {
    id: '@id'
  }, {
  	'update': { method:'PUT' }
  });

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

	serv.calculateCreatureDetails = function(creature){
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
				if(savingThrow.value)
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
				if(skill.value)
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
		if(creature.stats && creature.stats.challengeRating){
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

  serv.get = function(id, success, error){
  	api.get({ 'id': id}, function(data){
  		serv.calculateCreatureDetails(data);
  		success(data);
  	},error);
  }

  serv.getAll = function(success, error){
  	api.query(function(data){
  		for(var i=0;i<data.length;i++)
  			serv.calculateCreatureDetails(data[i]);
  		success(data);
  	},error);
  }

  serv.create = function(data,success,error){
  	api.save(data,success,error);
  }

  serv.update = function(id,data,success,error){
  	api.update({'id':id},data,function(data){
  		serv.calculateCreatureDetails(data);
  		success(data);
  	},error);
  }

  serv.delete = function(id, success, error){
  	api.delete({'id':id},success,error);
  }

  serv.getAllForBestiary = function(bestiaryId, success, error){
    $resource("/api/bestiaries/:id/creatures").query({ 'id': bestiaryId}, function(data){
    	for(var i=0;i<data.length;i++)
    		serv.calculateCreatureDetails(data[i]);
    	success(data);
    },error);
  }

  return serv;
});
