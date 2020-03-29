/** 
 * Adapts bestiaries into another specified format. Used for import and export.
 */

angular.module('myApp').factory("BestiaryAdapter", function (ToJsonAdapter, FiveEToolsDataMapper) {

    var BestiaryAdapter = {};

    /**
     * Represents a Bestiary Format for import and export.
     * @constructor
     * @param {object[]} dataMappers - A list of the objects defining the bestiary conversion. They will be run in order, and will convert from a js object 
     * to another js object.
     * @param {ToStringAdapter} stringAdapter - An instance of the adapter which converts from js object to string. This will be run after all of the data mappers.
     * For example, may convert to JSON format, or HTML, or XML.
     */
    class BestiaryFormat {
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

    BestiaryAdapter.Format = {
        "5E_TOOLS": new BestiaryFormat([new FiveEToolsDataMapper()], new ToJsonAdapter())
    }

    /**
     * Converts a CritterDB bestiary to that of another format.
     * 
     * @param {Bestiary} bestiary - A CritterDB bestiary
     * @param {BestiaryAdapter.Format} format - The format to adapt to.
     * @returns {string} The string of the exported bestiary in the specified format.
     * @throws {TypeError} Throws a TypeError if format is not of the correct type.
     */
    BestiaryAdapter.export = function (bestiary, format) {
        if (!format.dataMappers || format.dataMappers.length == 0) {
            throw new TypeError("Invalid Format. Format must have one or more data mappers.");
        }
        if (!format.stringAdapter) {
            throw new TypeError("Invalid Format. Format must have a string adapter.");
        }
        console.log(JSON.stringify(bestiary));
        // Run all data adapters in series
        var dataMappedBestiary = bestiary;
        format.dataMappers.forEach(dataMapper => {
            dataMappedBestiary = dataMapper.map(dataMappedBestiary);
        });
        // Run string adapter and return
        return format.stringAdapter.adapt(dataMappedBestiary);
    }

    return BestiaryAdapter;
});