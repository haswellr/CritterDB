var generateAttackCtrl = function ($scope,creature,CreatureData,$mdDialog) {

	$scope.creatureData = CreatureData;

	$scope.attack = {
		weapon: '',
		melee: true,
		ranged: false,
		reach: 5,
		shortRange: 80,
		longRange: 320,
		damageType: 'Slashing',
		damageDiceSize: 6,
		damageDiceNum: 1,
	};

	var createDamageStr = function(damageType,diceSize,numDice,modifier){
		var diceAvg = (diceSize/2.0) + 0.5;
		var avgDamage = Math.floor(numDice * diceAvg) + modifier;
		var damageStr = avgDamage + " (" + numDice + "d" + diceSize;
		if(modifier!=0)
			damageStr = damageStr + " + "	+ modifier;
		damageStr = damageStr + ") " + damageType.toLowerCase() + " damage";
		return(damageStr);
	}

	//melee, ranged, versatile, bonus damage
	var createDescription = function(attack){
		var ability = "strength";
		if((attack.finesse && creature.stats.abilityScoreModifiers["dexterity"] > creature.stats.abilityScoreModifiers["strength"]) || (attack.ranged && !attack.melee))
			ability = "dexterity";
		var type;
		if(attack.melee && attack.ranged)
			type = "Melee or Ranged Weapon Attack:";
		else if(attack.melee)
			type = "Melee Weapon Attack:";
		else if(attack.ranged)
			type = "Ranged Weapon Attack:";
		else
			type = "Weapon Attack:";
		var toHit = creature.stats.abilityScoreModifiers[ability]
			+ creature.stats.proficiencyBonus;
		var toHitStr = toHit >= 0 ? "+" + toHit : toHit;
		var rangeStr;
		if(attack.melee && attack.ranged)
			rangeStr = "reach " + attack.reach + " ft. or range " + attack.shortRange
				+ "/" + attack.longRange + " ft.";
		else if(attack.melee)
			rangeStr = "reach " + attack.reach + " ft.";
		else if(attack.ranged)
			rangeStr = "range " + attack.shortRange + "/" + attack.longRange + " ft.";
		var damageMod = creature.stats.abilityScoreModifiers[ability];
		var meleeDamageStr,
			rangedDamageStr,
			twoHandedDamageStr,
			bonusDamageStr;
		if(attack.melee)
			meleeDamageStr = createDamageStr(attack.damageType,attack.damageDiceSize,attack.damageDiceNum,damageMod);
		if(attack.ranged)
			rangedDamageStr = createDamageStr(attack.rangedDamageType,attack.rangedDamageDiceSize,attack.rangedDamageDiceNum,damageMod);
		if(attack.versatile)
			twoHandedDamageStr = createDamageStr(attack.twoHandedDamageType,attack.twoHandedDamageDiceSize,attack.twoHandedDamageDiceNum,damageMod);
		if(attack.bonusDamage)
			bonusDamageStr = createDamageStr(attack.bonusDamageType,attack.bonusDamageDiceSize,attack.bonusDamageDiceNum,0);
		var hitStr, needsCommaBeforeBonusDamage;
		if(attack.melee){
			hitStr = meleeDamageStr;
			if(attack.ranged){
				hitStr = hitStr + " in melee, or " + rangedDamageStr + " at range";
				needsCommaBeforeBonusDamage = true;
			}
		}
		else if(attack.ranged)
			hitStr = rangedDamageStr;
		if(attack.versatile) {
			hitStr = hitStr + ", or " + twoHandedDamageStr + " if used with two "
				+ "hands to make a melee attack";
			needsCommaBeforeBonusDamage = true;
		}
		if(attack.bonusDamage) {
			if (needsCommaBeforeBonusDamage) {
				hitStr = hitStr + ",";
				needsCommaBeforeBonusDamage = false;
			}
			hitStr = hitStr + " plus " + bonusDamageStr;
		}

		var description = "<i>" + type + "</i> " + toHitStr + " to hit, " + rangeStr
			+ ", one target. <i>Hit:</i> " + hitStr + ".";
		return(description);
	}

	$scope.generateAttack = function() {
		var ability = {
			name: $scope.attack.weapon,
			description: createDescription($scope.attack)
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
	}

	$scope.weapon = {
		changed: function(){
			var weapon = $scope.attack.weapon;
			if(CreatureData.weaponTypeDefaults.hasOwnProperty(weapon)){
				$scope.attack = angular.copy(CreatureData.weaponTypeDefaults[weapon]);
				$scope.attack.weapon = weapon;
			}
		}
	}
	$scope.$watch("attack.weapon",function(newValue,oldValue){
		if(oldValue!=newValue)
			$scope.weapon.changed();
	},true);
};


angular.module('myApp').controller('generateAttackCtrl', generateAttackCtrl);