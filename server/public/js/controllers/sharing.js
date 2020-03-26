/**
 * sharedEntity: An object with a "sharing" component from the SharingSchema DB model. ie a creature or a bestiary.
 * entityAPIService: The Angular service which controls the API for this entity type. ie Creature or Bestiary.
 * entityLocalDirectory (string): Sets the root of the URL to view entities of this type. ie "creature" or "bestiary".
 * presentationData (object): Sets various attributes of the modal's presentation.
 *      {
 *          entityName: The name of the entity which will appear in paragraph text. ie "creature" or "bestiary".
 *          entityNameTitle: The name of the entity which will appear in the title. ie "Creature" or "Bestiary".
 *      }
 */
var sharingCtrl = function ($scope,sharedEntity,entityAPIService,entityLocalDirectory,presentationData,$mdDialog,$mdToast,$location,Auth) {
    $scope.sharedEntity = sharedEntity;
    $scope.presentationData = presentationData;

	var getLocalPath = function(sharedEntity) {
		return "/" + entityLocalDirectory + "/view/" + sharedEntity._id;
	}

	var getLink = function(sharedEntity){
		var url = $location.protocol() + "://" + $location.host();
		if ($location.port() && $location.port() != 80) {
			url = url + ":" + $location.port();
		}
		url = url + "/#" + getLocalPath(sharedEntity);
		return url;
	}

	$scope.path = getLink(sharedEntity);

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
		const linkSharingEnabled = sharedEntity.sharing && sharedEntity.sharing.linkSharingEnabled;
		return linkSharingToStatus[reverse ? !linkSharingEnabled : linkSharingEnabled];
	}

	$scope.cancel = function() {
    $mdDialog.cancel();
  };

  $scope.openUrl = function() {
  	$scope.cancel();
  	$location.path(getLocalPath(sharedEntity));
  }

  $scope.$watch("sharedEntity.sharing.linkSharingEnabled", function(newValue,oldValue){
      console.log("new value: " + newValue);
		if(oldValue!=newValue && sharedEntity._id) {
            console.log("updating: " + JSON.stringify(sharedEntity));
			$scope.loading = true;
			entityAPIService.update(sharedEntity._id, sharedEntity, function() {
                console.log("success");
				$scope.loading = false;
			}, function(err){
				console.log("error: "+err);
				$scope.loading = false;
			});
		}
	},true);

};

angular.module('myApp').controller('sharingCtrl',sharingCtrl);