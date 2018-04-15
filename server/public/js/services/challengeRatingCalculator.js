angular.module('myApp').factory("ChallengeRatingCalculator", function($mdMedia,$mdDialog) {

	var calculateChallengeRatingCtrl = function ($scope,creature,$mdDialog) {

		$scope.challengeParameters = {
			challenge: {
				defensive: 0,
				offensive: 0,
				combined: 0
			}
		};

		$scope.finish = function() {
			$mdDialog.hide($scope.challengeParameters.challenge.combined);
		}

		$scope.cancel = function() {
	    $mdDialog.cancel();
	  };
	};

	return({
		// ev: the event that opens this dialog
		// creature: the creature whose CR is being calculated
		// callback: A callback function. function(integer challengeRating).
		openDialog: function(ev, creature, callback) {
			var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
	    $mdDialog.show({
	      controller: calculateChallengeRatingCtrl,
	      templateUrl: '/assets/partials/creature/create-challenge-calculate-challenge-rating.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      clickOutsideToClose:true,
	      locals: {
	      	'creature': creature
	      },
	      fullscreen: useFullScreen
	    })
	    .then(callback);
		}
	})
	
});
