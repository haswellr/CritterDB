angular.module('myApp').factory("ChallengeRatingCalculator", function($mdMedia,$mdDialog) {

	var calculateChallengeRatingCtrl = function ($scope,creature,$mdDialog,CreatureData) {

		$scope.challengeParameters = {
			attackBonus: 0,
			damagePerRound: 0,
			saveDC: 0,
			resistances: {
				resistances: false,
				immunities: false,
				vulnerabilities: false
			},
			specialBonuses: {
				offense: 0,
				defense: 0
			}
		};

		$scope.challengeRating = {
			offense: 0,
			defense: 0,
			combined: 0
		}

		$scope.creature = JSON.parse(JSON.stringify(creature));

		var calculateDefensiveChallengeRating = function(hitPoints, armorClass) {
			var defensiveCR = 0.125;
			console.log("cr: " + JSON.stringify(CreatureData.challengeRating));
			for(var cr in CreatureData.challengeRating) {
				if(parseFloat(cr) > defensiveCR && hitPoints >= CreatureData.challengeRating[cr].hitPoints.min) {
					console.log("CR[" + cr + "] hitPoints > " + CreatureData.challengeRating[cr].hitPoints.min)
					defensiveCR = parseFloat(cr);
				}
			}
			defensiveCR = defensiveCR + Math.floor((armorClass - CreatureData.challengeRating[defensiveCR].armorClass)/2.0);
			return(defensiveCR);
		}

		var calculateOffensiveChallengeRating = function(damage, attackBonus, saveDC) {
			var offensiveCR = 0.125;
			for(var cr in CreatureData.challengeRating) {
				if(parseFloat(cr) > offensiveCR && damage >= CreatureData.challengeRating[cr].damage.min || saveDC >= CreatureData.challengeRating[cr].saveDC) {
					offensiveCR = parseFloat(cr);
				}
			}
			offensiveCR = offensiveCR + Math.floor((attackBonus - CreatureData.challengeRating[offensiveCR].attackBonus)/2.0);
			return(offensiveCR);
		}

		var populateChallengeRating = function(){
			//defensive CR
			//find 'true' hit point value based on hitPoints x/ resistances
			var estimatedDefensiveCR = calculateDefensiveChallengeRating($scope.creature.stats.hitPoints, $scope.creature.stats.armorClass);
			var trueHitPoints = $scope.creature.stats.hitPoints;
			if($scope.challengeParameters.resistances.resistances) {
				if(estimatedDefensiveCR < 5)
					trueHitPoints = trueHitPoints * 2;
				else if(estimatedDefensiveCR < 11)
					trueHitPoints = trueHitPoints * 1.5;
				else if(estimatedDefensiveCR < 17)
					trueHitPoints = trueHitPoints * 1.25;
			}
			if($scope.challengeParameters.resistances.immunities) {
				if(estimatedDefensiveCR < 11)
					trueHitPoints = trueHitPoints * 2;
				else if(estimatedDefensiveCR < 17)
					trueHitPoints = trueHitPoints * 1.5;
				else
					trueHitPoints = trueHitPoints * 1.25;
			}
			if($scope.challengeParameters.resistances.vulnerabilities) {
				trueHitPoints = trueHitPoints / 2;
			}
			//find CR based on 'true' hit points and armor class
			var defensiveCR = calculateDefensiveChallengeRating(trueHitPoints, $scope.creature.stats.armorClass);
			//modify based on special bonus
			defensiveCR = defensiveCR + $scope.challengeParameters.specialBonuses.defense;
			//offensive CR
			var offensiveCR = calculateOffensiveChallengeRating($scope.challengeParameters.damagePerRound, $scope.challengeParameters.attackBonus, $scope.challengeParameters.saveDC);
			offensiveCR = offensiveCR + $scope.challengeParameters.specialBonuses.offense;
			//set challenge rating
			$scope.challengeRating.defense = defensiveCR;
			$scope.challengeRating.offense = offensiveCR;
			$scope.challengeRating.combined = Math.min(30,Math.round((offensiveCR + defensiveCR)/2.0));
		}

		$scope.$watch("creature",function(newValue,oldValue){
			if(oldValue!=newValue)
				populateChallengeRating();
		},true);

		$scope.$watch("challengeParameters",function(newValue,oldValue){
			if(oldValue!=newValue)
				populateChallengeRating();
		},true);

		$scope.finish = function() {
			$mdDialog.hide($scope.challengeRating.combined);
		}

		$scope.cancel = function() {
	    $mdDialog.cancel();
	  };

	  populateChallengeRating();
	};

	return({
		// ev: the event that opens this dialog
		// creature: the creature whose CR is being calculated
		// callback: A callback function. function(integer challengeRating).
		openDialog: function(ev, creature, callback) {
			let useFullScreen;
			let parent;
			if($mdMedia('sm') || $mdMedia('xs')) {
				useFullScreen = true;
				parent = angular.element(document.body);
			}
			else {
				useFullScreen = false;
				parent = angular.element(document.querySelector('#create-creature-area'));
			}
			$mdDialog.show({
				controller: calculateChallengeRatingCtrl,
				templateUrl: '/assets/partials/creature/create-challenge-calculate-challenge-rating.html',
				parent: parent,
				targetEvent: ev,
				clickOutsideToClose:true,
				locals: {
					'creature': creature
				},
				fullscreen: useFullScreen
			})
			.then(callback);
		}
	});
});
