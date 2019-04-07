angular.module('myApp').factory("TextUtils", function() {

  class TextUtils {
    getCreatureNameAsProperNoun(creature) {
      if (!creature) return "";
      var nameIsProper = creature.flavor ? creature.flavor.nameIsProper : false;
      return this.getNameAsProperNoun(creature.name, nameIsProper);
    }

    getNameAsProperNoun(name, nameIsProper) {
      if(nameIsProper)
        return(name);
      else
        return("the " + name.toLowerCase());
    }

    getCreatureNameAsIt(creature) {
      if (!creature) return "";
      var nameIsProper = creature.flavor ? creature.flavor.nameIsProper : false;
      return this.getNameAsIt(creature.name, nameIsProper);
    }

    //not sure what to call this function, but it determines when to call
    //  a creature "it" or by its full name like "King George".
    getNameAsIt(name, nameIsProper) {
      if(nameIsProper)
        return(name);
      else
        return("it");
    }

    capitalizeFirstLetter(word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }

    getPossessive(name){
      if(name.toLowerCase() == "it")
        return (name + "s");
      else
        return (name + "'s");   //just keeping things simple
    }

    getOrdinal(num) {
      var suffix = ["th","st","nd","rd"];
      var v = num%100;
      return num+(suffix[(v-20)%10]||suffix[v]||suffix[0]);
    }
  }

  // Create and return a singleton
  const instance = new TextUtils();
  Object.freeze(instance);

  return instance;
});
