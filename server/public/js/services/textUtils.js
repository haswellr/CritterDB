angular.module('myApp').factory("TextUtils", function() {

  const lowercaseTitleWords = {"a":true,"an":true,"the":true,"for":true,"and":true,"nor":true,"but":true,"or":true,"yet":true,"so":true,"at":true,"around":true,"by":true,"after":true,"along":true,"for":true,"from":true,"of":true,"on":true,"to":true,"with":true,"without":true};

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
      const firstAlphabeticalCharIndex = word.search(/[A-Za-z]/);
      return word.slice(0,firstAlphabeticalCharIndex) + word.charAt(firstAlphabeticalCharIndex).toUpperCase() + word.slice(firstAlphabeticalCharIndex + 1);
    }

    getTitleCase(sentence) {
      function shouldCapitalizeWord(word,index,numWords) {
        if (index === 0 || index === (numWords-1))
          return true;
        return lowercaseTitleWords[word] ? false : true;
      }

      return sentence
        ? sentence.split(' ').map((word, index, wordList) => shouldCapitalizeWord(word, index, wordList.length) ? this.capitalizeFirstLetter(word) : word.toLowerCase()).join(' ')
        : sentence;
    }

    getCommaSeparatedList(items) {
      return items.filter(item => item).join(", ");
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
