/** 
 * Adapts data, like creatures or bestiaries, to or from other formats. Used for import and export.
 */

angular.module('myApp').factory("DataAdapter", function (JsonAdapter, FiveEToolsBestiaryMapper, FiveEToolsCreatureMapper) {

    var DataAdapter = {};

    /**
     * Represents an adapter workflow for adapting from one type of data to another.
     * @constructor
     * @param {object[]} dataMappers - A list of the objects defining the data conversion. They will be run in order, and will convert from a js object 
     * to another js object.
     * @param {TextAdapter} textAdapter - An instance of the adapter which converts from js object to text. This will be run after all of the data mappers.
     * For example, may convert to JSON format, or HTML, or XML.
     */
    class AdapterWorkflow {
        constructor(dataMappers, textAdapter) {
            this._dataMappers = dataMappers;
            this._textAdapter = textAdapter;
        }

        get dataMappers() {
            return this._dataMappers;
        }

        get textAdapter() {
            return this._textAdapter;
        }
    }

    DataAdapter.Format = {
        "5E_TOOLS_BESTIARY": new AdapterWorkflow([new FiveEToolsBestiaryMapper()], new JsonAdapter()),
        "5E_TOOLS_CREATURE": new AdapterWorkflow([new FiveEToolsCreatureMapper()], new JsonAdapter()),
        "CRITTERDB": new AdapterWorkflow([], new JsonAdapter())
    }

    /**
     * Exports data from CritterDB format to that of another format.
     * 
     * @param {object} data - A piece of CritterDB data to be exported, such as a creature or bestiary.
     * @param {DataAdapter.Format} format - The format to adapt to.
     * @returns {string} The text of the exported bestiary in the specified format.
     * @throws {TypeError} Throws a TypeError if format is not of the correct type.
     */
    DataAdapter.export = function (data, format) {
        if (!format.dataMappers) {
            throw new TypeError("Invalid Format. Format must have defined data mappers.");
        }
        if(format.dataMappers.find(dataMapper => !dataMapper.canMap())) {
            throw new TypeError("Invalid Format. Data mappers must be able to map.");
        }
        if (!format.textAdapter) {
            throw new TypeError("Invalid Format. Format must have a text adapter.");
        }
        // Run all data adapters in series
        var mappedData = data;
        format.dataMappers.forEach(dataMapper => {
            mappedData = dataMapper.map(mappedData);
        });
        // Run text adapter and return
        return format.textAdapter.export(mappedData);
    }

    /**
     * Imports data from text in another format to CritterDB format.
     * 
     * @param {string} text - Text to be imported, such as a creature or bestiary.
     * @param {DataAdapter.Format} format - The format to adapt to.
     * @returns {object} The CritterDB object imported from the text.
     * @throws {TypeError} Throws a TypeError if data adapter format is not valid.
     * @throws {SyntaxError} Throws a SyntaxError if the text is not formatted correctly.
     */
    DataAdapter.import = function (text, format) {
        if (!format.dataMappers) {
            throw new TypeError("Invalid Format. Format must have defined data mappers.");
        }
        if(format.dataMappers.find(dataMapper => !dataMapper.canReverse())) {
            throw new TypeError("Invalid Format. Data mappers must be able to reverse.");
        }
        if (!format.textAdapter) {
            throw new TypeError("Invalid Format. Format must have a text adapter.");
        }
        // Run text adapter in reverse
        var mappedData = format.textAdapter.import(text);
        // Run all data adapters in reverse
        [...format.dataMappers].reverse().forEach(dataMapper => {
            mappedData = dataMapper.reverse(mappedData);
        });
        return mappedData;
    }

    return DataAdapter;
});