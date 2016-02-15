


var creatureCtrl = function($scope,creature,Creature) {
	$scope.creature = creature;

	$scope.creatureData = {
		sizes: ["Fine","Diminutive","Tiny","Small","Medium","Large","Huge","Gargantuan","Colossal","Colossal+"],
		races: ["Human","Dwarf","Elf","Halfling","Gnome","Dragonborn","Undead","Beast","Elemental","Ooze","Giant","Construct"],
		alignments: ["Unaligned","Lawful Good","Lawful Neutral","Lawful Evil","Neutral Good","Neutral","Neutral Evil","Chaotic Good","Chaotic Neutral","Chaotic Evil"],
		armorTypes: ["Natural Armor","Padded","Leather","Studded leather","Hide","Chain shirt","Scale mail","Breastplate","Half plate","Ring mail","Chain mail","Splint","Plate"],
		search: function(searchText,arrayToSearch){
			var returnedVals = [];
			if(searchText && arrayToSearch){
				var searchTextLower = searchText.toLowerCase();
				for(var i=0;i<arrayToSearch.length;i++){
					if(arrayToSearch[i].toLowerCase().indexOf(searchTextLower)!=-1)
						returnedVals.push(arrayToSearch[i]);
				}
			}
			return(returnedVals);
		}
	};


	$scope.$watch("creature",function(newValue,oldValue){
		Creature.calculateCreatureDetails($scope.creature);
	},true);
}

//don't load controller until we've gotten the data from the server
creatureCtrl.resolve = {
			creature: function(Creature, $q, $route){
				if($route.current.params.creatureId){
					var deferred = $q.defer();
					Creature.get($route.current.params.creatureId,function(data) {
						deferred.resolve(data);
					}, function(errorData) {
						deferred.reject();
					});
					return deferred.promise;
				}
				else
					return {};
			}
		}

angular.module('myApp').controller('creatureCtrl',creatureCtrl);
