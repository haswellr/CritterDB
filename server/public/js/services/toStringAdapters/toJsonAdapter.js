/**
 * Adapts data to JSON format.
 */

angular.module('myApp').factory("ToJsonAdapter", function (ToStringAdapter) {

    class ToJsonAdapter extends ToStringAdapter {
        constructor() {
            super();
        }

        _adapt(data) {
            return JSON.stringify(data);
        }
    }

    return ToJsonAdapter;
});
