/** 
 * Adapts bestiaries into the 5E tools format. https://5e.tools/bestiary.html#adult%20gold%20dragon_mm
 */

angular.module('myApp').factory("FiveEToolsBestiaryMapper", function (DataMapper, FiveEToolsCreatureMapper) {

    class FiveEToolsBestiaryMapper extends DataMapper {
        constructor() {
            super();
        }

        get _mappingDefinition() {
            return {
                "_type": "object",
                "valueMap": {
                    "monster": {
                        "_type": "array",
                        "source": "creatures",
                        "elementMap": {
                            "_type": "dataMapper",
                            "dataMapper": new FiveEToolsCreatureMapper()
                        }
                    }
                }
            }
        }
    }

    return FiveEToolsBestiaryMapper;
});