var exportNaturalCritCtrl = function ($scope,creature,Creature,$http,$mdDialog,$mdToast,TextUtils) {

	var header = "";
	Creature.calculateCreatureDetails(creature);

	var convertWhitespaceAndHtml = function(text){
		function escapeSpaces (str) {
		    return str.replace(/^ +/mg, function (match) {
		        return match.replace(/ /g, "&nbsp;");
		    });
		}
		if(text)
				return(escapeSpaces(text).replace(/(?:\r\n|\r|\n)/g, '\n>').replace(/(?:<i>|<\/i>)/g,'*'));
			else
				return(text);
	}

	var newline = "\n>";

	var generateTaperedLine = function(){
		var html = '___' + newline;
		return html;
	}

	var generateHeading = function(creature){
		var html = '## ' + creature.name + newline +
			'*' + TextUtils.capitalizeFirstLetter(creature.stats.size) + ' ' + creature.stats.race.toLowerCase() + ', ' + creature.stats.alignment.toLowerCase() + '*' + newline +
			generateTaperedLine();
		return html;
	}

	var generatePropertyLine = function(title,text){
		var html = '- **' + title + '** ' + text + newline;
		return html;
	}

	var generateAbilityScoreLine = function(creature){
		var html = '|STR|DEX|CON|INT|WIS|CHA|' + newline +
			'|:---:|:---:|:---:|:---:|:---:|:---:|' + newline +
			'|'+creature.stats.abilityScoreStrs.strength+'|'+creature.stats.abilityScoreStrs.dexterity+'|'+creature.stats.abilityScoreStrs.constitution+'|'+creature.stats.abilityScoreStrs.intelligence+'|'+creature.stats.abilityScoreStrs.wisdom+'|'+creature.stats.abilityScoreStrs.charisma+'|'+newline;
		return html;
	}

	var generateTopStats = function(creature){
		var html = generatePropertyLine('Armor Class',creature.stats.armorClass + ' ' + (creature.stats.armorType ? ('(' + creature.stats.armorType.toLowerCase() + ')') : '')) +
			generatePropertyLine('Hit Points',creature.stats.hitPointsStr) + 
			generatePropertyLine('Speed',creature.stats.speed) +
			generateTaperedLine() +
			generateAbilityScoreLine(creature) +
			generateTaperedLine();
		if(creature.stats.savingThrows.length>0){
			var propertyText = '';
			for(var i=0;i<creature.stats.savingThrows.length;i++){
				if(i>0)
					propertyText = propertyText + ', ';
				propertyText = propertyText + creature.stats.savingThrows[i].modifierStr;
			}
			html = html +
				generatePropertyLine('Saving Throws',propertyText);
		}
		if(creature.stats.skills.length>0){
			var propertyText = '';
			for(var i=0;i<creature.stats.skills.length;i++){
				if(i>0)
					propertyText = propertyText + ', ';
				propertyText = propertyText + creature.stats.skills[i].modifierStr;
			}
			html = html +
				generatePropertyLine('Skills',propertyText);
		}
		if(creature.stats.damageVulnerabilities.length>0){
			var propertyText = '';
			for(var i=0;i<creature.stats.damageVulnerabilities.length;i++){
				if(i>0)
					propertyText = propertyText + ', ';
				propertyText = propertyText + creature.stats.damageVulnerabilities[i].toLowerCase();
			}
			html = html +
				generatePropertyLine('Damage Vulnerabilities',propertyText);
		}
		if(creature.stats.damageResistances.length>0){
			var propertyText = '';
			for(var i=0;i<creature.stats.damageResistances.length;i++){
				if(i>0)
					propertyText = propertyText + ', ';
				propertyText = propertyText + creature.stats.damageResistances[i].toLowerCase();
			}
			html = html +
				generatePropertyLine('Damage Resistances',propertyText);
		}
		if(creature.stats.damageImmunities.length>0){
			var propertyText = '';
			for(var i=0;i<creature.stats.damageImmunities.length;i++){
				if(i>0)
					propertyText = propertyText + ', ';
				propertyText = propertyText + creature.stats.damageImmunities[i].toLowerCase();
			}
			html = html +
				generatePropertyLine('Damage Immunities',propertyText);
		}
		if(creature.stats.conditionImmunities.length>0){
			var propertyText = '';
			for(var i=0;i<creature.stats.conditionImmunities.length;i++){
				if(i>0)
					propertyText = propertyText + ', ';
				propertyText = propertyText + creature.stats.conditionImmunities[i].toLowerCase();
			}
			html = html +
				generatePropertyLine('Condition Immunities',propertyText);
		}
		var sensesText = '';
		for(var i=0;i<creature.stats.senses.length;i++){
			if(i>0)
				sensesText = sensesText + ', ';
			sensesText = sensesText + creature.stats.senses[i].toLowerCase();
		}
		if(creature.stats.senses.length>0)
			sensesText = sensesText + ', ';
		sensesText = sensesText + 'passive Perception ' + creature.stats.passivePerception;
		html = html +
			generatePropertyLine('Senses',sensesText);

		var languagesText = '';
		if(creature.stats.languages.length==0)
			languagesText = '—';
		else{
			for(var i=0;i<creature.stats.languages.length;i++){
				if(i>0)
					languagesText = languagesText + ', ';
				var language = creature.stats.languages[i];
				languagesText = languagesText + TextUtils.capitalizeFirstLetter(language);
			}
		}
		html = html +
			generatePropertyLine('Languages',languagesText);
		//Challenge Rating
		var challengeText = creature.stats.challengeRatingStr + ' (' + creature.stats.experiencePoints + ' XP)';
		html = html +
			generatePropertyLine('Challenge',challengeText);
		html = html +
			generateTaperedLine();
		return html;
	}

	/*
		styling: {
			hangingIndent: boolean (default: false),
			snugLines: boolean (default: false),
			title: {
				italicized: boolean (default: true)
			}
		}
	*/
	var generateAbility = function(ability, styling){
		var html = '';
		if (styling && styling.hangingIndent) {
			html = html + '- ';
		}
		var titleFontStyle = styling && styling.title && !styling.italicized ? '**' : '***';
		html = html + titleFontStyle + ability.name + '.' + titleFontStyle + ' ' + convertWhitespaceAndHtml(ability.description) + newline;
		if(!(styling && styling.snugLines)) {
			html = html + newline;
		}
		return html;
	}

	
	var generateProperties = function(title,abilities,subtext,abilityStyling){
		var html = '';
		if(abilities && abilities.length>0){
			if(title)
				html = html + '### ' + title + newline;
			if(subtext)
				html = html + subtext + newline +
					newline;
			for(var i=0;i<abilities.length;i++){
				html = html + generateAbility(abilities[i],abilityStyling);
			}
		}
		return html;
	}

	var generateLegendaryActions = function(creature){
		var abilityStyling = {
			hangingIndent: true,
			snugLines: true,
			title: {
				italicized: false
			}
		};
		return generateProperties('Legendary Actions',creature.stats.legendaryActions,creature.stats.legendaryActionsDescription,abilityStyling);
	}

	var generateDescription = function(creature){
		var html = '';
		if(creature.flavor.description && creature.flavor.description.length>0){
			html = html + '### Description' + newline +
				convertWhitespaceAndHtml(creature.flavor.description) + newline;
		}
		return html;
	}

	var generateNaturalCritData = function(creature){
		var html = '___' + newline +
			generateHeading(creature) +
			generateTopStats(creature) +
			generateProperties('',creature.stats.additionalAbilities) +
			generateProperties('Actions',creature.stats.actions) +
			generateProperties('Reactions',creature.stats.reactions) +
			generateLegendaryActions(creature) +
			generateDescription(creature);
		return(html);
	}

	$scope.export = {
		data: generateNaturalCritData(creature),
		filename: creature.name + '.txt'
	};

	$scope.onCopy = function(e) {
		console.log("copied!");
	}

	var clipboard = new Clipboard('#copy-to-clipboard', {
		text: function(trigger){
			return($scope.export.data);
		}
	});

	clipboard.on('success', function(e) {
		$mdToast.show(
			$mdToast.simple()
				.textContent("Text copied to clipboard!")
				.position("bottom right")
				.parent(document.getElementById('export-dialog'))
				.hideDelay(2000)
		);
		e.clearSelection();
	});

	clipboard.on('error', function(e) {
		$mdToast.show(
			$mdToast.simple()
				.textContent("Press CTRL-C to copy output!")
				.position("bottom right")
				.parent(document.getElementById('export-dialog'))
				.hideDelay(3000)
		);
		e.clearSelection();
	});

	$scope.cancel = function() {
    $mdDialog.cancel();
  };

};

angular.module('myApp').controller('exportNaturalCritCtrl',exportNaturalCritCtrl);