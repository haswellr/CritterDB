var compareNot = function() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareNot"
        },
        link: function(scope, element, attributes, ngModel) {

            ngModel.$validators.compareNot = function(modelValue) {
                return modelValue != scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
};

angular.module('myApp').directive("compareNot", compareNot);
