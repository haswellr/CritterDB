//This is used to fix md-input-container when used with textareas. The textarea
//will not auto-grow if it is inside of a sidenav or certain other elements
//where the textareas size is not set until after the parent element is opened.
//This directive doesn't truly fix the problem but it triggers a keydown when
//the element is focused, which then triggers the textarea's handler to
//recalculate its size. It is a simple solution that doesn't require patching
//the angular material code.

var expandTextarea = function() {
    return {
        link: function(scope, element, attributes) {
            element.on('focus', function(){
                element.triggerHandler("keydown");
            });
        }
    };
};

angular.module('myApp').directive("expandTextarea", expandTextarea);
