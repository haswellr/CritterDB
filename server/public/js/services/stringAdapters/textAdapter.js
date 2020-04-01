/**
 * Abstract base class which adapts data from a javascript object to a string in a specific format, such as JSON or XML, or vice versa.
 */

angular.module('myApp').factory("TextAdapter", function () {

    class TextAdapter {
        constructor() {
            if (new.target === TextAdapter) {
                throw new TypeError("Cannot construct TextAdapter instances directly, as it is an abstract class.");
            }
        }

        /**
         * Exports a javascript object to text. Child classes must implement _export.
         * 
         * @param {object} data 
         */
        export(data) {
            return this._export(data);
        }

        /**
         * Imports a javascript object from text. Child classes must implement _import.
         * 
         * @param {string} text 
         */
        import(text) {
            return this._import(text);
        }
    }

    return TextAdapter;
});
