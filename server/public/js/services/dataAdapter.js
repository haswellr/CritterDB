/** 
 * Adapts data, like creatures or bestiaries, into another specified format. Used for import and export.
 */

angular.module('myApp').factory("DataAdapter", function (ToJsonAdapter, FiveEToolsBestiaryMapper, FiveEToolsCreatureMapper) {

    var DataAdapter = {};

    /**
     * Represents an adapter workflow for adapting from one type of data to another.
     * @constructor
     * @param {object[]} dataMappers - A list of the objects defining the data conversion. They will be run in order, and will convert from a js object 
     * to another js object.
     * @param {ToStringAdapter} stringAdapter - An instance of the adapter which converts from js object to string. This will be run after all of the data mappers.
     * For example, may convert to JSON format, or HTML, or XML.
     */
    class AdapterWorkflow {
        constructor(dataMappers, stringAdapter) {
            this._dataMappers = dataMappers;
            this._stringAdapter = stringAdapter;
        }

        get dataMappers() {
            return this._dataMappers;
        }

        get stringAdapter() {
            return this._stringAdapter;
        }
    }

    DataAdapter.Format = {
        "5E_TOOLS_BESTIARY": new AdapterWorkflow([new FiveEToolsBestiaryMapper()], new ToJsonAdapter()),
        "5E_TOOLS_CREATURE": new AdapterWorkflow([new FiveEToolsCreatureMapper()], new ToJsonAdapter()),
        "CRITTERDB": new AdapterWorkflow([], new ToJsonAdapter())
    }

    /**
     * Converts data to that of another format.
     * 
     * @param {object} data - A piece of data to be adapter, such as a creature or bestiary.
     * @param {DataAdapter.Format} format - The format to adapt to.
     * @returns {string} The string of the exported bestiary in the specified format.
     * @throws {TypeError} Throws a TypeError if format is not of the correct type.
     */
    DataAdapter.adapt = function (data, format) {
        if (!format.dataMappers || format.dataMappers.length == 0) {
            throw new TypeError("Invalid Format. Format must have one or more data mappers.");
        }
        if (!format.stringAdapter) {
            throw new TypeError("Invalid Format. Format must have a string adapter.");
        }
        // Run all data adapters in series
        var mappedData = data;
        format.dataMappers.forEach(dataMapper => {
            mappedData = dataMapper.map(mappedData);
        });
        // Run string adapter and return
        return format.stringAdapter.adapt(mappedData);
    }

    return DataAdapter;
});