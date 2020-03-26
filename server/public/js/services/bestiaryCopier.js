angular.module('myApp').factory("BestiaryCopier", function (Bestiary, Creature, Auth) {

    var BestiaryCopier = {};

    var copyCreaturesToBestiary = function (originalBestiary, createdBestiary, successCallback, errorCallback) {
        var copiedCount = 0;
        var totalToCopy = originalBestiary.creatures.length;
        var finishedCreatingCreature = function () {
            copiedCount = copiedCount + 1;
            if (copiedCount == totalToCopy) {
                successCallback(createdBestiary);
            }
        }
        for (var i = 0; i < originalBestiary.creatures.length; i++) {
            var newCreature = angular.copy(originalBestiary.creatures[i]);
            newCreature._id = undefined;
            newCreature.bestiaryId = createdBestiary._id;
            newCreature.publishedBestiaryId = undefined;
            Creature.create(newCreature, finishedCreatingCreature, finishedCreatingCreature);
        }
    }

    /**
     * Copies the provided Bestiary or PublishedBestiary to a new bestiary owned by the current user. When finished, calls callback, passing in the new bestiary.
     */
    BestiaryCopier.copy = function (bestiary, successCallback, errorCallback) {
        if (!Auth.user) {
            setTimeout(function() {
                errorCallback("Must be logged in to copy a bestiary.")
            });
        }
        var newBestiary = Bestiary.generateNewBestiary(Auth.user._id);
        newBestiary.name = bestiary.name + " (Copy)";
        newBestiary.description = bestiary.description;
        Bestiary.create(newBestiary, function (data) {
            copyCreaturesToBestiary(bestiary, data, successCallback, errorCallback);
        }, function (err) {
            errorCallback("error: " + err);
        });
    }

    return BestiaryCopier;
});