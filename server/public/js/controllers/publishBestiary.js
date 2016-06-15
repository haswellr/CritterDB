var publishBestiaryCtrl = function ($scope,$mdDialog,baseBestiary,publishedBestiary,Auth,PublishedBestiary,$location,Creature) {

	$scope.publishedBestiary = (publishedBestiary ? angular.copy(publishedBestiary) : 
		{
			'name': baseBestiary.name,
			'description': baseBestiary.description,
			'owner': Auth.user,
			'creatures': []				//define later upon creation
		});

	$scope.newBestiary = {
		"_id": "NEW_BESTIARY",
		"name": "PUBLISH NEW BESTIARY"
	};
	$scope.ownedPublishedBestiaries = [$scope.newBestiary];
	$scope.selectedBestiary = publishedBestiary || $scope.newBestiary;

	//Recursively gets all pages of owned bestiaries
	function getOwnedPublishedBestiaries(page){
		if(Auth.user && !publishedBestiary){
			PublishedBestiary.getByUser(Auth.user._id,page,function(data){
				if(data && data.length > 0){
					for(var i=0;i<data.length;i++){
						$scope.ownedPublishedBestiaries.push(data[i]);
					}
					getOwnedPublishedBestiaries(page + 1);
				}
			});
		}
	}
	getOwnedPublishedBestiaries(1);

	$scope.$watch("selectedBestiary",function(newValue,oldValue){
		if(oldValue!=newValue){
			if(newValue==$scope.newBestiary){
				$scope.publishedBestiary.name = baseBestiary.name;
				$scope.publishedBestiary.description = baseBestiary.description;
				$scope.publishedBestiary._id = undefined;
			}
			else{
				$scope.publishedBestiary = $scope.selectedBestiary;
			}
		}
	},true);

	function goToPublishedBestiary(id){
		$location.url("/publishedbestiary/view/"+id);
	}

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
		if(publicBestiary._id){	//just update existing bestiary
			PublishedBestiary.update(publicBestiary._id,publicBestiary,function(data){
				var publishedBestiary = data;
				Creature.deleteAllForPublishedBestiary(publishedBestiary._id,function(data){
					createCreaturesForBestiary(baseBestiary,publishedBestiary,function(data){
						success(publishedBestiary);
					},function(err){
						failure(err);
					});
				},function(err){
					failure(err);
				});
			},function(err){
				failure(err);
			});
		}
		else{	//make new bestiary
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
