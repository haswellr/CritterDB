angular.module('myApp').factory("CreatureFilter", function() {
  function Filter(){
    return {
      text: "",
      operator: "or",
      toggleOperator: function(){
        if(this.operator=="or")
          this.operator = "and";
        else
          this.operator = "or";
      },
      doesCreaturePass: function(creature){
        if(this.text.length>0){
          var lowerText = this.text.toLowerCase();
          var matchesName = creature.name.toLowerCase().indexOf(lowerText)!=-1;
          var matchesFaction = creature.flavor.faction.toLowerCase().indexOf(lowerText)!=-1;
          var matchesEnvironment = creature.flavor.environment.toLowerCase().indexOf(lowerText)!=-1;
          var matchesType = creature.stats.race.toLowerCase().indexOf(lowerText)!=-1;
          return(matchesName || matchesEnvironment || matchesFaction || matchesType);
        }
        else
          return true;
      }
    };
  }
  function CreatureFilter(){
    var creatureFilter = {
      challengeRating: {
        min: {
          value: 0,
          step: 0.125
        },
        max: {
          value: 30,
          step: 1
        },
        changed: function(cr){
          //set new step
          if(cr.value>1)
            cr.step = 1;
          else if(cr.value>0.5)
            cr.step = 0.5;
          else if(cr.value>0.25)
            cr.step = 0.25;
          else
            cr.step = 0.125;
          //fix up issues caused by dynamic step value
          if(cr.value==1.5)
            cr.value = 2;
          else if(cr.value==0.75)
            cr.value = 1;
          else if(cr.value==0.375)
            cr.value = 0.5;
        }
      },
      filters: [new Filter()],
      addFilter: function(){
        var filter = new Filter();
        creatureFilter.filters.push(filter);
      },
      removeFilter: function(index){
        creatureFilter.filters.splice(index,1);
      },
      resetFilters: function(){
        creatureFilter.filters = [new Filter()];
        creatureFilter.challengeRating.min = {
          value: 0,
          step: 0.125
        };
        creatureFilter.challengeRating.max = {
          value: 30,
          step: 1
        };
      },
      areFiltersActive: function(){
        var active = false;
        for(var i=0;i<creatureFilter.filters.length;i++){
          var filter = creatureFilter.filters[i];
          if(filter.text.length>0){
            active = true;
            break;
          }
        }
        if(creatureFilter.challengeRating.min.value>0 || creatureFilter.challengeRating.max.value<30){
          active = true;
        }
        return active;
      },
      fillBackground: function(isBody,index){
        var show = false;
        var filter = creatureFilter.filters[index];
        var prevFilter = undefined;
        if(index>0)
          prevFilter = creatureFilter.filters[index-1];
        if(isBody && filter.operator=="and")
          show = true;
        else if(!isBody && prevFilter!=undefined && prevFilter.operator=="and" && filter.operator!="and")
          show = true;
        return show;
      },
      isCreatureShown: function(creature){
        if(creature.stats.challengeRating >= creatureFilter.challengeRating.min.value
          && creature.stats.challengeRating <= creatureFilter.challengeRating.max.value){
          if(creatureFilter.filters.length>0){
            var andFilterGroups = [];
            var currentAndFilterGroup = undefined;
            //follow order of operations - do ANDs, then ORs. We do this by calculating all groups
            //of consecutive ANDs, then doing OR between those groups.
            for(var i=0;i<creatureFilter.filters.length;i++){
              var filter = creatureFilter.filters[i];
              var passes = filter.doesCreaturePass(creature);
              if(currentAndFilterGroup==undefined)
                currentAndFilterGroup = passes;
              else
                currentAndFilterGroup = currentAndFilterGroup && passes;
              if(filter.operator=="or" || (i+1)==(creatureFilter.filters.length)){
                andFilterGroups.push(currentAndFilterGroup);
                currentAndFilterGroup = undefined;
              }
            }
            var matches = false;
            for(var i=0;i<andFilterGroups.length;i++){
              matches = matches || andFilterGroups[i];
            }
            return(matches);
          }
          else{
            return true;
          }
        }
        else
          return false;
      }
    };
    return creatureFilter;
  };

  return CreatureFilter;
});
