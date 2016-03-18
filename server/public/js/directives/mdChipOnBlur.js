angular.module('myApp').directive('mdChips', function ($timeout) {
  return {
    restrict: 'E',
    require: 'mdChips', // Extends the original mdChips directive
    link: function (scope, element, attributes, mdChipsCtrl) {

      var mouseUpActions = [];

      mdChipsCtrl.onInputBlur = function (event) {
        this.inputHasFocus = false;

        mouseUpActions.push((function(){
          var chipBuffer = this.getChipBuffer();
          if (chipBuffer != "") { // REQUIRED, OTHERWISE YOU'D GET A BLANK CHIP
            this.appendChip(chipBuffer);
            this.resetChipBuffer();
          }
        }).bind(this));
      };

      window.addEventListener('click', function(event){
        while(mouseUpActions.length>0){
          var action = mouseUpActions.splice(0,1)[0];
          $timeout(function(){
            $timeout(action);
          });
        }
      },false);
    }
  }
});
