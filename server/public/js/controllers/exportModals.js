var exportHtmlCtrl = function ($scope,creature,Creature,$http,$mdDialog,$mdToast) {

	var header = "";
	Creature.calculateCreatureDetails(creature);

	$scope.loading = true;

	$http.get("/assets/data/valloricHeader.html").then(function(response){
		header = response.data;
		$scope.loading = false;
		$scope.export.html = generateHTML(creature);
	});

	var generateHeading = function(creature){
		var html = '<creature-heading>\n' +
			'<h1>'+creature.name+'</h1>\n' +
			'<h2>'+ creature.stats.size.charAt(0).toUpperCase() + creature.stats.size.slice(1).toLowerCase() + ' ' + creature.stats.race.toLowerCase() + ', ' + creature.stats.alignment.toLowerCase() + '</h2>\n' +
			'</creature-heading>';
		return html;
	}

	var generateTopStats = function(creature){
		var html = '<top-stats>\n' +
			'<property-line>\n' +
			'<h4>Armor Class</h4>\n' +
			'<p>' + creature.stats.armorClass + ' ' + (creature.stats.armorType ? ('(' + creature.stats.armorType.toLowerCase() + ')') : '') + '</p>\n' +
			'</property-line>\n' +
			'<property-line>\n' +
			'<h4>Hit Points</h4>\n' +
			'<p>' + creature.stats.hitPointsStr + '</p>\n' +
			'</property-line>\n' +
			'<property-line>\n' +
			'<h4>Speed</h4>\n' +
			'<p>' + creature.stats.speed + '</p>\n' +
			'</property-line>\n' +
			'<abilities-block data-cha="' + creature.stats.abilityScores.charisma + '" data-con="' + creature.stats.abilityScores.constitution + '" data-dex="' + creature.stats.abilityScores.dexterity + '" data-int="' + creature.stats.abilityScores.intelligence + '" data-str="' + creature.stats.abilityScores.strength + '" data-wis="' + creature.stats.abilityScores.wisdom + '"\n';
			'</abilities-block>\n' +
			//CONTINUE FROM HERE (damage immunities, etc)
		return html;
	}

	var generateProperties = function(title,abilities){
		var html = "";

		return html;
	}

	var generateLegendaryActions = function(creature){
		var html = "";

		return html;
	}

	var generateDescription = function(creature){
		var html = "";

		return html;
	}

	var generateHTML = function(creature){
		var html = header +
			'<stat-block>\n' +
			generateHeading(creature) +
			generateTopStats(creature) +
			generateProperties('',creature.additionalAbilities) +
			generateProperties('Actions',creature.actions) +
			generateProperties('Reactions',creature.reactions) +
			generateLegendaryActions(creature) +
			generateDescription(creature) +
			'</statblock>\n' +
			'</body>\n' +
			'</html>\n';
		return(html);
	}

	$scope.export = {
		html: ''
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