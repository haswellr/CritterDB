var exportCreatureJsonCtrl = function ($scope, creature, $mdDialog, $mdToast, DataAdapter) {

    $scope.loading = true;

    $scope.exportFormats = {
        "CritterDB JSON": {
            name: "CritterDB JSON",
            fileSuffix: "",
            fileExtension: "json",
            description: "Export this bestiary in CritterDB's JSON format.",
            adapterFormat: DataAdapter.Format["CRITTERDB"]
        },
        "5E Tools": {
            name: "5E Tools",
            fileSuffix: "_(5e_tools)",
            fileExtension: "json",
            description: '<a href="https://5e.tools/">5E Tools</a> has a browseable collection of official 5E information, including core rules, monsters, and more. Additionally, creatures in the 5E Tools format can be imported into the Roll20 virtual tabletop.',
            adapterFormat: DataAdapter.Format["5E_TOOLS_CREATURE"]
        }
    }
        
    $scope.exportFormatIds = Object.keys($scope.exportFormats);

    function getSelectedExportFormat() {
        return $scope.exportFormats[$scope.selectedExportFormatId];
    }

    function calculateExportData() {
        return {
            filename: `${creature.name}${getSelectedExportFormat().fileSuffix}.${getSelectedExportFormat().fileExtension}`,
            data: DataAdapter.adapt(creature, getSelectedExportFormat().adapterFormat)
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

	var clipboard = new Clipboard('#copy-to-clipboard', {
		text: function (trigger) {
			return ($scope.export.data);
		}
	});

	clipboard.on('success', function (e) {
		$mdToast.show(
			$mdToast.simple()
				.textContent("Creature copied to clipboard!")
				.position("bottom right")
				.parent(document.getElementById('export-dialog'))
				.hideDelay(2000)
		);
		e.clearSelection();
	});

	clipboard.on('error', function (e) {
		$mdToast.show(
			$mdToast.simple()
				.textContent("Press CTRL-C to copy creature!")
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

angular.module('myApp').controller('exportCreatureJsonCtrl',exportCreatureJsonCtrl);