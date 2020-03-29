/**
 * Abstract base class which adapts data from a javscript object to another javascript object. One example of use is to convert from CritterDB bestiary format to another tool's format.
 */

angular.module('myApp').factory("DataMapper", function () {

    const MappingType = {
        OBJECT: "object",
        ARRAY: "array",
        FUNCTION: "function",
        SINGULAR_ARRAY: "singularArray",
        DATA_MAPPER: "dataMapper"
    };

    function _getProperty(key, sourceData) {
        // %% is a special override that says to return this as a value rather than use it as a key
        if (key.substring(0, 2) === "%%") {
            return key.substring(2);
        }
        var data = sourceData;
        key.split(".").forEach(nestedKey => data = data[nestedKey]);
        return data;
    }

    function _mapObject(mappingDefinition, sourceData) {
        const output = {};
        for (const key in mappingDefinition) {
            output[key] = _mapByDefinition(mappingDefinition[key], sourceData);
        }
        return output;
    }

    function _mapArray(mappingDefinition, sourceArray) {
        return sourceArray.map(element => _mapByDefinition(mappingDefinition, element));
    }

    function _mapFunction(mappingFunction, sourceData) {
        const getterFunction = function (key) {
            return _getProperty(key, sourceData);
        }
        return mappingFunction(getterFunction);
    }

    function _mapSingularArray(mappingDefinition, sourceData) {
        const value = _mapByDefinition(mappingDefinition, sourceData);
        return value ? [value] : [];
    }

    function _mapUsingDataMapper(mappingDefinition, sourceData) {
        return mappingDefinition.dataMapper.map(sourceData);
    }

    function _mapByDefinition(mappingDefinition, sourceData) {
        if (mappingDefinition == null || sourceData == null) {
            return null;
        }
        switch (mappingDefinition._type) {
            case undefined:
                // This is just a direct value mapping
                return _getProperty(mappingDefinition, sourceData);
            case MappingType.OBJECT:
                if (!mappingDefinition.valueMap) {
                    console.error(`valueMap must be defined for _type "object" in mapping definition: ${JSON.stringify(mappingDefinition)}`);
                    return null;
                }
                return _mapObject(mappingDefinition.valueMap, sourceData);
            case MappingType.ARRAY:
                if (!mappingDefinition.elementMap) {
                    console.error(`elementMap must be defined for _type "array" in mapping definition: ${JSON.stringify(mappingDefinition)}`);
                    return null;
                }
                return _mapArray(mappingDefinition.elementMap, _getProperty(mappingDefinition.source, sourceData));
            case MappingType.FUNCTION:
                if (!mappingDefinition.function) {
                    console.error(`function must be defined for _type "function" in mapping definition: ${JSON.stringify(mappingDefinition)}`);
                    return null;
                }
                return _mapFunction(mappingDefinition.function, sourceData);
            case MappingType.SINGULAR_ARRAY:
                if (!mappingDefinition.elementMap) {
                    console.error(`elementMap must be defined for _type "singularArray" in mapping definition: ${JSON.stringify(mappingDefinition)}`);
                    return null;
                }
                return _mapSingularArray(mappingDefinition.elementMap, sourceData);
            case MappingType.DATA_MAPPER:
                if (!mappingDefinition.dataMapper) {
                    console.error(`dataMapper must be defined for _type "dataMapper" in mapping definition: ${JSON.stringify(mappingDefinition)}`);
                    return null;
                }
                return _mapUsingDataMapper(mappingDefinition, sourceData);
            default:
                return null;
        }
    }

    class DataMapper {
        constructor() {
            if (new.target === DataMapper) {
                throw new TypeError("Cannot construct DataMapper instances directly, as it is an abstract class.");
            }
        }

        /**
         * Types of mapping:
         * - object: Maps fields 1-to-1 as specified in "map".
         * - array: Reads from an array specified by the "source" field. For each element in that array, adds an object to an array, mapping fields 1-to-1 as specified in "map".
         * - function: Runs the function specified in "map", passing in a function which takes in a key and returns data from the source object.
         * - singularArray: Reads a value from "map" and places it as a single element in an array, IF that element is not null.
         * - dataMapper: Maps using another DataMapper.
         */
        map(sourceData) {
            if (!this._mappingDefinition) {
                throw new TypeError("Children of DataMapper must include mappingDefinition.")
            }
            return _mapByDefinition(this._mappingDefinition, sourceData);
        }
    }

    return DataMapper;
});
