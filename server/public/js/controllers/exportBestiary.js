var exportBestiaryCtrl = function ($scope, bestiary, $mdDialog, $mdToast, DataAdapter) {

    $scope.loading = true;

    $scope.exportFormats = {
        "5E Tools": {
            name: "5E Tools",
            fileSuffix: "5e_tools",
            fileExtension: "json",
            description: '<a href="https://5e.tools/">5E Tools</a> has a browseable collection of official 5E information, including core rules, monsters, and more. Additionally, creatures in the 5E Tools format can be imported into the Roll20 virtual tabletop. Use 5E Tools as a way to get your CritterDB monsters into Roll20.',
            adapterFormat: DataAdapter.Format["5E_TOOLS_BESTIARY"]
        }
    }
        
    $scope.exportFormatIds = Object.keys($scope.exportFormats);

    function getSelectedExportFormat() {
        console.log("selected id: !" + $scope.selectedExportFormatId + "!");
        console.log("selected format: " + JSON.stringify($scope.exportFormats[$scope.selectedExportFormatId]));
        return $scope.exportFormats[$scope.selectedExportFormatId];
    }

    function calculateExportData() {
        return {
            filename: `${bestiary.name}_(${getSelectedExportFormat().fileSuffix}).${getSelectedExportFormat().fileExtension}`,
            data: DataAdapter.adapt(bestiary, getSelectedExportFormat().adapterFormat)
        }
    }

    $scope.export = {}
    
    $scope.$watch("selectedExportFormatId",function(newValue,oldValue){
		if(oldValue!=newValue) {
            if (!newValue) {
                $scope.loading = true;
            } else {
                $scope.export = calculateExportData();
                $scope.loading = false;
            }
        }
	});

	$scope.onCopy = function (e) {
		console.log("copied!");
	}

	var clipboard = new Clipboard('#copy-to-clipboard', {
		text: function (trigger) {
            console.log("clip text");
			return ($scope.export.data);
		}
	});

	clipboard.on('success', function (e) {
        console.log("clip success");
		$mdToast.show(
			$mdToast.simple()
				.textContent("Bestiary copied to clipboard!")
				.position("bottom right")
				.parent(document.getElementById('export-dialog'))
				.hideDelay(2000)
		);
		e.clearSelection();
	});

	clipboard.on('error', function (e) {
        console.log("clip fail");
		$mdToast.show(
			$mdToast.simple()
				.textContent("Press CTRL-C to copy bestiary!")
				.position("bottom right")
				.parent(document.getElementById('export-dialog'))
				.hideDelay(3000)
		);
		e.clearSelection();
	});

	$scope.cancel = function () {
		$mdDialog.cancel();
	};

};

angular.module('myApp').controller('exportBestiaryCtrl',exportBestiaryCtrl);