var UTILITY = (function() {
var module = {};

// Execute func when a click occurs outside elems or elems children
// Use tag as namespace in jQuery.off() and jQuery.on() to remove old event listener
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

// Adds event listener that causes input to lose focus on enter press
// focusable - jQuery
module.blurOnEnter = function(focusable) {
    focusable.keypress(function(e) {
        if(e.which == 13) {
            $(this).blur();
        }
    });
}

// modal_id - string
module.showDialog = function(modal_id) {
    var overlay = $('#dialog_overlay');
    overlay.css({
        'display': 'block',
        'opacity': 0,
    });
    overlay.fadeTo(200, 0.5);
    overlay.click(function() {
        module.closeDialog();
    });

    var modal = $('#' + modal_id);
    modal.fadeTo(200, 1);
}

// modal_id - string
module.closeDialog = function() {
    var overlay = $('#dialog_overlay');
    overlay.fadeOut(200);

    var modal = $('.dialog');
    modal.hide();
}

return module;
}());
