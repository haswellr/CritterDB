var publishBestiaryCtrl = function ($scope,$mdDialog,baseBestiary,publishedBestiary,Auth,PublishedBestiary,$location,Creature) {

	$scope.publishedBestiary = (publishedBestiary ? angular.copy(publishedBestiary) : 
		{
			'name': baseBestiary.name,
			'description': baseBestiary.description,
			'owner': Auth.user,
			'creatures': []				//define later upon creation
		});

	function goToPublishedBestiary(id){
		$location.url("/publishedbestiary/view/"+id);
	}

	/*
	var copiedCount = 0;
		var totalToCopy = $scope.bestiary.creatures.length;
		var finishedCreatingCreature = function(){
			copiedCount = copiedCount + 1;
			if(copiedCount==totalToCopy){
				$location.url("/bestiary/view/"+createdBestiary._id);
			}
		}
		for(var i=0;i<$scope.bestiary.creatures.length;i++){
			var newCreature = angular.copy($scope.bestiary.creatures[i]);
			newCreature._id = undefined;
			newCreature.bestiaryId = createdBestiary._id;
			Creature.create(newCreature,finishedCreatingCreature,finishedCreatingCreature);
		}
		*/

	function createCreaturesForBestiary(baseBestiary,publishedBestiary,success,failure){
		Creature.getAllForBestiary(baseBestiary._id,function(data){
			var createdCreatures = [];
			if(data.length > 0){
				var createdCreatureCount = 0;
				var totalCreaturesToCreate = data.length;
				var finishedCreatingCreature = function(){
					createdCreatureCount = createdCreatureCount + 1;
					if(createdCreatureCount == totalCreaturesToCreate){
						success(createdCreatures);
					}
				}
				for(var i=0;i<baseBestiary.creatures.length;i++){
					var newCreature = angular.copy(baseBestiary.creatures[i]);
					newCreature._id = undefined;
					newCreature.bestiaryId = undefined;
					newCreature.publishedBestiaryId = publishedBestiary._id;
					Creature.create(newCreature,finishedCreatingCreature,finishedCreatingCreature);
				}
			}
			else
				success(createdCreatures);
		},function(err){
			failure(err);
		});
	}

	function publishBestiary(baseBestiary,publicBestiary,success,failure){
		PublishedBestiary.create(publicBestiary,function(data){
			var publishedBestiary = data;
			createCreaturesForBestiary(baseBestiary,publishedBestiary,function(data){
				success(publishedBestiary);
			},function(err){
				failure(err);
			});
		},function(err){
			failure(err);
		});
	}

	$scope.publish = function(ev){
		var confirm = $mdDialog.confirm()
			.title("Confirm Ownership")
			.textContent("Please confirm that the published content is legally yours to share and is not copyrighted or otherwise legally protected in a way that would prevent its publishing on this site.")
			.ariaLabel("Confirm Publish")
			.targetEvent(ev)
			.ok("Confirm")
			.cancel("Cancel");
		$mdDialog.show(confirm).then(function() {
			publishBestiary(baseBestiary,$scope.publishedBestiary,function(data){
				goToPublishedBestiary(data._id);
				$mdDialog.cancel();
			},function(err){
				console.error("Error publishing bestiary: "+err);
			});
		});

	}

	//updates, closes dialog, and gives the data to the resolved promise
	$scope.update = function(){
		PublishedBestiary.update($scope.publishedBestiary._id,$scope.publishedBestiary,function(data){
				$mdDialog.hide(data);
			},function(err){
				console.log("error: "+err);
			});
	}

	$scope.cancel = function() {
    $mdDialog.cancel();
  };

};

angular.module('myApp').controller('publishBestiaryCtrl',publishBestiaryCtrl);
