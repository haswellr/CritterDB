angular.module('myApp').factory("CreatureAPI", function($location,CreatureClipboard,Creature,$mdMedia,$mdDialog) {

  //Use options to include the API interfaces that you want to be exposed. If 
  //undefined it will include all.
  //{
  //  edit: boolean,
  //  copy: boolean,
  //  copyInPlace: boolean,
  //  delete: boolean,
  //  export: boolean
  //}
  //If a controller needs custom functions, just override the necessary function.
  //Functions are:
  //  edit
  //  copy
  //  copyInPlace
  //  delete
  //  export.image
  //  export.html
  //  export.naturalCrit

  function CreatureAPI(options) {
    var api = {};

    api.shouldHighlightClipboard = function(creature) {
      return CreatureClipboard.contains(creature);
    }

    if(!options || options.edit){
      api.edit = function(creature){
        $location.url("/creature/edit/"+creature._id);
      }
    }
    if(!options || options.copy){
      api.copy = function(creature){
        CreatureClipboard.add(creature);
      }
    }
    if(!options || options.copyInPlace){
      api.copyInPlace = function(creature){
        var newCreature = angular.copy(creature);
        newCreature._id = undefined;
        newCreature.name = newCreature.name + " Copy";
        Creature.create(newCreature,function(data){
          $scope.editCreature(data);
        },function(err){
          console.log("error: "+err);
        });
      }
    }
    if(!options || options.delete){
      api.delete = function(ev,creature){
        var confirm = $mdDialog.confirm()
          .title("Confirm Deletion")
          .textContent("This creature will be permanently deleted. Would you like to proceed?")
          .ariaLabel("Confirm Delete")
          .targetEvent(ev)
          .ok("Delete")
          .cancel("Cancel");
        $mdDialog.show(confirm).then(function() {
          Creature.delete(creature._id);
        });
      }
    }
    if(!options || options.export){
      api.export = {};
      api.export.exportImage = function(ev,creature){
        $mdDialog.show({
          controller: exportImageCtrl,
          templateUrl: '/assets/partials/creature/export-image.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          locals: {
            'creature': creature
          },
          fullscreen: true
        });
      }
      api.export.exportHTML = function(ev,creature){
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
        $mdDialog.show({
          controller: exportHtmlCtrl,
          templateUrl: '/assets/partials/creature/export-html.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          locals: {
            'creature': creature
          },
          fullscreen: useFullScreen
        });
      }
      api.export.exportNaturalCrit = function(ev,creature){
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
        $mdDialog.show({
          controller: exportNaturalCritCtrl,
          templateUrl: '/assets/partials/creature/export-natural-crit.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          locals: {
            'creature': creature
          },
          fullscreen: useFullScreen
        });
      }
    }
    return api;
  }

  return CreatureAPI;
});
