var importCreatureCtrl = function ($scope, bestiary, $mdDialog, $mdToast, DataAdapter, Creature, updateBestiaryCreaturesFunction) {
    $scope.loading = true;
    $scope.importFormats = {
        "CritterDB Creature": {
            name: "CritterDB Creature",
            description: "Import a single CritterDB creature. Paste a single creature below, in CritterDB JSON format.",
            adapterFormat: DataAdapter.Format["CRITTERDB"],
            getCreatureListFunction: function (importData) {
                const creatureList = [];
                if (importData) {
                    creatureList.push(importData);
                }
                return creatureList;
            }
        },
        "CritterDB Bestiary": {
            name: "CritterDB Bestiary",
            description: "Import all of the creatures from a CritterDB bestiary. Paste a single bestiary below, in CritterDB JSON format.",
            adapterFormat: DataAdapter.Format["CRITTERDB"],
            getCreatureListFunction: function (importData) {
                const creatureList = [];
                if (importData && importData.creatures) {
                    creatureList.push(...importData.creatures);
                }
                return creatureList;
            }
        }
    }
    $scope.importFormatIds = Object.keys($scope.importFormats);
    $scope.creaturesToImport = [];

    function getSelectedImportFormat() {
        return $scope.importFormats[$scope.selectedImportFormatId];
    }

    $scope.import = function () {
        if ($scope.loading) {
            console.error("Unable to import while text conversion is still processing.");
            return;
        }
        if (!$scope.creaturesToImport) {
            console.error("No creatures found to import.");
            return;
        }
        if (!bestiary || !bestiary._id) {
            console.error("Invalid bestiary.");
            return;
        }

        var numCreaturesCreated = 0;
        var numCreaturesToCreate = 0;
        $scope.creaturesToImport.forEach(creature => {
            const newCreature = {
                name: creature.name,
                flavor: creature.flavor,
                stats: creature.stats,
                bestiaryId: bestiary._id
            };
            numCreaturesToCreate++;
            Creature.create(newCreature, function (data) {
                numCreaturesCreated++;
                if (numCreaturesCreated >= numCreaturesToCreate) {
                    updateBestiaryCreaturesFunction();
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent(`${numCreaturesCreated} creatures imported!`)
                            .position("bottom right")
                            .parent(document.getElementById('import-dialog'))
                            .hideDelay(2000)
                    );
                }
            }, function (err) {
                numCreaturesToCreate--;
                console.error("Error creating creature: " + err);
            });
        });
        $scope.importText = "";
    }

    function update() {
        $scope.loading = true;
        if (!$scope.selectedImportFormatId || !$scope.importText) {
            return;
        } else {
            $scope.importForm.importText.$error = {};
            try {
                const importData = DataAdapter.import($scope.importText, getSelectedImportFormat().adapterFormat);
                $scope.creaturesToImport = getSelectedImportFormat().getCreatureListFunction(importData);
                if (!$scope.creaturesToImport || $scope.creaturesToImport.count === 0) {
                    $scope.importForm.importText.$error.empty = true;
                    return;
                }
                $scope.loading = false;
            } catch (err) {
                $scope.importForm.importText.$error.format = true;
            }
        }
    }

    $scope.$watch("importText", function (newValue, oldValue) {
        if (oldValue != newValue) {
            update();
        }
    });
    $scope.$watch("selectedImportFormatId", function (newValue, oldValue) {
        if (oldValue != newValue) {
            update();
        }
    });

    $scope.cancel = function () {
        $mdDialog.cancel();
    };

};

angular.module('myApp').controller('importCreatureCtrl', importCreatureCtrl);