var generateSpellcastingCtrl = function ($scope,creature,CreatureData,$mdDialog, TextUtils) {

	$scope.creatureData = CreatureData;

	$scope.spellLevels = [];
	var initializeSpellLevelArray = function(){
		for(var i=0;i<=9;i++){
			$scope.spellLevels.push(i);
		}
	}
	initializeSpellLevelArray();
	$scope.getSpellLevelText = function(level){
		if(level==0)
			return("Cantrips");
		else
			return("Level "+level+" spells");
	}

	$scope.spellcasting = (function(){
		return {
			type: 'Innate',	//wizard, cleric, innate, etc
			ability: 'charisma',
			level: 1,				//1-20
			components: {
				material: false,
				somatic: true,
				verbal: true
			},
			spells: {
				level0: [],
				level1: [],
				level2: [],
				level3: [],
				level4: [],
				level5: [],
				level6: [],
				level7: [],
				level8: [],
				level9: [],
				atWill: [],
				perDay3: [],
				perDay2: [],
				perDay1: []
			},
			getHighestSpellSlotLevel: function(){
				if(this.type){
					var spellcaster = CreatureData.spellcasters[this.type];
					if(this.level){
						var spellSlots = spellcaster.level[this.level].spellSlots;
						return(spellSlots.length);
					}
					else{
						return 0;
					}
				}
				else {
					return 0;
				}
			},
			hasSpellSlotsOfLevel: function(level){
				if(this.type){
					var spellcaster = CreatureData.spellcasters[this.type];
					if(level==0)
						return true;
					else if(this.level){
						var spellSlots = spellcaster.level[this.level].spellSlots;
						if(spellSlots.hasOwnProperty(level-1) && spellSlots[level-1]!=0)
							return true;
					}
					else {
						return false;
					}
				}
				else{
					return false;
				}
			},
			typeChanged: function(){
				var spellcaster = CreatureData.spellcasters[this.type];
				if(spellcaster){
					if(spellcaster.ability){
						this.ability = spellcaster.ability;
					}
					if(spellcaster.components){
						this.components = angular.copy(spellcaster.components);
					}
				}
			},
			getSaveDC: function(creature){
				var dc = 8 +
					creature.stats.proficiencyBonus +
					creature.stats.abilityScoreModifiers[this.ability];
				return(dc);
			},
			getSpellAttackBonus: function(creature){
				var bonus = creature.stats.proficiencyBonus +
					creature.stats.abilityScoreModifiers[this.ability];
				return(bonus);
			}
		}
	})();
	$scope.$watch("spellcasting.type",function(newValue,oldValue){
		if(oldValue!=newValue)
			$scope.spellcasting.typeChanged();
	},true);

	var generateStatsText = function(){
		var text = "(spell save DC " +
			$scope.spellcasting.getSaveDC(creature) +
			", +" +
			$scope.spellcasting.getSpellAttackBonus(creature) +
			" to hit with spell attacks)";
		return(text);
	}

	var generateComponentText = function(){
		var text = "";
		var requiredComponents = [];
		var notRequiredComponents = [];
		for(var key in $scope.spellcasting.components){
			if($scope.spellcasting.components.hasOwnProperty(key)){
				var componentType = $scope.spellcasting.components[key];
				if(componentType)
					requiredComponents.push(key);
				else
					notRequiredComponents.push(key);
			}
		}
		if(requiredComponents.length<3){
			if($scope.spellcasting.type=="Innate"){
				text = text + ", requiring ";
				if(notRequiredComponents.length==1){
					text = text + "no " +
						notRequiredComponents[0] +
						" components";
				}
				else if(notRequiredComponents.length==2){
					text = text + "only " +
						requiredComponents[0] +
						" components";
				}
				else{
					text = text +"no components";
				}
			}
			else{
				text = TextUtils.capitalizeFirstLetter(TextUtils.getCreatureNameAsIt(creature)) + " requires ";
				if(notRequiredComponents.length==1){
					text = text + "no " +
						notRequiredComponents[0] +
						" components to cast its spells";
				}
				else if(notRequiredComponents.length==2){
					text = text + "only " +
						requiredComponents[0] +
						" components to cast its spells";
				}
				else{
					text = text +"no components to cast its spells";
				}
				text = text + ". ";
			}
		}
		return(text);
	}

	var generateSpellLine = function(type,spells){
		var text = type + ": ";
		for(var i=0;i<spells.length;i++){
			var spell = spells[i];
			text = text + "<i>" + spell.toLowerCase() + "</i>";
			if(i<(spells.length-1))
				text = text + ", ";
		}
		return(text);
	}

	function getOrdinal(n) {
	  var s=["th","st","nd","rd"],
	      v=n%100;
	  return n+(s[(v-20)%10]||s[v]||s[0]);
	}

	var generateSpellBlock = function(){
		var text = "";
		var tryAddLine = function(title,levelStr,level){
			var spellcasterData = CreatureData.spellcasters[$scope.spellcasting.type];
			var slots = undefined;
			if(level && spellcasterData.hasOwnProperty("level")){
				var dataByLevel = spellcasterData["level"];
				if(dataByLevel.hasOwnProperty($scope.spellcasting.level)){
					var slotsByLevel = dataByLevel[$scope.spellcasting.level].spellSlots;
					if(slotsByLevel){
						slots = slotsByLevel[level-1];
					}
				}
			}
			if($scope.spellcasting.spells[levelStr].length>0 && (slots==undefined || slots>0)){
				if(slots>0){
					title = title + " ("+ slots +" slots)";
				}
				text = text +
					generateSpellLine(title,$scope.spellcasting.spells[levelStr]) +
					"\n";
			}
		}
		if($scope.spellcasting.type=="Innate"){
			tryAddLine("At will","atWill");
			tryAddLine("3/day","perDay3");
			tryAddLine("2/day","perDay2");
			tryAddLine("1/day","perDay1");
		}
		else{
			var slots = 0;
			tryAddLine("Cantrip (at will)","level0");
			for(var i=1;i<=9;i++){
				var title = getOrdinal(i);
				tryAddLine(getOrdinal(i)+" level","level"+i,i);
			}
		}
		if(text[text.length-1]=='\n')
			text = text.substring(0,text.length-1);	//cut off the ending newline
		return(text);
	}

	var generateInnateDescription = function(){
		var abilityStr = TextUtils.capitalizeFirstLetter($scope.spellcasting.ability);
		var possessiveCreatureName = TextUtils.getPossessive(TextUtils.getCreatureNameAsProperNoun(creature));
		var text = TextUtils.capitalizeFirstLetter(possessiveCreatureName) +
			" innate spellcasting ability is " + abilityStr + " " + generateStatsText() +
			". " + TextUtils.capitalizeFirstLetter(TextUtils.getCreatureNameAsIt(creature)) +
			" can " + "innately cast the following spells" + generateComponentText() +
			":\n\n" + generateSpellBlock();
		return(text);
	}

	var generateClassDescription = function(){
		var abilityStr = TextUtils.capitalizeFirstLetter($scope.spellcasting.ability);
		var levelStr = TextUtils.getOrdinal($scope.spellcasting.level)+"-level";
		var classStr = $scope.spellcasting.type.toLowerCase();
		var possessiveCreatureName = TextUtils.getPossessive(TextUtils.getCreatureNameAsProperNoun(creature));
		var text = TextUtils.capitalizeFirstLetter(TextUtils.getCreatureNameAsProperNoun(creature)) +
			" is a " + levelStr + " spellcaster. " + TextUtils.capitalizeFirstLetter(possessiveCreatureName) +
			" spellcasting ability is " + abilityStr + " " + generateStatsText() + ". " +
			generateComponentText() + TextUtils.capitalizeFirstLetter(TextUtils.getCreatureNameAsProperNoun(creature)) +
			" has the following " + classStr + " spells prepared:\n\n" + generateSpellBlock();
		return(text);
	}

	var generateDescription = function(){
		if($scope.spellcasting.type=='Innate')
			return(generateInnateDescription());
		else
			return(generateClassDescription());
	}

	var generateTitle = function(){
		if($scope.spellcasting.type=='Innate')
			return("Innate Spellcasting");
		else
			return("Spellcasting");
	}

	$scope.generateSpellcasting = function() {
		var ability = {
			name: generateTitle(),
			description: generateDescription()
		};
		$mdDialog.hide(ability);
	}
	$scope.cancel = function() {
    $mdDialog.cancel();
  };

  $scope.searchArray = function(searchText,arrayToSearch,includeSearch){
		var returnedVals = [];
		if(searchText && arrayToSearch){
			var searchTextLower = searchText.toLowerCase();
			for(var i=0;i<arrayToSearch.length;i++){
				if(arrayToSearch[i].toLowerCase().indexOf(searchTextLower)!=-1)
					returnedVals.push(arrayToSearch[i]);
			}
		}
		if(includeSearch)
			returnedVals.push(searchText);
		return(returnedVals);
	};

	$scope.searchSpellNames = function(searchText,level){
		var returnedVals = [];
		if(searchText){
			var searchTextLower = searchText.toLowerCase();
			var classLower = ($scope.spellcasting.type!='Innate' ? $scope.spellcasting.type.toLowerCase() : null);
			for(var i=0;i<CreatureData.spells.length;i++){
				var spell = CreatureData.spells[i];
				var matchesLevel = (level==undefined || level==null || spell.level==level || (level==0 && spell.level.toLowerCase()=="cantrip"));
				var matchesClass = (classLower==undefined || classLower==null || spell.tags.indexOf(classLower)!=-1);
				var matchesName = (spell.name.toLowerCase().indexOf(searchTextLower)!=-1);
				var school = spell[school] || "";
				var matchesSchool = (school.toLowerCase().indexOf(searchTextLower)!=-1);
				if(matchesLevel && matchesClass && (matchesName || matchesSchool))
					returnedVals.push(spell.name);
			}
		}
		returnedVals.push(searchText);
		return(returnedVals);
	};
};

angular.module('myApp').controller('generateSpellcastingCtrl', generateSpellcastingCtrl);
