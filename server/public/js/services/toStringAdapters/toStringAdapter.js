/**
 * Abstract base class which adapts data from a javscript object to a string in a specific format, such as JSON or XML.
 */

angular.module('myApp').factory("ToStringAdapter", function () {

    class ToStringAdapter {
        constructor() {
            if (new.target === ToStringAdapter) {
                throw new TypeError("Cannot construct ToStringAdapter instances directly, as it is an abstract class.");
            }
        }

        adapt(data) {
            return this._adapt(data);
        }
    }

    return ToStringAdapter;
});
