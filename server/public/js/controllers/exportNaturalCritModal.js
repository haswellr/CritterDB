var exportNaturalCritCtrl = function ($scope,creature,Creature,$http,$mdDialog,$mdToast) {

	var header = "";
	Creature.calculateCreatureDetails(creature);

	var convertExtraWhitespace = function(text){
		function escapeSpaces (str) {
		    return str.replace(/^ +/mg, function (match) {
		        return match.replace(/ /g, "&nbsp;");
		    });
		}
		if(text)
				return(escapeSpaces(text).replace(/(?:\r\n|\r|\n)/g, '\n>'));
			else
				return(text);
	}

	var newline = "\n>";

	var generateHeading = function(creature){
		var html = '## ' + creature.name + newline +
			'*' + creature.stats.size.charAt(0).toUpperCase() + creature.stats.size.slice(1).toLowerCase() + ' ' + creature.stats.race.toLowerCase() + ', ' + creature.stats.alignment.toLowerCase() + '*' + newline +
			'___' + newline;
		return html;
	}

	var generateTopStats = function(creature){
		var html = tabs(3) + '<top-stats>\n' +
			tabs(4) + '<property-line>\n' +
			tabs(5) + '<h4>Armor Class</h4>\n' +
			tabs(5) + '<p>' + creature.stats.armorClass + ' ' + (creature.stats.armorType ? ('(' + creature.stats.armorType.toLowerCase() + ')') : '') + '</p>\n' +
			tabs(4) + '</property-line>\n' +
			tabs(4) + '<property-line>\n' +
			tabs(5) + '<h4>Hit Points</h4>\n' +
			tabs(5) + '<p>' + creature.stats.hitPointsStr + '</p>\n' +
			tabs(4) + '</property-line>\n' +
			tabs(4) + '<property-line>\n' +
			tabs(5) + '<h4>Speed</h4>\n' +
			tabs(5) + '<p>' + creature.stats.speed + '</p>\n' +
			tabs(4) + '</property-line>\n' +
			tabs(4) + '<abilities-block data-cha="' + creature.stats.abilityScores.charisma + '" data-con="' + creature.stats.abilityScores.constitution + '" data-dex="' + creature.stats.abilityScores.dexterity + '" data-int="' + creature.stats.abilityScores.intelligence + '" data-str="' + creature.stats.abilityScores.strength + '" data-wis="' + creature.stats.abilityScores.wisdom + '">\n' +
			tabs(4) + '</abilities-block>\n';
		if(creature.stats.savingThrows.length>0){
			html = html +
				tabs(4) + '<property-line>\n' +
				tabs(5) + '<h4>Saving Throws</h4>\n' +
				tabs(5) + '<p>';
			for(var i=0;i<creature.stats.savingThrows.length;i++){
				if(i>0)
					html = html + ', ';
				html = html + creature.stats.savingThrows[i].modifierStr;
			}
			html = html +
				'</p>\n' +
				tabs(4) + '</property-line>\n';
		}
		if(creature.stats.skills.length>0){
			html = html +
				tabs(4) + '<property-line>\n' +
				tabs(5) + '<h4>Skills</h4>\n' +
				tabs(5) + '<p>';
			for(var i=0;i<creature.stats.skills.length;i++){
				if(i>0)
					html = html + ', ';
				html = html + creature.stats.skills[i].modifierStr;
			}
			html = html +
				'</p>\n' +
				tabs(4) + '</property-line>\n';
		}
		if(creature.stats.damageVulnerabilities.length>0){
			html = html +
				tabs(4) + '<property-line>\n' +
				tabs(5) + '<h4>Damage Vulnerabilities</h4>\n' +
				tabs(5) + '<p>';
			for(var i=0;i<creature.stats.damageVulnerabilities.length;i++){
				if(i>0)
					html = html + ', ';
				html = html + creature.stats.damageVulnerabilities[i].toLowerCase();
			}
			html = html +
				'</p>\n' +
				tabs(4) + '</property-line>\n';
		}
		if(creature.stats.damageResistances.length>0){
			html = html +
				tabs(4) + '<property-line>\n' +
				tabs(5) + '<h4>Damage Resistances</h4>\n' +
				tabs(5) + '<p>';
			for(var i=0;i<creature.stats.damageResistances.length;i++){
				if(i>0)
					html = html + ', ';
				html = html + creature.stats.damageResistances[i].toLowerCase();
			}
			html = html +
				'</p>\n' +
				tabs(4) + '</property-line>\n';
		}
		if(creature.stats.damageImmunities.length>0){
			html = html +
				tabs(4) + '<property-line>\n' +
				tabs(5) + '<h4>Damage Immunities</h4>\n' +
				tabs(5) + '<p>';
			for(var i=0;i<creature.stats.damageImmunities.length;i++){
				if(i>0)
					html = html + ', ';
				html = html + creature.stats.damageImmunities[i].toLowerCase();
			}
			html = html +
				'</p>\n' +
				tabs(4) + '</property-line>\n';
		}
		if(creature.stats.conditionImmunities.length>0){
			html = html +
				tabs(4) + '<property-line>\n' +
				tabs(5) + '<h4>Condition Immunities</h4>\n' +
				tabs(5) + '<p>';
			for(var i=0;i<creature.stats.conditionImmunities.length;i++){
				if(i>0)
					html = html + ', ';
				html = html + creature.stats.conditionImmunities[i].toLowerCase();
			}
			html = html +
				'</p>\n' +
				tabs(4) + '</property-line>\n';
		}
		//Senses
		html = html +
			tabs(4) + '<property-line>\n' +
			tabs(5) + '<h4>Senses</h4>\n' +
			tabs(5) + '<p>';
		for(var i=0;i<creature.stats.senses.length;i++){
			if(i>0)
				html = html + ', ';
			html = html + creature.stats.senses[i].toLowerCase();
		}
		if(creature.stats.senses.length>0)
			html = html + ', ';
		html = html +
			tabs(5) + 'passive Perception ' + creature.stats.passivePerception +
			'</p>\n' +
			tabs(4) + '</property-line>\n';
		//Languages
		html = html +
			tabs(4) + '<property-line>\n' +
			tabs(5) + '<h4>Languages</h4>\n' +
			tabs(5) + '<p>';
		if(creature.stats.languages.length==0)
			html = html + '—';
		else {
			for(var i=0;i<creature.stats.languages.length;i++){
				if(i>0)
					html = html + ', ';
				var language = creature.stats.languages[i];
				html = html + language.charAt(0).toUpperCase() + language.slice(1).toLowerCase();
			}
		}
		html = html +
			'</p>\n' +
			tabs(4) + '</property-line>\n';
		//Challenge Rating
		html = html +
			tabs(4) + '<property-line>\n' +
			tabs(5) + '<h4>Challenge</h4>\n' +
			tabs(5) + '<p>' + creature.stats.challengeRatingStr + ' (' + creature.stats.experiencePoints + ' XP)' +
			'</p>\n' +
			tabs(4) + '</property-line>\n';
		html = html + 
			tabs(3) + '</top-stats>\n';
		return html;
	}

	var generateAbility = function(ability){
		var html = tabs(3) + '<property-block>\n' +
			tabs(4) + '<h4>' + ability.name + '</h4>\n' +
			tabs(4) + '<p>' + convertExtraWhitespace(ability.description) + '</p>\n' +
			tabs(3) + '</property-block>\n';
		return(html);
	}

	var generateProperties = function(title,abilities){
		var html = '';
		if(abilities && abilities.length>0){
			if(title)
				html = html + tabs(3) + '<h3>' + title + '</h3>\n';
			for(var i=0;i<abilities.length;i++){
				html = html + generateAbility(abilities[i]);
			}
		}
		return html;
	}

	var generateLegendaryActions = function(creature){
		var html = '';
		if(creature.stats.legendaryActions && creature.stats.legendaryActions.length>0) {
			html = html + tabs(3) + '<h3>Legendary Actions</h3>\n' +
				tabs(3) + '<p>The ' + creature.name.toLowerCase() + ' can take ' + creature.stats.legendaryActionsPerRound + ' legendary actions, choosing from the options below. Only one legendary action option can be used at a time and only at the end of another creature\'s turn. The ' + creature.name.toLowerCase() + ' regains spent legendary actions at the start of its turn.</p>\n' +
				'\n' +
				generateProperties(null,creature.stats.legendaryActions);
		}
		return html;
	}

	var generateDescription = function(creature){
		var html = '';
		if(creature.flavor.description && creature.flavor.description.length>0){
			html = html + tabs(3) + '<h3>Description</h3>\n' +
				tabs(3) + '<p>' + convertExtraWhitespace(creature.flavor.description) + '</p>\n';
		}
		return html;
	}

	var generateHTML = function(creature){
		var html = header + '\n' +
			tabs(2) + '<stat-block>\n' +
			generateHeading(creature) +
			generateTopStats(creature) +
			generateProperties('',creature.stats.additionalAbilities) +
			generateProperties('Actions',creature.stats.actions) +
			generateProperties('Reactions',creature.stats.reactions) +
			generateLegendaryActions(creature) +
			generateDescription(creature) +
			tabs(2) + '</statblock>\n' +
			tabs(1) + '</body>\n' +
			'</html>\n';
		return(html);
	}

	$scope.export = {
		html: '',
		filename: creature.name + '.html'
	};

	$scope.onCopy = function(e) {
		console.log("copied!");
	}

	var clipboard = new Clipboard('#copy-to-clipboard', {
		text: function(trigger){
			return($scope.export.html);
		}
	});

	clipboard.on('success', function(e) {
		$mdToast.show(
			$mdToast.simple()
				.textContent("HTML copied to clipboard!")
				.position("bottom right")
				.parent(document.getElementById('export-dialog'))
				.hideDelay(3000)
		);
		e.clearSelection();
	});

	clipboard.on('error', function(e) {
		$mdToast.show(
			$mdToast.simple()
				.textContent("Press CTRL-C to copy HTML!")
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

angular.module('myApp').controller('exportHtmlCtrl',exportHtmlCtrl);