/**
 * Adapts data to or from JSON format.
 */

angular.module('myApp').factory("JsonAdapter", function (TextAdapter) {

    class JsonAdapter extends TextAdapter {
        constructor() {
            super();
        }

        /**
         * 
         * @param {object} data 
         */
        _export(data) {
            return JSON.stringify(data);
        }

        /**
         * 
         * @param {string} text 
         * @throws {SyntaxError} Text must be valid JSON.
         */
        _import(text) {
            return JSON.parse(text);
        }
    }

    return JsonAdapter;
});
