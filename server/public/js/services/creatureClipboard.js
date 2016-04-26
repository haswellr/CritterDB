angular.module('myApp').factory("CreatureClipboard", function() {

  function CreatureClipboard() {
    var clipboard = [];

    this.add = function(creature) {
      clipboard.push(creature);
    }

    this.getAll = function() {
      return(clipboard);
    }

    this.remove = function(creature) {
      var index = clipboard.indexOf(creature);
      clipboard.splice(index,1);
    }

    this.isEmpty = function() {
      return(clipboard.length==0);
    }

    this.clear = function() {
      clipboard = [];
    }
  }

  return(new CreatureClipboard());
});
