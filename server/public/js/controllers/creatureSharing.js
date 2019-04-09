var creatureSharingCtrl = function ($scope,creature,$mdDialog,$mdToast,$location,Creature,Auth) {
	$scope.creature = creature;

	var getLocalPath = function(creature) {
		return "/creature/view/" + creature._id;
	}

	var getLink = function(creature){
		var url = $location.protocol() + "://" + $location.host();
		if ($location.port() && $location.port() != 80) {
			url = url + ":" + $location.port();
		}
		url = url + "/#" + getLocalPath(creature);
		return url;
	}

	$scope.path = getLink(creature);

	var clipboard = new Clipboard('#copy-to-clipboard', {
		text: function(trigger){
			return($scope.path);
		}
	});

	clipboard.on('success', function(e) {
		$mdToast.show(
			$mdToast.simple()
				.textContent("Link copied to clipboard!")
				.position("bottom right")
				.parent(document.getElementById('share-dialog'))
				.hideDelay(2000)
		);
		e.clearSelection();
	});

	clipboard.on('error', function(e) {
		$mdToast.show(
			$mdToast.simple()
				.textContent("Press CTRL-C to copy link!")
				.position("bottom right")
				.parent(document.getElementById('share-dialog'))
				.hideDelay(3000)
		);
		e.clearSelection();
	});

	var linkSharingToStatus = {
		true: "ON",
		false: "OFF"
	};
	$scope.getLinkSharingStatus = function(reverse) {
		const linkSharingEnabled = creature.sharing && creature.sharing.linkSharingEnabled;
		return linkSharingToStatus[reverse ? !linkSharingEnabled : linkSharingEnabled];
	}

	$scope.cancel = function() {
    $mdDialog.cancel();
  };

  $scope.openUrl = function() {
  	$scope.cancel();
  	$location.path(getLocalPath(creature));
  }

  $scope.$watch("creature.sharing.linkSharingEnabled", function(newValue,oldValue){
		if(oldValue!=newValue && creature._id) {
			$scope.loading = true;
			Creature.update(creature._id, creature, function() {
				$scope.loading = false;
			}, function(err){
				console.log("error: "+err);
				$scope.loading = false;
			});
		}
	},true);

};

angular.module('myApp').controller('creatureSharingCtrl',creatureSharingCtrl);