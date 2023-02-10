/** 
 * Adapts bestiaries into the 5E tools format. https://5e.tools/bestiary.html#adult%20gold%20dragon_mm
 */

angular.module('myApp').factory("FiveEToolsBestiaryMapper", function (DataMapper, FiveEToolsCreatureMapper) {

    function generateJsonName(getterFunction) {
        const name = getterFunction("name");
        const username = getterFunction("owner.username");
        return `${username}-${name.replace(" ", "-")}`
    }

    class FiveEToolsBestiaryMapper extends DataMapper {
        constructor() {
            super();
        }

        get _mappingDefinition() {
            return {
                "_type": "object",
                "valueMap": {
                    "monster": {
                        "_type": "function",
                        "function": function (getterFunction) {
                            const creatures = getterFunction("creatures");
                            const sourceName = getterFunction("name");
                            const mapper = new FiveEToolsCreatureMapper();
                            return creatures.map(creature => {
                                return {
                                    ...mapper.map(creature),
                                    source: generateJsonName(getterFunction),
                                }
                            })
                        }
                    },
                    "_meta": {
                        "_type": "function",
                        "function": function (getterFunction) {
                            const name = getterFunction("name");
                            const username = getterFunction("owner.username");

                            return {
                                "sources": [{
                                    "json": generateJsonName(getterFunction),
                                    "abbreviation": name.split(" ").map(str => str.substring(0, 1)).join(" "),
                                    "full": name,
                                    "url": "",
                                    "authors": [username],
                                    "convertedBy": []
                                }]
                            }
                        }
                        
                    }
                }
            }
        }
    }

    return FiveEToolsBestiaryMapper;
});