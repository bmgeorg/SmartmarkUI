var UTILITY = (function() {
var module = {};

// elems - jQuery 
// tag - string
// func - function
module.clickOutside = function(elems, tag, func) {
    var trigger = tag? 'mouseup.'+tag : 'mouseup';
    // Clean up old handler if present.
    if(tag) {
        $(document).off(trigger);
    }
    $(document).on(trigger, function(e) {
        if(!elems.is(e.target) && elems.has(e.target).length === 0) {
            func();
        }
    });
}

return module;
}());
